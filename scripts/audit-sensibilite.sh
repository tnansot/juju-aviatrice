#!/usr/bin/env bash
# Audit de sensibilité — juju-aviatrice (repo public, utilisatrice mineure)
# Usage :
#   scripts/audit-sensibilite.sh              # scan les fichiers staged
#   scripts/audit-sensibilite.sh file1 file2  # scan des fichiers donnés
#   scripts/audit-sensibilite.sh --diff       # scan le diff staged (lignes ajoutées)
#
# Exit codes : 0 = clean, 1 = bloquants, 2 = warnings only
set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
BOLD='\033[1m'
RESET='\033[0m'

BLOCKERS=()
WARNINGS=()

add_blocker() { BLOCKERS+=("$1"); }
add_warning() { WARNINGS+=("$1"); }

# --- Résolution des fichiers à scanner ---

MODE="files"
FILES=()

if [[ $# -eq 0 ]] || [[ "$1" == "--diff" ]]; then
  MODE="diff"
  while IFS= read -r f; do
    FILES+=("$f")
  done < <(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null)
  if [[ ${#FILES[@]} -eq 0 ]]; then
    echo -e "${GREEN}Aucun fichier stagé à scanner.${RESET}"
    exit 0
  fi
else
  FILES=("$@")
fi

echo -e "${BOLD}## Audit de sensibilité${RESET}"
echo ""
echo "Fichiers scannés : ${#FILES[@]}"
echo "Mode : ${MODE}"
echo ""

# --- Catégorie A : Fichiers bloqués par nom ---

for f in "${FILES[@]}"; do
  # Exclure les fichiers example/sample/template
  if echo "$f" | grep -qE '\.(example|sample|template)$'; then
    continue
  fi
  if echo "$f" | grep -qE '\.pub$'; then
    continue
  fi

  if echo "$f" | grep -qE '\.env($|\.)'; then
    add_blocker "$f — Cat.A — Fichier .env"
  elif echo "$f" | grep -qE '(credentials|secrets|serviceAccountKey|gcp-key)\.json$'; then
    add_blocker "$f — Cat.A — Fichier credentials/secrets"
  elif echo "$f" | grep -qE 'firebase-adminsdk.*\.json$'; then
    add_blocker "$f — Cat.A — Fichier Firebase admin SDK"
  elif echo "$f" | grep -qE '\.(pem|key|p12|pfx|keystore|jks)$'; then
    add_blocker "$f — Cat.A — Clé privée / certificat"
  elif echo "$f" | grep -qE 'id_(rsa|ed25519|ecdsa|dsa)$'; then
    add_blocker "$f — Cat.A — Clé SSH privée"
  elif echo "$f" | grep -qE '\.aws/credentials'; then
    add_blocker "$f — Cat.A — AWS credentials"
  elif echo "$f" | grep -qE '/(secrets|private|confidential|\.secrets)/'; then
    add_blocker "$f — Cat.A — Dossier sensible"
  fi
done

# --- Préparation du contenu à scanner ---

SCAN_CONTENT=$(mktemp)
trap 'rm -f "$SCAN_CONTENT"' EXIT

if [[ "$MODE" == "diff" ]]; then
  git diff --cached -U0 --diff-filter=ACMR -- "${FILES[@]}" \
    | grep -E '^\+[^+]' \
    | sed 's/^\+//' \
    > "$SCAN_CONTENT" 2>/dev/null || true
else
  for f in "${FILES[@]}"; do
    if [[ -f "$f" ]] && file --brief "$f" | grep -qi text; then
      cat "$f" >> "$SCAN_CONTENT"
    fi
  done
fi

SCAN_LINES=$(wc -l < "$SCAN_CONTENT" | tr -d ' ')
echo "Lignes de contenu à scanner : $SCAN_LINES"
echo ""

if [[ "$SCAN_LINES" -eq 0 ]]; then
  echo -e "${GREEN}✅ Aucun contenu textuel à scanner.${RESET}"
  exit 0
fi

# --- Fonctions de scan (grep -E, POSIX extended) ---

scan_pattern() {
  local label="$1" pattern="$2" category="${3:-Cat.B}"
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    add_blocker "contenu — $category — $label : $(echo "$match" | head -c 120)"
  done < <(grep -noE "$pattern" "$SCAN_CONTENT" 2>/dev/null | head -5)
}

scan_warning_pattern() {
  local label="$1" pattern="$2" category="${3:-Cat.B}"
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    add_warning "contenu — $category — $label : $(echo "$match" | head -c 120)"
  done < <(grep -noE "$pattern" "$SCAN_CONTENT" 2>/dev/null | head -5)
}

# --- Catégorie B : Secrets techniques ---

# GitHub tokens
scan_pattern "GitHub PAT classic" 'ghp_[A-Za-z0-9]{36}'
scan_pattern "GitHub fine-grained PAT" 'github_pat_[A-Za-z0-9_]{80,}'
scan_pattern "GitHub OAuth/app token" 'gh[osur]_[A-Za-z0-9]{36,}'

# API keys
scan_pattern "OpenAI API key" 'sk-[A-Za-z0-9]{20,}'
scan_pattern "Anthropic API key" 'sk-ant-[A-Za-z0-9_-]{20,}'
scan_pattern "Google API key" 'AIza[A-Za-z0-9_-]{35}'
scan_pattern "AWS access key" 'AKIA[A-Z0-9]{16}'

# Service tokens
scan_pattern "Slack token" 'xox[baprs]-[A-Za-z0-9-]{10,}'
scan_pattern "Stripe live key" 'sk_live_[A-Za-z0-9]{24,}'

# Crypto / auth
scan_pattern "Clé privée PEM" '-----BEGIN[[:space:]]+(RSA[[:space:]]+|OPENSSH[[:space:]]+|DSA[[:space:]]+|EC[[:space:]]+|PGP[[:space:]]+|ENCRYPTED[[:space:]]+)?PRIVATE KEY-----'
scan_pattern "JWT" 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
scan_pattern "URL avec credentials" 'https?://[^[:space:]:@/]+:[^[:space:]@/]+@'
scan_pattern "Connection string DB" '(mysql|postgres|postgresql|mongodb|redis)://[^:]+:[^@]+@'
scan_pattern "Authorization Bearer" 'Authorization:[[:space:]]*Bearer[[:space:]]+[A-Za-z0-9._-]{20,}'
scan_pattern "Authorization Basic" 'Authorization:[[:space:]]*Basic[[:space:]]+[A-Za-z0-9+/=]+'

# Generic secret assignments (warning)
scan_warning_pattern "Assignement secret générique" \
  '(password|api_key|secret|token)[[:space:]]*[=:][[:space:]]*"[^"]{8,}"'

# Cloudflare tokens
scan_pattern "Cloudflare API token" '(CF_API_TOKEN|CLOUDFLARE_API_TOKEN)[[:space:]]*[=:][[:space:]]*[A-Za-z0-9_-]{40,}'

# --- Catégorie C : Données personnelles (PII) ---

scan_pattern "Adresse postale" \
  '[0-9]+[[:space:]]+(rue|avenue|boulevard|place|chemin|impasse|allée|route|square|cours)[[:space:]]+' \
  "Cat.C"

scan_pattern "Téléphone FR" \
  '(\+33[[:space:]]?|0)[1-9]([[:space:].-]?[0-9]{2}){4}' \
  "Cat.C"

scan_pattern "N° sécurité sociale" \
  '[12][[:space:]]?[0-9]{2}[[:space:]]?[0-9]{2}[[:space:]]?[0-9]{2}[[:space:]]?[0-9]{3}[[:space:]]?[0-9]{3}[[:space:]]?[0-9]{2}' \
  "Cat.C"

# --- Catégorie D : Données sensibles projet ---

scan_warning_pattern "Nom d'établissement scolaire" \
  '(lycée|collège)[[:space:]]+[A-Z]' \
  "Cat.D"

scan_pattern "Données médicales personnelles" \
  '(aptitude|inapte|classe[[:space:]]*1|aéromédical)[[:space:]]+.{0,30}(juju|résultat|examen)' \
  "Cat.D"

scan_pattern "Identifiant candidat concours" \
  '(identifiant|dossier|numéro)[[:space:]]*(candidat|session)[[:space:]]*[=:][[:space:]]*[^[:space:]]+' \
  "Cat.D"

scan_pattern "N° licence/élève DGAC/FCL/INE" \
  '(numéro|num)[[:space:]]*(de[[:space:]]+)?(licence|élève|candidat|FCL|DGAC|INE)[[:space:]]*[=:][[:space:]]*[^[:space:]]+' \
  "Cat.D"

# --- Catégorie E : Données financières ---

scan_pattern "IBAN" \
  '[A-Z]{2}[0-9]{2}([[:space:]]?[0-9]{4}){4,6}' \
  "Cat.E"

scan_pattern "N° carte bancaire (16 chiffres)" \
  '[0-9]{4}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}' \
  "Cat.E"

# --- Catégorie F : Identifiants infrastructure ---

scan_warning_pattern "IP privée" \
  '192\.168\.[0-9]+\.[0-9]+|10\.[0-9]+\.[0-9]+\.[0-9]+' \
  "Cat.F"

scan_warning_pattern "URL admin interne" \
  'https?://(pi-?hole|nas|router|admin|dashboard)\.' \
  "Cat.F"

# --- Images (EXIF) ---

for f in "${FILES[@]}"; do
  if echo "$f" | grep -qiE '\.(jpg|jpeg|png|gif|heic|heif|tiff|webp)$'; then
    add_warning "$f — Cat.F — Image : peut contenir des données EXIF (géolocalisation)"
  fi
done

# --- Rapport ---

echo ""
echo -e "${BOLD}─── Résultat ───${RESET}"
echo ""

EXIT_CODE=0

if [[ ${#BLOCKERS[@]} -gt 0 ]]; then
  echo -e "${RED}🚫 Bloquants (${#BLOCKERS[@]}) :${RESET}"
  for b in "${BLOCKERS[@]}"; do
    echo -e "  ${RED}• $b${RESET}"
  done
  echo ""
  EXIT_CODE=1
fi

if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  echo -e "${YELLOW}⚠️  Warnings (${#WARNINGS[@]}) :${RESET}"
  for w in "${WARNINGS[@]}"; do
    echo -e "  ${YELLOW}• $w${RESET}"
  done
  echo ""
  if [[ $EXIT_CODE -eq 0 ]]; then
    EXIT_CODE=2
  fi
fi

if [[ ${#BLOCKERS[@]} -eq 0 && ${#WARNINGS[@]} -eq 0 ]]; then
  echo -e "${GREEN}✅ Aucun finding. Prêt à committer.${RESET}"
fi

exit $EXIT_CODE

#!/usr/bin/env bash
# Installe le hook pre-commit qui lance l'audit de sensibilité.
# Usage : scripts/setup-hooks.sh
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOK_DIR="$REPO_ROOT/.git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

if [[ -f "$HOOK_FILE" ]]; then
  echo "⚠️  Un hook pre-commit existe déjà : $HOOK_FILE"
  echo "   Contenu actuel :"
  head -5 "$HOOK_FILE"
  echo ""
  read -rp "Écraser ? (y/N) " answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "Annulé."
    exit 0
  fi
fi

cat > "$HOOK_FILE" << 'HOOK'
#!/usr/bin/env bash
# Hook pre-commit — audit de sensibilité juju-aviatrice
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
SCRIPT="$REPO_ROOT/scripts/audit-sensibilite.sh"

if [[ ! -x "$SCRIPT" ]]; then
  echo "⚠️  scripts/audit-sensibilite.sh introuvable ou non exécutable."
  echo "   Lancer : chmod +x scripts/audit-sensibilite.sh"
  exit 1
fi

"$SCRIPT" --diff

EXIT_CODE=$?
if [[ $EXIT_CODE -eq 1 ]]; then
  echo ""
  echo "🚫 Commit bloqué — corriger les findings ci-dessus."
  exit 1
elif [[ $EXIT_CODE -eq 2 ]]; then
  echo ""
  read -rp "⚠️  Warnings détectés. Committer quand même ? (y/N) " answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "Commit annulé."
    exit 1
  fi
fi
HOOK

chmod +x "$HOOK_FILE"
echo "✅ Hook pre-commit installé : $HOOK_FILE"

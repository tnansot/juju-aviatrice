// bc-contenu, bc-entrainement — orchestrateur du parcours psy J3 (spec-ecran-fiche-methode, spec-ecran-qcm, spec-ecran-recap-psy)
//
// Enchaîne la fiche méthode (FO-11), les exercices psy sans chronomètre
// (REQ-SESSION-004) puis le récap de séquence (FO-13). Le récap propose d'essayer
// l'autre type psy, relançant le parcours sur ce type (REQ-SUGGEST-004).
import { useState } from "react";
import { SessionFlow } from "../entrainement/SessionFlow.js";
import { trpc } from "../trpc.js";
import { FicheMethodeScreen } from "./FicheMethodeScreen.js";
import { RecapPsyScreen } from "./RecapPsyScreen.js";

type EtapePsy = "fiche" | "session";

// Libellé du bouton « Essayer … » (FO-13) par type, repris du wireframe.
const LABEL_AUTRE_TYPE: Record<string, string> = {
  logique: "la logique",
  calcul_mental: "le calcul mental",
};

export function PsyFlow({
  chapitreId,
  chapitreNom,
  onQuitter,
}: {
  chapitreId: string;
  chapitreNom: string;
  onQuitter: () => void;
}) {
  const [cible, setCible] = useState({ chapitreId, chapitreNom });
  const [etape, setEtape] = useState<EtapePsy>("fiche");
  const piliersQuery = trpc.contenu.listerPiliers.useQuery();

  const psyChapitres =
    piliersQuery.data?.find((p) => p.id === "psychotechniques")?.chapitres ??
    [];
  const autre = psyChapitres.find((c) => c.id !== cible.chapitreId);
  const autreTypeLabel = autre
    ? (LABEL_AUTRE_TYPE[autre.matiere] ?? autre.nom)
    : null;

  function essayerAutreType() {
    if (!autre) return;
    setCible({ chapitreId: autre.id, chapitreNom: autre.nom });
    setEtape("fiche");
  }

  if (etape === "session") {
    return (
      <SessionFlow
        params={{
          chapitreId: cible.chapitreId,
          chapitreNom: cible.chapitreNom,
          format: "qcm",
          modeChrono: false,
        }}
        onQuitter={onQuitter}
        renderFin={(miniSessionId) => (
          <RecapPsyScreen
            miniSessionId={miniSessionId}
            chapitreNom={cible.chapitreNom}
            autreTypeLabel={autreTypeLabel}
            onAutreType={essayerAutreType}
            onAccueil={onQuitter}
          />
        )}
      />
    );
  }

  return (
    <FicheMethodeScreen
      chapitreId={cible.chapitreId}
      chapitreNom={cible.chapitreNom}
      onSentrainer={() => setEtape("session")}
      onPlusTard={onQuitter}
    />
  );
}

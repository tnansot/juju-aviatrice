// bc-contenu, bc-entrainement — orchestrateur du parcours psy J3 (spec-ecran-fiche-methode, spec-ecran-qcm)
//
// Enchaîne la fiche méthode (FO-11) puis les exercices psy sans chronomètre
// (REQ-SESSION-004). Le récap de séquence (FO-13) sera ajouté en S5.
import { useState } from "react";
import { SessionFlow } from "../entrainement/SessionFlow.js";
import { FicheMethodeScreen } from "./FicheMethodeScreen.js";

type EtapePsy = "fiche" | "session";

export function PsyFlow({
  chapitreId,
  chapitreNom,
  onQuitter,
}: {
  chapitreId: string;
  chapitreNom: string;
  onQuitter: () => void;
}) {
  const [etape, setEtape] = useState<EtapePsy>("fiche");

  if (etape === "session") {
    return (
      <SessionFlow
        params={{ chapitreId, chapitreNom, format: "qcm", modeChrono: false }}
        onQuitter={onQuitter}
      />
    );
  }

  return (
    <FicheMethodeScreen
      chapitreId={chapitreId}
      chapitreNom={chapitreNom}
      onSentrainer={() => setEtape("session")}
      onPlusTard={onQuitter}
    />
  );
}

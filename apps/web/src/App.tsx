// bc-identite, bc-onboarding, bc-entrainement — point d'entrée app : garde device,
// routing onboarding puis navigation accueil → session / choix d'activité
import { useState } from "react";
import { HomeScreen } from "./accueil/HomeScreen.js";
import { ChoixActivite } from "./entrainement/ChoixActivite.js";
import { SessionFlow } from "./entrainement/SessionFlow.js";
import type { ParamsDemarrage } from "./entrainement/types.js";
import { AccessRefused } from "./identite/AccessRefused.js";
import { DeviceGuard } from "./identite/DeviceGuard.js";
import { OnboardingFlow } from "./onboarding/OnboardingFlow.js";
import { VersionPage } from "./version/VersionPage.js";

// Suggestion par défaut (stub) en attendant bc-suggestion (F9) : flashcards maths.
const SUGGESTION_DEFAUT: ParamsDemarrage = {
  chapitreId: "maths-geometrie",
  chapitreNom: "Géométrie",
  format: "flashcard",
};

type Vue = "accueil" | "choix" | "session";

export function App() {
  if (window.location.pathname === "/version") {
    return <VersionPage />;
  }

  return (
    <DeviceGuard fallback={<AccessRefused />}>
      <AuthenticatedApp />
    </DeviceGuard>
  );
}

function AuthenticatedApp() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [vue, setVue] = useState<Vue>("accueil");
  const [params, setParams] = useState<ParamsDemarrage>(SUGGESTION_DEFAUT);

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={() => setOnboardingDone(true)} />;
  }

  if (vue === "session") {
    return <SessionFlow params={params} onQuitter={() => setVue("accueil")} />;
  }

  if (vue === "choix") {
    return (
      <ChoixActivite
        onChoisir={(chapitreId, chapitreNom, format) => {
          setParams({ chapitreId, chapitreNom, format });
          setVue("session");
        }}
        onChoisirPsy={(chapitreId, chapitreNom) => {
          // Entraînement psy : QCM sans chronomètre (REQ-SESSION-004).
          setParams({
            chapitreId,
            chapitreNom,
            format: "qcm",
            modeChrono: false,
          });
          setVue("session");
        }}
        onRetour={() => setVue("accueil")}
      />
    );
  }

  return (
    <HomeScreen
      onGo={() => {
        setParams(SUGGESTION_DEFAUT);
        setVue("session");
      }}
      onChanger={() => setVue("choix")}
    />
  );
}

// bc-identite, bc-onboarding — point d'entrée app avec garde device et routing onboarding
import { useState } from "react";
import { HomeScreen } from "./accueil/HomeScreen.js";
import { AccessRefused } from "./identite/AccessRefused.js";
import { DeviceGuard } from "./identite/DeviceGuard.js";
import { OnboardingFlow } from "./onboarding/OnboardingFlow.js";
import { VersionPage } from "./version/VersionPage.js";

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

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={() => setOnboardingDone(true)} />;
  }

  return <HomeScreen />;
}

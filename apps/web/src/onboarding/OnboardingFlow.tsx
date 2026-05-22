// bc-onboarding — flow de routing onboarding (bc-onboarding, spec API onboarding)
import { useState } from "react";
import { trpc } from "../trpc.js";
import { OnboardingFlashcard } from "./OnboardingFlashcard.js";
import { PiliersScreen } from "./PiliersScreen.js";
import { WelcomeScreen } from "./WelcomeScreen.js";

type OnboardingStep = "bienvenue" | "piliers" | "flashcard" | "done";

function stepFromEtat(
  etat: string,
  etapeCourante: number | null,
): OnboardingStep {
  if (etat === "complete" || etat === "saute") return "done";
  if (etat === "non_demarre") return "bienvenue";
  if (etat === "en_cours") {
    if (etapeCourante === 2) return "piliers";
    if (etapeCourante === 3) return "flashcard";
    return "bienvenue";
  }
  return "bienvenue";
}

export function OnboardingFlow({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const etatQuery = trpc.onboarding.obtenirEtat.useQuery();
  const [step, setStep] = useState<OnboardingStep | null>(null);

  const initialStep = etatQuery.data
    ? stepFromEtat(etatQuery.data.etat, etatQuery.data.etapeCourante)
    : null;

  const currentStep = step ?? initialStep;

  if (etatQuery.isLoading || !currentStep) {
    return null;
  }

  if (currentStep === "done") {
    onComplete();
    return null;
  }

  if (currentStep === "bienvenue") {
    return (
      <WelcomeScreen
        onContinue={() => setStep("piliers")}
        onSkip={onComplete}
      />
    );
  }

  if (currentStep === "piliers") {
    return (
      <PiliersScreen
        onContinue={() => setStep("flashcard")}
        onSkip={onComplete}
      />
    );
  }

  if (currentStep === "flashcard") {
    return <OnboardingFlashcard onComplete={onComplete} />;
  }

  return null;
}

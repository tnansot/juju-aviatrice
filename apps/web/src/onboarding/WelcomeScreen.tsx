// bc-onboarding — écran bienvenue FO-01 (spec-ecran-onboarding-bienvenue, model-etat-onboarding)
import { trpc } from "../trpc.js";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen({
  onContinue,
  onSkip,
}: {
  onContinue: () => void;
  onSkip: () => void;
}) {
  const avancerEtape = trpc.onboarding.avancerEtape.useMutation();
  const sauter = trpc.onboarding.sauter.useMutation();

  function handleContinue() {
    avancerEtape.mutate(
      { etapeCompletee: 1 },
      { onSuccess: () => onContinue() },
    );
  }

  function handleSkip() {
    sauter.mutate(undefined, { onSuccess: () => onSkip() });
  }

  return (
    <div className={styles.screen}>
      <div className={styles.avatar}>
        <span className={styles.avatarLabel}>Stade 1</span>
      </div>
      <h1 className={styles.greeting}>Salut Juju</h1>
      <p className={styles.subtitle}>
        Ton compagnon d'entraînement est prêt. Il va progresser avec toi.
      </p>
      <button
        type="button"
        className={styles.btnPrimary}
        onClick={handleContinue}
        disabled={avancerEtape.isPending}
      >
        Continuer
      </button>
      <button
        type="button"
        className={styles.btnSkip}
        onClick={handleSkip}
        disabled={sauter.isPending}
      >
        Passer
      </button>
    </div>
  );
}

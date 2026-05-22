// bc-onboarding — écran piliers FO-02 (spec-ecran-onboarding-piliers, bc-contenu)
import { trpc } from "../trpc.js";
import styles from "./PiliersScreen.module.css";

export function PiliersScreen({
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
      { etapeCompletee: 2 },
      { onSuccess: () => onContinue() },
    );
  }

  function handleSkip() {
    sauter.mutate(undefined, { onSuccess: () => onSkip() });
  }

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>Deux terrains d'entraînement</h2>
      <p className={styles.intro}>
        Ton compagnon couvre deux grandes familles. Le contenu s'enrichira avec
        le temps.
      </p>

      <div className={styles.pillarCard}>
        <div className={`${styles.pillarIcon} ${styles.iconSciences}`}>SCI</div>
        <div className={styles.pillarName}>Sciences</div>
        <div className={styles.pillarDesc}>
          Maths + physique-chimie de 1ère. Flashcards et QCM pour ancrer les
          réflexes.
        </div>
      </div>

      <div className={styles.pillarCard}>
        <div className={`${styles.pillarIcon} ${styles.iconPsy}`}>PSY</div>
        <div className={styles.pillarName}>Psychotechniques</div>
        <div className={styles.pillarDesc}>
          Logique et calcul mental. Fiches méthode pour comprendre, puis
          exercices pour s'entraîner.
        </div>
      </div>

      <p className={styles.futureNote}>
        D'autres contenus arriveront au fil du temps.
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

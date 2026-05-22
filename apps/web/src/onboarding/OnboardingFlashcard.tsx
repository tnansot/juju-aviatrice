// bc-onboarding — écran flashcard FO-03 (spec-ecran-onboarding-flashcard, bc-contenu)
import { useState } from "react";
import { trpc } from "../trpc.js";
import styles from "./OnboardingFlashcard.module.css";

type Phase = "flashcard" | "progression";

export function OnboardingFlashcard({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("flashcard");
  const [flipped, setFlipped] = useState(false);

  const flashcard = trpc.contenu.obtenirFlashcardEchantillon.useQuery();
  const avancerEtape = trpc.onboarding.avancerEtape.useMutation();

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  function handleContinueToProgression() {
    avancerEtape.mutate(
      { etapeCompletee: 3 },
      { onSuccess: () => setPhase("progression") },
    );
  }

  if (flashcard.isLoading) return null;

  const card = flashcard.data;
  if (!card) return null;

  if (phase === "progression") {
    return (
      <div className={styles.screen}>
        <div className={styles.progressionPhase}>
          <div className={styles.avatarSmall}>
            <span className={styles.avatarLabel}>Stade 1+</span>
          </div>
          <p className={styles.progressionMsg}>
            Ton avatar a fait un premier pas
          </p>
          <p className={styles.progressionSub}>
            Chaque exercice le fait avancer. Un déblocage arrive bientôt.
          </p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onComplete}
          >
            C'est parti
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.flashcardPhase}>
        <span className={styles.stepLabel}>Onboarding 3/3</span>
        <p className={styles.introText}>
          Première flashcard, juste pour goûter
        </p>
        <p className={styles.introSub}>
          Formule ta réponse dans ta tête, puis retourne la carte.
        </p>

        <button
          type="button"
          className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`}
          onClick={handleFlip}
        >
          {!flipped ? (
            <>
              <span className={styles.flashcardQuestion}>
                {card.faceQuestion}
              </span>
              <span className={styles.flashcardHint}>Tape pour retourner</span>
            </>
          ) : (
            <>
              <span className={styles.flashcardAnswerLabel}>Réponse</span>
              <span className={styles.flashcardAnswerText}>
                {card.faceReponse}
              </span>
              <span className={styles.flashcardCorrection}>
                {card.correction}
              </span>
            </>
          )}
        </button>

        {flipped && (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleContinueToProgression}
            disabled={avancerEtape.isPending}
          >
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}

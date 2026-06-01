// bc-entrainement — écran flashcard FO-05 (spec-ecran-flashcard, direction-artistique)
import { useState } from "react";
import { trpc } from "../trpc.js";
import styles from "./FlashcardScreen.module.css";
import type { EnonceFlashcard, Exercice, PositionExercice } from "./types.js";

export function FlashcardScreen({
  exercice,
  chapitreNom,
  position,
  onSuivant,
}: {
  exercice: Exercice;
  chapitreNom: string;
  position: PositionExercice;
  onSuivant: () => void;
}) {
  const enonce = exercice.enonce as EnonceFlashcard;
  const [flipped, setFlipped] = useState(false);
  const retourner = trpc.entrainement.retournerFlashcard.useMutation();

  function handleFlip() {
    if (flipped) return;
    setFlipped(true);
    // Le retournement vaut effort : on marque l'exercice complété côté backend.
    retourner.mutate({ exerciceEnCoursId: exercice.exerciceEnCoursId });
  }

  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <span className={styles.chapterLabel}>{chapitreNom}</span>
        <span className={styles.progress}>
          {position.courant} / {position.total}
        </span>
      </div>

      <button
        type="button"
        className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`}
        onClick={handleFlip}
      >
        {flipped ? (
          <>
            <span className={styles.answerLabel}>Réponse</span>
            <span className={styles.answerText}>{enonce.faceReponse}</span>
            <span className={styles.explicationLabel}>Explication</span>
            <span className={styles.explicationText}>{enonce.explication}</span>
          </>
        ) : (
          <>
            <span className={styles.question}>{enonce.faceQuestion}</span>
            <span className={styles.hint}>Tape pour retourner</span>
          </>
        )}
      </button>

      {flipped && (
        <div className={styles.actions}>
          <button type="button" className={styles.btnNext} onClick={onSuivant}>
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

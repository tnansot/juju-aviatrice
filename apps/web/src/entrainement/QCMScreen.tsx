// bc-entrainement — écran QCM FO-06 (spec-ecran-qcm, direction-artistique)
import { useState } from "react";
import { trpc } from "../trpc.js";
import styles from "./QCMScreen.module.css";
import type { EnonceQcm, Exercice, PositionExercice } from "./types.js";

function formatChrono(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QCMScreen({
  exercice,
  chapitreNom,
  position,
  modeChrono,
  dureeChrono,
  onSuivant,
}: {
  exercice: Exercice;
  chapitreNom: string;
  position: PositionExercice;
  modeChrono: boolean;
  dureeChrono: number | null;
  onSuivant: () => void;
}) {
  const enonce = exercice.enonce as EnonceQcm;
  const [selection, setSelection] = useState<string | null>(null);
  const [resultat, setResultat] = useState<{
    estCorrect: boolean;
    correction: string;
    bonneReponseId: string;
    exerciceSuivant: boolean;
  } | null>(null);
  const soumettre = trpc.entrainement.soumettreReponse.useMutation();
  const valide = resultat !== null;

  function handleValider() {
    if (selection === null || valide) return;
    soumettre.mutate(
      {
        exerciceEnCoursId: exercice.exerciceEnCoursId,
        choixId: selection,
      },
      { onSuccess: (data) => setResultat(data) },
    );
  }

  function classeChoix(choixId: string): string {
    if (!valide || !resultat) {
      return selection === choixId
        ? `${styles.choice} ${styles.selected}`
        : styles.choice;
    }
    if (choixId === resultat.bonneReponseId) {
      return `${styles.choice} ${styles.correct}`;
    }
    if (choixId === selection) {
      return `${styles.choice} ${styles.autre}`;
    }
    return styles.choice;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <span className={styles.chapterLabel}>{chapitreNom}</span>
        <span className={styles.progress}>
          {position.courant} / {position.total}
        </span>
        {modeChrono && dureeChrono !== null && (
          <span className={styles.chrono}>{formatChrono(dureeChrono)}</span>
        )}
      </div>

      <p className={styles.question}>{enonce.question}</p>

      <ul className={styles.choices}>
        {enonce.choix.map((choix) => (
          <li key={choix.id}>
            <button
              type="button"
              className={classeChoix(choix.id)}
              onClick={() => !valide && setSelection(choix.id)}
              disabled={valide}
            >
              {choix.libelle}
            </button>
          </li>
        ))}
      </ul>

      {valide && resultat && (
        <div className={styles.explication}>
          <span className={styles.explicationLabel}>Explication</span>
          <p className={styles.explicationText}>{resultat.correction}</p>
        </div>
      )}

      <div className={styles.actions}>
        {valide ? (
          <button type="button" className={styles.btnNext} onClick={onSuivant}>
            Suivant
          </button>
        ) : (
          <button
            type="button"
            className={styles.btnValidate}
            onClick={handleValider}
            disabled={selection === null || soumettre.isPending}
          >
            Valider
          </button>
        )}
      </div>
    </div>
  );
}

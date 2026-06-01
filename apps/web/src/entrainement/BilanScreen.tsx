// bc-entrainement — écran bilan FO-07 (spec-ecran-bilan, direction-artistique)
//
// Clôture la mini-session (terminerMiniSession) puis affiche un bilan sobre
// (nombre d'exercices + durée, jamais de note /N). La barre de progression vers
// le prochain déblocage et l'évolution d'avatar relèvent de bc-progression (F8)
// et seront ajoutées quand ce contexte existera.
import { useEffect } from "react";
import { trpc } from "../trpc.js";
import styles from "./BilanScreen.module.css";

export function BilanScreen({
  miniSessionId,
  onEncore,
  onArreter,
}: {
  miniSessionId: string;
  onEncore: () => void;
  onArreter: () => void;
}) {
  const terminer = trpc.entrainement.terminerMiniSession.useMutation();

  // Clôture unique au montage du bilan.
  // biome-ignore lint/correctness/useExhaustiveDependencies: clôture volontairement unique au montage
  useEffect(() => {
    terminer.mutate({ miniSessionId });
  }, []);

  const bilan = trpc.entrainement.obtenirBilan.useQuery(
    { miniSessionId },
    { enabled: terminer.isSuccess },
  );

  if (!bilan.data) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>Session terminée</h2>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>
            {bilan.data.nombreExercicesFaits}
          </div>
          <div className={styles.statLabel}>exercices</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{bilan.data.dureeMinutes} min</div>
          <div className={styles.statLabel}>durée</div>
        </div>
      </div>

      <div className={styles.avatarZone}>
        <div className={styles.avatarSmall}>
          <span className={styles.avatarLabel}>Stade 1</span>
        </div>
        <p className={styles.avatarMsg}>{bilan.data.messageBilan}</p>
      </div>

      <button type="button" className={styles.btnPrimary} onClick={onEncore}>
        Encore une session
      </button>
      <button type="button" className={styles.btnStop} onClick={onArreter}>
        Bonne nuit
      </button>
    </div>
  );
}

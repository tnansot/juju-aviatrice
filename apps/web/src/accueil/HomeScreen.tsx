// bc-onboarding, bc-suggestion, bc-progression — écran accueil FO-04 (spec-ecran-accueil)
import styles from "./HomeScreen.module.css";

export function HomeScreen({
  onGo,
  onChanger,
}: {
  onGo: () => void;
  onChanger: () => void;
}) {
  return (
    <div className={styles.screen}>
      <div className={styles.avatarZone}>
        <div className={styles.avatar}>
          <span className={styles.avatarPlaceholder}>Avatar stade 1</span>
        </div>
        <div className={styles.avatarName}>Juju</div>
        <div className={styles.avatarStade}>Stade 1 — Débutante</div>
      </div>

      <div className={styles.suggestionCard}>
        <span className={styles.suggestionLabel}>Suggestion</span>
        <p className={styles.suggestionText}>
          Lance ta première session : 4 flashcards maths
        </p>
        <button type="button" className={styles.btnGo} onClick={onGo}>
          Go
        </button>
      </div>

      <button type="button" className={styles.btnChange} onClick={onChanger}>
        Changer d'activité
      </button>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>0</div>
          <div className={styles.statLabel}>sessions</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>0</div>
          <div className={styles.statLabel}>exercices</div>
        </div>
      </div>
    </div>
  );
}

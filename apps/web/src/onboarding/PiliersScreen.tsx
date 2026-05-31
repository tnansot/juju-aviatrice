// bc-onboarding — écran piliers FO-02 (spec-ecran-onboarding-piliers, bc-contenu)
import { trpc } from "../trpc.js";
import styles from "./PiliersScreen.module.css";

// Habillage visuel par pilier (le contenu vient de contenu.listerPiliers)
const PILIER_ICONS: Record<string, { label: string; className: string }> = {
  sciences: { label: "SCI", className: styles.iconSciences },
  psychotechniques: { label: "PSY", className: styles.iconPsy },
};

export function PiliersScreen({
  onContinue,
  onSkip,
}: {
  onContinue: () => void;
  onSkip: () => void;
}) {
  const piliersQuery = trpc.contenu.listerPiliers.useQuery();
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

  if (piliersQuery.isLoading || !piliersQuery.data) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>Deux terrains d'entraînement</h2>
      <p className={styles.intro}>
        Ton compagnon couvre deux grandes familles. Le contenu s'enrichira avec
        le temps.
      </p>

      {piliersQuery.data.map((pilier) => {
        const icon = PILIER_ICONS[pilier.id];
        return (
          <div key={pilier.id} className={styles.pillarCard}>
            <div className={`${styles.pillarIcon} ${icon?.className ?? ""}`}>
              {icon?.label ?? pilier.nom.slice(0, 3).toUpperCase()}
            </div>
            <div className={styles.pillarName}>{pilier.nom}</div>
            <div className={styles.pillarDesc}>{pilier.description}</div>
          </div>
        );
      })}

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

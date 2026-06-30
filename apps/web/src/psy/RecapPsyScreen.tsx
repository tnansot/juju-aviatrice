// bc-entrainement, bc-progression — écran Récap Séquence Psy FO-13 (spec-ecran-recap-psy)
//
// Clôture la mini-session psy (terminerMiniSession) puis affiche une checklist
// factuelle des étapes franchies (fiche lue, N exercices sans chrono). Pas de
// note /N (REQ-SESSION-007). La ligne « QCM chrono » relève de F7 (FO-12) et
// l'avatar par stade de F8 ; ici un message sobre suffit.
import { Check } from "lucide-react";
import { useEffect } from "react";
import { trpc } from "../trpc.js";
import styles from "./RecapPsyScreen.module.css";

export function RecapPsyScreen({
  miniSessionId,
  chapitreNom,
  autreTypeLabel,
  onAutreType,
  onAccueil,
}: {
  miniSessionId: string;
  chapitreNom: string;
  autreTypeLabel: string | null;
  onAutreType: () => void;
  onAccueil: () => void;
}) {
  const terminer = trpc.entrainement.terminerMiniSession.useMutation();

  // Clôture unique au montage du récap.
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

  const etapes = [
    { texte: "Fiche méthode lue" },
    { texte: `${bilan.data.nombreExercicesFaits} exercices sans chrono` },
  ];

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>Premier passage {chapitreNom} terminé</h2>
      <p className={styles.sub}>
        Tu as exploré un nouveau terrain. Les prochaines sessions psy seront
        suggérées en alternance avec les sciences.
      </p>

      <ul className={styles.list}>
        {etapes.map((etape) => (
          <li key={etape.texte} className={styles.item}>
            <span className={styles.check}>
              <Check size={16} strokeWidth={1.75} />
            </span>
            <span className={styles.itemText}>{etape.texte}</span>
          </li>
        ))}
      </ul>

      <div className={styles.avatarZone}>
        <p className={styles.avatarMsg}>
          Ton compagnon a exploré un nouveau monde
        </p>
      </div>

      {autreTypeLabel ? (
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={onAutreType}
        >
          Essayer {autreTypeLabel}
        </button>
      ) : null}
      <button type="button" className={styles.btnSecondary} onClick={onAccueil}>
        Retour à l'accueil
      </button>
    </div>
  );
}

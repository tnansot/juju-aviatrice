// bc-contenu — écran Fiche Méthode FO-11 (spec-ecran-fiche-methode, model-fiche-methode)
import { trpc } from "../trpc.js";
import styles from "./FicheMethodeScreen.module.css";

export function FicheMethodeScreen({
  chapitreId,
  chapitreNom,
  onSentrainer,
  onPlusTard,
}: {
  chapitreId: string;
  chapitreNom: string;
  onSentrainer: () => void;
  onPlusTard: () => void;
}) {
  const ficheQuery = trpc.contenu.obtenirFicheMethode.useQuery({ chapitreId });

  if (ficheQuery.isLoading || !ficheQuery.data) {
    return null;
  }

  const fiche = ficheQuery.data;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Fiche méthode — Psychotechniques</p>
        <h2 className={styles.title}>{chapitreNom}</h2>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>C'est quoi ?</h3>
        <p className={styles.sectionBody}>{fiche.cestQuoi}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ce que ça évalue</h3>
        <ul className={styles.list}>
          {fiche.ceQueCaEvalue.map((item) => (
            <li key={item} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Comment l'aborder</h3>
        <ul className={styles.list}>
          {fiche.commentAborder.map((item) => (
            <li key={item} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={onSentrainer}
        >
          S'entraîner
        </button>
        <button type="button" className={styles.btnSkip} onClick={onPlusTard}>
          Plus tard
        </button>
      </div>
    </div>
  );
}

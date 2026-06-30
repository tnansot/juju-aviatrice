// bc-onboarding, bc-contenu — écran Psy Bienvenue FO-10 (spec-ecran-psy-bienvenue, bc-onboarding)
import { Brain } from "lucide-react";
import styles from "./PsyBienvenueScreen.module.css";

// Habillage rédactionnel FO-10 par type psy (libellés repris littéralement du
// wireframe fo-10-psy-bienvenue — source de vérité rédactionnelle). La logique
// est recommandée en premier (REQ-CONTENU-007).
const TYPE_HABILLAGE: Record<
  string,
  { desc: string; recommande: boolean; ordre: number }
> = {
  logique: {
    desc: "Séries, analogies, raisonnement déductif. Fiche méthode + exercices pour apprivoiser.",
    recommande: true,
    ordre: 1,
  },
  calcul_mental: {
    desc: "Opérations rapides et estimation. Même structure : comprendre puis s'entraîner.",
    recommande: false,
    ordre: 2,
  },
};

export interface ChapitrePsy {
  id: string;
  nom: string;
  matiere: string;
}

export function PsyBienvenueScreen({
  chapitres,
  onChoisirType,
  onRetour,
}: {
  chapitres: ChapitrePsy[];
  onChoisirType: (chapitreId: string, nom: string) => void;
  onRetour: () => void;
}) {
  const types = [...chapitres].sort(
    (a, b) =>
      (TYPE_HABILLAGE[a.matiere]?.ordre ?? 99) -
      (TYPE_HABILLAGE[b.matiere]?.ordre ?? 99),
  );

  return (
    <div className={styles.screen}>
      <div className={styles.icon}>
        <Brain size={32} strokeWidth={1.75} />
      </div>
      <h2 className={styles.title}>Bienvenue dans la zone Psy</h2>
      <p className={styles.intro}>
        Deux types de tests utilisés dans les sélections pilote. On commence par
        comprendre, puis on s'entraîne.
      </p>

      {types.map((type) => {
        const habillage = TYPE_HABILLAGE[type.matiere];
        return (
          <button
            key={type.id}
            type="button"
            className={styles.typeCard}
            onClick={() => onChoisirType(type.id, type.nom)}
          >
            <span className={styles.typeHeader}>
              <span className={styles.typeName}>{type.nom}</span>
              {habillage?.recommande ? (
                <span className={styles.typeBadge}>Recommandé en 1er</span>
              ) : null}
            </span>
            <span className={styles.typeDesc}>{habillage?.desc}</span>
          </button>
        );
      })}

      <p className={styles.note}>
        Tu peux commencer par celui qui t'intrigue le plus. La logique est
        souvent plus visuelle, c'est un bon point de départ.
      </p>

      <button type="button" className={styles.btnBack} onClick={onRetour}>
        Retour à l'accueil
      </button>
    </div>
  );
}

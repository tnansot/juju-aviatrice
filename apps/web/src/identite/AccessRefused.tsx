// bc-identite — écran accès refusé FO-14 (spec-ecran-acces-refuse, wireframe fo-14)
import { Lock } from "lucide-react";
import styles from "./AccessRefused.module.css";

export function AccessRefused() {
  return (
    <div className={styles.screen}>
      <div className={styles.lockIcon}>
        <Lock size={32} strokeWidth={1.75} />
      </div>
      <h1 className={styles.title}>Accès non disponible</h1>
      <p className={styles.desc}>
        Cette application est réservée à une utilisation privée. Si tu devrais y
        avoir accès, demande le lien d'invitation à la personne qui t'a parlé de
        l'app.
      </p>
      <p className={styles.hint}>
        Aucun compte à créer, aucune inscription. Le lien d'invitation suffit.
      </p>
    </div>
  );
}

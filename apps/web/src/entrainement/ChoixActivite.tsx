// bc-entrainement — écran choix d'activité FO-09 (spec-ecran-choix-activite, bc-contenu)
//
// Pour le pilier Psychotechniques au premier accès, l'écran FO-10 Psy Bienvenue
// (spec-ecran-psy-bienvenue) s'intercale : il présente les types et marque le
// premier accès. Les accès suivants mènent directement au choix de type.
import { useState } from "react";
import { PsyBienvenueScreen } from "../psy/PsyBienvenueScreen.js";
import { trpc } from "../trpc.js";
import styles from "./ChoixActivite.module.css";

type Pilier = "sciences" | "psychotechniques";

// Habillage par pilier : libellés repris du wireframe FO-09 (source de vérité rédactionnelle).
const PILIERS: {
  id: Pilier;
  nom: string;
  desc: string;
  format: "flashcard" | "qcm";
}[] = [
  {
    id: "sciences",
    nom: "Sciences",
    desc: "Maths + Physique-chimie 1ère",
    format: "flashcard",
  },
  {
    id: "psychotechniques",
    nom: "Psychotechniques",
    desc: "Logique + Calcul mental",
    format: "qcm",
  },
];

export function ChoixActivite({
  onChoisir,
  onChoisirPsy,
  onRetour,
}: {
  onChoisir: (
    chapitreId: string,
    chapitreNom: string,
    format: "flashcard" | "qcm",
  ) => void;
  onChoisirPsy: (chapitreId: string, chapitreNom: string) => void;
  onRetour: () => void;
}) {
  const piliersQuery = trpc.contenu.listerPiliers.useQuery();
  const etatQuery = trpc.onboarding.obtenirEtat.useQuery();
  const utils = trpc.useUtils();
  const marquerPremierAccesPsy =
    trpc.onboarding.marquerPremierAccesPsy.useMutation();
  const [pilierActif, setPilierActif] = useState<Pilier | null>(null);

  if (
    piliersQuery.isLoading ||
    !piliersQuery.data ||
    etatQuery.isLoading ||
    !etatQuery.data
  ) {
    return null;
  }

  if (pilierActif === null) {
    return (
      <div className={styles.screen}>
        <h2 className={styles.title}>Choisis ton terrain</h2>
        <p className={styles.sub}>Sélectionne un pilier, puis un chapitre.</p>

        <div className={styles.pillarChoice}>
          {PILIERS.map((pilier) => (
            <button
              key={pilier.id}
              type="button"
              className={styles.pillarBtn}
              onClick={() => setPilierActif(pilier.id)}
            >
              <span className={styles.pillarName}>{pilier.nom}</span>
              <span className={styles.pillarDesc}>{pilier.desc}</span>
            </button>
          ))}
        </div>

        <button type="button" className={styles.btnBack} onClick={onRetour}>
          Retour
        </button>
      </div>
    );
  }

  const pilier = PILIERS.find((p) => p.id === pilierActif);
  const pilierData = piliersQuery.data.find((p) => p.id === pilierActif);
  const chapitres = pilierData?.chapitres ?? [];

  // Premier accès psy : on intercale l'écran de bienvenue FO-10.
  if (
    pilierActif === "psychotechniques" &&
    !etatQuery.data.premierAccesPsyFait
  ) {
    return (
      <PsyBienvenueScreen
        chapitres={chapitres.map((c) => ({
          id: c.id,
          nom: c.nom,
          matiere: c.matiere,
        }))}
        onChoisirType={(chapitreId, chapitreNom) => {
          marquerPremierAccesPsy.mutate(undefined, {
            onSuccess: () => utils.onboarding.obtenirEtat.invalidate(),
          });
          onChoisirPsy(chapitreId, chapitreNom);
        }}
        onRetour={() => setPilierActif(null)}
      />
    );
  }

  const estPsy = pilierActif === "psychotechniques";

  return (
    <div className={styles.screen}>
      <h2 className={styles.title}>{pilier?.nom}</h2>
      <p className={styles.sub}>Choisis un chapitre.</p>

      <ul className={styles.chapterList}>
        {chapitres.map((chapitre) => (
          <li key={chapitre.id}>
            <button
              type="button"
              className={styles.chapterItem}
              onClick={() =>
                estPsy
                  ? onChoisirPsy(chapitre.id, chapitre.nom)
                  : onChoisir(
                      chapitre.id,
                      chapitre.nom,
                      pilier?.format ?? "flashcard",
                    )
              }
            >
              <span className={styles.chapterName}>{chapitre.nom}</span>
              <span className={styles.chapterStatus}>Débloqué</span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.btnBack}
        onClick={() => setPilierActif(null)}
      >
        Retour
      </button>
    </div>
  );
}

// bc-identite, bc-onboarding, bc-contenu, bc-entrainement — schemas Zod partagés
// entre routers tRPC (schemas-partages)
import { z } from "zod";

export const zDeviceId = z.string().uuid();
export type DeviceId = z.infer<typeof zDeviceId>;

export const zEtatOnboarding = z.enum([
  "non_demarre",
  "en_cours",
  "complete",
  "saute",
]);
export type EtatOnboarding = z.infer<typeof zEtatOnboarding>;

// --- bc-contenu / bc-entrainement ---

export const zChapitreId = z.string().regex(/^[a-z0-9-]+$/);
export type ChapitreId = z.infer<typeof zChapitreId>;

export const zExerciceId = z.string().min(1);
export type ExerciceId = z.infer<typeof zExerciceId>;

export const zFormat = z.enum(["flashcard", "qcm"]);
export type Format = z.infer<typeof zFormat>;

export const zMatiere = z.enum([
  "maths",
  "physique_chimie",
  "logique",
  "calcul_mental",
]);
export type Matiere = z.infer<typeof zMatiere>;

export const zEtatSession = z.enum(["en_cours", "terminee", "interrompue"]);
export type EtatSession = z.infer<typeof zEtatSession>;

export const zEtatMiniSession = z.enum(["en_cours", "terminee", "interrompue"]);
export type EtatMiniSession = z.infer<typeof zEtatMiniSession>;

export const zEtatExercice = z.enum(["en_attente", "complete", "saute"]);
export type EtatExercice = z.infer<typeof zEtatExercice>;

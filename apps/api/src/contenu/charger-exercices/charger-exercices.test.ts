// bc-contenu — tests sélection d'exercices (ADR-010)
import { describe, expect, it } from "vitest";
import type { ExerciceCatalogue } from "../catalogue.js";
import { createChargerExercicesService } from "./charger-exercices.service.js";

// Shuffle identité : rend la sélection déterministe pour les assertions.
const noShuffle = <T>(items: T[]): T[] => items;

// Provider stub : N flashcards factices, pour tester le bornage indépendamment
// du contenu réel du catalogue.
function providerDe(nombre: number) {
  const exercices: ExerciceCatalogue[] = Array.from(
    { length: nombre },
    (_, i) => ({
      id: `fc-${i + 1}`,
      chapitreId: "ch-stub",
      format: "flashcard",
      ordre: i + 1,
      enonce: { faceQuestion: `Q${i + 1}`, faceReponse: `R${i + 1}` },
      correction: `C${i + 1}`,
      typologiePsy: null,
    }),
  );
  return () => exercices;
}

describe("contenu.chargerExercices", () => {
  it("sélectionne le nombre demandé quand le chapitre a ≥ 5 exercices", () => {
    const service = createChargerExercicesService(noShuffle);

    const result = service.execute("maths-geometrie", "flashcard", 4);

    expect(result).toHaveLength(4);
    for (const ex of result) {
      expect(ex.chapitreId).toBe("maths-geometrie");
      expect(ex.format).toBe("flashcard");
    }
  });

  it("retourne tout le contenu disponible quand le chapitre n'a que le minimum (3)", () => {
    const service = createChargerExercicesService(noShuffle, providerDe(3));

    const result = service.execute("ch-stub", "flashcard", 4);

    expect(result).toHaveLength(3);
  });

  it("borne la sélection au maximum de 5 même si on demande plus", () => {
    const service = createChargerExercicesService(noShuffle);

    const result = service.execute("maths-geometrie", "qcm", 99);

    expect(result).toHaveLength(5);
  });

  it("remonte le minimum de 3 même si on demande moins", () => {
    const service = createChargerExercicesService(noShuffle);

    const result = service.execute("maths-geometrie", "flashcard", 1);

    expect(result).toHaveLength(3);
  });

  it("ne mélange que les exercices du format demandé", () => {
    const service = createChargerExercicesService(noShuffle);

    const result = service.execute("maths-geometrie", "qcm", 5);

    for (const ex of result) {
      expect(ex.format).toBe("qcm");
    }
  });

  it("retourne un tableau vide pour un chapitre inexistant", () => {
    const service = createChargerExercicesService(noShuffle);

    const result = service.execute("chapitre-fantome", "flashcard", 4);

    expect(result).toEqual([]);
  });
});

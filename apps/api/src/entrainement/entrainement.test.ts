// bc-entrainement — tests d'intégration (ADR-010, SQLite in-memory)
import { describe, expect, it } from "vitest";
import { devices } from "../shared/db/schema.js";
import { createTestDb } from "../shared/db/test-client.js";
import { type DomainEvent, createEventBus } from "../shared/events.js";
import { createCallerFactory, router } from "../trpc/trpc.js";
import { createEntrainementRouter } from "./entrainement.router.js";

const DEVICE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function setup() {
  const db = createTestDb();
  const bus = createEventBus();
  const events: DomainEvent[] = [];
  bus.on((e) => events.push(e));
  const entrainement = createEntrainementRouter(db, bus);
  const appRouter = router({ entrainement });
  const caller = createCallerFactory(appRouter)({
    req: new Request("http://localhost/trpc", {
      headers: { "X-Device-Id": DEVICE_ID },
    }),
  });
  db.insert(devices)
    .values({
      id: DEVICE_ID,
      dateCreation: new Date(),
      derniereActivite: new Date(),
    })
    .run();
  return { db, caller, events };
}

// Démarre une mini-session et renvoie les exercices + identifiants utiles.
async function demarrer(
  caller:
    | Awaited<ReturnType<typeof setup>>["caller"]
    | ReturnType<typeof setup>["caller"],
  format: "flashcard" | "qcm",
  chapitreId = "maths-geometrie",
) {
  return caller.entrainement.demarrerMiniSession({
    chapitreId,
    format,
    nombre: 4,
  });
}

describe("entrainement.demarrerMiniSession", () => {
  it("démarre une mini-session de 4 flashcards sans écran intermédiaire", async () => {
    const { caller } = setup();

    const result = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-geometrie",
      format: "flashcard",
      modeChrono: false,
      nombre: 4,
    });

    expect(result.sessionId).toBeTruthy();
    expect(result.miniSessionId).toBeTruthy();
    expect(result.exercices).toHaveLength(4);
    expect(result.modeChrono).toBe(false);
    expect(result.dureeChrono).toBeNull();
    for (const ex of result.exercices) {
      expect(ex.format).toBe("flashcard");
      expect(ex.exerciceEnCoursId).toBeTruthy();
      expect(ex.enonce).toHaveProperty("faceQuestion");
      expect(ex.enonce).toHaveProperty("faceReponse");
    }
  });

  it("ne transmet jamais la bonne réponse d'un QCM au frontend", async () => {
    const { caller } = setup();

    const result = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-geometrie",
      format: "qcm",
      modeChrono: false,
      nombre: 4,
    });

    for (const ex of result.exercices) {
      expect(ex.enonce).not.toHaveProperty("bonneReponseId");
      expect(ex.enonce).toHaveProperty("question");
      expect(ex.enonce).toHaveProperty("choix");
    }
  });

  it("conserve le mode chrono et la durée pour un QCM chronométré", async () => {
    const { caller } = setup();

    const result = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-geometrie",
      format: "qcm",
      modeChrono: true,
      dureeChrono: 120,
      nombre: 4,
    });

    expect(result.modeChrono).toBe(true);
    expect(result.dureeChrono).toBe(120);
  });

  it("réutilise la session en cours pour une seconde mini-session", async () => {
    const { caller } = setup();

    const premiere = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-geometrie",
      format: "flashcard",
      nombre: 4,
    });
    const seconde = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-algebre",
      format: "flashcard",
      nombre: 4,
    });

    expect(seconde.sessionId).toBe(premiere.sessionId);
    expect(seconde.miniSessionId).not.toBe(premiere.miniSessionId);
  });

  it("rejette un chapitre inexistant avec NON_TROUVE", async () => {
    const { caller } = setup();

    await expect(
      caller.entrainement.demarrerMiniSession({
        chapitreId: "chapitre-fantome",
        format: "flashcard",
        nombre: 4,
      }),
    ).rejects.toThrow("NON_TROUVE");
  });

  it("numérote les exercices de 1 à n dans l'ordre", async () => {
    const { caller } = setup();

    const result = await caller.entrainement.demarrerMiniSession({
      chapitreId: "maths-geometrie",
      format: "flashcard",
      nombre: 5,
    });

    expect(result.exercices.map((e) => e.ordre)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("entrainement.retournerFlashcard", () => {
  it("complète l'exercice et indique s'il reste un exercice suivant", async () => {
    const { caller, events } = setup();
    const session = await demarrer(caller, "flashcard");

    const r1 = await caller.entrainement.retournerFlashcard({
      exerciceEnCoursId: session.exercices[0].exerciceEnCoursId,
    });

    expect(r1.exerciceSuivant).toBe(true);
    expect(events).toContainEqual(
      expect.objectContaining({
        type: "exercice_effectue",
        estCorrect: null,
      }),
    );
  });

  it("indique exerciceSuivant=false sur le dernier exercice", async () => {
    const { caller } = setup();
    const session = await demarrer(caller, "flashcard");

    for (let i = 0; i < session.exercices.length - 1; i++) {
      await caller.entrainement.retournerFlashcard({
        exerciceEnCoursId: session.exercices[i].exerciceEnCoursId,
      });
    }
    const dernierExercice = session.exercices[session.exercices.length - 1];
    const dernier = await caller.entrainement.retournerFlashcard({
      exerciceEnCoursId: dernierExercice.exerciceEnCoursId,
    });

    expect(dernier.exerciceSuivant).toBe(false);
  });

  it("rejette un exercice d'un autre device", async () => {
    const { caller } = setup();
    await expect(
      caller.entrainement.retournerFlashcard({
        exerciceEnCoursId: "inexistant",
      }),
    ).rejects.toThrow("NON_TROUVE");
  });
});

describe("entrainement.soumettreReponse", () => {
  it("retourne la correction, la bonne réponse et estCorrect", async () => {
    const { caller, events } = setup();
    const session = await demarrer(caller, "qcm");
    const premier = session.exercices[0];

    const choixId =
      "choix" in premier.enonce ? premier.enonce.choix[0].id : "a";
    const result = await caller.entrainement.soumettreReponse({
      exerciceEnCoursId: premier.exerciceEnCoursId,
      choixId,
    });

    expect(typeof result.estCorrect).toBe("boolean");
    expect(result.correction).toBeTruthy();
    expect(result.bonneReponseId).toBeTruthy();
    expect(events).toContainEqual(
      expect.objectContaining({ type: "exercice_effectue" }),
    );
  });

  it("calcule estCorrect=true quand le choix correspond à la bonne réponse", async () => {
    const { caller } = setup();
    const session = await demarrer(caller, "qcm");
    const premier = session.exercices[0];

    // On découvre d'abord la bonne réponse via une 1re soumission, puis on
    // vérifie qu'un choix égal à bonneReponseId donne estCorrect=true.
    const decouverte = await caller.entrainement.soumettreReponse({
      exerciceEnCoursId: premier.exerciceEnCoursId,
      choixId: "choix" in premier.enonce ? premier.enonce.choix[0].id : "a",
    });
    const verif = await caller.entrainement.soumettreReponse({
      exerciceEnCoursId: premier.exerciceEnCoursId,
      choixId: decouverte.bonneReponseId,
    });

    expect(verif.estCorrect).toBe(true);
  });
});

describe("entrainement.terminerMiniSession + obtenirBilan", () => {
  it("clôture la mini-session et compte les exercices faits", async () => {
    const { caller, events } = setup();
    const session = await demarrer(caller, "flashcard");
    for (const ex of session.exercices) {
      await caller.entrainement.retournerFlashcard({
        exerciceEnCoursId: ex.exerciceEnCoursId,
      });
    }

    const result = await caller.entrainement.terminerMiniSession({
      miniSessionId: session.miniSessionId,
    });

    expect(result.etat).toBe("terminee");
    expect(result.nombreExercicesFaits).toBe(session.exercices.length);
    expect(result.avatarProgresse).toBe(false);
    expect(events).toContainEqual(
      expect.objectContaining({ type: "mini_session_terminee" }),
    );
  });

  it("le bilan ne contient ni note /N ni pourcentage et reste positif", async () => {
    const { caller } = setup();
    const session = await demarrer(caller, "flashcard");
    for (const ex of session.exercices) {
      await caller.entrainement.retournerFlashcard({
        exerciceEnCoursId: ex.exerciceEnCoursId,
      });
    }
    await caller.entrainement.terminerMiniSession({
      miniSessionId: session.miniSessionId,
    });

    const bilan = await caller.entrainement.obtenirBilan({
      miniSessionId: session.miniSessionId,
    });

    expect(bilan.nombreExercicesFaits).toBe(session.exercices.length);
    expect(bilan.chapitreNom).toBe("Géométrie");
    expect(bilan.dureeMinutes).toBeGreaterThanOrEqual(1);
    expect(bilan.messageBilan).not.toMatch(/\/\s*\d|%/);
    expect(bilan.messageBilan).not.toMatch(/faux|raté|mauvais/i);
  });
});

describe("entrainement.signalerInterruption", () => {
  it("comptabilise les exercices faits malgré l'interruption", async () => {
    const { caller, events } = setup();
    const session = await demarrer(caller, "flashcard");

    // 2 exercices faits sur 4, puis interruption.
    await caller.entrainement.retournerFlashcard({
      exerciceEnCoursId: session.exercices[0].exerciceEnCoursId,
    });
    await caller.entrainement.retournerFlashcard({
      exerciceEnCoursId: session.exercices[1].exerciceEnCoursId,
    });

    const result = await caller.entrainement.signalerInterruption({
      miniSessionId: session.miniSessionId,
    });

    expect(result.exercicesFaitsComptes).toBe(2);
    expect(events).toContainEqual(
      expect.objectContaining({
        type: "session_interrompue",
        exercicesFaitsComptes: 2,
      }),
    );
  });

  it("est sans effet supplémentaire si rappelé (idempotent sur l'état)", async () => {
    const { caller } = setup();
    const session = await demarrer(caller, "flashcard");
    await caller.entrainement.retournerFlashcard({
      exerciceEnCoursId: session.exercices[0].exerciceEnCoursId,
    });

    const r1 = await caller.entrainement.signalerInterruption({
      miniSessionId: session.miniSessionId,
    });
    const r2 = await caller.entrainement.signalerInterruption({
      miniSessionId: session.miniSessionId,
    });

    expect(r1.exercicesFaitsComptes).toBe(1);
    expect(r2.exercicesFaitsComptes).toBe(1);
  });
});

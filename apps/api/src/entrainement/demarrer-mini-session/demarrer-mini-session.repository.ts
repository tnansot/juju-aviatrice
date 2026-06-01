// bc-entrainement — repository démarrage mini-session (model-session, model-mini-session, model-exercice-en-cours)
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { Db } from "../../shared/db/client.js";
import {
  exercicesEnCours,
  miniSessions,
  sessions,
} from "../../shared/db/schema.js";

export interface ExerciceInstanceACreer {
  exerciceId: string;
  ordre: number;
}

export function createDemarrerMiniSessionRepository(db: Db) {
  return {
    trouverSessionEnCours(deviceId: string) {
      return db
        .select()
        .from(sessions)
        .where(
          and(eq(sessions.deviceId, deviceId), eq(sessions.etat, "en_cours")),
        )
        .get();
    },

    creerSession(deviceId: string): string {
      const id = randomUUID();
      db.insert(sessions)
        .values({ id, deviceId, debut: new Date(), etat: "en_cours" })
        .run();
      return id;
    },

    creerMiniSession(params: {
      sessionId: string;
      chapitreId: string;
      format: string;
      modeChrono: boolean;
      dureeChrono: number | null;
    }): string {
      const id = randomUUID();
      db.insert(miniSessions)
        .values({
          id,
          sessionId: params.sessionId,
          chapitreId: params.chapitreId,
          format: params.format,
          modeChrono: params.modeChrono,
          dureeChrono: params.dureeChrono,
          etat: "en_cours",
          nombreExercicesFaits: 0,
          debut: new Date(),
        })
        .run();
      return id;
    },

    creerExercicesEnCours(
      miniSessionId: string,
      instances: ExerciceInstanceACreer[],
    ): { exerciceId: string; exerciceEnCoursId: string; ordre: number }[] {
      const now = new Date();
      const crees = instances.map((inst) => ({
        exerciceId: inst.exerciceId,
        exerciceEnCoursId: randomUUID(),
        ordre: inst.ordre,
      }));
      db.insert(exercicesEnCours)
        .values(
          crees.map((c) => ({
            id: c.exerciceEnCoursId,
            miniSessionId,
            exerciceId: c.exerciceId,
            etat: "en_attente" as const,
            ordre: c.ordre,
            chargeA: now,
          })),
        )
        .run();
      return crees;
    },
  };
}

export type DemarrerMiniSessionRepository = ReturnType<
  typeof createDemarrerMiniSessionRepository
>;

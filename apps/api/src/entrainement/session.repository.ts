// bc-entrainement — repository cycle de vie session/mini-session/exercice
// (model-session, model-mini-session, model-exercice-en-cours)
import { and, count, eq } from "drizzle-orm";
import type { Db } from "../shared/db/client.js";
import {
  exercicesEnCours,
  miniSessions,
  sessions,
} from "../shared/db/schema.js";

export function createSessionRepository(db: Db) {
  return {
    /** Contexte d'un exercice en cours + device propriétaire (via la chaîne mini-session → session). */
    contexteExercice(exerciceEnCoursId: string) {
      return db
        .select({
          id: exercicesEnCours.id,
          exerciceId: exercicesEnCours.exerciceId,
          miniSessionId: exercicesEnCours.miniSessionId,
          etat: exercicesEnCours.etat,
          chargeA: exercicesEnCours.chargeA,
          deviceId: sessions.deviceId,
        })
        .from(exercicesEnCours)
        .innerJoin(
          miniSessions,
          eq(exercicesEnCours.miniSessionId, miniSessions.id),
        )
        .innerJoin(sessions, eq(miniSessions.sessionId, sessions.id))
        .where(eq(exercicesEnCours.id, exerciceEnCoursId))
        .get();
    },

    /** Mini-session + device propriétaire. */
    contexteMiniSession(miniSessionId: string) {
      return db
        .select({
          id: miniSessions.id,
          sessionId: miniSessions.sessionId,
          chapitreId: miniSessions.chapitreId,
          format: miniSessions.format,
          modeChrono: miniSessions.modeChrono,
          etat: miniSessions.etat,
          debut: miniSessions.debut,
          fin: miniSessions.fin,
          deviceId: sessions.deviceId,
        })
        .from(miniSessions)
        .innerJoin(sessions, eq(miniSessions.sessionId, sessions.id))
        .where(eq(miniSessions.id, miniSessionId))
        .get();
    },

    completerExercice(
      exerciceEnCoursId: string,
      donnees: {
        reponse: string | null;
        estCorrect: boolean | null;
        dureeReponseMs: number;
      },
    ) {
      db.update(exercicesEnCours)
        .set({
          etat: "complete",
          reponse: donnees.reponse,
          estCorrect: donnees.estCorrect,
          dureeReponseMs: donnees.dureeReponseMs,
        })
        .where(eq(exercicesEnCours.id, exerciceEnCoursId))
        .run();
    },

    resteExercicesEnAttente(miniSessionId: string): boolean {
      const ligne = db
        .select({ n: count() })
        .from(exercicesEnCours)
        .where(
          and(
            eq(exercicesEnCours.miniSessionId, miniSessionId),
            eq(exercicesEnCours.etat, "en_attente"),
          ),
        )
        .get();
      return (ligne?.n ?? 0) > 0;
    },

    compterExercicesFaits(miniSessionId: string): number {
      const ligne = db
        .select({ n: count() })
        .from(exercicesEnCours)
        .where(
          and(
            eq(exercicesEnCours.miniSessionId, miniSessionId),
            eq(exercicesEnCours.etat, "complete"),
          ),
        )
        .get();
      return ligne?.n ?? 0;
    },

    cloturerMiniSession(
      miniSessionId: string,
      etat: "terminee" | "interrompue",
      nombreExercicesFaits: number,
    ) {
      db.update(miniSessions)
        .set({ etat, fin: new Date(), nombreExercicesFaits })
        .where(eq(miniSessions.id, miniSessionId))
        .run();
    },

    /** Y a-t-il encore une mini-session en cours dans cette session ? */
    sessionAMiniEnCours(sessionId: string): boolean {
      const ligne = db
        .select({ n: count() })
        .from(miniSessions)
        .where(
          and(
            eq(miniSessions.sessionId, sessionId),
            eq(miniSessions.etat, "en_cours"),
          ),
        )
        .get();
      return (ligne?.n ?? 0) > 0;
    },

    cloturerSession(sessionId: string, etat: "terminee" | "interrompue") {
      db.update(sessions)
        .set({ etat, fin: new Date() })
        .where(eq(sessions.id, sessionId))
        .run();
    },
  };
}

export type SessionRepository = ReturnType<typeof createSessionRepository>;

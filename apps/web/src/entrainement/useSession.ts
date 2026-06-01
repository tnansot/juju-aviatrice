// bc-entrainement — hook d'orchestration d'une mini-session (bc-entrainement)
//
// Démarre une mini-session, expose les exercices, l'exercice courant et la
// progression. La navigation est locale (pas d'écran intermédiaire entre exercices).
import { useState } from "react";
import { trpc } from "../trpc.js";
import type { ParamsDemarrage, SessionDemarree } from "./types.js";

export function useSession() {
  const demarrer = trpc.entrainement.demarrerMiniSession.useMutation();
  const [session, setSession] = useState<SessionDemarree | null>(null);
  const [index, setIndex] = useState(0);

  function start(params: ParamsDemarrage) {
    demarrer.mutate(
      {
        chapitreId: params.chapitreId,
        format: params.format,
        modeChrono: params.modeChrono ?? false,
        dureeChrono: params.dureeChrono,
        nombre: params.nombre ?? 4,
      },
      {
        onSuccess: (data) => {
          setSession(data);
          setIndex(0);
        },
      },
    );
  }

  function avancer() {
    setIndex((i) => i + 1);
  }

  function reset() {
    setSession(null);
    setIndex(0);
  }

  const exerciceCourant = session?.exercices[index] ?? null;
  const total = session?.exercices.length ?? 0;
  const termine = session !== null && index >= total;

  return {
    start,
    avancer,
    reset,
    session,
    exerciceCourant,
    index,
    total,
    termine,
    isLoading: demarrer.isPending,
  };
}

// bc-entrainement → bc-progression — bus d'événements de domaine in-process
//
// Seam minimal de publication d'événements. bc-entrainement publie ; bc-progression
// (F8) s'abonnera pour incrémenter compteurs, faire évoluer l'avatar et débloquer
// les chapitres. En M0 (F4), il n'y a pas encore d'abonné : les événements sont émis
// sans effet, ce qui permet de tester l'émission et de brancher F8 sans refonte.

export type DomainEvent =
  | {
      type: "exercice_effectue";
      deviceId: string;
      miniSessionId: string;
      exerciceId: string;
      estCorrect: boolean | null;
    }
  | {
      type: "mini_session_terminee";
      deviceId: string;
      miniSessionId: string;
      nombreExercicesFaits: number;
    }
  | {
      type: "session_interrompue";
      deviceId: string;
      miniSessionId: string;
      exercicesFaitsComptes: number;
    };

type Listener = (event: DomainEvent) => void;

export interface EventBus {
  emit(event: DomainEvent): void;
  on(listener: Listener): () => void;
}

export function createEventBus(): EventBus {
  const listeners = new Set<Listener>();
  return {
    emit(event) {
      for (const listener of listeners) {
        listener(event);
      }
    },
    on(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

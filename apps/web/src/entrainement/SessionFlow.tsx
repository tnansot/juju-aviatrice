// bc-entrainement — orchestrateur de mini-session (spec-ecran-flashcard, spec-ecran-qcm, spec-ecran-bilan)
//
// Démarre la mini-session au montage puis enchaîne les exercices sans écran
// intermédiaire. Délègue le rendu à FlashcardScreen (FO-05), QCMScreen (FO-06)
// et BilanScreen (FO-07). Signale les interruptions (fermeture/onglet masqué)
// pour comptabiliser les exercices faits sans pénalité (REQ-SESSION-008).
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { trpc } from "../trpc.js";
import { BilanScreen } from "./BilanScreen.js";
import { FlashcardScreen } from "./FlashcardScreen.js";
import { QCMScreen } from "./QCMScreen.js";
import type { ParamsDemarrage } from "./types.js";
import { useSession } from "./useSession.js";

export function SessionFlow({
  params,
  onQuitter,
  renderFin,
}: {
  params: ParamsDemarrage;
  onQuitter: () => void;
  // Écran de fin personnalisé (ex. récap psy FO-13). À défaut, le bilan FO-07.
  renderFin?: (miniSessionId: string) => ReactNode;
}) {
  const session = useSession();
  const { start } = session;
  const signaler = trpc.entrainement.signalerInterruption.useMutation();

  // Démarrage unique au montage avec les paramètres reçus (Go ou choix activité).
  // biome-ignore lint/correctness/useExhaustiveDependencies: démarrage volontairement unique au montage
  useEffect(() => {
    start(params);
  }, []);

  // Signalement d'interruption : si Juju masque l'onglet ou ferme l'app pendant
  // une mini-session non terminée, les exercices déjà faits sont comptabilisés.
  const miniSessionId = session.session?.miniSessionId ?? null;
  const termine = session.termine;
  const interrompu = useRef(false);

  useEffect(() => {
    if (!miniSessionId || termine) return;
    function handleMasquage() {
      if (document.visibilityState === "hidden" && !interrompu.current) {
        interrompu.current = true;
        signaler.mutate({ miniSessionId: miniSessionId as string });
      }
    }
    document.addEventListener("visibilitychange", handleMasquage);
    window.addEventListener("pagehide", handleMasquage);
    return () => {
      document.removeEventListener("visibilitychange", handleMasquage);
      window.removeEventListener("pagehide", handleMasquage);
    };
  }, [miniSessionId, termine, signaler]);

  if (session.isLoading || !session.session) {
    return null;
  }

  if (session.termine) {
    if (renderFin) {
      return <>{renderFin(session.session.miniSessionId)}</>;
    }
    return (
      <BilanScreen
        miniSessionId={session.session.miniSessionId}
        onEncore={onQuitter}
        onArreter={onQuitter}
      />
    );
  }

  const exercice = session.exerciceCourant;
  if (!exercice) {
    return null;
  }

  const position = { courant: session.index + 1, total: session.total };

  if (exercice.format === "flashcard") {
    return (
      <FlashcardScreen
        key={exercice.exerciceEnCoursId}
        exercice={exercice}
        chapitreNom={params.chapitreNom}
        position={position}
        onSuivant={session.avancer}
      />
    );
  }

  return (
    <QCMScreen
      key={exercice.exerciceEnCoursId}
      exercice={exercice}
      chapitreNom={params.chapitreNom}
      position={position}
      modeChrono={session.session.modeChrono}
      dureeChrono={session.session.dureeChrono}
      onSuivant={session.avancer}
    />
  );
}

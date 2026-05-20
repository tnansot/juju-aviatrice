// bc-identite — garde d'identification device (ADR-005, spec-ecran-acces-refuse)
import { type ReactNode, useEffect, useRef, useState } from "react";
import { trpc } from "../trpc.js";
import { useDeviceId } from "./use-device-id.js";

type DeviceState =
  | { status: "loading" }
  | { status: "authorized" }
  | { status: "denied" };

export function DeviceGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const deviceId = useDeviceId();
  const [state, setState] = useState<DeviceState>({ status: "loading" });
  const registering = useRef(false);

  const verifier = trpc.identite.verifierDevice.useQuery(
    { deviceId },
    { retry: false, enabled: state.status === "loading" },
  );

  const { mutate: doEnregistrer } =
    trpc.identite.enregistrerDevice.useMutation();

  useEffect(() => {
    if (verifier.data?.valide) {
      setState({ status: "authorized" });
      cleanInviteFromUrl();
      return;
    }

    if (verifier.data && !verifier.data.valide) {
      const invite = getInviteToken();
      if (invite && !registering.current) {
        registering.current = true;
        doEnregistrer(
          { deviceId, jetonInvitation: invite },
          {
            onSuccess: () => {
              setState({ status: "authorized" });
              cleanInviteFromUrl();
            },
            onError: () => {
              registering.current = false;
              setState({ status: "denied" });
              cleanInviteFromUrl();
            },
          },
        );
      } else if (!invite) {
        setState({ status: "denied" });
      }
    }

    if (verifier.error) {
      setState({ status: "denied" });
    }
  }, [verifier.data, verifier.error, deviceId, doEnregistrer]);

  if (state.status === "loading") {
    return null;
  }

  if (state.status === "denied") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

function getInviteToken(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("invite");
}

function cleanInviteFromUrl() {
  const url = new URL(window.location.href);
  if (url.searchParams.has("invite")) {
    url.searchParams.delete("invite");
    window.history.replaceState(null, "", url.pathname + url.search);
  }
}

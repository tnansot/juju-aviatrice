// bc-identite — point d'entrée app avec garde device
import { AccessRefused } from "./identite/AccessRefused.js";
import { DeviceGuard } from "./identite/DeviceGuard.js";

export function App() {
  return (
    <DeviceGuard fallback={<AccessRefused />}>
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1>Juju l'aviatrice</h1>
        <p>Bienvenue ! L'application est en construction.</p>
      </div>
    </DeviceGuard>
  );
}

import { trpc } from "./trpc.js";

export function App() {
  const hello = trpc.hello.useQuery();

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Juju l'aviatrice</h1>
      <p>{hello.data?.message ?? "Chargement…"}</p>
    </div>
  );
}

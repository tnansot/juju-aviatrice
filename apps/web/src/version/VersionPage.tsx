import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  version: { gitSha: string; buildDate: string };
  db: { lastMigration: string };
}

const apiUrl = import.meta.env.VITE_API_URL ?? "";

export function VersionPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch((e: Error) => setError(e.message));
  }, []);

  const frontGitSha = (import.meta.env.VITE_GIT_SHA ?? "dev").substring(0, 7);
  const frontBuildDate = import.meta.env.VITE_BUILD_DATE ?? "unknown";

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        Diagnostic de version
      </h1>

      <Section title="Frontend">
        <Row label="Git SHA" value={frontGitSha} />
        <Row label="Build" value={frontBuildDate} />
      </Section>

      <Section title="API">
        {error ? (
          <p style={{ color: "#c53030" }}>Indisponible : {error}</p>
        ) : health ? (
          <>
            <Row label="Status" value={health.status} />
            <Row label="Git SHA" value={health.version.gitSha} />
            <Row label="Build" value={health.version.buildDate} />
          </>
        ) : (
          <p>Chargement…</p>
        )}
      </Section>

      <Section title="Base de données">
        {error ? (
          <p style={{ color: "#c53030" }}>Indisponible</p>
        ) : health ? (
          <Row label="Dernière migration" value={health.db.lastMigration} />
        ) : (
          <p>Chargement…</p>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2
        style={{
          fontSize: "1rem",
          borderBottom: "1px solid #ccc",
          paddingBottom: "0.25rem",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.25rem 0",
      }}
    >
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

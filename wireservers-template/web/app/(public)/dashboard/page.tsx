import { getMe } from "@/lib/api";

export default async function DashboardPage() {
  const result = await getSafeMe();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Authenticated Workspace</p>
          <h1 style={styles.title}>Dashboard</h1>
        </div>
      </header>

      <section style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.label}>API endpoint</p>
          <p style={styles.value}>{process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ws-security.azurewebsites.net"}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>Purpose</p>
          <p style={styles.value}>{process.env.NEXT_PUBLIC_PURPOSE_OF_USE ?? "operations"}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>User mirror</p>
          <p style={styles.value}>{result.ok ? "Loaded" : "Unavailable"}</p>
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>Current Access</h2>
        {result.ok ? (
          <div style={styles.detailsGrid}>
            <Detail label="Name" value={result.me.displayName} />
            <Detail label="Email" value={result.me.email} />
            <Detail label="Department" value={result.me.department} />
            <Detail label="Clearance" value={result.me.clearanceLevel} />
            <Detail label="Region" value={result.me.region} />
            <Detail label="Roles" value={result.me.roles.map((role) => role.name).join(", ") || "None"} />
          </div>
        ) : (
          <p style={styles.error}>{result.error}</p>
        )}
      </section>
    </div>
  );
}

async function getSafeMe() {
  try {
    return { ok: true as const, me: await getMe() };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Unable to load /api/me." };
  }
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value || "Not set"}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    margin: "0 0 6px",
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: 32,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  card: {
    border: "1px solid var(--card-border)",
    borderRadius: 8,
    background: "var(--card-bg)",
    padding: 16,
  },
  label: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 700,
  },
  value: {
    margin: "8px 0 0",
    color: "var(--text-primary)",
    fontSize: 17,
    fontWeight: 800,
    overflowWrap: "anywhere",
  },
  panel: {
    marginTop: 18,
    border: "1px solid var(--card-border)",
    borderRadius: 8,
    background: "var(--card-bg)",
    padding: 18,
  },
  panelTitle: {
    margin: "0 0 16px",
    fontSize: 20,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  detailLabel: {
    margin: "0 0 6px",
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 700,
  },
  detailValue: {
    margin: 0,
    color: "var(--text-primary)",
    fontWeight: 700,
    overflowWrap: "anywhere",
  },
  error: {
    margin: 0,
    color: "#ef4444",
    overflowWrap: "anywhere",
  },
};

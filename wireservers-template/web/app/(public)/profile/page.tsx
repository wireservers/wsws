import { readMsalSession } from "@/lib/msalAuth";
import { getMe } from "@/lib/api";

export default async function ProfilePage() {
  const session = await readMsalSession();
  const result = await getSafeMe();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Account</p>
        <h1 style={styles.title}>Profile</h1>
      </header>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>Entra Session</h2>
        <div style={styles.detailsGrid}>
          <Detail label="Name" value={session?.account.name ?? "Not available"} />
          <Detail label="Username" value={session?.account.username ?? "Not available"} />
          <Detail label="Local account" value={session?.account.localAccountId ?? "Not available"} />
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>ws-security User</h2>
        {result.ok ? (
          <div style={styles.detailsGrid}>
            <Detail label="Display name" value={result.me.displayName} />
            <Detail label="Email" value={result.me.email} />
            <Detail label="Department" value={result.me.department} />
            <Detail label="Permissions" value={`${result.me.permissions.length}`} />
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
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 18 },
  eyebrow: { margin: "0 0 6px", color: "var(--text-muted)", fontSize: 13, fontWeight: 800, textTransform: "uppercase" },
  title: { margin: 0, fontSize: 32 },
  panel: { marginBottom: 16, border: "1px solid var(--card-border)", borderRadius: 8, background: "var(--card-bg)", padding: 18 },
  panelTitle: { margin: "0 0 16px", fontSize: 20 },
  detailsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  detailLabel: { margin: "0 0 6px", color: "var(--text-muted)", fontSize: 13, fontWeight: 700 },
  detailValue: { margin: 0, color: "var(--text-primary)", fontWeight: 700, overflowWrap: "anywhere" },
  error: { margin: 0, color: "#ef4444", overflowWrap: "anywhere" },
};

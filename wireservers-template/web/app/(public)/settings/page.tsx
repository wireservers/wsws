export default function SettingsPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Configuration</p>
        <h1 style={styles.title}>Security Settings</h1>
      </header>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>Azure ws-security</h2>
        <div style={styles.rows}>
          <ConfigRow label="API base URL" value={process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ws-security.azurewebsites.net"} />
          <ConfigRow label="API scope" value={process.env.NEXT_PUBLIC_API_SCOPE ?? "Not configured"} />
          <ConfigRow label="Issuer" value={process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER ?? "Not configured"} />
          <ConfigRow label="Purpose of use" value={process.env.NEXT_PUBLIC_PURPOSE_OF_USE ?? "operations"} />
        </div>
      </section>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{value}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 18 },
  eyebrow: { margin: "0 0 6px", color: "var(--text-muted)", fontSize: 13, fontWeight: 800, textTransform: "uppercase" },
  title: { margin: 0, fontSize: 32 },
  panel: { border: "1px solid var(--card-border)", borderRadius: 8, background: "var(--card-bg)", padding: 18 },
  panelTitle: { margin: "0 0 16px", fontSize: 20 },
  rows: { display: "grid", gap: 10 },
  row: { display: "grid", gridTemplateColumns: "minmax(140px, 220px) 1fr", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--card-border)" },
  rowLabel: { color: "var(--text-muted)", fontWeight: 700 },
  rowValue: { color: "var(--text-primary)", fontWeight: 700, overflowWrap: "anywhere" },
};

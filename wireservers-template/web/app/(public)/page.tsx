import Link from "next/link";

const stats = [
  { label: "Auth", value: "MSAL BFF" },
  { label: "API", value: "Azure wireservers-security" },
  { label: "Shell", value: "Next 15" },
];

export default function HomePage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.welcomeText}>Welcome to</p>
          <h1 style={styles.appName}>Wireservers Template</h1>
        </div>
      </header>

      <section style={styles.heroBanner}>
        <div>
          <h2 style={styles.heroTitle}>Start from the Wireservers shell</h2>
          <p style={styles.heroSubtitle}>A BringThe-style app frame with secure delegated calls to wireservers-security.</p>
        </div>
        <Link href="/dashboard" style={styles.heroButton}>Open Dashboard</Link>
      </section>

      <section style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Shell Sections</h3>
          <Link href="/settings" style={styles.seeAllLink}>Security Settings</Link>
        </div>
        <div style={styles.cardGrid}>
          {[
            ["Dashboard", "Authenticated landing page with a server-side /api/me call.", "/dashboard"],
            ["Profile", "Current Entra account and wireservers-security mirrored user details.", "/profile"],
            ["Security", "Endpoint, scope, and purpose-of-use configuration surface.", "/settings"],
          ].map(([title, body, href]) => (
            <Link key={title} href={href} style={styles.shellCard}>
              <span style={styles.shellIcon} />
              <h4 style={styles.cardTitle}>{title}</h4>
              <p style={styles.cardBody}>{body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    margin: "0 0 4px",
    color: "var(--text-muted)",
    fontSize: 14,
    fontWeight: 600,
  },
  appName: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.1,
  },
  heroBanner: {
    minHeight: 240,
    borderRadius: 8,
    padding: 28,
    background: "linear-gradient(135deg, #111827 0%, #064e3b 55%, #0f766e 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 32,
  },
  heroTitle: {
    margin: 0,
    maxWidth: 620,
    fontSize: 36,
    lineHeight: 1.08,
  },
  heroSubtitle: {
    margin: "12px 0 0",
    maxWidth: 560,
    color: "#d1fae5",
    fontSize: 16,
    lineHeight: 1.5,
  },
  heroButton: {
    alignSelf: "flex-start",
    padding: "10px 18px",
    borderRadius: 8,
    background: "#10b981",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    border: "1px solid var(--card-border)",
    borderRadius: 8,
    background: "var(--card-bg)",
    padding: 16,
  },
  statLabel: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 700,
  },
  statValue: {
    margin: "8px 0 0",
    color: "var(--text-primary)",
    fontSize: 20,
    fontWeight: 800,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 22,
  },
  seeAllLink: {
    color: "var(--accent)",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: 14,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  shellCard: {
    display: "block",
    minHeight: 160,
    border: "1px solid var(--card-border)",
    borderRadius: 8,
    background: "var(--card-bg)",
    padding: 18,
    textDecoration: "none",
  },
  shellIcon: {
    display: "block",
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#10b981",
  },
  cardTitle: {
    margin: "16px 0 8px",
    color: "var(--text-primary)",
    fontSize: 17,
  },
  cardBody: {
    margin: 0,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
};

export function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <p style={styles.brand}>Wireservers Template</p>
        <p style={styles.copy}>Shell app connected to the Azure ws-security API.</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid var(--card-border)",
    padding: "28px 16px 96px",
    color: "var(--text-muted)",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  brand: {
    margin: 0,
    color: "var(--text-primary)",
    fontWeight: 700,
  },
  copy: {
    margin: 0,
    fontSize: 14,
  },
};

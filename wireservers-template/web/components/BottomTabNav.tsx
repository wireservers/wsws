"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS: Array<{ label: string; href: string; icon: (active: boolean) => React.ReactNode }> = [
  {
    label: "Home",
    href: "/",
    icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    label: "Dash",
    href: "/dashboard",
    icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>,
  },
  {
    label: "Security",
    href: "/settings",
    icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
];

export function BottomTabNav() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .bottom-tab-nav { display: none; }
        @media (max-width: 768px) {
          .bottom-tab-nav { display: block !important; }
        }
      `}</style>
      <nav className="bottom-tab-nav" style={styles.nav}>
        <div style={styles.inner}>
          {TABS.map((tab) => {
            const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} style={{ ...styles.tab, color: active ? "#10b981" : "#9ca3af" }}>
                {tab.icon(active)}
                <span style={styles.tabLabel}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "var(--bottom-nav-bg)",
    borderTop: "1px solid var(--bottom-nav-border)",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "8px 0 12px",
  },
  tab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    textDecoration: "none",
    fontSize: 10,
    fontWeight: 600,
    minWidth: 48,
  },
  tabLabel: {
    textAlign: "center",
    lineHeight: 1.2,
  },
};

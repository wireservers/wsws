"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/useSession";
import { ThemeToggle } from "@/components/ThemeToggle";

const TABS: Array<{ label: string; href: string; icon: React.ReactNode }> = [
  {
    label: "Home",
    href: "/",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>,
  },
  {
    label: "Security",
    href: "/settings",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
];

export function TabNav() {
  const pathname = usePathname();
  const { authenticated, user, login, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav ref={menuRef} style={styles.nav}>
      <style>{`
        .tn-tabs { display: flex; gap: 2px; align-items: center; }
        .tn-burger { display: none; }
        .tn-mobile-menu { display: none; }
        .tn-auth-desktop { display: flex; }
        .tn-auth-mobile { display: none; }
        @media (max-width: 768px) {
          .tn-tabs { display: none; }
          .tn-burger { display: flex; }
          .tn-auth-desktop { display: none; }
          .tn-mobile-menu {
            display: ${menuOpen ? "flex" : "none"};
            flex-direction: column;
            padding: 8px 16px 16px;
            gap: 2px;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          .tn-auth-mobile {
            display: ${menuOpen ? "flex" : "none"};
            padding: 8px 16px 16px;
            gap: 8px;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
        }
      `}</style>
      <div style={styles.topBar}>
        <button type="button" className="tn-burger" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" style={styles.burgerBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandAccent}>Wireservers</span>Template
        </Link>
        <div className="tn-tabs">
          {TABS.map((tab) => {
            const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}>
                <span style={{ display: "flex", color: active ? "var(--accent)" : "inherit" }}>{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div className="tn-auth-desktop" style={styles.authRow}>
          <ThemeToggle />
          {authenticated && user ? (
            <>
              <Link href="/profile" style={styles.profileBtn}>{user.name ?? user.username ?? "Profile"}</Link>
              <button type="button" onClick={logout} style={styles.signOutBtn}>Sign Out</button>
            </>
          ) : (
            <button type="button" onClick={login} style={styles.signInBtn}>Sign In</button>
          )}
        </div>
      </div>
      <div className="tn-mobile-menu">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href} onClick={() => setMenuOpen(false)} style={{ ...styles.mobileTab, ...(active ? styles.mobileTabActive : {}) }}>
              <span style={{ display: "flex", color: active ? "var(--accent)" : "inherit" }}>{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="tn-auth-mobile">
        {authenticated && user ? (
          <>
            <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ ...styles.signInBtn, flex: 1, textAlign: "center", textDecoration: "none" }}>{user.name ?? "Profile"}</Link>
            <button type="button" onClick={logout} style={{ ...styles.signOutBtn, flex: 1 }}>Sign Out</button>
          </>
        ) : (
          <button type="button" onClick={login} style={{ ...styles.signInBtn, flex: 1 }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "var(--nav-bg)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--nav-border)",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    height: 56,
    gap: 16,
  },
  burgerBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
    color: "white",
    textDecoration: "none",
    letterSpacing: 0,
    whiteSpace: "nowrap",
  },
  brandAccent: {
    color: "var(--accent)",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 8,
    color: "#9ca3af",
    fontWeight: 500,
    fontSize: 13,
  },
  tabActive: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  authRow: {
    marginLeft: "auto",
    alignItems: "center",
    gap: 8,
  },
  signInBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    background: "var(--btn-primary-bg)",
    color: "var(--btn-primary-text)",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  signOutBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #374151",
    background: "transparent",
    color: "white",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  profileBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontWeight: 600,
    fontSize: 13,
    textDecoration: "none",
    maxWidth: 180,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  mobileTab: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 8,
    color: "#9ca3af",
    fontWeight: 600,
    fontSize: 14,
  },
  mobileTabActive: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
};

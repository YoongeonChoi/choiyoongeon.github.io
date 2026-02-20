"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import { navItems, siteConfig } from "@/site/config";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function MobileNavPanel({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const isClient = useIsClient();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isClient) return null;

  return createPortal(
    <nav className="mobile-nav-overlay" aria-label="주요 메뉴">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          className={
            isActive(pathname, item.href) ? "nav-link active" : "nav-link"
          }
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
    </nav>,
    document.body
  );
}

function HeaderControls({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      >
        <span className={`hamburger-icon ${open ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav className="desktop-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={
              isActive(pathname, item.href) ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {open && (
        <MobileNavPanel pathname={pathname} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="brand-mark" prefetch={false}>
          <span className="brand-initial">{siteConfig.shortName}</span>
          <span className="brand-text">Yoongeon&apos;s Portfolio</span>
        </Link>

        <HeaderControls key={pathname} pathname={pathname} />
      </div>
    </header>
  );
}

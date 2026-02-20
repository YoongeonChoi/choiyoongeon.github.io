"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, siteConfig } from "@/site/config";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      >
        <span className={`hamburger-icon ${open ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id="main-nav"
        className={`main-nav ${open ? "open" : ""}`}
        aria-label="주요 메뉴"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={isActive(pathname, item.href) ? "nav-link active" : "nav-link"}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
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

        <MobileNav key={pathname} pathname={pathname} />
      </div>
    </header>
  );
}

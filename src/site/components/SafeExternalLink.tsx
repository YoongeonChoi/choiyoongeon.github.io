import type { ComponentPropsWithoutRef } from "react";

const ALLOWED_PROTOCOLS = new Set(["https:", "mailto:", "tel:"]);

function isSafeHref(href: string) {
  try {
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return true;
    }
    const parsed = new URL(href);
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

interface SafeExternalLinkProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
}

export function SafeExternalLink({ href, children, rel, ...props }: SafeExternalLinkProps) {
  if (!isSafeHref(href)) {
    return <span className="text-text-muted">{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={rel ?? "noopener noreferrer"}
      {...props}
    >
      {children}
    </a>
  );
}

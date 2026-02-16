const directives = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "connect-src": ["'self'"],
  "object-src": ["'none'"],
  "upgrade-insecure-requests": [],
} as const;

export const contentSecurityPolicy = Object.entries(directives)
  .map(([key, value]) => `${key} ${value.join(" ")}`.trim())
  .join("; ");

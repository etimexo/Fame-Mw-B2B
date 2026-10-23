import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let cachedSql: NeonQueryFunction<false, false> | null = null;
let lastUrl: string | undefined = undefined;

/**
 * Returns a Neon serverless query function connected to DATABASE_URL.
 * If DATABASE_URL is not set or contains placeholder text, returns null
 * to allow static builds and preview environments to render safely.
 */
export function getSql(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("your-password") || (!url.startsWith("postgres://") && !url.startsWith("postgresql://"))) {
    return null;
  }

  if (cachedSql && lastUrl === url) {
    return cachedSql;
  }

  lastUrl = url;
  cachedSql = neon(url);
  return cachedSql;
}

export function isDbConfigured(): boolean {
  return getSql() !== null;
}

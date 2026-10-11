import { betterAuth } from "better-auth";
import { memoryAdapter } from "@better-auth/memory-adapter";

// Auth server configuration

function initializeDatabase() {
  try {
    // Try using sqlite if available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    const dbPath =
      process.env.DATABASE_URL?.replace(/^file:/, "") ||
      (process.env.VERCEL || process.env.NODE_ENV === "production"
        ? "/tmp/auth.db"
        : "auth.db");

    let sqliteDb;
    try {
      sqliteDb = new DatabaseSync(dbPath);
    } catch {
      sqliteDb = new DatabaseSync(":memory:");
    }

    // Create auth tables if they don't exist yet
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        expiresAt INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId TEXT NOT NULL REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL REFERENCES user(id),
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt INTEGER,
        refreshTokenExpiresAt INTEGER,
        scope TEXT,
        password TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        createdAt INTEGER,
        updatedAt INTEGER
      );
    `);

    return sqliteDb;
  } catch {
    // Fallback to in-memory storage if sqlite is not available
    const inMemoryStore: Record<string, unknown[]> = {
      user: [],
      session: [],
      account: [],
      verification: [],
      rateLimit: [],
      jwks: [],
    };
    return memoryAdapter(inMemoryStore);
  }
}

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "production")
    return "https://a7-bazar-do.vercel.app";
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: initializeDatabase(),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar_dor_default_development_auth_secret_key_32_chars_min",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://a7-bazar-do.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days signed cookie cache
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "placeholder-github-client-id",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "placeholder-github-client-secret",
    },
  },
});

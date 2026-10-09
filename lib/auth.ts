import { betterAuth } from "better-auth";
// @ts-expect-error - node:sqlite is built-in in Node 22+
import { DatabaseSync } from "node:sqlite";

// ============================================================================
// Better Auth Server Configuration with Persistent SQLite Storage
// Uses Node.js built-in DatabaseSync for robust, zero-dependency SQLite persistence.
// ============================================================================

// Initialize persistent SQLite database file (defaults to auth.db)
const dbPath = process.env.DATABASE_URL?.replace(/^file:/, "") || "auth.db";
const sqliteDb = new DatabaseSync(dbPath);

// Ensure required Better Auth database schema exists
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

export const auth = betterAuth({
  database: sqliteDb,
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar_dor_default_development_auth_secret_key_32_chars_min",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
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

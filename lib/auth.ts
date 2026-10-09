import { betterAuth } from "better-auth";

// ============================================================================
// Better Auth Server Configuration
// Configures Email/Password authentication and Google & GitHub social providers
// utilizing environment variables for credentials and secrets.
// ============================================================================

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar_dor_default_development_auth_secret_key_32_chars_min",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ),
    },
  },
});

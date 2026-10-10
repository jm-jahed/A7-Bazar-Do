import { createAuthClient } from "better-auth/react";

// ============================================================================
// Better Auth React Client
// Exports hooks and methods for client-side authentication:
// signIn, signUp, useSession, signOut, updateUser.
// Automatically resolves origin in browser to work seamlessly on local & Vercel.
// ============================================================================

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
});

export const { signIn, signUp, useSession, signOut, updateUser } = authClient;

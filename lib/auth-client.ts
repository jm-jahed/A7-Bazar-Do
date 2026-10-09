import { createAuthClient } from "better-auth/react";

// ============================================================================
// Better Auth React Client
// Exports hooks and methods for client-side authentication:
// signIn, signUp, useSession, signOut.
// ============================================================================

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession, signOut } = authClient;

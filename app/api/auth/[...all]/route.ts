import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// ============================================================================
// Better Auth Next.js App Router API Route Handler
// Handles all auth requests: /api/auth/sign-in, /api/auth/sign-up, /api/auth/callback, etc.
// ============================================================================

export const { GET, POST } = toNextJsHandler(auth);

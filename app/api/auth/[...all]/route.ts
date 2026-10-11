import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Auth API route handler

export const { GET, POST } = toNextJsHandler(auth);

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Mismo patron que v-secrets: NextAuth v5 con Credentials contra la API,
 * mas un provider "magic-link" para el flujo sin password.
 * El hashing (Argon2id) y el rate limiting viven en el backend, no aqui.
 */
const CORE = process.env.NEXT_PUBLIC_CORE_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      id: "password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const res = await fetch(`${CORE}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(creds),
        });
        if (!res.ok) return null;
        return res.json();
      },
    }),
    Credentials({
      id: "magic-link",
      credentials: { token: {} },
      async authorize(creds) {
        const res = await fetch(`${CORE}/api/v1/auth/magic-link/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(creds),
        });
        if (!res.ok) return null;
        return res.json();
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.plan = (user as { plan?: string }).plan;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.plan = token.plan as string | undefined;
      return session;
    },
  },
});

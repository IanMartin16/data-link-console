import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware minimo, mismo criterio que v-secrets:
 * NO hace auth gating en el edge. La proteccion de rutas es client-side
 * via AppShell. Aqui solo redirecciones baratas.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/app") {
    return NextResponse.redirect(new URL("/app/new", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};

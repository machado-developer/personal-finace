import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware"; // 👈 Importa o tipo correto

const customMiddleware = withAuth(
  async function middleware(req: NextRequestWithAuth) {
    // Pode adicionar lógica extra, por exemplo, checar role: if (req.nextauth.token?.role !== 'admin') ...
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

// Exporta a função final, com try/catch e tipos certos
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    // Força o tipo do req para NextRequestWithAuth
    return await customMiddleware(req as NextRequestWithAuth, event);
  } catch (error) {
    console.error("Erro no middleware auth:", error);

    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("next-auth.session-token");
    res.cookies.delete("next-auth.callback-url");
    res.cookies.delete("__Secure-next-auth.session-token"); // produção

    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

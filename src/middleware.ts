import { decode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const tokenNext =
    request.cookies.get('__Secure-next-auth.session-token')?.value ??
    request.cookies.get('next-auth.session-token')?.value;

  const pathname = request.nextUrl.pathname;
  const requiresAuth = pathname.includes('/dashboard');
  const isAuthPage = ['/signin', '/sign-up'].includes(pathname);
  if (requiresAuth && !tokenNext) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  // Se estiver autenticado e tentar acessar signin ou sign-up, redireciona para dashboard
  if (tokenNext && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se houver token, tenta decodificar
  if (tokenNext && requiresAuth) {
    try {
      const decodedToken = await decode({
        token: tokenNext,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      if (!decodedToken || Object.keys(decodedToken).length === 0) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
  if (pathname == "/") {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

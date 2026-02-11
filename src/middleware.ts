import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Устанавливаем заголовки с информацией о текущем URL
	response.headers.set('x-pathname', request.nextUrl.pathname);
	response.headers.set('x-search-params', request.nextUrl.search);
	response.headers.set('x-full-url', request.url);

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};

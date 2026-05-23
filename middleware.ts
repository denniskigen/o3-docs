export { proxy as middleware } from 'nextra/locales'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_pagefind|.*\\.[^/]+$).*)',
  ],
}

export const makeLoginRedirectURL = (redirect: string, reason: string): URL => {
    const url = new URL('/login', window.location.origin)
    url.searchParams.set('redirect', encodeURIComponent(redirect))
    url.searchParams.set('reason', reason)

    return url
}

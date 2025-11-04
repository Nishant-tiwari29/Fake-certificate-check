export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Dashboard: '/dashboard',
    MyCertificates: '/my-certificates',
    Verify: '/verify',
    IssueCertificate: '/issue',
    Login: '/login'
  }
  return routes[pageName] || '/'
}
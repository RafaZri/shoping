module.exports = {
  experimental: {
    reactStrictMode: true,

    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium'
    ],
    serverActions: true
  }
}
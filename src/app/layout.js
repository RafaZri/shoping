import { Inter } from 'next/font/google'
import '../../styles/global.css'
import { SearchProvider } from '../contexts/SearchContext'
import { LanguageProvider } from '../contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'PriceCompare - Find the Best Deals Across Multiple Retailers',
    template: '%s | PriceCompare'
  },
  description: 'Compare prices across multiple retailers to find the best deals. Get product recommendations and save money on your purchases.',
  keywords: [
    'price comparison',
    'online deals',
    'retailer deals',
    'best prices',
    'online shopping',
    'product comparison',
    'discount finder',
    'deal hunter',
    'shopping comparison',
    'price tracker'
  ],
  authors: [{ name: 'PriceCompare Team' }],
  creator: 'PriceCompare',
  publisher: 'PriceCompare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'PriceCompare - Find the Best Deals Across Multiple Retailers',
    description: 'Compare prices across multiple retailers to find the best deals. Get product recommendations and save money on your purchases.',
    siteName: 'PriceCompare',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PriceCompare - Best Deals Across Multiple Retailers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PriceCompare - Find the Best Deals Across Multiple Retailers',
    description: 'Compare prices across multiple retailers to find the best deals. Get product recommendations and save money on your purchases.',
    images: ['/og-image.jpg'],
    creator: '@pricecompare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PriceCompare",
              "url": "https://yourdomain.com",
              "description": "Compare prices across multiple retailers to find the best deals",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://yourdomain.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/pricecompare",
                "https://facebook.com/pricecompare",
                "https://instagram.com/pricecompare"
              ]
            })
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PriceCompare",
              "url": "https://yourdomain.com",
              "logo": "https://yourdomain.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "hello@yourdomain.com"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
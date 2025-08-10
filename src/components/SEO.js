'use client';

import Head from 'next/head';

export default function SEO({ 
  title, 
  description, 
  keywords = [], 
  image = '/og-image.jpg',
  url,
  type = 'website'
}) {
  const siteName = 'PriceCompare';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullUrl = url ? `https://yourdomain.com${url}` : 'https://yourdomain.com';
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`https://yourdomain.com${image}`} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://yourdomain.com${image}`} />
      <meta name="twitter:creator" content="@pricecompare" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="PriceCompare Team" />
      
      {/* Structured Data for Product Pages */}
      {type === 'product' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": title,
              "description": description,
              "url": fullUrl,
              "brand": {
                "@type": "Brand",
                "name": "Various"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      )}
    </Head>
  );
} 
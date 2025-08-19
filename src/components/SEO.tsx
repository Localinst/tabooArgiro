import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/og-image.jpg', 
  article = false 
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const baseUrl = 'https://paroletaboo.it';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  // Determina l'URL canonico e l'URL alternativo per l'altra lingua
  const canonicalUrl = currentUrl;
  const alternateUrl = language === 'it' 
    ? `${baseUrl}/en${location.pathname}` 
    : currentUrl.replace(/^(https:\/\/[^\/]+)\/en/, '$1');

  return (
    <Helmet>
      {/* Impostazioni di base */}
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical e Alternate hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link 
        rel="alternate" 
        href={alternateUrl}
        hreflang={language === 'it' ? 'en' : 'it'}
      />
      <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:site_name" content="Parole Taboo" />
      <meta property="og:locale" content={language === 'it' ? 'it_IT' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'it' ? 'en_US' : 'it_IT'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Parole Taboo",
          "url": baseUrl,
          "description": description,
          "applicationCategory": "Game",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "inLanguage": [
            {
              "@type": "Language",
              "name": "Italian",
              "alternateName": "it"
            },
            {
              "@type": "Language",
              "name": "English",
              "alternateName": "en"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;

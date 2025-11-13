import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/context/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  path = '',
  image = '/og-image.jpg'
}) => {
  const { language } = useLanguage();
  const baseUrl = 'https://paroletaboo.it';
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isEnglish = language === 'en';
  
  const canonicalUrl = `${baseUrl}${isEnglish ? '/en' : ''}${currentPath}`;
  const alternateUrls = {
    it: `${baseUrl}${currentPath.replace('/en','')}`,
    en: `${baseUrl}/en${currentPath.replace('/en','')}`
  };
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const schemaOrgWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': isEnglish ? 'Word Taboo' : 'Parole Taboo',
    'url': baseUrl,
    'description': description,
    'applicationCategory': 'Game',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'EUR'
    },
    'inLanguage': [
      {
        '@type': 'Language',
        'name': 'Italian',
        'alternateName': 'it'
      },
      {
        '@type': 'Language',
        'name': 'English',
        'alternateName': 'en'
      }
    ],
    'screenshot': imageUrl,
    'image': imageUrl
  };

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="it" href={alternateUrls.it} />
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.it} />
      
      {/* Altri meta tag */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="sitemap" type="application/xml" href={`${baseUrl}/sitemap.xml`} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={isEnglish ? 'en_US' : 'it_IT'} />
      <meta property="og:locale:alternate" content={isEnglish ? 'it_IT' : 'en_US'} />
      <meta property="og:site_name" content={isEnglish ? 'Word Taboo' : 'Parole Taboo'} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebApp)}
      </script>
    </Helmet>
  );
};

export default SEO;

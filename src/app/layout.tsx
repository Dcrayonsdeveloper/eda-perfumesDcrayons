import './styles/globals.css';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FacebookPixel from '../../components/FacebookPixel';
import Script from 'next/script';
import AnnouncementBar from '../../components/anouncement';
import { Suspense } from 'react';
import Whatsapp from '../../components/Whatsapp';
import CartDrawer from '../../components/CartDrawer';

export const metadata = {
  title: 'EDA Perfumes - Where Desire Meets Sophisticated Fragrance',
  description: 'Dare to indulge in the forbidden. EDA Perfumes crafts seductive fragrances for the bold, the daring, and those who aren\'t afraid to make a statement. Our collection embodies the perfect balance of sophistication and temptation.',
  keywords: 'luxury perfumes, seductive fragrances, EDP, unisex perfumes, long lasting perfumes, premium fragrances, after dark collection, signature scents, luxury perfumes India',
  openGraph: {
    title: 'EDA Perfumes - Where Desire Meets Sophisticated Fragrance',
    description: 'Crafting seductive fragrances for those who dare to make a statement. Premium EDP collection for the bold and sophisticated.',
    url: 'https://edaperfumes.com',
    siteName: 'EDA Perfumes',
    images: [
      {
        url: '/eda-perfumes-logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'EDA Perfumes - Seductive Luxury Fragrances',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDA Perfumes - Where Desire Meets Sophisticated Fragrance',
    description: 'Crafting seductive fragrances for those who dare to make a statement.',
    images: ['/eda-perfumes-logo.jpeg'],
    creator: '@edaperfumes',
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
  },
  alternates: {
    canonical: 'https://edaperfumes.com',
  },
  category: 'luxury perfumes',
  classification: 'Beauty & Personal Care',
  authors: [{ name: 'EDA Perfumes Team' }],
  creator: 'EDA Perfumes',
  publisher: 'EDA Perfumes',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = '2061667547953165';
  const gtagId = 'AW-17713098050';

  return (
    <html lang="en">
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f43f5e" />
        <meta name="msapplication-TileColor" content="#f43f5e" />
        
        {/* Preload Critical Assets */}
        <link rel="preload" href="/eda-perfumes-logo.jpeg" as="image" type="image/jpeg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="Worldwide" />
        
        {/* Structured Data for Luxury Brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "EDA Perfumes",
              "description": "Luxury perfume brand crafting seductive fragrances for the bold and sophisticated",
              "url": "https://edaperfumes.com",
              "logo": "https://edaperfumes.com/eda-perfumes-logo.jpeg",
              "foundingDate": "2023",
              "founders": [
                {
                  "@type": "Person",
                  "name": "EDA Perfumes Founder"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "D5/204, Chintpurni House, Central Market",
                "addressLocality": "Prashant Vihar",
                "addressRegion": "New Delhi",
                "postalCode": "110085",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-92116-19009",
                "contactType": "customer service",
                "email": "care@edaperfumes.com"
              },
              "sameAs": [
                "https://www.facebook.com/edaperfumes",
                "https://www.instagram.com/edaperfumes",
                "https://www.youtube.com/@edaperfumes"
              ],
              "brand": {
                "@type": "Brand",
                "name": "EDA Perfumes"
              },
              "makesOffer": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Luxury Perfumes",
                  "category": "Beauty & Personal Care",
                  "brand": "EDA Perfumes"
                }
              }
            })
          }}
        />

        {/* Facebook Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
            
            // Track luxury brand specific events
            fbq('trackCustom', 'ViewLuxuryBrand', {
              brand: 'EDA Perfumes',
              category: 'Luxury Perfumes'
            });
          `}
        </Script>

        {/* Google Analytics */}
        <Script 
          src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}', {
              page_title: 'EDA Perfumes',
              page_location: window.location.href,
              content_group1: 'Luxury Perfumes',
              content_group2: 'Beauty & Personal Care',
              custom_map: {
                'dimension1': 'luxury_brand',
                'dimension2': 'perfume_category'
              }
            });
            
            // Enhanced ecommerce tracking
            gtag('config', '${gtagId}', {
              'custom_map': {'custom_parameter': 'dimension1'},
              'enhanced_ecommerce': true
            });
          `}
        </Script>

        {/* Google Tag Manager (Optional) */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>

        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body className="overflow-x-hidden overflow-y-scroll antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <ReactQueryProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main role="main">
              {children}
            </main>
            <Footer />
            <Whatsapp/>
            <CartDrawer />

            {/* Facebook Pixel Route Tracking */}
            <Suspense fallback={null}>
              <FacebookPixel pixelId={1648859765778662} />
            </Suspense>
          </CartProvider>
        </ReactQueryProvider>

        {/* Customer Chat Plugin (Optional) */}
        <Script id="facebook-chat" strategy="lazyOnload">
          {`
            var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "YOUR_PAGE_ID");
            chatbox.setAttribute("attribution", "biz_inbox");
            
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v18.0'
              });
            };
            
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
        
        {/* Facebook Customer Chat */}
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </body>
    </html>
  );
}

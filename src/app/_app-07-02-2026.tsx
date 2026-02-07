// src/app/_app.tsx
import { AppProps } from 'next/app';
import Script from 'next/script';
import '../styles/globals.css';
import { useEffect } from "react";
import { useRouter } from 'next/router';

// ✅ REMOVE THIS GLOBAL DECLARATION - It's conflicting
// declare global {
//   interface Window {
//     fbq: (...args: unknown[]) => void;
//     _fbq?: (...args: unknown[]) => void;
//   }
// }

const FB_PIXEL_ID = '1648859765778662';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq('track', 'PageView');
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="facebook pixel"
        />
      </noscript>
      <Component {...pageProps} />
    </>
  );
}

/**
 * Google Analytics Component (Opsiyonel)
 * Kullanmak için: GA_MEASUREMENT_ID environment variable'ını ekleyin
 */
import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (!measurementId) {
      return; // GA ID yoksa hiçbir şey yapma
    }

    // Google Analytics script'ini yükle
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // gtag config
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
};

export default GoogleAnalytics;


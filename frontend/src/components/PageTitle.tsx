/**
 * Page Title Component - Updates document title and meta tags
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleProps {
  title: string;
  description?: string;
  image?: string;
}

const PageTitle = ({ title, description, image }: PageTitleProps) => {
  const location = useLocation();
  const baseUrl = 'https://yourdomain.com'; // Production'da gerçek domain ile değiştirin
  const currentUrl = `${baseUrl}${location.pathname}`;
  const fullTitle = `${title} - Kardeş Demir Doğrama ve Lastik`;

  useEffect(() => {
    // Update title
    document.title = fullTitle;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (description) {
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', currentUrl);
      document.head.appendChild(canonical);
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };
    
    updateOGTag('og:title', fullTitle);
    if (description) {
      updateOGTag('og:description', description);
    }
    updateOGTag('og:url', currentUrl);
    if (image) {
      updateOGTag('og:image', image);
    }
    
    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (twitterTag) {
        twitterTag.setAttribute('content', content);
      } else {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        twitterTag.setAttribute('content', content);
        document.head.appendChild(twitterTag);
      }
    };
    
    updateTwitterTag('twitter:title', fullTitle);
    if (description) {
      updateTwitterTag('twitter:description', description);
    }
    if (image) {
      updateTwitterTag('twitter:image', image);
    }
  }, [title, description, image, currentUrl, fullTitle]);

  return null;
};

export default PageTitle;


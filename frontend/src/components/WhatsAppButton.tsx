/**
 * WhatsApp Floating Button Component
 */
import { Button } from 'react-bootstrap';

const WhatsAppButton = () => {
  const phoneNumber = '905414636726'; // +90 541 463 6726 (ülke kodu + numara, + ve boşluklar olmadan)
  const message = encodeURIComponent('Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      style={{
        position: 'fixed',
        width: '60px',
        height: '60px',
        bottom: '40px',
        right: '40px',
        backgroundColor: '#25D366',
        color: '#FFF',
        borderRadius: '50px',
        textAlign: 'center',
        fontSize: '30px',
        boxShadow: '2px 2px 3px #999',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '3px 3px 5px #999';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '2px 2px 3px #999';
      }}
      title="WhatsApp ile iletişime geçin"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 0C7.164 0 0 7.164 0 16c0 2.825.744 5.476 2.044 7.771L0 32l8.229-2.044C10.524 32.256 13.175 33 16 33c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.5c-2.344 0-4.55-.609-6.461-1.675l-.44-.231-4.569 1.137 1.137-4.569-.231-.44C4.609 20.55 4 18.344 4 16 4 9.383 9.383 4 16 4s12 5.383 12 12-5.383 12-12 12z"/>
        <path d="M24.5 19.5c-.3-.15-1.75-.863-2.025-.963-.275-.1-.475-.15-.675.15-.2.3-.775.963-.95 1.163-.175.2-.35.225-.65.075-.3-.15-1.263-.465-2.4-1.488-.888-.788-1.488-1.763-1.663-2.063-.175-.3-.018-.463.131-.613.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.24-.575-.488-.5-.675-.5-.175 0-.375-.013-.575-.013s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.113 3.213 5.113 4.513.7.3 1.25.488 1.675.625.7.225 1.338.193 1.838.118.55-.083 1.75-.713 1.995-1.4.25-.688.25-1.275.175-1.4-.05-.1-.2-.163-.5-.313z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;


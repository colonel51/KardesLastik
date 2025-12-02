import { Container, Row, Col, Card } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
import StructuredData from '../components/StructuredData';

const HomePage = () => {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kardeş Demir Doğrama ve Lastik',
    image: 'https://yourdomain.com/logo.png', // Logo URL'i eklenebilir
    '@id': 'https://yourdomain.com',
    url: 'https://yourdomain.com',
    telephone: ['+905422809344', '+905414636726'],
    email: 'ahmetkarsanba40@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sağlık Mahallesi, Unnamed Road',
      addressLocality: 'Altunhisar',
      addressRegion: 'Niğde',
      postalCode: '51600',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.00015327478188,
      longitude: 34.334151961292406,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '00:00',
        closes: '23:59',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    priceRange: '$$',
    servesCuisine: false,
    areaServed: {
      '@type': 'City',
      name: 'Altunhisar',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hizmetlerimiz',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lastik Satışı',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lastik Montajı',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Demir Doğrama',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Çatı İşlemleri',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Ziraat Aletleri',
          },
        },
      ],
    },
  };

  return (
    <>
      <PageTitle 
        title="Ana Sayfa" 
        description="Kardeş Demir Doğrama ve Lastik - Lastik, demir doğrama, çatı işlemleri ve ziraat aletleri için profesyonel hizmet. Altunhisar/Niğde." 
      />
      <StructuredData data={localBusinessSchema} />
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <div className="text-center bg-primary text-white rounded p-5 mb-5">
            <h1 className="display-4 mb-3">Kardeş Demir Doğrama ve Lastik'e Hoş Geldiniz</h1>
            <p className="lead">
              Kaliteli lastik, demir doğrama ve yapı işleri için yanınızdayız
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="text-center mb-4">Özelliklerimiz</h2>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">🎯</div>
              <Card.Title>Geniş Ürün Yelpazesi</Card.Title>
              <Card.Text>
                Tüm marka ve ebatlarda lastik seçenekleri
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">⚡</div>
              <Card.Title>Hızlı Hizmet</Card.Title>
              <Card.Text>
                Hızlı ve güvenilir montaj hizmeti
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">💳</div>
              <Card.Title>Kolay Ödeme</Card.Title>
              <Card.Text>
                Ödeme seçenekleri
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-3">🛡️</div>
              <Card.Title>Güvenilir Hizmet</Card.Title>
              <Card.Text>
                Güvenilir ve kaliteli hizmet
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default HomePage;

import { Container, Row, Col, Card } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';

const ServicesPage = () => {
  const services = [
    {
      title: 'Lastik Satışı',
      description: 'Tüm marka ve ebatlarda lastik seçenekleri',
      icon: '🚗',
    },
    {
      title: 'Lastik Montajı',
      description: 'Profesyonel ve hızlı montaj hizmeti',
      icon: '🔧',
    },
    {
      title: 'Balans Ayarı',
      description: 'Araç güvenliği için balans ayarı',
      icon: '⚖️',
    },
    {
      title: 'Rot Ayarı',
      description: 'Profesyonel rot ve ayar hizmeti',
      icon: '🎯',
    },
    {
      title: 'Demir Doğrama',
      description: 'Kapı, pencere, balkon korkulukları ve demir işleri',
      icon: '🔨',
    },
    {
      title: 'Çatı İşlemleri',
      description: 'Çatı onarımı, izolasyon ve çatı kaplama hizmetleri',
      icon: '🏠',
    },
    {
      title: 'Demir İşleri',
      description: 'Demir doğrama ve işleri için profesyonel çözümler',
      icon: '🏗️',
    },
    {
      title: 'Ziraat Aletleri',
      description: 'Ziraat aletleri ve işleri için profesyonel çözümler',
      icon: '🔧',
    },

  ];

  return (
    <>
      <PageTitle 
        title="Hizmetlerimiz" 
        description="Kardeş Demir Doğrama ve Lastik hizmetleri: Lastik satışı, montaj, balans, rot ayarı, demir doğrama, çatı işlemleri ve ziraat aletleri." 
      />
      <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-3">Hizmetlerimiz</h1>
          <p className="text-center text-muted lead mb-5">
            Kardeş Demir Doğrama ve Lastik olarak müşterilerimize geniş bir hizmet yelpazesi sunuyoruz.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {services.map((service, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="h-100 shadow-sm text-center">
              <Card.Body>
                <div className="display-4 mb-3">{service.icon}</div>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
};

export default ServicesPage;

import { Container, Row, Col, Card } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';

const AboutPage = () => {
  return (
    <>
      <PageTitle 
        title="Hakkımızda" 
        description="Kardeş Demir Doğrama ve Lastik hakkında bilgi. Misyonumuz, vizyonumuz ve şirket bilgileri." 
      />
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-5">Hakkımızda</h1>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-3">
                Biz Kimiz?
              </Card.Title>
              <Card.Text className="lead">
                Kardeş Demir Doğrama ve Lastik, yıllardır lastik, demir doğrama ve ziraat aletleri sektöründe 
                kaliteli hizmet vermekte olan güvenilir bir markadır. Müşteri memnuniyetini ön planda 
                tutarak, geniş ürün yelpazesi ve profesyonel hizmet anlayışıyla sektörde öncü konumdayız.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-3">
                Misyonumuz
              </Card.Title>
              <Card.Text>
                Müşterilerimize en kaliteli lastik, demir doğrama ve yapı işleri hizmetlerini sunarak,
                güvenli ve konforlu yaşam alanları oluşturmak.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-3">
                Vizyonumuz
              </Card.Title>
              <Card.Text>
                Sektörde lider konumda olmak ve müşteri memnuniyetini en üst seviyede tutarak
                sürekli gelişim sağlamak.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default AboutPage;

import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';

const NotFoundPage = () => {
  return (
    <>
      <PageTitle title="Sayfa Bulunamadı" />
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow">
            <Card.Body className="p-5">
              <div className="display-1 mb-4">404</div>
              <Card.Title as="h1" className="mb-3">
                Sayfa Bulunamadı
              </Card.Title>
              <Card.Text className="text-muted mb-4">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
              </Card.Text>
              <div className="d-flex gap-2 justify-content-center">
                <Button as={Link as any} to="/" variant="primary">
                  Ana Sayfaya Dön
                </Button>
                <Button as={Link as any} to="/iletisim" variant="outline-primary">
                  İletişim
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default NotFoundPage;


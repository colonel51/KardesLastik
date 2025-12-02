import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { showError } from '../utils/swal';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: JWT token endpoint'i ile login işlemi
      // Şimdilik admin paneline yönlendirme
      window.location.href = 'http://127.0.0.1:8000/admin/login/';
    } catch (err) {
      await showError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title as="h1" className="text-center mb-3">
                Giriş Yap
              </Card.Title>
              <p className="text-center text-muted mb-4">
                Sadece admin kullanıcıları giriş yapabilir.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Giriş Yap
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted small mb-0">
                  Veya{' '}
                  <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer">
                    Django Admin Panel
                  </a>
                  {' '}üzerinden giriş yapabilirsiniz.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

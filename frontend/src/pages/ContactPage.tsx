import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { createContactMessage } from '../services/contactService';
import type { CreateContactMessageData } from '../services/contactService';
import { showSuccess, showError } from '../utils/swal';
import PageTitle from '../components/PageTitle';
import StructuredData from '../components/StructuredData';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const contactData: CreateContactMessageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      };
      
      await createContactMessage(contactData);
      await showSuccess('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      await showError(
        err.response?.data?.detail || 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kardeş Demir Doğrama ve Lastik',
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
  };

  return (
    <>
      <PageTitle 
        title="İletişim" 
        description="Kardeş Demir Doğrama ve Lastik iletişim bilgileri. Telefon, e-posta, adres ve çalışma saatleri. Bize ulaşın!" 
      />
      <StructuredData data={localBusinessSchema} />
      <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-5">İletişim</h1>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-4">
                Bize Ulaşın
              </Card.Title>
              
              <div className="mb-4">
                <h5>📞 Telefon</h5>
                <p className="text-muted">+90 542 280 9344</p>
                <p className="text-muted">+90 541 463 6726</p>
                <a
                  href={`https://wa.me/905414636726?text=${encodeURIComponent('Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  WhatsApp ile İletişime Geç
                </a>
              </div>

              <div className="mb-4">
                <h5>📧 E-posta</h5>
                <p className="text-muted">ahmetkarsanba40@gmail.com</p>
              </div>

              <div className="mb-4">
                <h5>📍 Adres</h5>
                <p className="text-muted">
                Sağlık Mahallesi, Unnamed Road, 51600 Altunhisar/Niğde, Türkiye
                </p>
              </div>

              <div>
                <h5>🕒 Çalışma Saatleri</h5>
                <p className="text-muted mb-0">
                  Pazartesi - Cuma: 24 saat açık<br />
                  Pazar: 08:00 - 13:00
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-4">
                Mesaj Gönderin
              </Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad Soyad *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>E-posta *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mesaj *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="text-primary mb-4">
                📍 Konumumuz
              </Card.Title>
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22761.34534660941!2d34.334151961292406!3d38.00015327478188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d623df994978e5%3A0x3ff687c13aaa3da1!2sKarde%C5%9F%20Demir%20Do%C4%9Frama%20ve%20Lastik!5e1!3m2!1str!2s!4v1764663826050!5m2!1str!2s"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kardeş Demir Doğrama ve Lastik Konumu"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default ContactPage;

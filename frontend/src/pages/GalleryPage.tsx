import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { getGalleryImages } from '../services/galleryService';
import type { GalleryImage } from '../services/galleryService';
import { showError } from '../utils/swal';
import PageTitle from '../components/PageTitle';

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const galleryImages = await getGalleryImages(true); // Sadece aktif olanları getir
        setImages(galleryImages);
      } catch (err: any) {
        await showError(err.response?.data?.detail || 'Galeri yüklenirken bir hata oluştu.');
        console.error('Gallery load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      <PageTitle 
        title="Galeri" 
        description="Kardeş Demir Doğrama ve Lastik galeri - Yaptığımız işlerden örnekler ve projelerimiz." 
      />
      <Container className="my-5">
      <h1 className="text-center mb-5">Galeri</h1>
      
      {images.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>Henüz galeriye resim eklenmemiş.</p>
        </div>
      ) : (
        <Row className="g-4">
          {images.map((image) => (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={image.image_url}
                  alt={image.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Resim+Yüklenemedi';
                  }}
                />
                <Card.Body>
                  <Card.Title>{image.title}</Card.Title>
                  {image.description && (
                    <Card.Text className="text-muted small">{image.description}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </>
  );
};

export default GalleryPage;


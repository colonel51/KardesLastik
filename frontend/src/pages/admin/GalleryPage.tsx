import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner,
  Badge,
} from 'react-bootstrap';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../../services/galleryService';
import type {
  GalleryImage,
  CreateGalleryImageData,
} from '../../services/galleryService';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/swal';

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await getGalleryImages(); // Tüm resimler
      setImages(galleryImages);
    } catch (err: any) {
      await showError(err.response?.data?.detail || 'Galeri yüklenirken bir hata oluştu.');
      console.error('Gallery load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        description: image.description || '',
        is_active: image.is_active,
        order: image.order,
      });
      setImagePreview(image.image_url);
      setImageFile(null);
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        description: '',
        is_active: true,
        order: 0,
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({
      title: '',
      description: '',
      is_active: true,
      order: 0,
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingImage) {
        // Update
        await updateGalleryImage(editingImage.id, formData);
        await showSuccess('Resim başarıyla güncellendi.');
      } else {
        // Create
        if (!imageFile) {
          await showError('Lütfen bir resim seçin.');
          setSubmitting(false);
          return;
        }
        const createData: CreateGalleryImageData = {
          ...formData,
          image: imageFile,
        };
        await createGalleryImage(createData);
        await showSuccess('Resim başarıyla eklendi.');
      }
      handleCloseModal();
      loadImages();
    } catch (err: any) {
      await showError(err.response?.data?.detail || 'İşlem başarısız oldu.');
      console.error('Gallery save error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('Bu resmi silmek istediğinize emin misiniz?');
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteGalleryImage(id);
      await showSuccess('Resim başarıyla silindi.');
      loadImages();
    } catch (err: any) {
      await showError(err.response?.data?.detail || 'Silme işlemi başarısız oldu.');
      console.error('Gallery delete error:', err);
    }
  };

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
    <Container fluid className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Galeri Yönetimi</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Resim Ekle
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p className="text-muted mb-0">Henüz galeriye resim eklenmemiş.</p>
          </Card.Body>
        </Card>
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
                />
                <Card.Body>
                  <Card.Title className="h6">{image.title}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg={image.is_active ? 'success' : 'secondary'}>
                      {image.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                    <span className="text-muted small">Sıra: {image.order}</span>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleOpenModal(image)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingImage ? 'Resim Düzenle' : 'Yeni Resim Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Başlık *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {editingImage ? 'Yeni Resim (isteğe bağlı)' : 'Resim *'}
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingImage}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                </div>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sıra</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Aktif"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              İptal
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Kaydediliyor...
                </>
              ) : editingImage ? (
                'Güncelle'
              ) : (
                'Kaydet'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default GalleryPage;


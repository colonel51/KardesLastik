import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Spinner,
  Badge,
  Table,
} from 'react-bootstrap';
import {
  getContactMessages,
  markContactMessageAsRead,
  deleteContactMessage,
} from '../../services/contactService';
import type { ContactMessage } from '../../services/contactService';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/swal';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    loadMessages();
  }, [filterRead]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const contactMessages = await getContactMessages(filterRead);
      setMessages(contactMessages);
    } catch (err: any) {
      await showError(err.response?.data?.detail || 'Mesajlar yüklenirken bir hata oluştu.');
      console.error('Contact messages load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mesajı okundu olarak işaretle
    if (!message.is_read) {
      markContactMessageAsRead(message.id)
        .then(() => {
          loadMessages();
        })
        .catch((err) => {
          console.error('Mark as read error:', err);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('Bu mesajı silmek istediğinize emin misiniz?');
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteContactMessage(id);
      await showSuccess('Mesaj başarıyla silindi.');
      loadMessages();
    } catch (err: any) {
      await showError(err.response?.data?.detail || 'Silme işlemi başarısız oldu.');
      console.error('Contact message delete error:', err);
    }
  };

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

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
        <h2>İletişim Mesajları</h2>
        <div className="d-flex gap-2">
          <Button
            variant={filterRead === undefined ? 'primary' : 'outline-primary'}
            onClick={() => setFilterRead(undefined)}
          >
            Tümü ({messages.length})
          </Button>
          <Button
            variant={filterRead === false ? 'warning' : 'outline-warning'}
            onClick={() => setFilterRead(false)}
          >
            Okunmamış ({unreadCount})
          </Button>
          <Button
            variant={filterRead === true ? 'success' : 'outline-success'}
            onClick={() => setFilterRead(true)}
          >
            Okunmuş ({messages.length - unreadCount})
          </Button>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p className="text-muted mb-0">Henüz mesaj bulunmamaktadır.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Mesaj</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className={!message.is_read ? 'table-warning' : ''}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.phone || '-'}</td>
                    <td>
                      {message.message.length > 50
                        ? `${message.message.substring(0, 50)}...`
                        : message.message}
                    </td>
                    <td>
                      <Badge bg={message.is_read ? 'success' : 'warning'}>
                        {message.is_read ? 'Okundu' : 'Okunmadı'}
                      </Badge>
                    </td>
                    <td>
                      {new Date(message.created_at).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewMessage(message)}
                        className="me-2"
                      >
                        Görüntüle
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Message Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mesaj Detayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Ad Soyad:</strong>
                  <p>{selectedMessage.name}</p>
                </Col>
                <Col md={6}>
                  <strong>E-posta:</strong>
                  <p>{selectedMessage.email}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Telefon:</strong>
                  <p>{selectedMessage.phone || '-'}</p>
                </Col>
                <Col md={6}>
                  <strong>Durum:</strong>
                  <p>
                    <Badge bg={selectedMessage.is_read ? 'success' : 'warning'}>
                      {selectedMessage.is_read ? 'Okundu' : 'Okunmadı'}
                    </Badge>
                  </p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Tarih:</strong>
                  <p>
                    {new Date(selectedMessage.created_at).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Mesaj:</strong>
                  <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContactMessagesPage;


import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/swal';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email?: string;
}

interface Debt {
  id: number;
  customer_id: number;
  customer_name: string;
  debt_type: 'DEBT' | 'CREDIT';
  amount: string;
  description?: string;
  is_paid: boolean;
  due_date?: string;
  created_at: string;
}

const DebtsPage = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaid, setFilterPaid] = useState<boolean | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    debt_type: 'DEBT' as 'DEBT' | 'CREDIT',
    amount: '',
    description: '',
    due_date: '',
  });

  // Customer form state
  const [customerFormData, setCustomerFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    fetchDebts();
    fetchCustomers();
  }, [filterPaid]);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      let url = API_ENDPOINTS.DEBTS;
      if (filterPaid !== null) {
        url += `?is_paid=${filterPaid}`;
      }
      const response = await api.get(url);
      setDebts(response.data.results || []);
    } catch (err: any) {
      await showError('Borçlar yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CUSTOMERS + '?is_active=true');
      setCustomers(response.data.results || []);
    } catch (err: any) {
      console.error('Müşteriler yüklenirken hata:', err);
    }
  };

  const handleOpenModal = (debt?: Debt) => {
    if (debt) {
      setEditingDebt(debt);
      setFormData({
        customer_id: debt.customer_id.toString(),
        debt_type: debt.debt_type,
        amount: debt.amount,
        description: debt.description || '',
        due_date: debt.due_date || '',
      });
    } else {
      setEditingDebt(null);
      setFormData({
        customer_id: '',
        debt_type: 'DEBT',
        amount: '',
        description: '',
        due_date: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDebt(null);
    setFormData({
      customer_id: '',
      debt_type: 'DEBT',
      amount: '',
      description: '',
      due_date: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        amount: parseFloat(formData.amount),
      };

      if (editingDebt) {
        await api.put(API_ENDPOINTS.DEBT(editingDebt.id), data);
      } else {
        await api.post(API_ENDPOINTS.DEBTS, data);
      }

      handleCloseModal();
      await showSuccess(editingDebt ? 'Borç kaydı güncellendi.' : 'Borç kaydı eklendi.');
      fetchDebts();
    } catch (err: any) {
      await showError(err.response?.data?.error || 'İşlem başarısız oldu.');
      console.error(err);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(API_ENDPOINTS.CUSTOMERS, customerFormData);
      await fetchCustomers();
      await showSuccess('Müşteri başarıyla eklendi.');
      setShowCustomerModal(false);
      setCustomerFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
      });
    } catch (err: any) {
      await showError(err.response?.data?.error || 'Müşteri eklenemedi.');
      console.error(err);
    }
  };

  const handleMarkPaid = async (debtId: number) => {
    try {
      await api.post(API_ENDPOINTS.DEBT_MARK_PAID(debtId));
      await showSuccess('Borç ödendi olarak işaretlendi.');
      fetchDebts();
    } catch (err: any) {
      await showError('İşlem başarısız oldu.');
      console.error(err);
    }
  };

  const handleMarkUnpaid = async (debtId: number) => {
    try {
      await api.post(API_ENDPOINTS.DEBT_MARK_UNPAID(debtId));
      await showSuccess('Borç ödenmedi olarak işaretlendi.');
      fetchDebts();
    } catch (err: any) {
      await showError('İşlem başarısız oldu.');
      console.error(err);
    }
  };

  const handleDelete = async (debtId: number) => {
    const result = await showDeleteConfirm('Bu borç kaydını silmek istediğinize emin misiniz?');
    
    if (!result.isConfirmed) {
      return;
    }
    
    try {
      await api.delete(API_ENDPOINTS.DEBT(debtId));
      await showSuccess('Borç kaydı başarıyla silindi.');
      fetchDebts();
    } catch (err: any) {
      await showError('Silme işlemi başarısız oldu.');
      console.error(err);
    }
  };

  const filteredDebts = debts.filter((debt) => {
    if (searchTerm) {
      return (
        debt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const totalUnpaid = filteredDebts
    .filter((d) => !d.is_paid && d.debt_type === 'DEBT')
    .reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>💰 Veresiye Defteri</h1>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => setShowCustomerModal(true)}
            className="me-2"
          >
            + Yeni Müşteri
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            + Yeni Borç/Alacak
          </Button>
        </div>
      </div>


      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Müşteri veya açıklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterPaid === null ? '' : filterPaid.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setFilterPaid(value === '' ? null : value === 'true');
            }}
          >
            <option value="">Tümü</option>
            <option value="false">Ödenmeyenler</option>
            <option value="true">Ödenenler</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Card className="border-warning">
            <Card.Body className="py-2">
              <small className="text-muted">Toplam Ödenmemiş Borç:</small>
              <h5 className="mb-0 text-warning">{totalUnpaid.toFixed(2)} ₺</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>Tür</th>
                <th>Tutar</th>
                <th>Açıklama</th>
                <th>Durum</th>
                <th>Vade Tarihi</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredDebts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    Henüz borç/alacak kaydı yok
                  </td>
                </tr>
              ) : (
                filteredDebts.map((debt) => (
                  <tr key={debt.id}>
                    <td>{debt.customer_name}</td>
                    <td>
                      <Badge bg={debt.debt_type === 'DEBT' ? 'danger' : 'success'}>
                        {debt.debt_type === 'DEBT' ? 'Borç' : 'Alacak'}
                      </Badge>
                    </td>
                    <td className="fw-bold">{parseFloat(debt.amount).toFixed(2)} ₺</td>
                    <td>{debt.description || '-'}</td>
                    <td>
                      {debt.is_paid ? (
                        <Badge bg="success">Ödendi</Badge>
                      ) : (
                        <Badge bg="warning">Ödenmedi</Badge>
                      )}
                    </td>
                    <td>{debt.due_date || '-'}</td>
                    <td>{new Date(debt.created_at).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleOpenModal(debt)}
                        className="p-0 me-2"
                      >
                        Düzenle
                      </Button>
                      {!debt.is_paid ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-success p-0 me-2"
                          onClick={() => handleMarkPaid(debt.id)}
                        >
                          Ödendi
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-warning p-0 me-2"
                          onClick={() => handleMarkUnpaid(debt.id)}
                        >
                          Ödenmedi
                        </Button>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => handleDelete(debt.id)}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Borç/Alacak Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDebt ? 'Borç/Alacak Düzenle' : 'Yeni Borç/Alacak'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Müşteri *</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Müşteri Seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.full_name} - {customer.phone}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setShowCustomerModal(true);
                  }}
                >
                  + Yeni
                </Button>
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tür *</Form.Label>
                  <Form.Select
                    value={formData.debt_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        debt_type: e.target.value as 'DEBT' | 'CREDIT',
                      })
                    }
                    required
                  >
                    <option value="DEBT">Borç</option>
                    <option value="CREDIT">Alacak</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tutar *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vade Tarihi</Form.Label>
              <Form.Control
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button variant="primary" type="submit">
              {editingDebt ? 'Güncelle' : 'Kaydet'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Müşteri Ekleme Modal */}
      <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Müşteri</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCustomerSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad *</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.first_name}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad *</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.last_name}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Telefon *</Form.Label>
              <Form.Control
                type="tel"
                value={customerFormData.phone}
                onChange={(e) =>
                  setCustomerFormData({
                    ...customerFormData,
                    phone: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                value={customerFormData.email}
                onChange={(e) =>
                  setCustomerFormData({
                    ...customerFormData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={customerFormData.address}
                onChange={(e) =>
                  setCustomerFormData({
                    ...customerFormData,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCustomerModal(false)}
            >
              İptal
            </Button>
            <Button variant="primary" type="submit">
              Kaydet
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DebtsPage;


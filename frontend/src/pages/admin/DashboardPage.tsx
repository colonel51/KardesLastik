import { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';
import { showError } from '../../utils/swal';

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalDebts: number;
  unpaidDebts: number;
  totalDebtAmount: number;
  totalPaidAmount: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch customers
      const customersResponse = await api.get(API_ENDPOINTS.CUSTOMERS);
      const customers = customersResponse.data.results || [];
      
      // Fetch debts
      const debtsResponse = await api.get(API_ENDPOINTS.DEBTS);
      const debts = debtsResponse.data.results || [];

      // Calculate stats
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter((c: any) => c.is_active).length;
      const totalDebts = debts.length;
      const unpaidDebts = debts.filter((d: any) => !d.is_paid).length;
      
      const totalDebtAmount = debts
        .filter((d: any) => !d.is_paid && d.debt_type === 'DEBT')
        .reduce((sum: number, d: any) => sum + parseFloat(d.amount || 0), 0);
      
      const totalPaidAmount = debts
        .filter((d: any) => d.is_paid)
        .reduce((sum: number, d: any) => sum + parseFloat(d.amount || 0), 0);

      setStats({
        totalCustomers,
        activeCustomers,
        totalDebts,
        unpaidDebts,
        totalDebtAmount,
        totalPaidAmount,
      });
    } catch (err: any) {
      await showError('İstatistikler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <h1 className="mb-4">📊 Dashboard</h1>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-muted small">Toplam Müşteri</Card.Title>
              <h2 className="mb-0">{stats?.totalCustomers || 0}</h2>
              <small className="text-muted">
                {stats?.activeCustomers || 0} aktif
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-muted small">Toplam Borç Kaydı</Card.Title>
              <h2 className="mb-0">{stats?.totalDebts || 0}</h2>
              <small className="text-muted">
                {stats?.unpaidDebts || 0} ödenmedi
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-warning">
            <Card.Body>
              <Card.Title className="text-muted small">Toplam Borç Tutarı</Card.Title>
              <h2 className="mb-0 text-warning">
                {stats?.totalDebtAmount.toFixed(2) || '0.00'} ₺
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-success">
            <Card.Body>
              <Card.Title className="text-muted small">Toplam Ödenen</Card.Title>
              <h2 className="mb-0 text-success">
                {stats?.totalPaidAmount.toFixed(2) || '0.00'} ₺
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;


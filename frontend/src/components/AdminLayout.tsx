import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { authService } from '../services/authService';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/yonetim/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/yonetim/dashboard">
            🏢 Kardeş Demir Doğrama ve Lastik - Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/yonetim/dashboard"
                active={location.pathname === '/yonetim/dashboard'}
              >
                📊 Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/yonetim/debts"
                active={location.pathname === '/yonetim/debts'}
              >
                💰 Veresiye Defteri
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/yonetim/gallery"
                active={location.pathname === '/yonetim/gallery'}
              >
                🖼️ Galeri Yönetimi
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/yonetim/contact-messages"
                active={location.pathname === '/yonetim/contact-messages'}
              >
                📧 İletişim Mesajları
              </Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown 
                title={currentUser?.username || 'Kullanıcı'} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  {currentUser?.email}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Çıkış Yap
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default AdminLayout;

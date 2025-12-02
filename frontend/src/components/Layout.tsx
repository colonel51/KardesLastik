import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import WhatsAppButton from './WhatsAppButton';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Kardeş Demir Doğrama ve Lastik
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/"
                active={location.pathname === '/'}
              >
                Ana Sayfa
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/hakkimizda"
                active={location.pathname === '/hakkimizda'}
              >
                Hakkımızda
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/hizmetlerimiz"
                active={location.pathname === '/hizmetlerimiz'}
              >
                Hizmetlerimiz
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/galeri"
                active={location.pathname === '/galeri'}
              >
                Galeri
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/iletisim"
                active={location.pathname === '/iletisim'}
              >
                İletişim
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/yonetim/login"
                active={location.pathname === '/yonetim/login'}
              >
                Admin Girişi
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-light text-center py-4 mt-auto">
        <Container>
          <p className="mb-0">&copy; 2024 Kardeş Demir Doğrama ve Lastik. Tüm hakları saklıdır.</p>
        </Container>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default Layout;

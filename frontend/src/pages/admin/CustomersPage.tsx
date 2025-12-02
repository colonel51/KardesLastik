// Bu sayfa artık kullanılmıyor - müşteriler veresiye sayfasından yönetiliyor
import { Navigate } from 'react-router-dom';

const CustomersPage = () => {
  return <Navigate to="/admin/debts" replace />;
};

export default CustomersPage;


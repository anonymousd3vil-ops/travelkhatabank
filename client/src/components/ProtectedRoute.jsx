import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './Layout.jsx';

export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token);
  return token ? <Layout /> : <Navigate to="/login" replace />;
}

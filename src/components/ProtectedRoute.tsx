import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated()) {
      // Redirecionar para a página de login
      navigate('/login');
    }
  }, [navigate]);

  // Se o usuário estiver autenticado, renderizar os filhos
  return <>{children}</>;
}

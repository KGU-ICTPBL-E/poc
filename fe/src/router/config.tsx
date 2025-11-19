
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/home/page';
import Admin from '../pages/admin/page';
import AlertDetail from '../pages/alert-detail/page';
import NotFound from '../pages/NotFound';
import AuthPage from '../pages/auth/page';
import { ProtectedRoute } from '../components/ProtectedRoute';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/alert/:id',
    element: <AlertDetail />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;

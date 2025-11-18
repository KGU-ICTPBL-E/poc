
import { RouteObject } from 'react-router-dom';
import Home from '../pages/home/page';
import Admin from '../pages/admin/page';
import AlertDetail from '../pages/alert-detail/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: <Admin />,
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

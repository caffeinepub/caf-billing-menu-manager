import { RouterProvider, createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import MenuManagement from './pages/MenuManagement';
import OrderTaking from './pages/OrderTaking';
import BillView from './pages/BillView';
import SalesReports from './pages/SalesReports';

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Index redirect to /menu
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/menu' });
  },
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuManagement,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order',
  component: OrderTaking,
});

const billRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bill',
  component: BillView,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: SalesReports,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  orderRoute,
  billRoute,
  reportsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

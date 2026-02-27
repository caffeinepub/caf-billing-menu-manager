import { RouterProvider, createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import MenuManagement from './pages/MenuManagement';
import OrderTaking from './pages/OrderTaking';
import BillView from './pages/BillView';
import SalesReports from './pages/SalesReports';
import OrderDetails from './pages/OrderDetails';
import PublicMenu from './pages/PublicMenu';

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Index redirect to /order
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/order' });
  },
});

// Public menu page (accessible to all)
const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: PublicMenu,
});

// Admin menu management page
const menuManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu-management',
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

const orderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-details',
  component: OrderDetails,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  menuManagementRoute,
  orderRoute,
  billRoute,
  reportsRoute,
  orderDetailsRoute,
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

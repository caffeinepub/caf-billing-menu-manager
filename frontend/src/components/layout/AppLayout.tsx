import { Outlet, useRouterState } from '@tanstack/react-router';
import Navigation from './Navigation';

export default function AppLayout() {
  const routerState = useRouterState();
  const isBillPage = routerState.location.pathname.startsWith('/bill');

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="no-print sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src="/assets/generated/cafe-logo.dim_256x256.png"
            alt="Café Logo"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">My Café</h1>
            <p className="text-xs text-muted-foreground">Billing & Menu Manager</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto ${!isBillPage ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!isBillPage && <Navigation />}
    </div>
  );
}

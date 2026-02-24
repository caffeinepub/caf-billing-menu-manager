import { Outlet, useRouterState } from '@tanstack/react-router';
import Navigation from './Navigation';

export default function AppLayout() {
  const routerState = useRouterState();
  const isBillPage = routerState.location.pathname.startsWith('/bill');

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="no-print sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="flex items-center gap-3 px-4 py-2">
          <img
            src="/assets/generated/cafe-logo.png"
            alt="Simple Sips Cafe Logo"
            className="h-11 w-11 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-amber-warm leading-tight tracking-tight">
              Simple Sips Cafe
            </h1>
            <p className="text-xs text-muted-foreground">Billing &amp; Menu Manager</p>
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

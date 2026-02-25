import { Outlet, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import Navigation from './Navigation';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminRole } from '../../hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AppLayout() {
  const routerState = useRouterState();
  const isBillPage = routerState.location.pathname.startsWith('/bill');

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

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
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-amber-warm leading-tight tracking-tight">
              Simple Sips Cafe
            </h1>
            <p className="text-xs text-muted-foreground">Billing &amp; Menu Manager</p>
          </div>

          {/* Role badge + auth button */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && !roleLoading && (
              <Badge
                variant={isAdmin ? 'default' : 'secondary'}
                className="gap-1 text-xs px-2 py-0.5 rounded-full"
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck size={11} />
                    Admin
                  </>
                ) : (
                  <>
                    <Eye size={11} />
                    Viewer
                  </>
                )}
              </Badge>
            )}

            {isAuthenticated && roleLoading && (
              <Loader2 size={14} className="animate-spin text-muted-foreground" />
            )}

            <Button
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="h-8 gap-1.5 text-xs px-3"
              onClick={handleAuth}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Logging in…
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut size={12} />
                  Logout
                </>
              ) : (
                <>
                  <LogIn size={12} />
                  Login
                </>
              )}
            </Button>
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

import { Link, useRouterState } from '@tanstack/react-router';
import { ShoppingCart, BarChart3, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/order', label: 'Order', icon: ShoppingCart },
  { path: '/menu', label: 'Menu', icon: BookOpen },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Navigation() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="no-print fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-card border-t border-border shadow-card">
      <div className="flex items-stretch h-16">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = currentPath === path || (path === '/order' && currentPath === '/');
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-h-[64px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-7 rounded-full transition-colors',
                isActive && 'bg-primary/10'
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                'text-[11px] font-medium leading-none',
                isActive ? 'font-semibold' : ''
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

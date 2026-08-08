import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Map, ShieldAlert, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { GlobalSOSOverlay } from '../components/GlobalSOSOverlay';

export function TravelerLayout() {
  const [showSOS, setShowSOS] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t('Home'), icon: Map, path: '/' },
    { name: 'SOS', icon: ShieldAlert, path: '/sos' },
    { name: t('Settings'), icon: Settings, path: '/settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent text-foreground relative w-full">
      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto relative", location.pathname !== '/' && "pb-28")}>
        <Outlet />
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-0 left-6 right-6 z-[1000] mb-safe">
        <div className="bg-card/70 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[32px] px-2 py-2 flex justify-around items-center">
          {navItems.map((item) => {
            if (item.name === 'SOS') {
              return (
                <button
                  key={item.name}
                  onClick={() => setShowSOS(true)}
                  className="flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 text-destructive hover:bg-destructive/10"
                >
                  <item.icon className="w-6 h-6 stroke-[2.5px]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {item.name}
                  </span>
                </button>
              );
            }

            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                <span className={cn(
                  "text-[10px] font-bold tracking-wider transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Global SOS Overlay */}
      {showSOS && <GlobalSOSOverlay onClose={() => setShowSOS(false)} />}
    </div>
  );
}

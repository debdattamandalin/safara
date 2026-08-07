import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, Users, Map as MapIcon, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminLayout() {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Active Incidents', icon: ShieldAlert, path: '/' },
    { name: 'Traveler Map', icon: MapIcon, path: '/map' },
    { name: 'Analytics', icon: Activity, path: '/analytics' },
    { name: 'Staff', icon: Users, path: '/staff' },
  ];

  return (
    <div className="h-full bg-transparent text-foreground flex overflow-hidden w-full relative">
      {/* Sidebar for Desktop */}
      <aside className="w-64 flex-col border-r border-border bg-card hidden md:flex">
        <div className="h-20 flex flex-col justify-center px-6 border-b border-border">
          <div className="flex items-center">
            <ShieldAlert className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold leading-none">Safara Admin</h1>
          </div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1 ml-8">National Tourist Safety</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Emergency Operations Center</h2>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 bg-secondary/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

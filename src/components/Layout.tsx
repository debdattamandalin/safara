import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Bell, Menu, X, Compass, UserCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { cn } from '../lib/utils';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Network', icon: Users, path: '/network' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      
      {/* Sidebar for Desktop */}
      {!isNative && (
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
          <div className="h-20 flex flex-col justify-center px-6 border-b border-border">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent leading-none">Safara</h1>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">National Tourist Safety</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
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
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 pt-safe">
          <div className="flex items-center gap-4">
            {!isNative && (
              <button 
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            {isNative && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent leading-none">Safara</h1>
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">National Tourist Safety</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white cursor-pointer shadow-sm">
               <UserCircle className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation (for Native Mobile or Mobile Web) */}
      <nav className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-lg pb-safe z-50",
        isMobileMenuOpen && !isNative ? "flex" : "flex"
      )}>
        <div className="flex justify-around items-center h-16 px-2 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
}

import React from "react";
import { useLocation } from "react-router-dom";
import '@fontsource/bricolage-grotesque';
import '@fontsource/inter';

export function InteractiveBackground({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dash") || location.pathname.startsWith("/admin");

  return (
    <div className="h-[100dvh] w-full selection:bg-black selection:text-white flex flex-col font-body antialiased overflow-hidden bg-background">
      {/* Subtle Grid Background Only */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-60"></div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-grow flex flex-col relative z-10 w-full h-full ${
        isDashboard ? "" : "items-center justify-center"
      }`}>
        {children}
      </main>
    </div>
  );
}

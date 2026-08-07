import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

export function TravelerSettings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('safara_onboarded');
    localStorage.removeItem('safara_digital_id');
    localStorage.removeItem('safara_user_data');
    navigate('/onboarding', { replace: true });
  };

  return (
    <div className="px-6 pb-6 pt-safe mt-6 space-y-8 animate-in fade-in duration-500">
      {/* iOS Large Title */}
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Settings</h1>
      </div>

      {/* Grouped List */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-4">Account & Data</h3>
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors cursor-pointer border-b border-white/40">
            <div>
              <p className="font-semibold text-foreground">Privacy Policy</p>
              <p className="text-xs text-muted-foreground mt-0.5">How your data is secured</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div 
            onClick={handleLogout}
            className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors cursor-pointer"
          >
            <div>
              <p className="font-bold text-destructive">Sign Out & Erase ID</p>
              <p className="text-xs text-muted-foreground mt-0.5">Removes all local secure data</p>
            </div>
            <LogOut className="w-5 h-5 text-destructive" />
          </div>

        </div>
      </div>
    </div>
  );
}

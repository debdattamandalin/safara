import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, ChevronRight, Globe } from 'lucide-react';

export function TravelerSettings() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const dataStr = localStorage.getItem('safara_user_data');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        if (data.language) setLanguage(data.language);
      } catch (e) {}
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const dataStr = localStorage.getItem('safara_user_data');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        data.language = newLang;
        localStorage.setItem('safara_user_data', JSON.stringify(data));
      } catch (e) {}
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('safara_onboarded');
    localStorage.removeItem('safara_digital_id');
    localStorage.removeItem('safara_user_data');
    navigate('/onboarding', { replace: true });
  };

  const indianLanguages = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil'];
  const worldLanguages = ['English', 'Mandarin', 'Spanish', 'French', 'Arabic'];

  return (
    <div className="px-6 pb-6 pt-safe mt-6 space-y-8 animate-in fade-in duration-500">
      {/* iOS Large Title */}
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Settings</h1>
      </div>

      {/* Preferences Group */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-4">Preferences</h3>
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="p-5 flex items-center justify-between border-b border-white/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Language</p>
                <p className="text-xs text-muted-foreground mt-0.5">App interface language</p>
              </div>
            </div>
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-right font-medium text-foreground outline-none cursor-pointer appearance-none pr-4 relative after:content-['▼'] after:absolute after:right-0 after:text-xs"
            >
              <optgroup label="Indian Languages">
                {indianLanguages.map(l => <option key={l} value={l}>{l}</option>)}
              </optgroup>
              <optgroup label="World Languages">
                {worldLanguages.map(l => <option key={l} value={l}>{l}</option>)}
              </optgroup>
            </select>
          </div>

        </div>
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

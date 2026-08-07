import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function TravelerSettings() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const dataStr = localStorage.getItem('safara_user_data');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        if (data.language) setLanguage(data.language);
      } catch (e) {}
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setIsLangOpen(false);
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
          
          <div className="flex flex-col border-b border-white/40">
            <div 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground mt-0.5">App interface language</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{language}</span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isLangOpen && "rotate-180")} />
              </div>
            </div>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/5"
                >
                  <div className="p-5 pt-0 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">Indian Languages</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {indianLanguages.map(l => (
                          <button
                            key={l}
                            onClick={() => handleLanguageChange(l)}
                            className={cn(
                              "py-2 px-3 rounded-xl border transition-all active:scale-95 text-center text-sm font-medium",
                              language === l ? "bg-foreground text-background border-foreground shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">World Languages</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {worldLanguages.map(l => (
                          <button
                            key={l}
                            onClick={() => handleLanguageChange(l)}
                            className={cn(
                              "py-2 px-3 rounded-xl border transition-all active:scale-95 text-center text-sm font-medium",
                              language === l ? "bg-foreground text-background border-foreground shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

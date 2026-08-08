import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export function TravelerSettings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [digitalIdHash, setDigitalIdHash] = useState<string | null>(null);

  useEffect(() => {
    const dataStr = localStorage.getItem('safara_user_data');
    const hash = localStorage.getItem('safara_digital_id');
    if (hash) setDigitalIdHash(hash);
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setUserData(data);
        if (data.language) setLanguage(data.language);
      } catch (e) {}
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setIsLangOpen(false);
    i18n.changeLanguage(newLang);
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
        <h1 className="text-4xl font-display font-bold tracking-tight">{t('Settings')}</h1>
      </div>

      {/* Preferences Group */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-4">{t('Preferences')}</h3>
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
                  <p className="font-semibold text-foreground">{t('Language')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('App interface language')}</p>
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
                  <div className="px-6 pb-6 pt-4 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">{t('Indian Languages')}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {indianLanguages.map(l => (
                          <button
                            key={l}
                            onClick={() => handleLanguageChange(l)}
                            className={cn(
                              "py-2 px-3 rounded-xl border transition-all active:scale-95 text-center text-sm font-medium",
                              language === l ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">{t('World Languages')}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {worldLanguages.map(l => (
                          <button
                            key={l}
                            onClick={() => handleLanguageChange(l)}
                            className={cn(
                              "py-2 px-3 rounded-xl border transition-all active:scale-95 text-center text-sm font-medium",
                              language === l ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
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
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-4">{t('Account & Data')}</h3>
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {userData && (
            <div className="p-5 border-b border-white/40">
              <h4 className="font-bold text-foreground mb-3">{t('Traveler Profile')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t('Name')}</span><span className="font-medium">{userData.name}</span></div>
                {digitalIdHash && <div className="flex justify-between"><span className="text-muted-foreground">{t('Safara ID')}</span><span className="font-mono font-bold text-emerald-700">SAF-{digitalIdHash.substring(0, 8).toUpperCase()}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">{t('DOB')}</span><span className="font-medium">{userData.dob}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t('Blood Type')}</span><span className="font-medium">{userData.bloodType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t('Emergency Contact')}</span><span className="font-medium">{userData.emergencyContact}</span></div>
              </div>
            </div>
          )}

          <div className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors cursor-pointer border-b border-white/40">
            <div>
              <p className="font-semibold text-foreground">{t('Privacy Policy')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('How your data is secured')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div 
            onClick={handleLogout}
            className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors cursor-pointer"
          >
            <div>
              <p className="font-bold text-destructive">{t('Sign Out & Erase ID')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('Removes all local secure data')}</p>
            </div>
            <LogOut className="w-5 h-5 text-destructive" />
          </div>

        </div>
      </div>
    </div>
  );
}

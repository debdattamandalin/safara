import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, ChevronLeft, Fingerprint, 
  MapPin, UserSquare2, Globe, ShieldCheck, Bell, CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

type OnboardingPath = 'none' | 'indian' | 'international';

export function Onboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [path, setPath] = useState<OnboardingPath>('none');
  const [isSimulatingDigilocker, setIsSimulatingDigilocker] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  
  const [data, setData] = useState({
    name: '',
    nationality: '',
    passport: '',
    aadhaar: '',
    dob: '',
    bloodType: '',
    medical: '',
    emergencyContact: '',
    insurance: '',
    duration: '',
    destination: '',
    language: ''
  });

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const [dobParts, setDobParts] = useState({ day: '', month: '', year: '' });
  const [pickerState, setPickerState] = useState<'day'|'month'|'year'|null>(null);
  
  useEffect(() => {
    if (dobParts.day && dobParts.month && dobParts.year) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const mIdx = (months.indexOf(dobParts.month) + 1).toString().padStart(2, '0');
      updateData({ dob: `${dobParts.year}-${mIdx}-${dobParts.day.padStart(2, '0')}` });
    } else {
      updateData({ dob: '' });
    }
  }, [dobParts]);

  const updateData = (fields: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleDigilocker = () => {
    setIsSimulatingDigilocker(true);
    setTimeout(() => {
      setIsSimulatingDigilocker(false);
      setStep(7); // Go to medical
    }, 2000);
  };

  const finishOnboarding = async () => {
    const text = `${data.name}-${data.passport || data.aadhaar}-${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuf = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Save to Supabase
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase.from('users').insert({
        full_name: data.name,
        aadhaar: data.aadhaar,
        passport: data.passport,
        nationality: data.nationality || (path === 'indian' ? 'Indian' : ''),
        blood_grp: data.bloodType,
        medical_cond: data.medical,
        emergency_contact: data.emergencyContact
      });
    } catch(e) {
      console.error('Supabase save failed', e);
    }

    localStorage.setItem('safara_onboarded', 'true');
    localStorage.setItem('safara_digital_id', hashHex);
    localStorage.setItem('safara_user_data', JSON.stringify(data));
    localStorage.setItem('safara_user_type', path);
    
    if (path === 'indian') {
      localStorage.setItem('safara_account_status', 'verified');
      navigate('/', { replace: true });
    } else {
      localStorage.setItem('safara_account_status', 'pending_verification');
      navigate('/verify', { replace: true });
    }
  };

  const slideVariants = {
    enter: { scale: 0.95, opacity: 0, filter: 'blur(10px)' },
    center: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    exit: { scale: 1.05, opacity: 0, filter: 'blur(10px)' }
  };

  return (
    <div className="h-full ambient-mesh-bg flex flex-col relative w-full">
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 pt-safe px-6 mt-4 z-[100] flex justify-between items-center">
        {step > 2 ? (
          <button 
            onClick={() => {
              if (step === 8 && path === 'indian') setStep(7);
              else if (step === 7 && path === 'indian') setStep(6);
              else if (step === 6 && path === 'indian') setStep(5);
              else if (step === 7 && path === 'international') setStep(6);
              else if (step === 6 && path === 'international') setStep(5);
              else setStep(s => s - 1);
            }}
            className="p-3 bg-white/40 backdrop-blur-md rounded-full text-foreground/80 hover:bg-white/60 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-11 h-11" />}
      </div>

      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div 
            key="step1"
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-32 w-32 bg-white/40 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center relative border border-white/50"
            >
              <Shield className="w-14 h-14 text-foreground/80 relative z-10" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl font-serif mt-6 text-foreground tracking-tight"
            >
              Safara
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg font-medium text-muted-foreground mt-2"
            >
              National Tourist Safety
            </motion.p>
          </motion.div>
        )}

        {step > 1 && (
          <motion.div 
            key="onboarding-modal"
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col justify-end z-10"
          >
            <div className="bg-white/70 backdrop-blur-3xl border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] flex flex-col h-[85vh] w-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-content-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col h-full w-full absolute inset-0 p-6 pb-[calc(env(safe-area-inset-bottom)+2rem)]"
                >
              
              {/* STEP 2: WELCOME */}
              {step === 2 && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col items-center text-center justify-center py-4">
                    <div className="bg-primary/5 p-4 rounded-full mb-6">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-5xl font-serif text-foreground mb-1 leading-tight">{t('Safara')}</h2>
                    <h3 className="text-lg font-medium text-muted-foreground mb-3">{t('National Tourist Safety')}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 px-2">
                      {t('An official safety infrastructure protecting travelers across India.')}
                    </p>
                  </div>
                  <button onClick={() => setStep(3)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-6 active:scale-95 transition-transform text-base shadow-xl">
                    {t('Get Started')}
                  </button>
                </div>
              )}

              {/* STEP 3: LANGUAGE SELECTION */}
              {step === 3 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Select Language')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Choose your preferred language for the app interface.')}</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                    <div>
                      <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3 px-1">{t('Indian Languages')}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => updateData({ language: lang })}
                            className={cn(
                              "p-4 rounded-2xl border transition-all active:scale-95 text-left font-medium",
                              data.language === lang ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3 px-1">{t('World Languages')}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['English', 'Mandarin', 'Spanish', 'French', 'Arabic'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => updateData({ language: lang })}
                            className={cn(
                              "p-4 rounded-2xl border transition-all active:scale-95 text-left font-medium",
                              data.language === lang ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    disabled={!data.language}
                    onClick={() => {
                      i18n.changeLanguage(data.language);
                      setStep(4);
                    }} 
                    className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0"
                  >
                    {t('Continue')}
                  </button>
                </div>
              )}

              {/* STEP 4: SELECT CITIZEN TYPE */}
              {step === 4 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-10 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Who are you?')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Registration process differs based on citizenship.')}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <button 
                      onClick={() => { setPath('indian'); setStep(5); }}
                      className="p-6 bg-white/50 backdrop-blur-xl border border-white rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-white/70 active:scale-95 transition-all shadow-sm"
                    >
                      <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <UserSquare2 className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{t('Indian Citizen')}</h3>
                        <p className="text-xs text-muted-foreground">{t('Domestic travel safety')}</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setPath('international'); setStep(5); }}
                      className="p-6 bg-white/50 backdrop-blur-xl border border-white rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-white/70 active:scale-95 transition-all shadow-sm"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{t('International Traveler')}</h3>
                        <p className="text-xs text-muted-foreground">{t('Tourism & Visa integration')}</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: TRAVELER IDENTITY (BOTH) */}
              {step === 5 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Traveler Identity')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Please enter your basic information.')}</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">{t('Full Name')}</label>
                      <input type="text" value={data.name} onChange={e => updateData({ name: e.target.value.replace(/[^a-zA-Z\s]/g, '') })} placeholder="John Doe" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">{t('Date of Birth')}</label>
                      <div className="relative">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPickerState(pickerState === 'day' ? null : 'day')}
                            className={cn(
                              "flex-[1] bg-foreground/5 border-none outline-none focus:bg-foreground/10 transition-colors font-serif text-lg text-foreground rounded-2xl px-4 py-3 text-center",
                              pickerState === 'day' && "bg-[#111111] text-white shadow-md"
                            )}
                          >
                            {dobParts.day || 'DD'}
                          </button>
                          <button 
                            onClick={() => setPickerState(pickerState === 'month' ? null : 'month')}
                            className={cn(
                              "flex-[1.5] bg-foreground/5 border-none outline-none focus:bg-foreground/10 transition-colors font-serif text-lg text-foreground rounded-2xl px-4 py-3 text-center",
                              pickerState === 'month' && "bg-[#111111] text-white shadow-md"
                            )}
                          >
                            {dobParts.month ? dobParts.month.substring(0,3) : 'MM'}
                          </button>
                          <button 
                            onClick={() => setPickerState(pickerState === 'year' ? null : 'year')}
                            className={cn(
                              "flex-[1.5] bg-foreground/5 border-none outline-none focus:bg-foreground/10 transition-colors font-serif text-lg text-foreground rounded-2xl px-4 py-3 text-center",
                              pickerState === 'year' && "bg-[#111111] text-white shadow-md"
                            )}
                          >
                            {dobParts.year || 'YYYY'}
                          </button>
                        </div>

                        <AnimatePresence>
                          {pickerState === 'day' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 w-full mt-2 p-3 bg-white/90 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-xl grid grid-cols-7 gap-1 z-50 max-h-56 overflow-y-auto"
                            >
                              {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => (
                                <button key={d} onClick={() => { setDobParts(p => ({ ...p, day: d })); setPickerState('month'); }} className="p-2 rounded-lg hover:bg-black/5 text-sm font-medium transition-colors active:scale-95">{d}</button>
                              ))}
                            </motion.div>
                          )}
                          {pickerState === 'month' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 w-full mt-2 p-3 bg-white/90 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-xl grid grid-cols-3 gap-2 z-50"
                            >
                              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <button key={m} onClick={() => { setDobParts(p => ({ ...p, month: m })); setPickerState('year'); }} className="p-3 rounded-xl bg-black/5 hover:bg-black/10 text-sm font-bold transition-colors active:scale-95">{m.substring(0,3)}</button>
                              ))}
                            </motion.div>
                          )}
                          {pickerState === 'year' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 w-full mt-2 p-3 bg-white/90 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-xl grid grid-cols-4 gap-2 z-50 h-56 overflow-y-auto"
                            >
                              {Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 1 - i).toString()).map(y => (
                                <button key={y} onClick={() => { setDobParts(p => ({ ...p, year: y })); setPickerState(null); }} className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-sm font-bold transition-colors active:scale-95">{y}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {path === 'international' ? (
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">{t('Nationality')}</label>
                          <input type="text" value={data.nationality} onChange={e => updateData({ nationality: e.target.value.replace(/[^a-zA-Z\s]/g, '') })} placeholder="USA" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">{t('Passport')}</label>
                          <input type="text" value={data.passport} onChange={e => updateData({ passport: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() })} placeholder="A12345678" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6">
                        <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">{t('Aadhaar Number')}</label>
                        <input type="text" inputMode="numeric" value={data.aadhaar} onChange={e => updateData({ aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })} placeholder="123456789012" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                      </div>
                    )}
                  </div>
                  
                  <button disabled={!data.name || !data.dob || (path === 'indian' ? !data.aadhaar : (!data.passport || !data.nationality))} onClick={() => setStep(6)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0">
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 6 (INDIAN ONLY): DIGILOCKER */}
              {step === 6 && path === 'indian' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Verify Identity')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Secure verification via Government of India.')}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
                      <ShieldCheck className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <button 
                      onClick={handleDigilocker}
                      disabled={isSimulatingDigilocker}
                      className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-50"
                    >
                      {isSimulatingDigilocker ? t('Fetching DigiLocker Data...') : t('Connect with DigiLocker')}
                    </button>
                    
                    <p className="text-xs text-muted-foreground mt-6 text-center px-4">
                      By proceeding, you consent to sharing your Name, DOB, and Aadhaar status with Safara for safety monitoring.
                    </p>
                  </div>
                </div>
              )}
              
              {/* STEP 6 (INTERNATIONAL ONLY): MEDICAL PROFILE */}
              {step === 6 && path === 'international' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Emergency Profile')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Crucial data for first responders.')}</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3 block">{t('Blood Type')}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <button
                            key={type}
                            onClick={() => updateData({ bloodType: type })}
                            className={cn(
                              "py-3 rounded-xl border transition-all active:scale-95 text-center font-bold text-lg",
                              data.bloodType === type ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">{t('Conditions & Allergies')}</label>
                      <textarea value={data.medical} onChange={e => updateData({ medical: e.target.value })} placeholder="E.g. Asthma, Peanut Allergy" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl min-h-[60px] text-foreground placeholder:text-muted-foreground/30 rounded-none px-0 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-4">{t('Emergency Contact')}</label>
                      <input type="tel" inputMode="numeric" value={data.emergencyContact} onChange={e => updateData({ emergencyContact: e.target.value.replace(/[^\d+()-\s]/g, '') })} placeholder="+1 (555) 000-0000" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                  </div>
                  
                  <button disabled={!data.bloodType || !data.emergencyContact} onClick={() => setStep(7)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0">
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 7 (INDIAN ONLY): MEDICAL PROFILE */}
              {step === 7 && path === 'indian' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Emergency Profile')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Crucial data for first responders.')}</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-6 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900">{t('Identity Verified')}</p>
                        <p className="text-xs text-emerald-700 mt-1">{t('DigiLocker successfully provided your identity information.')}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3 block">{t('Blood Type')}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <button
                            key={type}
                            onClick={() => updateData({ bloodType: type })}
                            className={cn(
                              "py-3 rounded-xl border transition-all active:scale-95 text-center font-bold text-lg",
                              data.bloodType === type ? "bg-[#111111] text-white border-[#111111] shadow-md" : "bg-white/50 border-white hover:bg-white/70 text-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">{t('Conditions & Allergies')}</label>
                      <textarea value={data.medical} onChange={e => updateData({ medical: e.target.value })} placeholder="E.g. Asthma, Peanut Allergy" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl min-h-[60px] text-foreground placeholder:text-muted-foreground/30 rounded-none px-0 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-4">{t('Emergency Contact')}</label>
                      <input type="tel" inputMode="numeric" value={data.emergencyContact} onChange={e => updateData({ emergencyContact: e.target.value.replace(/[^\d+()-\s]/g, '') })} placeholder="+1 (555) 000-0000" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                  </div>
                  
                  <button disabled={!data.bloodType || !data.emergencyContact} onClick={() => setStep(8)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0">
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 7 (INTERNATIONAL ONLY): TRAVEL DETAILS */}
              {step === 7 && path === 'international' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('Travel Details')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Information required for foreign tourists.')}</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">{t('Expected Stay Duration (Days)')}</label>
                      <input type="text" inputMode="numeric" value={data.duration} onChange={e => updateData({ duration: e.target.value.replace(/\D/g, '') })} placeholder="14" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">{t('Intended Destinations')}</label>
                      <input type="text" value={data.destination} onChange={e => updateData({ destination: e.target.value.replace(/[^a-zA-Z\s,]/g, '') })} placeholder="Delhi, Agra, Goa" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">{t('Medical Insurance (Optional)')}</label>
                      <input type="text" value={data.insurance} onChange={e => updateData({ insurance: e.target.value.replace(/[^a-zA-Z0-9\s]/g, '') })} placeholder="Provider Name" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                  </div>
                  
                  <button disabled={!data.duration || !data.destination} onClick={() => setStep(8)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0">
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 8: PERMISSIONS (BOTH) */}
              {step === 8 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">{t('System Permissions')}</h2>
                    <p className="text-muted-foreground text-xs px-2">{t('Safara requires certain permissions to function as a National Tourist Safety infrastructure.')}</p>
                  </div>
                  
                  <div className="space-y-4 flex-1 mt-4">
                    <button 
                      onClick={async () => {
                        setLocationGranted(true); // Force UI update for demo
                        try {
                          if (Capacitor.isNativePlatform()) {
                            await Geolocation.requestPermissions();
                          } else {
                            Geolocation.getCurrentPosition();
                          }
                        } catch(e) { console.warn(e); }
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-3xl flex gap-4 items-start border transition-all active:scale-95",
                        locationGranted 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                      )}
                    >
                      <div className={cn("p-3 rounded-full shrink-0 transition-colors", locationGranted ? "bg-emerald-500/20" : "bg-primary/20")}>
                        {locationGranted ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <MapPin className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{t('Live Location Tracking')}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {locationGranted ? t('Permission granted.') : t('Tap to allow continuous safety monitoring and instant SOS response.')}
                        </p>
                      </div>
                    </button>

                    <button 
                      onClick={async () => {
                        try {
                          if (Capacitor.isNativePlatform()) {
                            const status = await LocalNotifications.requestPermissions();
                            if (status.display === 'granted') setNotificationsGranted(true);
                          } else if ('Notification' in window) {
                            const status = await Notification.requestPermission();
                            if (status === 'granted') setNotificationsGranted(true);
                          } else {
                            setNotificationsGranted(true); // Fallback for unsupported browsers
                          }
                        } catch(e) { console.warn(e); }
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-3xl flex gap-4 items-start border transition-all active:scale-95",
                        notificationsGranted 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                      )}
                    >
                      <div className={cn("p-3 rounded-full shrink-0 transition-colors", notificationsGranted ? "bg-emerald-500/20" : "bg-primary/20")}>
                        {notificationsGranted ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <Bell className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{t('Safety Notifications')}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notificationsGranted ? t('Permission granted.') : t('Tap to allow danger zone alerts and emergency broadcasts.')}
                        </p>
                      </div>
                    </button>
                  </div>
                  
                  <button 
                    disabled={!locationGranted || !notificationsGranted}
                    onClick={finishOnboarding} 
                    className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base flex-shrink-0 disabled:opacity-30 disabled:active:scale-100"
                  >
                    Finish Registration
                  </button>
                </div>
              )}

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

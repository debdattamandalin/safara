import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, ChevronLeft, Fingerprint, 
  MapPin, UserSquare2, Globe, HeartPulse, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

type OnboardingPath = 'none' | 'indian' | 'international';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [path, setPath] = useState<OnboardingPath>('none');
  const [isSimulatingDigilocker, setIsSimulatingDigilocker] = useState(false);
  
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
    destination: ''
  });

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const updateData = (fields: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleDigilocker = () => {
    setIsSimulatingDigilocker(true);
    setTimeout(() => {
      updateData({
        name: 'Rohan Sharma',
        dob: '1990-05-15',
        aadhaar: 'XXXX-XXXX-1234',
        nationality: 'Indian'
      });
      setIsSimulatingDigilocker(false);
      setStep(5); // Go to medical
    }, 2000);
  };

  const finishOnboarding = async () => {
    const text = `${data.name}-${data.passport || data.aadhaar}-${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuf = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
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

      {/* Modern Floating Header with Back Button */}
      <div className="absolute top-0 left-0 right-0 pt-safe px-6 mt-4 z-[100] flex justify-between items-center">
        {step > 2 ? (
          <button 
            onClick={() => {
              if (path === 'indian' && step === 5) setStep(3);
              else if (step === 4 && path === 'indian') setStep(3); // from digilocker mock
              else setStep(s => s - 1);
            }}
            className="p-3 bg-white/40 backdrop-blur-md rounded-full text-foreground/80 hover:bg-white/60 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-11 h-11" />}
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: SPLASH */}
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

        {/* REUSABLE CARD WRAPPER FOR STEPS 2+ */}
        {step > 1 && (
          <motion.div 
            key={`step${step}`}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col justify-end z-10"
          >
            <div className="bg-white/70 backdrop-blur-3xl border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] p-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] flex flex-col h-[85vh] w-full">
              
              {/* STEP 2: WELCOME */}
              {step === 2 && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col items-center text-center justify-center py-4">
                    <div className="bg-primary/5 p-4 rounded-full mb-6">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-4xl font-serif text-foreground mb-3 leading-tight">National Tourist Safety</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 px-2">
                      An official safety infrastructure protecting travelers across India.
                    </p>
                  </div>
                  <button onClick={() => setStep(3)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-6 active:scale-95 transition-transform text-base shadow-xl">
                    Get Started
                  </button>
                </div>
              )}

              {/* STEP 3: SELECT CITIZEN TYPE */}
              {step === 3 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-10 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">Who are you?</h2>
                    <p className="text-muted-foreground text-xs px-2">Registration process differs based on citizenship.</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <button 
                      onClick={() => { setPath('indian'); setStep(4); }}
                      className="p-6 bg-white/50 backdrop-blur-xl border border-white rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-white/70 active:scale-95 transition-all shadow-sm"
                    >
                      <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <UserSquare2 className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Indian Citizen</h3>
                        <p className="text-xs text-muted-foreground">Domestic travel safety</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setPath('international'); setStep(4); }}
                      className="p-6 bg-white/50 backdrop-blur-xl border border-white rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-white/70 active:scale-95 transition-all shadow-sm"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">International Traveler</h3>
                        <p className="text-xs text-muted-foreground">Tourism & Visa integration</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 (INDIAN): DIGILOCKER */}
              {step === 4 && path === 'indian' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">Verify Identity</h2>
                    <p className="text-muted-foreground text-xs px-2">Secure verification via Government of India.</p>
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
                      {isSimulatingDigilocker ? 'Fetching DigiLocker Data...' : 'Connect with DigiLocker'}
                    </button>
                    
                    <p className="text-xs text-muted-foreground mt-6 text-center px-4">
                      By proceeding, you consent to sharing your Name, DOB, and Aadhaar status with Safara for safety monitoring.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4 (INTERNATIONAL): IDENTITY FORM */}
              {step === 4 && path === 'international' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">Traveler Identity</h2>
                    <p className="text-muted-foreground text-xs px-2">Must exactly match your passport.</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Full Name</label>
                      <input type="text" value={data.name} onChange={e => updateData({ name: e.target.value })} placeholder="John Doe" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">Date of Birth</label>
                      <input type="date" value={data.dob || ''} onChange={e => updateData({ dob: e.target.value })} className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground rounded-none px-0" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Nationality</label>
                        <input type="text" value={data.nationality} onChange={e => updateData({ nationality: e.target.value })} placeholder="USA" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Passport</label>
                        <input type="text" value={data.passport} onChange={e => updateData({ passport: e.target.value })} placeholder="A12345678" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                      </div>
                    </div>
                  </div>
                  
                  <button disabled={!data.name || !data.passport || !data.dob || !data.nationality} onClick={() => setStep(5)} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base disabled:opacity-30 disabled:active:scale-100 flex-shrink-0">
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 5: MEDICAL PROFILE (BOTH PATHS) */}
              {step === 5 && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">Emergency Profile</h2>
                    <p className="text-muted-foreground text-xs px-2">Crucial data for first responders.</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    {path === 'indian' && (
                      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-6 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-900">Identity Verified</p>
                          <p className="text-xs text-emerald-700 mt-1">DigiLocker successfully provided your identity information.</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Blood Type</label>
                      <select value={data.bloodType} onChange={e => updateData({ bloodType: e.target.value })} className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl appearance-none text-foreground rounded-none px-0">
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">Conditions & Allergies</label>
                      <textarea value={data.medical} onChange={e => updateData({ medical: e.target.value })} placeholder="E.g. Asthma, Peanut Allergy" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl min-h-[60px] text-foreground placeholder:text-muted-foreground/30 rounded-none px-0 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-4">Emergency Contact</label>
                      <input type="tel" value={data.emergencyContact} onChange={e => updateData({ emergencyContact: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                  </div>
                  
                  <button onClick={() => path === 'international' ? setStep(6) : finishOnboarding()} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base flex-shrink-0">
                    {path === 'indian' ? 'Finish Registration' : 'Continue'}
                  </button>
                </div>
              )}

              {/* STEP 6: INTERNATIONAL TRAVEL DETAILS */}
              {step === 6 && path === 'international' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6 pt-2">
                    <h2 className="text-3xl font-serif text-foreground mb-2">Travel Details</h2>
                    <p className="text-muted-foreground text-xs px-2">Information required for foreign tourists.</p>
                  </div>
                  
                  <div className="space-y-6 flex-1 overflow-y-auto pb-4 px-2 mt-4">
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Expected Stay Duration</label>
                      <input type="text" value={data.duration} onChange={e => updateData({ duration: e.target.value })} placeholder="14 Days" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">Intended Destinations</label>
                      <input type="text" value={data.destination} onChange={e => updateData({ destination: e.target.value })} placeholder="Delhi, Agra, Goa" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block mt-6">Medical Insurance (Optional)</label>
                      <input type="text" value={data.insurance} onChange={e => updateData({ insurance: e.target.value })} placeholder="Provider Name" className="w-full bg-transparent border-b-2 border-foreground/10 pb-2 outline-none focus:border-foreground transition-colors font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 rounded-none px-0" />
                    </div>
                  </div>
                  
                  <button onClick={finishOnboarding} className="w-full bg-[#111111] text-white font-medium h-14 rounded-full mt-2 shadow-xl active:scale-95 transition-transform text-base flex-shrink-0">
                    Finish Registration
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, QrCode, ScanLine, AlertTriangle, Loader2 } from 'lucide-react';

export function ImmigrationVerify() {
  const navigate = useNavigate();
  
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'failed'>('idle');

  const handleScan = () => {
    setScanState('scanning');
    
    // Simulate finding a QR code
    setTimeout(() => {
      setScanState('verifying');
      
      // Simulate backend verification
      setTimeout(() => {
        // Fetch local registration data
        const accountDataRaw = localStorage.getItem('safara_user_data');
        if (accountDataRaw) {
          JSON.parse(accountDataRaw);
          
          // Generate simulated Journey Data
          const journeyData = {
            journeyId: `IND-${Date.now().toString().slice(-6)}`,
            entryPort: 'DEL - Indira Gandhi International Airport',
            entryTime: new Date().toISOString(),
            visaExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            visaType: 'e-Tourist Visa',
            status: 'active'
          };
          
          localStorage.setItem('safara_journey_data', JSON.stringify(journeyData));
          localStorage.setItem('safara_account_status', 'verified');
          
          setScanState('success');
          
          // Navigate to dashboard after success message
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          setScanState('failed');
        }
      }, 2500);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground relative w-full pt-safe px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {scanState === 'idle' && (
          <>
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Awaiting Verification</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-12 max-w-[280px]">
              Your registration is complete. Your account will be activated after identity verification at the immigration checkpoint.
            </p>
            
            <button 
              onClick={handleScan}
              className="w-full bg-[#111111] text-white font-medium h-14 rounded-full shadow-xl active:scale-95 transition-transform text-base flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Activate Journey
            </button>
          </>
        )}

        {(scanState === 'scanning' || scanState === 'verifying') && (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 border-2 border-foreground/20 rounded-3xl overflow-hidden">
                <div className="w-full h-full bg-foreground/5 animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              <ScanLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-foreground/50" />
            </div>
            
            <h2 className="text-2xl font-serif font-bold mb-2">
              {scanState === 'scanning' ? 'Scanning QR...' : 'Verifying Identity...'}
            </h2>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {scanState === 'scanning' ? 'Point camera at Immigration QR' : 'Securing connection to Immigration API'}
            </p>
          </div>
        )}

        {scanState === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2">Verified Traveler</h2>
            <p className="text-muted-foreground text-sm">
              Immigration verification successful. Welcome to India.
            </p>
          </div>
        )}

        {scanState === 'failed' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground text-sm max-w-[280px] mb-8">
              Your registration details do not match the immigration records. Please contact the nearest Help Desk.
            </p>
            <button 
              onClick={() => setScanState('idle')}
              className="px-8 py-3 rounded-full border-2 border-border text-foreground font-bold hover:bg-foreground/5 active:scale-95 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

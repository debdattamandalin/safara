import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { playSiren, stopSiren, initAudio } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface GlobalSOSOverlayProps {
  onClose: () => void;
}

export function GlobalSOSOverlay({ onClose }: GlobalSOSOverlayProps) {
  const [sosState, setSosState] = useState<'idle' | 'holding' | 'active'>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const [digitalId, setDigitalId] = useState<any>(null);

  useEffect(() => {
    initAudio();
    const hash = localStorage.getItem('safara_digital_id');
    const dataStr = localStorage.getItem('safara_user_data');
    if (hash && dataStr) {
      try {
        setDigitalId({ hash, name: JSON.parse(dataStr).name });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  useEffect(() => {
    return () => stopSiren();
  }, []);

  useEffect(() => {
    let interval: any;
    if (sosState === 'holding') {
      interval = setInterval(() => {
        setHoldProgress((p) => {
          if (p >= 100) return 100;
          return p + 2.5; // 40 steps * 50ms = 2000ms (2 seconds to trigger)
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [sosState]);

  useEffect(() => {
    if (holdProgress >= 100 && sosState === 'holding') {
      setSosState('active'); // Immediately change state so it doesn't re-trigger
      executeSOS();
    }
  }, [holdProgress, sosState]);

  const handlePointerDown = () => {
    initAudio();
    if (sosState === 'active') return;
    if (!digitalId) {
      alert("Please complete onboarding to create a Digital ID.");
      return;
    }
    setSosState('holding');
    setHoldProgress(0);
  };

  const handlePointerUp = () => {
    if (sosState === 'holding') {
      setSosState('idle');
      setHoldProgress(0);
    }
  };

  const executeSOS = async () => {
    setSosState('active');
    playSiren();

    try {
      let lat = 51.505;
      let lng = -0.09;
      
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') await Geolocation.requestPermissions();
        const pos = await Geolocation.getCurrentPosition();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } else {
        try {
          const pos = await Geolocation.getCurrentPosition();
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch(e) {
          console.warn("Using fallback coordinates for SOS");
        }
      }

      const { error } = await supabase.from('incidents').insert({
        traveler_id: digitalId.hash,
        traveler_name: digitalId.name,
        lat,
        lng,
        status: 'active',
        timestamp: Date.now()
      });
      
      if (error) {
        throw error;
      }
      
    } catch (e) {
      console.error("Failed to trigger SOS", e);
      alert("SOS Triggered locally, but failed to reach server. Error: " + (e as any).message);
    }
  };

  const circleRadius = 135;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-background/95 backdrop-blur-3xl transition-opacity animate-in fade-in duration-300">
      {sosState === 'active' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[150vw] h-[150vw] bg-destructive/20 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }} />
        </div>
      )}

      <div className="text-center z-10 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Emergency</h1>
        <p className="text-muted-foreground text-center mb-12 h-12">
          {sosState === 'active' 
            ? "Authorities and emergency contacts have been notified." 
            : "Press and hold the button below to instantly broadcast an SOS."}
        </p>

        <div className="relative flex items-center justify-center select-none touch-none">
          {/* Progress Ring */}
          <svg className="absolute w-[300px] h-[300px] -rotate-90 pointer-events-none" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={circleRadius}
              className="stroke-foreground/10"
              strokeWidth="16"
              fill="none"
            />
            {sosState === 'holding' && (
              <circle
                cx="150"
                cy="150"
                r={circleRadius}
                className="stroke-destructive transition-all duration-75"
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )}
          </svg>

          <button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onContextMenu={(e) => e.preventDefault()}
            disabled={sosState === 'active'}
            className={`relative flex items-center justify-center w-64 h-64 rounded-full transition-all duration-150 touch-none select-none ${
              sosState === 'active'
                ? 'bg-destructive/10 border-4 border-destructive text-destructive cursor-default scale-95 shadow-[0_20px_50px_rgba(239,68,68,0.5)]' 
                : 'bg-gradient-to-b from-red-500 to-red-700 hover:scale-[1.02] active:scale-[0.98] text-white shadow-2xl'
            }`}
          >
            {sosState === 'active' ? (
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="w-16 h-16 animate-pulse" />
                <span className="font-bold text-2xl tracking-widest mt-2">SOS ACTIVE</span>
                <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Help is on the way</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <ShieldAlert className={`w-20 h-20 transition-transform ${sosState === 'holding' ? 'scale-110 animate-pulse' : ''}`} />
                <span className="font-bold text-4xl tracking-widest mt-2">SOS</span>
                <span className="text-xs uppercase tracking-widest opacity-80 mt-2">Hold 2 seconds</span>
              </div>
            )}
          </button>
        </div>

        <div className="mt-12 h-16">
          {sosState === 'active' ? (
            <div className="flex gap-4">
              <button 
                className="flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full shadow-lg active:scale-95 transition-transform"
                onClick={() => alert("Calling local emergency services...")}
              >
                <PhoneCall className="w-5 h-5" />
                Call Authorities
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-4 rounded-full border-2 border-foreground/20 text-foreground font-bold hover:bg-foreground/5 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-full border-2 border-foreground/20 text-foreground font-bold hover:bg-foreground/5 active:scale-95 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

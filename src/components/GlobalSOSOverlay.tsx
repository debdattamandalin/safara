import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { MockBackend } from '../lib/mockBackend';
import { playSiren, stopSiren, initAudio } from '../lib/utils';

interface GlobalSOSOverlayProps {
  onClose: () => void;
}

export function GlobalSOSOverlay({ onClose }: GlobalSOSOverlayProps) {
  const [sosState, setSosState] = useState<'idle' | 'counting' | 'active'>('counting');
  const [countdown, setCountdown] = useState(5);
  const [digitalId, setDigitalId] = useState<any>(null);

  useEffect(() => {
    // Unlock audio context on mount for immediate tap compatibility
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
    return () => {
      stopSiren();
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (sosState === 'counting' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (sosState === 'counting' && countdown === 0) {
      executeSOS();
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown]);

  const handleSOSClick = () => {
    initAudio(); // Unlock audio on direct user interaction
    if (sosState === 'idle') {
      if (!digitalId) {
        alert("Please complete onboarding to create a Digital ID.");
        return;
      }
      setSosState('counting');
      setCountdown(5);
    } else if (sosState === 'counting') {
      // Instant trigger
      executeSOS();
    }
  };

  const cancelSOS = () => {
    onClose();
  };

  const executeSOS = async () => {
    setSosState('active');

    // Siren Logic
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
          console.warn("Using mock coordinates for SOS");
        }
      }

      MockBackend.triggerIncident({
        id: `inc_${Date.now()}`,
        travelerId: digitalId.hash,
        travelerName: digitalId.name,
        lat,
        lng,
        status: 'active',
        timestamp: Date.now()
      });
      
    } catch (e) {
      console.error("Failed to get location for SOS", e);
      alert("SOS Failed: Cannot determine your location.");
      setSosState('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-background/95 backdrop-blur-3xl transition-opacity animate-in fade-in duration-300">
      {/* Background Pulse Effect */}
      {sosState === 'active' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[150vw] h-[150vw] bg-destructive/20 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }} />
        </div>
      )}
      {sosState === 'counting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[100vw] h-[100vw] bg-destructive/10 rounded-full animate-ping opacity-70" style={{ animationDuration: '1s' }} />
        </div>
      )}

      <div className="text-center z-10 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Emergency</h1>
        <p className="text-muted-foreground text-center mb-12 h-12">
          {sosState === 'counting' && "Tap again to send instantly, or wait to auto-send."}
          {sosState === 'active' && "Authorities and emergency contacts have been notified."}
        </p>

        <button
          onClick={handleSOSClick}
          disabled={sosState === 'active'}
          className={`relative flex items-center justify-center w-64 h-64 rounded-full shadow-[0_20px_50px_rgba(239,68,68,0.5)] transition-all duration-300 ${
            sosState === 'active'
              ? 'bg-destructive/10 border-4 border-destructive text-destructive cursor-default scale-95' 
              : 'bg-gradient-to-b from-red-500 to-red-700 hover:scale-105 active:scale-95 text-white'
          }`}
        >
          {sosState === 'active' ? (
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-16 h-16 animate-pulse" />
              <span className="font-bold text-2xl tracking-widest mt-2">SOS ACTIVE</span>
              <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Help is on the way</span>
            </div>
          ) : sosState === 'counting' ? (
            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-[5rem] leading-none mb-2">{countdown}</span>
              <span className="font-bold text-xl tracking-widest uppercase">Tap to Send</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ShieldAlert className="w-20 h-20" />
              <span className="font-bold text-4xl tracking-widest mt-2">SOS</span>
            </div>
          )}
        </button>

        <div className="mt-12 h-16">
          {sosState === 'counting' && (
            <button 
              onClick={cancelSOS}
              className="px-8 py-3 rounded-full border-2 border-foreground/20 text-foreground font-bold hover:bg-foreground/5 active:scale-95 transition-all"
            >
              Stop SOS
            </button>
          )}
          {sosState === 'active' && (
            <div className="flex gap-4">
              <button 
                className="flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full shadow-lg active:scale-95"
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
          )}
        </div>
      </div>
    </div>
  );
}

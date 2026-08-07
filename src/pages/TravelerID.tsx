import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, QrCode, UserSquare2, Plane } from 'lucide-react';
import { cn } from '../lib/utils';

export function TravelerID() {
  const [digitalIdHash, setDigitalIdHash] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<string>('indian');
  const [journeyData, setJourneyData] = useState<any>(null);

  useEffect(() => {
    const hash = localStorage.getItem('safara_digital_id');
    const data = localStorage.getItem('safara_user_data');
    const type = localStorage.getItem('safara_user_type');
    const jData = localStorage.getItem('safara_journey_data');

    if (hash && data) {
      setDigitalIdHash(hash);
      setUserData(JSON.parse(data));
      if (type) setUserType(type);
      if (jData) setJourneyData(JSON.parse(jData));
    }
  }, []);

  if (!digitalIdHash || !userData) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">No Digital ID Found</h2>
        <p className="text-muted-foreground mt-2">Please complete your onboarding to secure your identity.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-32 pt-safe mt-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Identity Profile</h1>
      </div>

      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold">Secure ID Active</h2>
        <p className="text-muted-foreground text-sm px-4">
          Your identity is verified. In an emergency, first responders can access this information.
        </p>
      </div>

      {/* Ephemeral Journey ID (Only if International and Verified) */}
      {userType === 'international' && journeyData && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-4">
            <Plane className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Journey Session</h3>
          </div>
          <div className="bg-white/40 backdrop-blur-2xl border border-emerald-500/30 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(16,185,129,0.1)] divide-y divide-white/40 relative">
            <div className="absolute top-0 right-0 p-4">
              <QrCode className="w-12 h-12 text-foreground/20" />
            </div>
            <div className="p-5 flex flex-col pt-6">
              <span className="text-muted-foreground font-medium text-xs mb-1">Journey ID (Ephemeral)</span>
              <span className="font-mono text-lg font-bold text-emerald-700">{journeyData.journeyId}</span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Visa Type</span>
              <span className="font-bold">{journeyData.visaType}</span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Port of Entry</span>
              <span className="font-bold">{journeyData.entryPort.split(' - ')[0]}</span>
            </div>
            <div className="p-5 flex items-center justify-between bg-emerald-50/50">
              <span className="text-muted-foreground font-medium">Valid Until</span>
              <span className="font-bold">{new Date(journeyData.visaExpiry).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Account ID */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 ml-4">
          <UserSquare2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Safara Account</h3>
        </div>
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] divide-y divide-white/40">
          <div className="p-5 flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Name</span>
            <span className="font-bold">{userData.name}</span>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-muted-foreground font-medium">DOB</span>
            <span className="font-bold">{userData.dob || 'Not specified'}</span>
          </div>
          <div className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">{userType === 'international' ? 'Passport' : 'Aadhaar'}</span>
              <span className="font-bold">{userData.passport || userData.aadhaar || 'Not specified'}</span>
            </div>
          </div>
          {userData.nationality && (
            <div className="p-5 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Nationality</span>
              <span className="font-bold">{userData.nationality}</span>
            </div>
          )}
          <div className="p-5 flex flex-col bg-white/30">
            <span className="text-muted-foreground font-medium text-xs mb-1">Account Hash (Persistent)</span>
            <span className="font-mono text-xs text-foreground/50 break-all">{digitalIdHash}</span>
          </div>
        </div>
      </div>

      {/* Medical Profile */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-4">Medical Profile</h3>
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] divide-y divide-white/40">
          <div className="p-5 flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Blood Group</span>
            <span className="font-bold text-rose-500">{userData.bloodType || 'Not specified'}</span>
          </div>
          <div className="p-5 flex flex-col">
            <span className="text-muted-foreground font-medium mb-1">Allergies / Conditions</span>
            <span className="font-bold">{userData.medical || 'None'}</span>
          </div>
          <div className="p-5 flex flex-col">
            <span className="text-muted-foreground font-medium mb-1">Emergency Contact</span>
            <span className="font-bold">{userData.emergencyContact || 'Not specified'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

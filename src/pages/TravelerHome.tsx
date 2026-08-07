import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { ShieldAlert, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MockBackend, type TravelerLocation } from '../lib/mockBackend';
import { cn } from '../lib/utils';
import L from 'leaflet';

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hardcoded danger zones for the demo
const DANGER_ZONES = [
  { id: 1, lat: 51.505, lng: -0.09, radius: 500, name: 'High Crime Area' }, // Default London center for demo
  { id: 2, lat: 10.2381, lng: 77.4892, radius: 1000, name: 'Landslide Prone Road' }, // Kodaikanal
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function TravelerHome() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [safetyScore, setSafetyScore] = useState(100);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [digitalId, setDigitalId] = useState<any>(null);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [userType, setUserType] = useState<string>('indian');

  useEffect(() => {
    const hash = localStorage.getItem('safara_digital_id');
    const dataStr = localStorage.getItem('safara_user_data');
    const type = localStorage.getItem('safara_user_type');
    const jData = localStorage.getItem('safara_journey_data');
    
    if (type) setUserType(type);
    if (jData) setJourneyData(JSON.parse(jData));

    if (hash && dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setDigitalId({ hash, name: data.name });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const updatePosition = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    
    // Calculate AI Score (Mock) based on distance to nearest danger zone
    let minDistance = Infinity;
    for (const zone of DANGER_ZONES) {
      const dist = calculateDistance(lat, lng, zone.lat, zone.lng);
      if (dist < minDistance) minDistance = dist;
    }

    // Score logic: 100 is perfectly safe. If distance < 2000m, score drops.
    let newScore = 100;
    if (minDistance < 2000) {
      newScore = Math.max(10, Math.floor((minDistance / 2000) * 100));
    }
    setSafetyScore(newScore);

    // Sync to mock backend
    if (digitalId) {
      MockBackend.updateLocation({
        id: digitalId.hash,
        name: digitalId.name,
        lat,
        lng,
        safetyScore: newScore,
        timestamp: Date.now()
      });
    }
  };

  const startJourney = async () => {
    if (Capacitor.isNativePlatform()) {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    }
    
    setIsTracking(true);
    
    // Initial position
    try {
      const pos = await Geolocation.getCurrentPosition();
      updatePosition(pos.coords.latitude, pos.coords.longitude);
      
      // Watch position
      const id = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (pos) updatePosition(pos.coords.latitude, pos.coords.longitude);
      });
      setWatchId(id);
    } catch (e) {
      console.warn("Geolocation failed, using fallback coordinates", e);
      // Fallback for desktop testing if GPS is blocked
      updatePosition(51.515, -0.09); // Slightly north of danger zone
    }
  };

  const stopJourney = async () => {
    setIsTracking(false);
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
  };

  const triggerSOS = () => {
    if (!digitalId || !position) return alert("Please create a Digital ID and ensure GPS is active first.");
    setSosActive(true);
    MockBackend.triggerIncident({
      id: `inc_${Date.now()}`,
      travelerId: digitalId.hash,
      travelerName: digitalId.name,
      lat: position[0],
      lng: position[1],
      status: 'active',
      timestamp: Date.now()
    });
    alert("SOS TRIGGERED! Emergency contacts and local authorities have been notified.");
  };

  if (!digitalId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">No Digital ID Found</h2>
        <p className="text-muted-foreground mt-2">You must create a Secure Digital ID before starting a journey.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Map View */}
      <div className="flex-1 bg-secondary relative">
        {position ? (
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Draw Danger Zones */}
            {DANGER_ZONES.map(zone => (
              <Circle 
                key={zone.id}
                center={[zone.lat, zone.lng]} 
                radius={zone.radius} 
                pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.3 }} 
              >
                <Popup>{zone.name}</Popup>
              </Circle>
            ))}

            {/* Current Position */}
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground font-medium">Acquiring GPS Signal...</p>
          </div>
        )}

        {/* Welcome / Journey Status Banner */}
        {userType === 'international' && journeyData && !isTracking && (
          <div className="absolute top-0 left-0 right-0 z-[400] pt-safe px-6 mt-4 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-2xl border border-border/50 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-none">Verified through Immigration</h3>
                  <p className="text-xs text-muted-foreground mt-1">Welcome to India!</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-foreground/5 p-3 rounded-2xl">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Stay Valid Until</p>
                  <p className="font-bold text-emerald-700">{new Date(journeyData.visaExpiry).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Entry Port</p>
                  <p className="font-bold truncate">{journeyData.entryPort.split(' - ')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating AI Score Overlay */}
        {isTracking && (
          <div className="absolute top-0 left-6 right-6 z-[400] flex justify-center pointer-events-none pt-safe mt-4">
            <div className={cn(
              "bg-card/90 backdrop-blur-2xl border p-4 rounded-3xl shadow-2xl pointer-events-auto transition-colors flex items-center justify-between w-full max-w-sm",
              safetyScore > 70 ? "border-emerald-500/30" : safetyScore > 30 ? "border-yellow-500/30" : "border-destructive/50 shadow-destructive/20"
            )}>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Safety Score</p>
                {safetyScore < 40 && (
                  <p className="text-xs text-destructive font-bold">Approaching Risk Zone</p>
                )}
                {safetyScore >= 40 && (
                  <p className="text-xs text-foreground font-medium">Environment is stable</p>
                )}
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-2xl">
                <div className={cn(
                  "text-3xl font-black font-display",
                  safetyScore > 70 ? "text-emerald-500" : safetyScore > 30 ? "text-yellow-500" : "text-destructive"
                )}>
                  {safetyScore}
                </div>
                {safetyScore < 40 ? (
                  <AlertTriangle className="text-destructive w-5 h-5 animate-pulse" />
                ) : (
                  <ShieldCheck className="text-emerald-500 w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="absolute bottom-28 left-6 right-6 z-[400] flex flex-col gap-4 max-w-sm mx-auto">
          {!isTracking ? (
            <button 
              onClick={startJourney}
              className="w-full h-16 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/30 font-bold flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Navigation className="w-6 h-6 fill-primary-foreground" /> Start Journey
            </button>
          ) : (
            <>
              <button 
                onClick={triggerSOS}
                disabled={sosActive}
                className={cn(
                  "w-full h-16 rounded-full font-bold flex items-center justify-center gap-3 text-lg transition-all active:scale-95",
                  sosActive 
                    ? "bg-destructive/10 text-destructive border-2 border-destructive/20" 
                    : "bg-destructive text-white hover:bg-destructive/90 shadow-2xl shadow-destructive/40"
                )}
              >
                <ShieldAlert className="w-6 h-6" /> {sosActive ? "SOS SENT" : "EMERGENCY SOS"}
              </button>
              <button 
                onClick={stopJourney}
                className="w-full h-14 bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl text-foreground rounded-full font-bold flex items-center justify-center hover:bg-card active:scale-95 transition-all"
              >
                End Journey
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

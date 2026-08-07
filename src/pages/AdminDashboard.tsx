import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { ShieldAlert, Fingerprint, CheckCircle2 } from 'lucide-react';
import { MockBackend, type Incident, type TravelerLocation } from '../lib/mockBackend';
import { cn } from '../lib/utils';
import L from 'leaflet';

// Danger Zones matching Traveler view
const DANGER_ZONES = [
  { id: 1, lat: 51.505, lng: -0.09, radius: 500, name: 'High Crime Area' },
  { id: 2, lat: 10.2381, lng: 77.4892, radius: 1000, name: 'Landslide Prone Road' },
];

export function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [locations, setLocations] = useState<Record<string, TravelerLocation>>({});
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    // Load initial state
    const { incidents: initialIncidents, locations: initialLocations } = MockBackend.getInitialState();
    setIncidents(initialIncidents);
    setLocations(initialLocations);

    // Subscribe to real-time events
    const unsubscribe = MockBackend.subscribe((msg) => {
      if (msg.type === 'LOCATION_UPDATE') {
        setLocations(prev => ({ ...prev, [msg.payload.id]: msg.payload }));
      } else if (msg.type === 'INCIDENT_TRIGGER') {
        setIncidents(prev => {
          const exists = prev.find(i => i.id === msg.payload.id);
          if (exists) return prev;
          // Play alert sound for new incident
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Audio play blocked by browser", e));
          return [msg.payload, ...prev];
        });
      } else if (msg.type === 'INCIDENT_RESOLVE') {
        setIncidents(prev => prev.map(inc => 
          inc.id === msg.payload.id ? { ...inc, status: 'resolved' } : inc
        ));
        if (selectedIncident?.id === msg.payload.id) {
          setSelectedIncident(prev => prev ? { ...prev, status: 'resolved' } : null);
        }
      }
    });

    return unsubscribe;
  }, [selectedIncident]);

  const activeIncidents = incidents.filter(i => i.status === 'active');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

  const handleResolve = (id: string) => {
    MockBackend.resolveIncident(id);
  };

  // Center map on latest active incident or default
  const mapCenter: [number, number] = activeIncidents.length > 0 
    ? [activeIncidents[0].lat, activeIncidents[0].lng] 
    : [51.505, -0.09];

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar: Incident Feed */}
      <div className="w-96 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-card/50 flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            Active Emergencies
          </h3>
          <span className="px-2.5 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded-full">
            {activeIncidents.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeIncidents.length === 0 ? (
            <div className="text-center text-muted-foreground p-8 flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-2" />
              <p>No active incidents.</p>
              <p className="text-xs">Monitoring all travelers...</p>
            </div>
          ) : (
            activeIncidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  selectedIncident?.id === inc.id 
                    ? "border-destructive bg-destructive/5 ring-1 ring-destructive" 
                    : "border-border bg-background hover:border-destructive/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{inc.travelerName}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(inc.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-secondary px-2 py-1 rounded w-fit mb-3 text-muted-foreground">
                  <Fingerprint className="w-3 h-3" />
                  {inc.travelerId.substring(0, 12)}...
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleResolve(inc.id); }}
                    className="flex-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold py-1.5 rounded-lg transition-colors"
                  >
                    Resolve
                  </button>
                  <button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold py-1.5 rounded-lg transition-colors">
                    Dispatch Unit
                  </button>
                </div>
              </div>
            ))
          )}

          {resolvedIncidents.length > 0 && (
            <div className="pt-4 border-t border-border mt-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recently Resolved</h4>
              <div className="space-y-2">
                {resolvedIncidents.slice(0, 3).map(inc => (
                  <div key={inc.id} className="p-3 bg-secondary rounded-lg flex justify-between items-center opacity-70">
                    <span className="font-medium text-sm">{inc.travelerName}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden relative shadow-sm">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Danger Zones */}
          {DANGER_ZONES.map(zone => (
            <Circle 
              key={zone.id}
              center={[zone.lat, zone.lng]} 
              radius={zone.radius} 
              pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.1, dashArray: '4' }} 
            >
              <Popup>{zone.name} (Risk Zone)</Popup>
            </Circle>
          ))}

          {/* Traveler Locations */}
          {Object.values(locations).map(loc => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="font-bold">{loc.name}</div>
                <div className="text-xs">Safety Score: {loc.safetyScore}</div>
              </Popup>
            </Marker>
          ))}

          {/* Active Incident Markers (Red Alert) */}
          {activeIncidents.map(inc => (
            <Circle 
              key={`alert-${inc.id}`}
              center={[inc.lat, inc.lng]} 
              radius={100} 
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.8 }} 
            >
              <Popup>
                <strong className="text-destructive">EMERGENCY SOS</strong><br/>
                Traveler: {inc.travelerName}
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        {/* Selected Incident Details Panel */}
        {selectedIncident && selectedIncident.status === 'active' && (
          <div className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-md border border-destructive/30 rounded-2xl shadow-2xl z-[400] overflow-hidden">
            <div className="bg-destructive text-white p-3 flex justify-between items-center">
              <span className="font-bold flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> SOS Details</span>
              <button onClick={() => setSelectedIncident(null)} className="opacity-70 hover:opacity-100 text-sm">Close</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Verified Identity</p>
                <p className="font-bold">{selectedIncident.travelerName}</p>
                <p className="text-[10px] font-mono text-muted-foreground break-all mt-1">{selectedIncident.travelerId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-secondary p-2 rounded">
                  <p className="text-[10px] text-muted-foreground">LATITUDE</p>
                  <p className="font-medium">{selectedIncident.lat.toFixed(4)}</p>
                </div>
                <div className="bg-secondary p-2 rounded">
                  <p className="text-[10px] text-muted-foreground">LONGITUDE</p>
                  <p className="font-medium">{selectedIncident.lng.toFixed(4)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleResolve(selectedIncident.id)}
                className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

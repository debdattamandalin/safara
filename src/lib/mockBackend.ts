// This simulates a real-time backend like Supabase
// by using the BroadcastChannel API to send messages between browser tabs.

export type TravelerLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  safetyScore: number;
  timestamp: number;
};

export type Incident = {
  id: string;
  travelerId: string;
  travelerName: string;
  lat: number;
  lng: number;
  status: 'active' | 'resolved';
  timestamp: number;
};

// Create the broadcast channel
const channel = new BroadcastChannel('safara_mock_backend');

type Message = 
  | { type: 'LOCATION_UPDATE'; payload: TravelerLocation }
  | { type: 'INCIDENT_TRIGGER'; payload: Incident }
  | { type: 'INCIDENT_RESOLVE'; payload: { id: string } };

export const MockBackend = {
  // Publish a location update to all listeners
  updateLocation: (location: TravelerLocation) => {
    channel.postMessage({ type: 'LOCATION_UPDATE', payload: location });
    // Also save to localStorage for persistence across reloads
    const locations = JSON.parse(localStorage.getItem('safara_locations') || '{}');
    locations[location.id] = location;
    localStorage.setItem('safara_locations', JSON.stringify(locations));
  },

  // Publish an SOS incident
  triggerIncident: (incident: Incident) => {
    channel.postMessage({ type: 'INCIDENT_TRIGGER', payload: incident });
    const incidents = JSON.parse(localStorage.getItem('safara_incidents') || '[]');
    incidents.push(incident);
    localStorage.setItem('safara_incidents', JSON.stringify(incidents));
  },

  // Resolve an SOS incident
  resolveIncident: (id: string) => {
    channel.postMessage({ type: 'INCIDENT_RESOLVE', payload: { id } });
    const incidents = JSON.parse(localStorage.getItem('safara_incidents') || '[]');
    const updated = incidents.map((inc: Incident) => 
      inc.id === id ? { ...inc, status: 'resolved' } : inc
    );
    localStorage.setItem('safara_incidents', JSON.stringify(updated));
  },

  // Subscribe to all events
  subscribe: (callback: (msg: Message) => void) => {
    const handler = (event: MessageEvent) => callback(event.data);
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  },

  // Get current state from localStorage
  getInitialState: () => {
    return {
      locations: JSON.parse(localStorage.getItem('safara_locations') || '{}') as Record<string, TravelerLocation>,
      incidents: JSON.parse(localStorage.getItem('safara_incidents') || '[]') as Incident[],
    };
  }
};

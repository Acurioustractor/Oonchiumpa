import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for primary location (Alice Springs/Atnarpa)
const primaryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#D97706" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom icon for communities
const communityIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#059669" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#fff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

interface Location {
  name: string;
  coordinates: [number, number];
  language?: string;
  participants?: number;
  description?: string;
  type: 'primary' | 'community' | 'atnarpa';
}

const locations: Location[] = [
  {
    name: 'Alice Springs (Mparntwe)',
    coordinates: [-23.6980, 133.8807],
    participants: 19,
    description: 'Primary service hub - Oonchiumpa headquarters',
    type: 'primary'
  },
  {
    name: 'Atnarpa Homestead (Loves Creek Station)',
    coordinates: [-23.4, 134.3],
    description: 'On-country healing and cultural learning center on Traditional Eastern Arrernte country',
    type: 'atnarpa'
  },
  {
    name: 'Hermannsburg (Ntaria)',
    coordinates: [-23.9423, 132.7695],
    language: 'Western Arrernte',
    description: 'Western Arrernte community',
    type: 'community'
  },
  {
    name: 'Santa Teresa (Ltyentye Apurte)',
    coordinates: [-24.1333, 134.3833],
    language: 'Eastern Arrernte',
    description: 'Eastern Arrernte community',
    type: 'community'
  },
  {
    name: 'Papunya',
    coordinates: [-23.2167, 131.9167],
    language: 'Luritja',
    description: 'Luritja community',
    type: 'community'
  },
  {
    name: 'Kintore (Walungurru)',
    coordinates: [-23.1667, 129.3833],
    language: 'Pitjantjatjara',
    description: 'Pitjantjatjara community - 500km west of Alice Springs',
    type: 'community'
  },
  {
    name: 'Yuendumu',
    coordinates: [-22.2556, 131.7911],
    language: 'Warlpiri',
    description: 'Warlpiri community - 290km northwest of Alice Springs',
    type: 'community'
  },
  {
    name: 'Yuelamu (Mt Allan)',
    coordinates: [-22.2667, 132.3333],
    language: 'Anmatyerr',
    description: 'Anmatyerr community',
    type: 'community'
  }
];

export const GeographicReachMap: React.FC = () => {
  // Center on Alice Springs with zoom to show all communities
  const center: [number, number] = [-23.5, 132.5];
  const zoom = 7;

  return (
    <div className="bg-gradient-to-br from-earth-50 to-sand-50 rounded-2xl p-8 border border-earth-200">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-earth-900 mb-2">Geographic Reach</h3>
        <p className="text-earth-600">Serving Aboriginal communities across Central Australia</p>
      </div>

      {/* Map Container */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-6" style={{ height: '500px' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Service radius circle around Alice Springs */}
          <Circle
            center={[-23.6980, 133.8807]}
            radius={150000} // 150km radius
            pathOptions={{
              color: '#D97706',
              fillColor: '#FED7AA',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '5, 10'
            }}
          />

          {/* Location markers */}
          {locations.map((location, idx) => (
            <Marker
              key={idx}
              position={location.coordinates}
              icon={location.type === 'primary' ? primaryIcon : location.type === 'atnarpa' ? primaryIcon : communityIcon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-earth-900 text-base mb-1">
                    {location.name}
                  </h4>
                  {location.language && (
                    <p className="text-sm text-earth-700 mb-1">
                      <span className="font-semibold">Language:</span> {location.language}
                    </p>
                  )}
                  {location.participants && (
                    <p className="text-sm text-ochre-600 font-bold mb-1">
                      {location.participants} active participants
                    </p>
                  )}
                  {location.description && (
                    <p className="text-xs text-earth-600 mt-1">
                      {location.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legend */}
        <div className="bg-white rounded-lg p-4 border border-earth-200">
          <h4 className="font-semibold text-earth-900 mb-3">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ochre-500 to-ochre-700 border-2 border-white"></div>
              <span className="text-earth-700">Service Hub & Atnarpa Homestead</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-eucalyptus-600 border-2 border-white"></div>
              <span className="text-earth-700">Remote Communities Served</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-ochre-500"></div>
              <span className="text-earth-700">150km Service Radius</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-ochre-50 to-eucalyptus-50 rounded-lg p-4 border border-ochre-200">
          <h4 className="font-semibold text-earth-900 mb-3">Coverage Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-ochre-600">7</div>
              <div className="text-xs text-earth-700">Language Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ochre-600">8</div>
              <div className="text-xs text-earth-700">Communities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ochre-600">500km</div>
              <div className="text-xs text-earth-700">Max Distance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ochre-600">19</div>
              <div className="text-xs text-earth-700">Alice Springs Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Groups List */}
      <div className="mt-6 bg-white rounded-lg p-6 border border-earth-200">
        <h4 className="font-semibold text-earth-900 mb-4 text-center">Language Groups Represented</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            'Western Arrernte',
            'Eastern Arrernte',
            'Warlpiri',
            'Luritja',
            'Pitjantjatjara',
            'Anmatyerr',
            'Pertame'
          ].map((language, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-gradient-to-r from-eucalyptus-50 to-sand-50 border border-eucalyptus-200 rounded-full text-sm font-medium text-earth-700"
            >
              {language}
            </span>
          ))}
        </div>
      </div>

      {/* Key Locations Detail */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-ochre-500 to-ochre-700 rounded-lg p-6 text-white">
          <div className="text-3xl mb-2">🏛️</div>
          <h4 className="font-bold text-lg mb-2">Alice Springs Hub</h4>
          <p className="text-ochre-50 text-sm mb-3">
            Oonchiumpa's primary office and service delivery base in the heart of Mparntwe
          </p>
          <div className="text-2xl font-bold">19 active clients</div>
        </div>

        <div className="bg-gradient-to-br from-eucalyptus-500 to-eucalyptus-700 rounded-lg p-6 text-white">
          <div className="text-3xl mb-2">🏡</div>
          <h4 className="font-bold text-lg mb-2">Atnarpa Homestead</h4>
          <p className="text-eucalyptus-50 text-sm mb-3">
            On-country healing center on Loves Creek Station - Traditional Eastern Arrernte country
          </p>
          <div className="text-sm font-medium">1.5 hours east of Alice Springs</div>
        </div>
      </div>
    </div>
  );
};

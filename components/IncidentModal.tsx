import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Share2, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { ManagedIncident, IncidentStatus } from '../types';
import { CATEGORY_CONFIG, SUBTYPE_MAPPING } from '../constants';

declare const mapboxgl: any;

interface IncidentModalProps {
  incident: ManagedIncident | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ incident, onClose, onUpdateStatus }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const mapToken = 'pk.eyJ1IjoicmF5MTExMzIwMDIiLCJhIjoiY2tvY3kwb3Y5MmliZDJub24wdnpjMTB5NiJ9.kPPmudTylSbhH27w2lwsoQ';

  // Initialize map when incident changes
  useEffect(() => {
    setMapError(false); // Reset error state on new incident

    if (!incident || !mapContainer.current) return;

    // DELAY: Wait for modal animation to complete before initializing map
    // This often fixes "height 0" or context issues in popups
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      if (typeof mapboxgl === 'undefined') {
        setMapError(true);
        return;
      }

      try {
        mapboxgl.accessToken = mapToken;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11', // Safe for v1
          center: [incident.location.x, incident.location.y],
          zoom: 15,
          interactive: true,
          attributionControl: false
        });

        // Add a simple default marker for the incident
        new mapboxgl.Marker({ color: '#EF4444' })
          .setLngLat([incident.location.x, incident.location.y])
          .addTo(newMap);

        // Disable scroll zoom so it doesn't interfere with modal scrolling
        newMap.scrollZoom.disable();
        newMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

        map.current = newMap;
      } catch (e) {
        console.error("Error initializing modal map:", e);
        setMapError(true);
      }
    }, 300); // 300ms delay matches typical modal transition times

    return () => {
      clearTimeout(timer);
      map.current?.remove();
      map.current = null;
    };
  }, [incident]);

  if (!incident) return null;

  const config = CATEGORY_CONFIG[incident.type] || CATEGORY_CONFIG.default;
  const SubTypeIcon = config.icon;
  const readableSubtype = incident.subtype ? (SUBTYPE_MAPPING[incident.subtype] || incident.subtype) : incident.type;

  // Waze coordinates are x=Lon, y=Lat
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${incident.location.y},${incident.location.x}`;

  // Static Map URL for fallback
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+ef4444(${incident.location.x},${incident.location.y})/${incident.location.x},${incident.location.y},15,0/800x400?access_token=${mapToken}`;

  const handleCopy = () => {
    const text = `
INCIDENT REPORT
Type: ${readableSubtype}
Location: ${incident.street || 'Unknown'}, ${incident.city || ''}
Reliability: ${incident.reliability}/10
Coords: ${incident.location.y}, ${incident.location.x}
    `.trim();
    navigator.clipboard.writeText(text);
    alert("Incident details copied to clipboard!");
  };

  const handleWhatsApp = () => {
    const message = `*Incident Report*\n\n🚨 *Type:* ${readableSubtype}\n📍 *Location:* ${incident.street || 'Unknown Street'}, ${incident.city || ''}\n🛡️ *Reliability:* ${incident.reliability}/10\n\n🔗 *Map:* ${googleMapsUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`p-6 ${config.bg} border-b border-gray-100 flex justify-between items-start`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white shadow-sm ${config.color}`}>
              <SubTypeIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{readableSubtype}</h2>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin size={14} className="mr-1" />
                {incident.city || 'Unknown City'}, {incident.country || 'N/A'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Status Actions */}
          {/* Status Actions Removed */}

          {/* Map Section */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-48 bg-gray-100 relative group">
            {mapError ? (
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative cursor-pointer">
                <img
                  src={staticMapUrl}
                  alt="Incident Location Map"
                  className="w-full h-full object-cover transition-opacity hover:opacity-90"
                />
                {/* Removed the overlay text here as requested */}
              </a>
            ) : (
              <div ref={mapContainer} className="absolute inset-0" />
            )}
          </div>

          {/* External Map Link (Moved here) */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-white">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Open in Google Maps</span>
                <span className="text-xs text-gray-500">Directions & Navigation</span>
              </div>
            </div>
            <ExternalLink size={18} className="text-gray-400 group-hover:text-blue-500" />
          </a>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</h3>

            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-600">Location</span>
              <span className="font-medium text-gray-900 text-right">{incident.street || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-600">Reliability Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(incident.reliability || 0) * 10}%` }}
                  />
                </div>
                <span className="font-bold text-gray-900">{incident.reliability}/10</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="text-gray-600">User Reports</span>
              <span className="font-medium text-gray-900">{incident.nThumbsUp} 👍</span>
            </div>

            <div className="flex justify-between items-center py-2 last:border-0">
              <span className="text-gray-600">Reported</span>
              <span className="font-medium text-gray-900">
                {new Date(incident.pubMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Copy size={18} />
            Copy Info
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#20bd5a] transition-colors shadow-sm shadow-green-200"
          >
            <Share2 size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
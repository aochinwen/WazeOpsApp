
import React, { useEffect, useRef, useState } from 'react';
import { ManagedIncident, WazeTrafficJam } from '../types';
import { CATEGORY_CONFIG, JAM_LEVEL_COLORS, JAM_DESCRIPTIONS } from '../constants';
import { createRoot } from 'react-dom/client';
import { AlertTriangle } from 'lucide-react';

declare const mapboxgl: any;

interface IncidentMapProps {
  incidents: ManagedIncident[];
  trafficData?: WazeTrafficJam[];
  onSelect: (incident: ManagedIncident) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({ incidents, trafficData = [], onSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const popup = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapToken = 'pk.eyJ1IjoicmF5MTExMzIwMDIiLCJhIjoiY2tvY3kwb3Y5MmliZDJub24wdnpjMTB5NiJ9.kPPmudTylSbhH27w2lwsoQ';

  useEffect(() => {
    if (!mapContainer.current) return;
    if (typeof mapboxgl === 'undefined') {
        setMapError(true);
        return;
    }

    let resizeObserver: ResizeObserver | null = null;

    try {
        mapboxgl.accessToken = mapToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          // Use streets-v11 which is fully compatible with Mapbox GL JS v1
          style: 'mapbox://styles/mapbox/light-v11', 
          center: [103.8198, 1.3521], // Singapore default
          zoom: 11
        });

        // Fix for map size issue: Watch container size changes
        resizeObserver = new ResizeObserver(() => {
            map.current?.resize();
        });
        resizeObserver.observe(mapContainer.current);

        map.current.on('load', () => {
            // Force a resize calculation once loaded
            map.current.resize();

            // Add Traffic Source
            if (!map.current.getSource('traffic-source')) {
                map.current.addSource('traffic-source', {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] }
                });
            }

            // Add Traffic Layer
            if (!map.current.getLayer('traffic-layer')) {
                map.current.addLayer({
                    id: 'traffic-layer',
                    type: 'line',
                    source: 'traffic-source',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-width': 8, // Thicker lines for better visibility
                        'line-color': [
                            'match',
                            ['get', 'level'],
                            0, JAM_LEVEL_COLORS[0],
                            1, JAM_LEVEL_COLORS[1],
                            2, JAM_LEVEL_COLORS[2],
                            3, JAM_LEVEL_COLORS[3],
                            4, JAM_LEVEL_COLORS[4],
                            5, JAM_LEVEL_COLORS[5],
                            '#888888' // default fallback
                        ],
                        'line-opacity': 0.8
                    }
                });
            }
            
            // Mouse Enter for Hover Effect
            map.current.on('mouseenter', 'traffic-layer', (e: any) => {
                map.current.getCanvas().style.cursor = 'pointer';

                const feature = e.features[0];
                const level = feature.properties.level;
                const street = feature.properties.street;
                const description = JAM_DESCRIPTIONS[level] || 'Unknown Condition';

                // Create popup
                if (popup.current) popup.current.remove();
                
                popup.current = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: 10
                })
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div class="px-3 py-2 min-w-[200px]">
                        <div class="font-bold text-gray-900 text-sm mb-1 border-b border-gray-100 pb-1">${street || 'Unknown Road'}</div>
                        <div class="flex items-center gap-2 mt-1">
                             <div class="w-3 h-3 rounded-full" style="background-color: ${JAM_LEVEL_COLORS[level] || '#999'}"></div>
                             <span class="text-sm font-semibold text-gray-800">Level ${level}</span>
                             <span class="text-sm text-gray-600">${description}</span>
                        </div>
                    </div>
                `)
                .addTo(map.current);
            });

            // Mouse Leave to remove popup
            map.current.on('mouseleave', 'traffic-layer', () => {
                map.current.getCanvas().style.cursor = '';
                if (popup.current) {
                    popup.current.remove();
                    popup.current = null;
                }
            });

            setIsMapLoaded(true);
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Error handling for map load
        map.current.on('error', (e: any) => {
            console.error("Mapbox error:", e);
        });

    } catch (error) {
        console.error("Error initializing map:", error);
        setMapError(true);
    }

    return () => {
      resizeObserver?.disconnect();
      if (popup.current) popup.current.remove();
      map.current?.remove();
    };
  }, []);

  // Update Traffic Layer - Runs when trafficData changes AND map is loaded
  useEffect(() => {
      if (!map.current || !isMapLoaded || mapError) return;

      const source = map.current.getSource('traffic-source');
      if (source) {
          const features = trafficData.map(jam => ({
              type: 'Feature',
              properties: {
                  // Ensure level is treated as a number for the match expression
                  level: typeof jam.level !== 'undefined' ? Number(jam.level) : 0,
                  speed: jam.speedKMH,
                  delay: jam.delay,
                  street: jam.street
              },
              geometry: {
                  type: 'LineString',
                  coordinates: jam.line.map(pt => [pt.x, pt.y])
              }
          }));

          source.setData({
              type: 'FeatureCollection',
              features: features
          });
      }
  }, [trafficData, isMapLoaded, mapError]);

  // Update markers when incidents change
  useEffect(() => {
    if (!map.current || mapError) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (incidents.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    incidents.forEach(incident => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      
      const config = CATEGORY_CONFIG[incident.type] || CATEGORY_CONFIG.default;
      const Icon = config.icon;
      
      // Render React component into the marker element
      const root = createRoot(el);
      root.render(
        <div 
            className={`p-2 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform ${config.bg} ${config.color}`}
            title={`${config.label}: ${incident.street}`}
        >
            <Icon size={16} />
        </div>
      );

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.location.x, incident.location.y])
        .addTo(map.current);

      // Add click listener
      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent map click
        onSelect(incident);
        
        // Fly to location
        map.current.flyTo({
            center: [incident.location.x, incident.location.y],
            zoom: 15,
            essential: true
        });
      });

      markers.current.push(marker);
      bounds.extend([incident.location.x, incident.location.y]);
    });

    // Fit map to bounds if we have incidents
    if (incidents.length > 0) {
      try {
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
      } catch (e) {
          console.warn("Could not fit bounds", e);
      }
    }
  }, [incidents, onSelect, mapError]);

  if (mapError) {
      // Fallback Static Map Construction
      let staticUrl = '';
      if (incidents.length > 0) {
          // Limit to 15 markers to prevent URL overflow and use simple pin style
          const markers = incidents.slice(0, 15).map(inc => {
              const config = CATEGORY_CONFIG[inc.type] || CATEGORY_CONFIG.default;
              // Mapbox static API colors must be hex without hash
              const color = config.hex.replace('#', '');
              return `pin-s+${color}(${inc.location.x},${inc.location.y})`;
          }).join(',');
          
          staticUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${markers}/auto/1000x600?access_token=${mapToken}`;
      } else {
          // Default view (Singapore)
          staticUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/103.8198,1.3521,11,0/1000x600?access_token=${mapToken}`;
      }

      return (
          <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative bg-gray-100 group">
              <img 
                  src={staticUrl} 
                  alt="Static Map Fallback" 
                  className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 p-4 text-center backdrop-blur-[1px]">
                   <div className="bg-white/90 p-5 rounded-2xl shadow-lg max-w-sm backdrop-blur-sm border border-white/50">
                       <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                           <AlertTriangle className="w-6 h-6 text-orange-600" />
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-1">Interactive Map Unavailable</h3>
                       <p className="text-sm text-gray-600 mb-3">
                           A static preview is shown due to environment restrictions.
                       </p>
                       {incidents.length > 15 && (
                           <p className="text-xs text-gray-500 font-medium bg-gray-100 py-1 px-3 rounded-full inline-block">
                               Showing top 15 of {incidents.length} incidents
                           </p>
                       )}
                   </div>
              </div>
          </div>
      );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
        <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

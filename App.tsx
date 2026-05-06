
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Search, ListFilter, LayoutDashboard, Map as MapIcon, Layers, Camera } from 'lucide-react';
import { fetchWazeIncidents, fetchTrafficView, fetchTrafficCameras } from './services/wazeService';
import { subscribeToCctvHealth } from './services/cctvHealthService';
import { ManagedIncident, IncidentStatus, FilterCategory, WazeTrafficJam, CctvHealthRecord } from './types';
import { FeedSelector } from './components/FeedSelector';
import { CATEGORY_CONFIG, SUBTYPE_MAPPING, DEMO_ALERTS, FEED_SOURCES, FEED_POLL_INTERVAL_MS, NSC_SMART_VMS_CCTV_CAMERAS, NSC_CCTV_CAMERAS } from './constants';
import { IncidentModal } from './components/IncidentModal';
import { IncidentFilter } from './components/IncidentFilter';
import { IncidentStats } from './components/IncidentStats';
import { IncidentMap } from './components/IncidentMap';
import { ToastContainer, ToastMessage, ToastType } from './components/Toast';

function App() {
  const { incidentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<ManagedIncident[]>([]);
  const [trafficData, setTrafficData] = useState<WazeTrafficJam[]>([]);
  // Ref always reflects the latest activeFeedIds so async callbacks can guard against stale results
  const activeFeedIdsRef = useRef<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTraffic, setLoadingTraffic] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showCameras, setShowCameras] = useState(false);
  const [cctvHealth, setCctvHealth] = useState<Record<string, CctvHealthRecord>>({});
  const cctvHealthUnsubRef = useRef<(() => void) | null>(null);

  const [selectedIncident, setSelectedIncident] = useState<ManagedIncident | null>(null);
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID' | 'MAP'>('MAP');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Feed State
  const [activeFeedIds, setActiveFeedIds] = useState<string[]>(() => {

    const getSourceFromStr = (searchStr: string) => new URLSearchParams(searchStr).get('source');

    let srcStr = getSourceFromStr(location.search);
    if (!srcStr && window.location.hash.includes('?')) {
      const hashSearch = window.location.hash.split('?')[1];
      srcStr = new URLSearchParams(hashSearch).get('source');
    }

    if (srcStr) {
      const ids = srcStr.split(',').filter(id => FEED_SOURCES.some(s => s.id === id));
      if (ids.length > 0) {
        console.log(`[App] Initializing with feeds: ${ids.join(', ')}`);
        return ids;
      }
    }
    console.log(`[App] Initializing with default feed: ${FEED_SOURCES[1].id}`);
    return [FEED_SOURCES[1].id];
  });
  const [customFeedUrl, setCustomFeedUrl] = useState<string>('');
  // Keep ref in sync so async closures can read the latest value
  useEffect(() => {
    activeFeedIdsRef.current = activeFeedIds;
  }, [activeFeedIds]);

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const processData = (newData: ManagedIncident[]) => {
    setIncidents(prev => {
      const prevEntries: [string, ManagedIncident][] = prev.map(item => [item.uuid, item]);
      const prevMap = new Map<string, ManagedIncident>(prevEntries);

      return newData.map(newItem => {
        const existing = prevMap.get(newItem.uuid);
        if (existing) {
          return { ...newItem, status: existing.status };
        }
        return newItem;
      });
    });
  };

  const getEffectiveFeedUrls = useCallback((): string[] => {
    return activeFeedIds.flatMap(id => {
      if (id === 'custom') return customFeedUrl ? [customFeedUrl] : [];
      const source = FEED_SOURCES.find(s => s.id === id);
      return source && source.url ? [source.url] : [];
    });
  }, [activeFeedIds, customFeedUrl]);

  const getEffectiveTrafficUrls = useCallback((): string[] => {
    return activeFeedIds.flatMap(id => {
      const source = FEED_SOURCES.find(s => s.id === id);
      return source && source.tvtUrl ? [source.tvtUrl] : [];
    });
  }, [activeFeedIds]);

  const loadData = async (isManual = false) => {
    const urls = getEffectiveFeedUrls();
    if (urls.length === 0) {
      if (activeFeedIds.includes('custom') && isManual) {
        addToast("Please enter a valid feed URL", 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const settled = await Promise.allSettled(urls.map(url => fetchWazeIncidents(url)));
      // Guard: discard result if feeds were cleared while request was in-flight
      if (activeFeedIdsRef.current.length === 0) return;

      const failedCount = settled.filter(r => r.status === 'rejected').length;
      if (failedCount > 0) {
        console.warn(`[Feed] ${failedCount}/${urls.length} feed(s) failed to load`);
        settled.forEach((r, i) => {
          if (r.status === 'rejected') console.warn(`  Feed ${i + 1} (${urls[i]}): ${r.reason}`);
        });
        if (failedCount === urls.length) {
          addToast(`All ${urls.length} feed(s) failed to load`, 'error');
        } else {
          addToast(`${failedCount} of ${urls.length} feed(s) failed — showing partial data`, 'error');
        }
      }

      const allIncidents = settled
        .filter((r): r is PromiseFulfilledResult<ManagedIncident[]> => r.status === 'fulfilled')
        .flatMap(r => r.value);

      if (allIncidents.length > 0 || failedCount < urls.length) {
        const merged = Array.from(
          new Map(allIncidents.map(item => [item.uuid, item])).values()
        ) as ManagedIncident[];
        processData(merged);
        if (isManual && failedCount === 0) {
          addToast("Feed updated successfully", 'success');
        }
        loadTrafficData();
      } else if (incidents.length === 0) {
        addToast("Loaded demo data for visualization", 'info');
        const demoData = DEMO_ALERTS.map(alert => ({
          ...alert,
          reportRating: alert.reportRating,
          nThumbsUp: alert.nThumbsUp,
          status: IncidentStatus.NEW
        } as ManagedIncident));
        processData(demoData);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTrafficData = async () => {
    const tvtUrls = getEffectiveTrafficUrls();
    if (tvtUrls.length === 0) return;

    setLoadingTraffic(true);
    try {
      const settled = await Promise.allSettled(tvtUrls.map(url => fetchTrafficView(url)));
      // Guard: discard result if feeds were cleared while request was in-flight
      if (activeFeedIdsRef.current.length === 0) return;

      settled.forEach((r, i) => {
        if (r.status === 'rejected') console.warn(`[Traffic] TVT feed ${i + 1} (${tvtUrls[i]}) failed:`, r.reason);
      });

      const jams = settled
        .filter((r): r is PromiseFulfilledResult<WazeTrafficJam[]> => r.status === 'fulfilled')
        .flatMap(r => r.value);
      setTrafficData(jams);
    } catch (e: any) {
      console.error("Traffic View Error", e);
      addToast("Failed to load traffic view data", 'error');
    } finally {
      setLoadingTraffic(false);
    }
  };

  const toggleTrafficView = () => {
    setShowTraffic(prev => !prev);
  };

  // Re-fetch traffic whenever selected feeds change; clear when no feeds selected
  useEffect(() => {
    if (activeFeedIds.length === 0) {
      setTrafficData([]);
      return;
    }
    loadTrafficData();
  }, [activeFeedIds]);

  // Camera State
  const [cameras, setCameras] = useState<any[]>([]);
  const [loadingCameras, setLoadingCameras] = useState(false);

  const loadCameras = async () => {
    setLoadingCameras(true);
    try {
      const data = await fetchTrafficCameras();
      // Guard: discard result if feeds were cleared while request was in-flight
      if (activeFeedIdsRef.current.length === 0) return;
      setCameras(data);
    } catch (e) {
      console.error(e);
      addToast("Failed to load traffic cameras", 'error');
    } finally {
      setLoadingCameras(false);
    }
  };

  const toggleCameras = () => {
    const newState = !showCameras;
    setShowCameras(newState);
    if (newState) {
      loadCameras();
      // Subscribe to real-time health updates
      if (!cctvHealthUnsubRef.current) {
        cctvHealthUnsubRef.current = subscribeToCctvHealth(setCctvHealth);
      }
    } else {
      setCameras([]);
      // Unsubscribe and clear health data
      cctvHealthUnsubRef.current?.();
      cctvHealthUnsubRef.current = null;
      setCctvHealth({});
    }
  };

  const refreshCamera = async (cameraId: string): Promise<string | null> => {
    setLoadingCameras(true);
    try {
      // We fetch the full list again to get fresh signed URLs
      // Optimization: In a real app we might have a specific endpoint for single camera refresh
      const data = await fetchTrafficCameras();
      setCameras(data);

      const updated = data.find((c: any) => c.CameraID === cameraId);
      return updated ? updated.ImageLink : null;
    } catch (e) {
      console.error(e);
      addToast("Failed to refresh camera image", 'error');
      return null;
    } finally {
      setLoadingCameras(false);
    }
  };

  const activeCCTVs = useMemo(() => {
    if (!showCameras) return [];
    let cctvs = [] as any[];
    if (activeFeedIds.includes('NSC-Smart-VMS')) {
      cctvs = cctvs.concat(NSC_SMART_VMS_CCTV_CAMERAS);
    }
    const otherCCTVs = NSC_CCTV_CAMERAS.filter(c => activeFeedIds.includes(c.area));
    return cctvs.concat(otherCCTVs);
  }, [showCameras, activeFeedIds]);

  // Initial load (traffic + cameras also loaded via loadData)
  useEffect(() => {
    if (activeFeedIds.length === 0) {
      setIncidents([]);
      setCameras([]);
      return;
    }
    const hasNonCustom = activeFeedIds.some(id => id !== 'custom');
    if (hasNonCustom) {
      loadData(false);
      if (showCameras) {
        loadCameras();
      }
    }
  }, [activeFeedIds, showCameras]);

  // Polling every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const hasNonCustom = activeFeedIds.some(id => id !== 'custom');
      if (hasNonCustom || customFeedUrl) {
        loadData(false);
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [activeFeedIds, customFeedUrl]);

  // Handle URL Routing for specific incident
  useEffect(() => {
    // Check for source parameter in URL
    const searchParams = new URLSearchParams(location.search);
    const sourceStr = searchParams.get('source');
    if (sourceStr) {
      const ids = sourceStr.split(',').filter(id => FEED_SOURCES.some(s => s.id === id));
      if (ids.length > 0) {
        const currentStr = activeFeedIds.slice().sort().join(',');
        const newStr = ids.slice().sort().join(',');
        if (currentStr !== newStr) {
          setActiveFeedIds(ids);
          return;
        }
      }
    }

    if (incidentId) {
      if (incidentId === 'mock-incident-123') {
        // Create a temporary mock incident for testing
        const mockIncident: ManagedIncident = {
          uuid: 'mock-incident-123',
          type: 'ACCIDENT',
          subtype: 'ACCIDENT_MAJOR',
          street: 'Test Highway 1',
          city: 'Singapore',
          location: { x: 103.8198, y: 1.3521 },
          reportRating: 5,
          reliability: 10,
          nThumbsUp: 5,
          confidence: 10,
          pubMillis: Date.now(),
          status: IncidentStatus.NEW,
          reportDescription: "This is a simulated accident for testing purposes."
        };
        setSelectedIncident(mockIncident);
      } else if (incidents.length > 0) {
        const found = incidents.find(i => i.uuid === incidentId);
        if (found) {
          setSelectedIncident(found);
        }
      }
    }
  }, [incidentId, incidents, location.search]);

  const handleUpdateStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => inc.uuid === id ? { ...inc, status: newStatus } : inc));
    if (selectedIncident && selectedIncident.uuid === id) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
    addToast(`Incident marked as ${(newStatus as string).toLowerCase()}`, 'success');
  };

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => {
        if (filter !== 'ALL') {
          if (filter === 'HAZARD') {
            if (!inc.type.includes('HAZARD')) return false;
          } else {
            if (inc.type !== filter) return false;
          }
        }
        if (search) {
          const term = search.toLowerCase();
          const subtype = (SUBTYPE_MAPPING[inc.subtype || ''] || inc.subtype || '').toLowerCase();
          const street = (inc.street || '').toLowerCase();
          const city = (inc.city || '').toLowerCase();
          if (!subtype.includes(term) && !street.includes(term) && !city.includes(term)) return false;
        }
        return true;
      })
      .sort((a, b) => b.pubMillis - a.pubMillis);
  }, [incidents, filter, search]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">WazeOps <span className="text-blue-600">Manager</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                OP
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Section: Stats & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Live Traffic Incidents</h2>
                <p className="text-gray-500 text-sm mt-1">Real-time feed from partner network</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Feed Source Selector */}
                <div className="flex items-center gap-2">
                  <FeedSelector
                    selectedIds={activeFeedIds}
                    onChange={(ids) => {
                      setActiveFeedIds(ids);
                      navigate({ pathname: '/', search: `?source=${ids.join(',')}` });
                    }}
                    customFeedUrl={customFeedUrl}
                    onCustomFeedUrlChange={setCustomFeedUrl}
                  />
                </div>

                <button
                  onClick={() => loadData(true)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm whitespace-nowrap disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden md:inline">Refresh</span>
                </button>

                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-40 md:w-48 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <IncidentFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              incidents={incidents}
            />

            {/* View Controls & Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2 gap-3">
              <span className="text-sm font-medium text-gray-500 self-start sm:self-center">
                Showing {filteredIncidents.length} incidents
              </span>

              <div className="flex items-center gap-4 self-end sm:self-center">
                {viewMode === 'MAP' && (
                  <>
                    <button
                      onClick={toggleTrafficView}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium
                            ${showTraffic
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                      <Layers size={16} className={loadingTraffic ? 'animate-spin' : ''} />
                      Traffic View {showTraffic ? 'On' : 'Off'}
                    </button>

                    <button
                      onClick={toggleCameras}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium
                            ${showCameras
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                      <div className={`transition-transform ${loadingCameras ? 'animate-pulse' : ''}`}>
                        <Camera size={16} />
                      </div>
                      Traffic Camera {showCameras ? 'On' : 'Off'}
                    </button>
                  </>
                )}

                {/* View Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('LIST')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <ListFilter size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('GRID')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <LayoutDashboard size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('MAP')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'MAP' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Map View"
                  >
                    <MapIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {viewMode === 'MAP' ? (
              <IncidentMap
                incidents={filteredIncidents}
                onSelect={setSelectedIncident}
                trafficData={showTraffic ? trafficData : []}
                cameras={showCameras ? cameras : []}
                cctvCameras={activeCCTVs}
                activeFeedIds={activeFeedIds}
                onRefreshCamera={refreshCamera}
                cctvHealth={cctvHealth}
              />
            ) : (
              <div className={`
                  ${viewMode === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'}
              `}>
                {loading && incidents.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">Loading incidents...</div>
                ) : filteredIncidents.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                      <Search className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No incidents found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  filteredIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.uuid}
                      incident={incident}
                      onClick={() => setSelectedIncident(incident)}
                      compact={viewMode === 'LIST'}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column: Stats (Desktop Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <IncidentStats incidents={incidents} />

              {/* Debug / Simulation Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Simulation</h3>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">DEV</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Test the notification service integration by triggering a mock alert.
                </p>
                <button
                  onClick={async () => {
                    const currentSource = FEED_SOURCES.find(s => s.id === activeFeedIds[0]) || FEED_SOURCES[0];

                    let slug = 'road_incident';
                    if (currentSource.id === 'thomson') slug = 'Thompson_Road';
                    if (currentSource.id === 'west') slug = 'West_Region';

                    try {
                      const response = await fetch(`${process.env.BACKEND_URL || ''}/notify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NOTIFY_KEY || 'secret123' },
                        body: JSON.stringify({
                          alertSlug: slug,
                          message: `⚠️ <b>TEST ALERT</b>\n\nThis is a mock alert triggered from the frontend.\nSource: ${currentSource.name}\n<a href="${process.env.FRONTEND_URL || window.location.origin}${import.meta.env.BASE_URL}#/detail/mock-incident-123?source=${currentSource.id}">View Details</a>`,
                          parseMode: 'HTML'
                        })
                      });
                      if (response.ok) {
                        addToast('Mock alert sent successfully', 'success');
                      } else {
                        throw new Error('Server responded with error');
                      }
                    } catch (e) {
                      console.error(e);
                      addToast('Failed to send mock alert', 'error');
                    }
                  }}
                  className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm shadow-sm"
                >
                  Send Mock Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <IncidentModal
        incident={selectedIncident}
        onClose={() => {
          setSelectedIncident(null);
          // When closing, update URL to remove the detail path but keep query params
          navigate({ pathname: '/', search: location.search });
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

// Sub-component for individual card to keep file clean
interface IncidentCardProps {
  incident: ManagedIncident;
  onClick: () => void;
  compact: boolean;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick, compact }) => {
  const config = CATEGORY_CONFIG[incident.type] || CATEGORY_CONFIG.default;
  const Icon = config.icon;
  const readableSubtype = incident.subtype ? (SUBTYPE_MAPPING[incident.subtype] || incident.subtype) : incident.type;

  let statusColor = 'bg-gray-100 text-gray-600';
  if (incident.status === IncidentStatus.ACKNOWLEDGED) statusColor = 'bg-blue-100 text-blue-700';
  if (incident.status === IncidentStatus.RESOLVED) statusColor = 'bg-green-100 text-green-700';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group
        ${compact ? 'p-4 flex items-center gap-4' : 'p-5 flex flex-col gap-4'}
      `}
    >
      <div className={`
        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors
        ${config.bg} ${config.color} group-hover:bg-opacity-80
      `}>
        <Icon size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 font-semibold truncate pr-2">{readableSubtype}</h3>
          {incident.status !== IncidentStatus.NEW && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
              {incident.status}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm truncate mt-0.5">
          {incident.street || 'Unknown Street'}, {incident.city}
        </p>

        {!compact && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>Reliability Score: {incident.reliability}/10</span>
            <span>Reported: {new Date(incident.pubMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      {compact && (
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-400">Reliability Score</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${incident.reliability && incident.reliability > 7 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {incident.reliability || '-'}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Reported: {new Date(incident.pubMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
};

export default App;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CCTVCamera, CctvHealthRecord } from '../types';
import { Video, VideoOff, Wifi, WifiOff, HelpCircle } from 'lucide-react';

const SNAPSHOT_INTERVAL_MS = 5000;

// VITE_CCTV_URL points to the service running go2rtc + Express (Cloud Run or local)
// Falls back to VITE_BACKEND_URL if not set
const CCTV_URL = import.meta.env.VITE_CCTV_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const CCTVCameraPopup: React.FC<{ camera: CCTVCamera; active?: boolean; health?: CctvHealthRecord; onStreamError?: () => void }> = ({ camera, active = false, health, onStreamError }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorCountRef = useRef(0);
    const isActiveRef = useRef(active);

    // --- Health helpers ---
    const formatLastChecked = (date: Date | null): string => {
        if (!date) return 'Never checked';
        const diffMs = Date.now() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin === 1) return '1 min ago';
        if (diffMin < 60) return `${diffMin} min ago`;
        const diffHr = Math.floor(diffMin / 60);
        return diffHr === 1 ? '1 hr ago' : `${diffHr} hrs ago`;
    };

    const healthStatus = health?.status ?? 'unknown';

    const snapshotUrl = `${CCTV_URL}/snapshot?src=${camera.id}`;

    useEffect(() => {
        isActiveRef.current = active;
    }, [active]);

    const fetchSnapshot = useCallback(() => {
        if (!isActiveRef.current) return;
        
        // Changing imgSrc aborts the previous browser request
        setImgSrc(`${snapshotUrl}&t=${Date.now()}`);
        
        if (timerRef.current) clearTimeout(timerRef.current);
        
        // Fallback timeout in case the image hangs forever without firing load/error
        timerRef.current = setTimeout(() => {
            if (!isActiveRef.current) return;
            errorCountRef.current++;
            if (errorCountRef.current >= 3) {
                setLoading(false);
                setError(true);
                onStreamError?.();
            } else {
                fetchSnapshot(); // retry
            }
        }, 10000);
    }, [snapshotUrl, onStreamError]);

    const handleLoad = () => {
        if (!isActiveRef.current) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        
        setLoading(false);
        setError(false);
        errorCountRef.current = 0;
        
        // Schedule next poll
        timerRef.current = setTimeout(fetchSnapshot, SNAPSHOT_INTERVAL_MS);
    };

    const handleError = () => {
        if (!isActiveRef.current) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        
        errorCountRef.current++;
        if (errorCountRef.current >= 3) {
            setLoading(false);
            setError(true);
            onStreamError?.();
        } else {
            // Schedule next poll
            timerRef.current = setTimeout(fetchSnapshot, SNAPSHOT_INTERVAL_MS);
        }
    };

    useEffect(() => {
        if (active) {
            setLoading(true);
            setError(false);
            errorCountRef.current = 0;
            fetchSnapshot();
        } else {
            // Cleanup on deactivate
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setImgSrc(null);
            setLoading(false);
        }
        
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [active, fetchSnapshot]);

    return (
        <div className="p-2 min-w-[280px]">
            <div className="flex items-center gap-2 mb-1.5">
                <Video size={14} className="text-emerald-600 shrink-0" />
                <div className="font-bold text-xs text-gray-700 truncate flex-1">{camera.name}</div>
                {/* Health status pill */}
                {healthStatus === 'online' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                        <Wifi size={9} />
                        Online
                    </span>
                )}
                {healthStatus === 'offline' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full shrink-0">
                        <WifiOff size={9} />
                        Offline
                    </span>
                )}
                {healthStatus === 'unknown' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full shrink-0">
                        <HelpCircle size={9} />
                        Unknown
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-gray-400">{camera.device} &middot; {camera.area}</div>
                {health?.lastChecked && (
                    <div className="text-[9px] text-gray-400">
                        Checked {formatLastChecked(health.lastChecked)}
                    </div>
                )}
            </div>

            {/* Offline warning banner */}
            {healthStatus === 'offline' && !error && (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5 mb-2">
                    <WifiOff size={11} className="text-red-500 shrink-0" />
                    <span className="text-[10px] text-red-600">
                        Stream may be unavailable — last check failed
                    </span>
                </div>
            )}

            <div className="relative w-full aspect-video bg-black rounded overflow-hidden mb-2">
                {loading && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 z-10">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px]">Loading snapshot...</span>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 z-10">
                        <VideoOff size={24} />
                        <span className="text-[10px]">Stream unavailable</span>
                    </div>
                )}
                {imgSrc && !error && (
                    <img
                        src={imgSrc}
                        alt={camera.name}
                        onLoad={handleLoad}
                        onError={handleError}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            {!error && !loading && imgSrc && (
                <div className="text-[9px] text-gray-400 text-right">Auto-refreshing every {SNAPSHOT_INTERVAL_MS / 1000}s</div>
            )}
        </div>
    );
};

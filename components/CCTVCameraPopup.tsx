
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CCTVCamera } from '../types';
import { Video, VideoOff } from 'lucide-react';

const SNAPSHOT_INTERVAL_MS = 5000;

// VITE_CCTV_URL points to the service running go2rtc + Express (Cloud Run or local)
// Falls back to VITE_BACKEND_URL if not set
const CCTV_URL = import.meta.env.VITE_CCTV_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const CCTVCameraPopup: React.FC<{ camera: CCTVCamera; active?: boolean; onStreamError?: () => void }> = ({ camera, active = false, onStreamError }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorCountRef = useRef(0);
    const isActiveRef = useRef(active);

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
            <div className="flex items-center gap-2 mb-2">
                <Video size={14} className="text-emerald-600 shrink-0" />
                <div className="font-bold text-xs text-gray-700 truncate">{camera.name}</div>
            </div>
            <div className="text-[10px] text-gray-400 mb-1.5">{camera.device} &middot; {camera.area}</div>

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

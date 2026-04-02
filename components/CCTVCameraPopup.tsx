
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
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const errorCountRef = useRef(0);

    const snapshotUrl = `${CCTV_URL}/snapshot?src=${camera.id}`;

    const fetchSnapshot = useCallback(() => {
        setImgSrc(`${snapshotUrl}&t=${Date.now()}`);
    }, [snapshotUrl]);

    useEffect(() => {
        if (active) {
            setLoading(true);
            setError(false);
            errorCountRef.current = 0;
            fetchSnapshot();
            intervalRef.current = setInterval(fetchSnapshot, SNAPSHOT_INTERVAL_MS);
        } else {
            setImgSrc(null);
            setLoading(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [active, fetchSnapshot]);

    const handleLoad = () => {
        setLoading(false);
        setError(false);
        errorCountRef.current = 0;
    };

    const handleError = () => {
        errorCountRef.current++;
        // After 3 consecutive failures, mark as unavailable
        if (errorCountRef.current >= 3) {
            setLoading(false);
            setError(true);
            onStreamError?.();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

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

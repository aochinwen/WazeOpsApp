import React, { useState, useRef, useEffect } from 'react';
import { Rss, ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';
import { FEED_SOURCES } from '../constants';

interface FeedSource {
  id: string;
  name: string;
  url: string;
  tvtUrl: string;
}

interface FeedSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  customFeedUrl: string;
  onCustomFeedUrlChange: (url: string) => void;
}

const NSC_IDS = FEED_SOURCES.filter(s => s.id.startsWith('NSC-')).map(s => s.id);
const OTHER_SOURCES = FEED_SOURCES.filter(s => !s.id.startsWith('NSC-'));
const NSC_SOURCES = FEED_SOURCES.filter(s => s.id.startsWith('NSC-'));

export const FeedSelector: React.FC<FeedSelectorProps> = ({
  selectedIds,
  onChange,
  customFeedUrl,
  onCustomFeedUrlChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nscExpanded, setNscExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedNscCount = NSC_IDS.filter(id => selectedIds.includes(id)).length;
  const allNscSelected = selectedNscCount === NSC_IDS.length;
  const someNscSelected = selectedNscCount > 0 && selectedNscCount < NSC_IDS.length;

  const toggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleAllNsc = () => {
    if (allNscSelected) {
      onChange(selectedIds.filter(id => !NSC_IDS.includes(id)));
    } else {
      const nonNsc = selectedIds.filter(id => !NSC_IDS.includes(id));
      onChange([...nonNsc, ...NSC_IDS]);
    }
  };

  const getLabel = () => {
    if (selectedIds.length === 0) return 'No feed selected';
    if (selectedIds.length === 1) {
      const src = FEED_SOURCES.find(s => s.id === selectedIds[0]);
      return src?.name ?? selectedIds[0];
    }
    // Check if all selected are NSC
    const selectedNsc = selectedIds.filter(id => NSC_IDS.includes(id));
    const selectedOther = selectedIds.filter(id => !NSC_IDS.includes(id));
    if (selectedNsc.length === NSC_IDS.length && selectedOther.length === 0) {
      return 'All NSC Feeds';
    }
    if (selectedNsc.length > 0 && selectedOther.length === 0) {
      return `NSC (${selectedNsc.length} feeds)`;
    }
    return `${selectedIds.length} feeds selected`;
  };

  const showCustomInput = selectedIds.includes('custom');

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer whitespace-nowrap"
      >
        <Rss className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <span className="max-w-[160px] truncate">{getLabel()}</span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom URL input (shown inline when custom is selected) */}
      {showCustomInput && (
        <input
          type="text"
          placeholder="Enter Waze JSON Feed URL..."
          value={customFeedUrl}
          onChange={e => onCustomFeedUrlChange(e.target.value)}
          className="mt-1 w-full sm:w-64 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto py-1">

            {/* Non-NSC feeds */}
            {OTHER_SOURCES.map(source => (
              <label
                key={source.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedIds.includes(source.id)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedIds.includes(source.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                </span>
                <span className="text-sm text-gray-700">{source.name}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedIds.includes(source.id)}
                  onChange={() => toggleId(source.id)}
                />
              </label>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />

            {/* NSC Group Header */}
            <div className="flex items-center px-4 py-2 hover:bg-gray-50">
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    allNscSelected
                      ? 'bg-blue-600 border-blue-600'
                      : someNscSelected
                      ? 'bg-blue-100 border-blue-400'
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={e => { e.preventDefault(); toggleAllNsc(); }}
                >
                  {allNscSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                  {someNscSelected && <Minus size={10} className="text-blue-600" strokeWidth={3} />}
                </span>
                <span className="text-sm font-semibold text-gray-800" onClick={toggleAllNsc}>
                  NSC
                  <span className="ml-1 text-xs font-normal text-gray-400">({selectedNscCount}/{NSC_IDS.length})</span>
                </span>
              </label>
              <button
                type="button"
                onClick={() => setNscExpanded(prev => !prev)}
                className="p-0.5 text-gray-400 hover:text-gray-600"
              >
                {nscExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>

            {/* NSC Individual Feeds */}
            {nscExpanded && NSC_SOURCES.map(source => (
              <label
                key={source.id}
                className="flex items-center gap-3 pl-9 pr-4 py-1.5 hover:bg-gray-50 cursor-pointer"
              >
                <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedIds.includes(source.id)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedIds.includes(source.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                </span>
                <span className="text-sm text-gray-600">{source.name}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedIds.includes(source.id)}
                  onChange={() => toggleId(source.id)}
                />
              </label>
            ))}

          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2 flex justify-between items-center bg-gray-50">
            <span className="text-xs text-gray-400">{selectedIds.length} feed{selectedIds.length !== 1 ? 's' : ''} selected</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

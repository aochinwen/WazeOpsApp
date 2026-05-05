import React, { useState, useRef, useEffect } from 'react';
import { Rss, ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';
import { FEED_SOURCES } from '../constants';

interface FeedSource {
  id: string;
  name: string;
  url: string;
  tvtUrl: string;
  group?: string;
}

interface FeedSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  customFeedUrl: string;
  onCustomFeedUrlChange: (url: string) => void;
}

export const FeedSelector: React.FC<FeedSelectorProps> = ({
  selectedIds,
  onChange,
  customFeedUrl,
  onCustomFeedUrlChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'NSC (Smart VMS)': true,
    'NSC (C1)': true,
    'NSC (C2)': true,
    'NSC (C3)': true,
    'NSC (C4)': true,
  });
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

  const toggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleGroup = (groupName: string, sourceIds: string[]) => {
    const groupSelectedCount = sourceIds.filter(id => selectedIds.includes(id)).length;
    const allGroupSelected = groupSelectedCount === sourceIds.length;

    if (allGroupSelected) {
      onChange(selectedIds.filter(id => !sourceIds.includes(id)));
    } else {
      const otherSelected = selectedIds.filter(id => !sourceIds.includes(id));
      onChange([...otherSelected, ...sourceIds]);
    }
  };

  const toggleGroupExpanded = (groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const getLabel = () => {
    if (selectedIds.length === 0) return 'No feed selected';
    if (selectedIds.length === 1) {
      const src = FEED_SOURCES.find(s => s.id === selectedIds[0]);
      return src?.name ?? selectedIds[0];
    }
    return `${selectedIds.length} feeds selected`;
  };

  // Group sources
  const groupedSources: Record<string, FeedSource[]> = {};
  FEED_SOURCES.forEach(source => {
    const group = source.group || 'Other';
    if (!groupedSources[group]) groupedSources[group] = [];
    groupedSources[group].push(source);
  });

  // Sort groups: NSC (Smart VMS), C1, C2, C3, C4, Other
  const groupOrder = ['NSC (Smart VMS)', 'NSC (C1)', 'NSC (C2)', 'NSC (C3)', 'NSC (C4)', 'Other'];
  const sortedGroups = Object.keys(groupedSources).sort((a, b) => {
    const idxA = groupOrder.indexOf(a);
    const idxB = groupOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  const showCustomInput = selectedIds.includes('custom');

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer whitespace-nowrap"
      >
        <Rss className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <span className="max-w-[160px] truncate">{getLabel()}</span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {showCustomInput && (
        <input
          type="text"
          placeholder="Enter Waze JSON Feed URL..."
          value={customFeedUrl}
          onChange={e => onCustomFeedUrlChange(e.target.value)}
          className="mt-1 w-full sm:w-64 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
        />
      )}

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto py-1">
            {sortedGroups.map(groupName => {
              const sources = groupedSources[groupName];
              const sourceIds = sources.map(s => s.id);
              const groupSelectedCount = sourceIds.filter(id => selectedIds.includes(id)).length;
              const allGroupSelected = groupSelectedCount === sourceIds.length;
              const someGroupSelected = groupSelectedCount > 0 && !allGroupSelected;
              const isNsc = groupName.startsWith('NSC');
              const isExpanded = expandedGroups[groupName] !== false;

              return (
                <div key={groupName} className="mb-1 last:mb-0">
                  {/* Group Header */}
                  <div className={`flex items-center px-4 py-2 hover:bg-gray-50 ${isNsc ? 'bg-gray-50/50' : ''}`}>
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <span
                        className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          allGroupSelected
                            ? 'bg-blue-600 border-blue-600'
                            : someGroupSelected
                            ? 'bg-blue-100 border-blue-400'
                            : 'border-gray-300 bg-white'
                        }`}
                        onClick={e => { e.preventDefault(); toggleGroup(groupName, sourceIds); }}
                      >
                        {allGroupSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                        {someGroupSelected && <Minus size={10} className="text-blue-600" strokeWidth={3} />}
                      </span>
                      <span className="text-sm font-semibold text-gray-800" onClick={() => toggleGroup(groupName, sourceIds)}>
                        {groupName}
                        <span className="ml-1 text-xs font-normal text-gray-400">({groupSelectedCount}/{sources.length})</span>
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleGroupExpanded(groupName)}
                      className="p-0.5 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>

                  {/* Group Items */}
                  {isExpanded && sources.map(source => (
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
                  {/* Divider for NSC groups */}
                  {isNsc && <div className="border-t border-gray-100 my-1 mx-2" />}
                </div>
              );
            })}
          </div>

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

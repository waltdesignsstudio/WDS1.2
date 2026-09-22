import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Building2,
  Globe2,
} from 'lucide-react';
import {
  LocationSuggestion,
  searchLocationKeywords,
  autoDetectCurrentLocation,
} from '../../lib/locationService';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onLocationSelected: (newLocation: string) => Promise<void> | void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelected,
}) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>(currentLocation);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(currentLocation);
      setKeyword('');
      setStatusMessage(null);
      // Load initial popular locations
      searchLocationKeywords('').then((res) => setSuggestions(res));
    }
  }, [isOpen, currentLocation]);

  // Handle typing keyword
  const handleKeywordChange = (text: string) => {
    setKeyword(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text.trim()) {
      searchLocationKeywords('').then((res) => setSuggestions(res));
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocationKeywords(text);
        setSuggestions(results);
      } catch (err) {
        console.error('Failed to search locations:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  // Auto-Detect GPS Location
  const handleAutoDetect = async () => {
    setIsDetectingGps(true);
    setStatusMessage({ type: 'info', text: 'Detecting your device GPS coordinates...' });

    try {
      const detected = await autoDetectCurrentLocation();
      setSelectedItem(detected.formatted);
      setStatusMessage({
        type: 'success',
        text: `Location auto-detected: ${detected.formatted}! Updating live weather...`,
      });

      // Apply immediately
      await onLocationSelected(detected.formatted);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not auto-detect location. Please ensure location permissions are enabled in your browser.',
      });
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Select from verified suggestion list
  const handleSelectSuggestion = async (item: LocationSuggestion) => {
    setSelectedItem(item.formatted);
    setStatusMessage({
      type: 'success',
      text: `Selected ${item.formatted}. Updating profile and real-time weather...`,
    });

    try {
      await onLocationSelected(item.formatted);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update location.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      {/* Scrollable Container with max height limit to prevent any screen overlap */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-purple-400/80 flex flex-col my-auto max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header - never scrolls out or overlaps */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#3B0764] via-[#581c87] to-[#3B0764] text-white flex items-center justify-between border-b border-purple-800/80 shrink-0 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <MapPin className="w-5 h-5 text-purple-950" />
            </div>
            <div>
              <h3 className="font-black text-base text-amber-300 tracking-tight">
                Update Registered Location
              </h3>
              <p className="text-[11px] text-purple-200 leading-tight">
                Auto-detect or select from verified Maps locations to sync live weather
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smooth Scrollable Modal Content (No Overlapping) */}
        <div className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-purple-50/40 to-amber-50/30 flex-1 overflow-y-auto min-h-0 overscroll-contain">
          
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in shadow-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold'
                  : statusMessage.type === 'error'
                  ? 'bg-red-100 border border-red-400 text-red-950 font-bold'
                  : 'bg-sky-100 border border-sky-400 text-sky-950 font-semibold'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />}
              {statusMessage.type === 'info' && <Loader2 className="w-4 h-4 text-sky-700 shrink-0 animate-spin" />}
              <span className="leading-snug">{statusMessage.text}</span>
            </div>
          )}

          {/* Auto-Detect GPS Section */}
          <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-black text-purple-950">Auto-Detect GPS Location</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                Fast & Accurate
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-tight">
              Turn on device location to automatically detect your current city and synchronize local weather.
            </p>
            <button
              type="button"
              disabled={isDetectingGps}
              onClick={handleAutoDetect}
              className="w-full mt-1 py-2.5 px-4 rounded-xl bg-[#3B0764] hover:bg-purple-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isDetectingGps ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Detecting GPS Coordinates...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Turn On & Auto-Detect My Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Or search location list
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Keyword Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 block">
              Type Location Keyword (Selectable from list)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                placeholder="Type city or area name (e.g. Mumbai, Indore, Jaipur)..."
                className="w-full bg-white border-2 border-zinc-300 focus:border-purple-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 outline-none shadow-xs font-medium placeholder:text-zinc-400 transition-colors"
              />
              {isSearching && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-purple-700 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 italic">
              Please click on a verified location from the list below to select it.
            </p>
          </div>

          {/* Verified Locations List (Dedicated Scrollable Area without overlapping) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-purple-950 uppercase tracking-wider block">
                Verified Maps Locations ({suggestions.length})
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Scroll to browse</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 rounded-2xl border border-zinc-200 p-2 bg-white shadow-inner overscroll-contain">
              {suggestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  <Globe2 className="w-7 h-7 text-zinc-300 mx-auto mb-1.5" />
                  <p className="font-bold text-zinc-700">No locations found</p>
                  <p className="text-[11px] text-zinc-500">Try typing a different city or region keyword.</p>
                </div>
              ) : (
                suggestions.map((loc) => {
                  const isCurrent =
                    selectedItem.toLowerCase().includes(loc.name.toLowerCase()) ||
                    currentLocation.toLowerCase().includes(loc.name.toLowerCase());

                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(loc)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                        isCurrent
                          ? 'bg-purple-900 text-white font-bold shadow-xs'
                          : 'hover:bg-purple-50 text-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isCurrent
                              ? 'bg-amber-400 text-purple-950'
                              : 'bg-purple-100 text-purple-800 group-hover:bg-purple-200'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-xs truncate">
                            {loc.name}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isCurrent ? 'text-purple-200' : 'text-zinc-500'
                            }`}
                          >
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-purple-950 shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-[11px] text-purple-800 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          Select →
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Currently Registered Note */}
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-[11px] flex items-center justify-between shrink-0">
            <span className="text-zinc-600">Currently Registered:</span>
            <strong className="font-mono font-bold text-purple-950">{currentLocation || 'Not configured'}</strong>
          </div>

        </div>

        {/* Modal Bottom Close Action Bar (Sticky footer) */}
        <div className="p-3 px-5 bg-white border-t border-zinc-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

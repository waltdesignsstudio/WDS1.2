import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Moon,
  CloudLightning,
  MapPin,
  RefreshCw,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Sliders,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { WeatherCondition, WeatherData } from '../../lib/weatherService';

interface WeatherVerificationWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  registeredLocation: string;
  onRefreshWeather: () => void;
  onUpdateLocation: (newLocation: string) => void;
  onOverrideCondition?: (cond: WeatherCondition | null) => void;
  activeOverrideCondition: WeatherCondition | null;
}

const COMMON_CITIES = [
  'Indore, Madhya Pradesh',
  'Mumbai, Maharashtra',
  'New Delhi, Delhi',
  'Bengaluru, Karnataka',
  'Lucknow, Uttar Pradesh',
  'Kolkata, West Bengal',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Chandigarh, Punjab',
];

export const WeatherVerificationWidget: React.FC<WeatherVerificationWidgetProps> = ({
  weather,
  loading,
  registeredLocation,
  onRefreshWeather,
  onUpdateLocation,
  onOverrideCondition,
  activeOverrideCondition,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');
  const [showOverrideMenu, setShowOverrideMenu] = useState(false);

  const displayCondition = activeOverrideCondition || weather?.condition || 'sunny';

  const getWeatherIcon = (cond: WeatherCondition) => {
    switch (cond) {
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-sky-300 animate-bounce" />;
      case 'thunder':
        return <CloudLightning className="w-5 h-5 text-amber-300 animate-pulse" />;
      case 'night':
        return <Moon className="w-5 h-5 text-indigo-200" />;
      case 'sunny':
      default:
        return <Sun className="w-5 h-5 text-yellow-300 animate-spin-slow" />;
    }
  };

  const getConditionBadgeStyle = (cond: WeatherCondition) => {
    switch (cond) {
      case 'rainy':
        return 'bg-sky-500/20 text-sky-200 border-sky-400/40';
      case 'thunder':
        return 'bg-purple-900/60 text-amber-200 border-amber-400/50';
      case 'night':
        return 'bg-indigo-900/60 text-indigo-200 border-indigo-400/40';
      case 'sunny':
      default:
        return 'bg-amber-500/20 text-yellow-200 border-amber-400/40';
    }
  };

  const handleSelectCity = (city: string) => {
    onUpdateLocation(city);
    setIsCityDropdownOpen(false);
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      onUpdateLocation(customCityInput.trim());
      setCustomCityInput('');
      setIsCityDropdownOpen(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#2a0435]/95 via-[#1a0120]/95 to-[#3b0444]/95 border-2 border-fuchsia-400/40 shadow-xl p-4 sm:p-5 backdrop-blur-xl text-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Weather Status & AI Verified Location */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl bg-fuchsia-950/80 border border-fuchsia-400/60 flex items-center justify-center shrink-0 shadow-inner">
            {getWeatherIcon(displayCondition)}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1a0120] animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide flex items-center gap-1.5">
                <span>{weather?.city || registeredLocation || 'Indore'}</span>
                <span className="text-fuchsia-300 font-normal">|</span>
                <span className="text-amber-300 font-mono font-bold">
                  {weather ? `${weather.temperature}°C` : '27°C'}
                </span>
              </span>

              {/* Verified Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getConditionBadgeStyle(
                  displayCondition
                )}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  {activeOverrideCondition
                    ? `Previewing: ${activeOverrideCondition.toUpperCase()}`
                    : weather?.description || 'AI Weather Verified'}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fuchsia-200">
              <span className="flex items-center gap-1 text-fuchsia-300">
                <MapPin className="w-3 h-3 text-fuchsia-400 shrink-0" />
                <span>Registered Area: <strong className="text-white">{registeredLocation || 'Indore, MP'}</strong></span>
              </span>

              {weather && (
                <>
                  <span className="hidden sm:inline text-fuchsia-400">•</span>
                  <span className="flex items-center gap-1 text-zinc-300 text-[11px]">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>{weather.humidity}% Humidity</span>
                  </span>
                  <span className="hidden sm:inline text-fuchsia-400">•</span>
                  <span className="flex items-center gap-1 text-zinc-300 text-[11px]">
                    <Wind className="w-3 h-3 text-teal-300" />
                    <span>{weather.windSpeed} km/h Wind</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions (Change Area, Refresh, Simulation/Override Controls) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-fuchsia-800/60">
          
          {/* Change Registered Area Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="px-3 py-1.5 rounded-xl bg-fuchsia-900/60 hover:bg-fuchsia-800/80 border border-fuchsia-400/50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-fuchsia-300" />
              <span>Change Area</span>
              <ChevronDown className="w-3 h-3 text-fuchsia-300" />
            </button>

            {/* Dropdown Menu */}
            {isCityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#1e0225] border-2 border-fuchsia-400 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[11px] font-bold text-fuchsia-200 mb-2">
                  Select Registered Area / City
                </p>

                <form onSubmit={handleCustomCitySubmit} className="mb-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Type any city (e.g. Mumbai)..."
                      value={customCityInput}
                      onChange={(e) => setCustomCityInput(e.target.value)}
                      className="flex-1 bg-fuchsia-950/80 border border-fuchsia-500 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-fuchsia-300/60 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </form>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {COMMON_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        registeredLocation?.toLowerCase().includes(c.split(',')[0].toLowerCase())
                          ? 'bg-fuchsia-600 font-bold text-white'
                          : 'text-fuchsia-100 hover:bg-fuchsia-900/50'
                      }`}
                    >
                      <span>{c}</span>
                      {registeredLocation?.toLowerCase().includes(c.split(',')[0].toLowerCase()) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weather Effect Override / Simulation Pill Selector */}
          <div className="flex items-center gap-1 bg-fuchsia-950/80 border border-fuchsia-500/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onOverrideCondition?.(null)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeOverrideCondition === null
                  ? 'bg-fuchsia-600 text-white shadow-xs'
                  : 'text-fuchsia-200 hover:text-white'
              }`}
              title="Real-time Verified Live Weather"
            >
              Live Auto
            </button>

            <button
              type="button"
              onClick={() => onOverrideCondition?.('rainy')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverrideCondition === 'rainy'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-sky-300 hover:text-white'
              }`}
              title="Show Rain Drops on Dashboard"
            >
              <CloudRain className="w-3 h-3" />
              <span>Rain</span>
            </button>

            <button
              type="button"
              onClick={() => onOverrideCondition?.('sunny')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverrideCondition === 'sunny'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-yellow-300 hover:text-white'
              }`}
              title="Show Radiant Sun on Dashboard"
            >
              <Sun className="w-3 h-3" />
              <span>Sun</span>
            </button>

            <button
              type="button"
              onClick={() => onOverrideCondition?.('night')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverrideCondition === 'night'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-indigo-300 hover:text-white'
              }`}
              title="Show Moon & Stars on Dashboard"
            >
              <Moon className="w-3 h-3" />
              <span>Moon</span>
            </button>

            <button
              type="button"
              onClick={() => onOverrideCondition?.('thunder')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverrideCondition === 'thunder'
                  ? 'bg-purple-800 text-amber-200 shadow-xs'
                  : 'text-amber-300 hover:text-white'
              }`}
              title="Show Thunderstorm & Lightning on Dashboard"
            >
              <CloudLightning className="w-3 h-3" />
              <span>Thunder</span>
            </button>
          </div>

          {/* Refresh Real-Time Weather */}
          <button
            type="button"
            onClick={onRefreshWeather}
            disabled={loading}
            className="p-2 rounded-xl bg-fuchsia-900/60 hover:bg-fuchsia-800/80 border border-fuchsia-400/50 text-fuchsia-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Live Meteorological Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

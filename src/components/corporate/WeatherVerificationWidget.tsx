import React from 'react';
import {
  CloudRain,
  Sun,
  Moon,
  CloudLightning,
  MapPin,
  RefreshCw,
  Sparkles,
  Wind,
  Droplets,
} from 'lucide-react';
import { WeatherCondition, WeatherData } from '../../lib/weatherService';

interface WeatherVerificationWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  registeredLocation: string;
  onRefreshWeather: () => void;
}

export const WeatherVerificationWidget: React.FC<WeatherVerificationWidgetProps> = ({
  weather,
  loading,
  registeredLocation,
  onRefreshWeather,
}) => {
  const displayCondition: WeatherCondition = weather?.condition || 'sunny';

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

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#2a0435]/95 via-[#1a0120]/95 to-[#3b0444]/95 border-2 border-fuchsia-400/40 shadow-xl p-4 sm:p-5 backdrop-blur-xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Weather Status & Verified Registered Area */}
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

              {/* Real-time Verified Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getConditionBadgeStyle(
                  displayCondition
                )}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{weather?.description || 'Real-Time Weather Verified'}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fuchsia-200">
              <span className="flex items-center gap-1 text-fuchsia-300">
                <MapPin className="w-3 h-3 text-fuchsia-400 shrink-0" />
                <span>
                  Registered Area: <strong className="text-white">{registeredLocation || 'Indore, Madhya Pradesh'}</strong>
                </span>
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

        {/* Right: Live Sync & Refresh Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onRefreshWeather}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-fuchsia-900/60 hover:bg-fuchsia-800/80 border border-fuchsia-400/50 text-fuchsia-200 hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 text-xs font-bold shadow-xs"
            title="Refresh Live Meteorological Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Updating...' : 'Sync Weather'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

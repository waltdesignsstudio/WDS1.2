import React, { useEffect, useState } from 'react';
import { WeatherCondition } from '../../lib/weatherService';

interface WeatherAmbientCanvasProps {
  condition: WeatherCondition;
  city?: string;
  temperature?: number;
}

export const WeatherAmbientCanvas: React.FC<WeatherAmbientCanvasProps> = ({
  condition,
  city = 'Corporate HQ',
  temperature,
}) => {
  // Lightning flash trigger state for thunderstorm condition
  const [isLightningFlashing, setIsLightningFlashing] = useState(false);
  const [lightningCoords, setLightningCoords] = useState<{ left: number; top: number }>({ left: 50, top: 0 });

  // Thunderstorm periodic lightning flash generator
  useEffect(() => {
    if (condition !== 'thunder') {
      setIsLightningFlashing(false);
      return;
    }

    let timer: NodeJS.Timeout;
    const triggerLightning = () => {
      // Randomize position across top 20-80% of width
      setLightningCoords({
        left: 20 + Math.random() * 60,
        top: 0,
      });
      setIsLightningFlashing(true);

      // Brief flash (120ms), quick pause, second micro-flash
      setTimeout(() => {
        setIsLightningFlashing(false);
        setTimeout(() => {
          setIsLightningFlashing(true);
          setTimeout(() => {
            setIsLightningFlashing(false);
          }, 80);
        }, 60);
      }, 140);

      // Schedule next lightning strike between 4 to 9 seconds
      const nextDelay = 4000 + Math.random() * 5000;
      timer = setTimeout(triggerLightning, nextDelay);
    };

    timer = setTimeout(triggerLightning, 2000);
    return () => clearTimeout(timer);
  }, [condition]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-all duration-1000"
    >
      {/* ========================================================================= */}
      {/* 1. RAINY CONDITION: RAIN DROPS FALLING ACROSS DASHBOARD */}
      {/* ========================================================================= */}
      {(condition === 'rainy' || condition === 'thunder') && (
        <div className="absolute inset-0">
          {/* Subtle top rain cloud mist */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/40 via-purple-950/20 to-transparent" />

          {/* Foreground & Midground Rain Drops Container */}
          <div className="absolute inset-0 overflow-hidden">
            {/* 36 Animated Rain Drops with staggered positions, durations, and heights */}
            {Array.from({ length: 42 }).map((_, i) => {
              const leftPercent = (i * 2.38 + ((i * 17) % 11)) % 100;
              const delay = ((i * 0.17) % 2.5).toFixed(2);
              const duration = condition === 'thunder' ? (0.6 + (i % 5) * 0.1).toFixed(2) : (0.8 + (i % 6) * 0.12).toFixed(2);
              const height = 18 + (i % 4) * 12;
              const opacity = 0.35 + (i % 5) * 0.12;

              return (
                <div
                  key={`raindrop-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${leftPercent}%`,
                    top: '-60px',
                    width: condition === 'thunder' ? '2px' : '1.5px',
                    height: `${height}px`,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(186,230,253,0.85))',
                    boxShadow: '0 0 4px rgba(186,230,253,0.5)',
                    opacity,
                    transform: 'rotate(12deg)',
                    animation: `fallRain ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}

            {/* Bottom Splash Ripples */}
            {Array.from({ length: 8 }).map((_, i) => {
              const leftPercent = 10 + i * 11 + ((i * 7) % 6);
              const delay = (i * 0.35).toFixed(2);
              return (
                <div
                  key={`splash-${i}`}
                  className="absolute bottom-2 rounded-full border border-sky-300/40"
                  style={{
                    left: `${leftPercent}%`,
                    width: '16px',
                    height: '6px',
                    animation: 'splashRipple 1.6s ease-out infinite',
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THUNDERSTORM: LIGHTNING BOLT & FLASH SCREEN EFFECT */}
      {/* ========================================================================= */}
      {condition === 'thunder' && (
        <>
          {/* Full Screen Lightning Illumination Flash */}
          <div
            className={`absolute inset-0 bg-fuchsia-100/30 backdrop-brightness-150 transition-opacity duration-75 ${
              isLightningFlashing ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Jagged Electric Lightning Branch SVG */}
          {isLightningFlashing && (
            <svg
              className="absolute top-0 w-48 h-96 filter drop-shadow-[0_0_16px_rgba(232,121,249,0.9)] animate-in fade-in duration-75"
              style={{ left: `${lightningCoords.left}%` }}
              viewBox="0 0 100 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 0 L42 55 L58 65 L36 125 L52 132 L25 200 L44 140 L30 134 L52 75 L38 68 Z"
                fill="url(#lightningGrad)"
              />
              <defs>
                <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#f0abfc" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. SUNNY CONDITION: GLOWING SUN & SOLAR FLARES */}
      {/* ========================================================================= */}
      {condition === 'sunny' && (
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none">
          {/* Outer Warm Ambient Lens Flare */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-400/20 via-yellow-400/10 to-transparent blur-3xl animate-pulse" />

          {/* The Radiant Sun Disc */}
          <div className="absolute top-6 right-8 sm:top-10 sm:right-16 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-yellow-100 via-amber-300 to-yellow-500 shadow-[0_0_60px_rgba(251,191,36,0.8)] border border-yellow-100/60 flex items-center justify-center">
            {/* Rotating Sun Rays Corona */}
            <div
              className="absolute inset-[-14px] rounded-full border-2 border-dashed border-amber-300/40"
              style={{ animation: 'spinSlow 30s linear infinite' }}
            />
            <div
              className="absolute inset-[-24px] rounded-full border border-dotted border-amber-400/30"
              style={{ animation: 'spinSlow 45s linear reverse infinite' }}
            />
          </div>

          {/* Floating Sunlight Dust Motes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const topPos = 20 + (i * 11) % 70;
            const rightPos = 15 + (i * 13) % 80;
            const delay = (i * 0.4).toFixed(1);
            return (
              <div
                key={`mote-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200/60 blur-[0.5px]"
                style={{
                  top: `${topPos}%`,
                  right: `${rightPos}%`,
                  animation: 'floatMote 4s ease-in-out infinite',
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NIGHT CONDITION: GLOWING MOON & TWINKLING STARS */}
      {/* ========================================================================= */}
      {condition === 'night' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep Night Atmosphere Glow */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-transparent" />

          {/* The Glowing Moon in Top Right */}
          <div className="absolute top-6 right-8 sm:top-10 sm:right-16 w-20 h-20 sm:w-24 sm:h-24">
            {/* Lunar Halo */}
            <div className="absolute inset-[-15px] rounded-full bg-indigo-200/15 blur-xl animate-pulse" />
            
            {/* Moon Sphere with realistic lunar crater accents */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200 shadow-[0_0_40px_rgba(224,231,255,0.7)] border border-white/60 overflow-hidden">
              {/* Lunar Crater Shading */}
              <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-slate-300/40 blur-[0.5px]" />
              <div className="absolute top-7 left-10 w-6 h-5 rounded-full bg-slate-300/35 blur-[0.5px]" />
              <div className="absolute bottom-4 left-6 w-5 h-4 rounded-full bg-slate-300/30 blur-[0.5px]" />
              <div className="absolute top-10 right-3 w-3 h-3 rounded-full bg-slate-300/40 blur-[0.5px]" />
            </div>
          </div>

          {/* Twinkling Starlight Field */}
          {Array.from({ length: 32 }).map((_, i) => {
            const topPos = 2 + ((i * 7 + 13) % 45);
            const leftPos = (i * 3.1 + ((i * 19) % 23)) % 95;
            const size = 1 + (i % 3);
            const delay = ((i * 0.3) % 3).toFixed(1);
            const duration = 1.5 + (i % 4) * 0.5;

            return (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                style={{
                  top: `${topPos}%`,
                  left: `${leftPos}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `twinkleStar ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Global Embedded Animations for Ambient Canvas */}
      <style>{`
        @keyframes fallRain {
          0% {
            transform: translateY(0) rotate(12deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes splashRipple {
          0% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatMote {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.9;
          }
        }

        @keyframes twinkleStar {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};

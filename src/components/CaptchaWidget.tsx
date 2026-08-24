import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerify: (token: string | null) => void;
  resetTrigger?: number;
  theme?: 'light' | 'dark';
}

// Characters pool for the captcha text (excluding easily confused chars like 0/O, 1/I)
const CHAR_POOL = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  onVerify,
  resetTrigger = 0,
  theme = 'light',
}) => {
  const [captchaCode, setCaptchaCode] = useState<string>('7W9K2');
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Generate 5-character random red text captcha
  const generateNewCaptcha = () => {
    setUserInput('');
    setIsCorrect(false);
    onVerify(null);

    let result = '';
    for (let i = 0; i < 5; i++) {
      result += CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
    }
    setCaptchaCode(result);
  };

  // Reset when trigger changes
  useEffect(() => {
    generateNewCaptcha();
  }, [resetTrigger]);

  // Validate answer as user types
  const handleInputChange = (val: string) => {
    setUserInput(val);

    const cleanedInput = val.trim().toUpperCase();
    if (cleanedInput === '') {
      setIsCorrect(false);
      onVerify(null);
      return;
    }

    if (cleanedInput === captchaCode.toUpperCase()) {
      setIsCorrect(true);
      const token = `red-captcha-verified-${Date.now()}-${captchaCode}`;
      onVerify(token);
    } else {
      setIsCorrect(false);
      onVerify(null);
    }
  };

  const isLight = theme === 'light';

  return (
    <div className="w-full my-2 space-y-1.5 font-sans">
      <div className="flex items-center justify-between text-xs font-semibold">
        <label className={`flex items-center gap-1.5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
          <KeyRound className="w-3.5 h-3.5 text-red-600" />
          <span>Security Verification</span>
        </label>
        <span className={`text-[10px] font-mono flex items-center gap-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <ShieldCheck className="w-3 h-3 text-red-600" />
          <span>Enter Red Text Code</span>
        </span>
      </div>

      <div
        className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 ${
          isCorrect
            ? isLight
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-sm'
            : isLight
            ? 'bg-red-50/40 border-red-200 text-zinc-900 hover:border-red-400 shadow-xs'
            : 'bg-black/40 border-red-500/30 text-white hover:border-red-500/60'
        }`}
      >
        {/* RED TEXT CAPTCHA BADGE DISPLAY */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="relative px-3 py-1.5 rounded-xl border-2 border-red-400/90 bg-red-100/90 shadow-inner flex items-center justify-center select-none overflow-hidden"
            title="Red Security Code"
          >
            {/* Visual Security Noise Grid & Strikethrough Line */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 1px, transparent 0, transparent 50%)',
                backgroundSize: '8px 8px',
              }}
            />
            <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[1.5px] bg-red-600/50 pointer-events-none transform -rotate-3" />

            {/* Stylized Red Characters */}
            <div className="flex items-center gap-1.5 z-10 font-mono font-black text-red-600 text-base sm:text-lg tracking-widest italic">
              {captchaCode.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block transform drop-shadow-xs transition-transform"
                  style={{
                    transform: `rotate(${((index % 3) - 1) * 6}deg) translateY(${index % 2 === 0 ? '-1px' : '1px'})`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* User Input to write the red text code */}
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter text"
              className={`w-28 sm:w-32 h-9 px-2.5 text-center font-mono font-bold uppercase text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                isCorrect
                  ? isLight
                    ? 'bg-white border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30'
                  : isLight
                  ? 'bg-white border-zinc-300 text-zinc-900 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 placeholder:text-zinc-400 placeholder:normal-case'
                  : 'bg-black/60 border-white/20 text-white focus:border-red-400 focus:ring-2 focus:ring-red-400/30 placeholder:text-zinc-500 placeholder:normal-case'
              }`}
              maxLength={6}
              aria-label="Enter red text captcha"
            />
          </div>
        </div>

        {/* Status Indicator & Refresh Button */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {isCorrect ? (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-xs ${
                isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified</span>
            </div>
          ) : (
            <span className={`text-[11px] font-medium hidden sm:inline-block ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Type red code
            </span>
          )}

          <button
            type="button"
            onClick={generateNewCaptcha}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-zinc-300 hover:border-red-300 shadow-xs'
                : 'bg-white/5 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 border-white/10 hover:border-red-500/30'
            }`}
            title="Generate new red text code"
            aria-label="New captcha code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

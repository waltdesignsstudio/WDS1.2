import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Calculator, ShieldCheck } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerify: (token: string | null) => void;
  resetTrigger?: number;
}

interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerify, resetTrigger = 0 }) => {
  const [problem, setProblem] = useState<MathProblem>({ num1: 7, num2: 5, operator: '+', answer: 12 });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Generate a random numbers-only math question
  const generateNewProblem = () => {
    setUserAnswer('');
    setIsCorrect(false);
    onVerify(null);

    const isAddition = Math.random() > 0.4;
    let n1 = Math.floor(Math.random() * 20) + 1; // 1 to 20
    let n2 = Math.floor(Math.random() * 20) + 1; // 1 to 20

    if (!isAddition) {
      // Ensure positive result for subtraction
      if (n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
      setProblem({
        num1: n1,
        num2: n2,
        operator: '-',
        answer: n1 - n2,
      });
    } else {
      setProblem({
        num1: n1,
        num2: n2,
        operator: '+',
        answer: n1 + n2,
      });
    }
  };

  // Reset when resetTrigger changes
  useEffect(() => {
    generateNewProblem();
  }, [resetTrigger]);

  // Validate answer whenever user types
  const handleInputChange = (val: string) => {
    // Only accept numeric input or minus sign
    const cleaned = val.replace(/[^0-9-]/g, '');
    setUserAnswer(cleaned);

    if (cleaned.trim() === '') {
      setIsCorrect(false);
      onVerify(null);
      return;
    }

    const numericVal = parseInt(cleaned, 10);
    if (!isNaN(numericVal) && numericVal === problem.answer) {
      setIsCorrect(true);
      const token = `math-solved-${Date.now()}-${problem.answer}`;
      onVerify(token);
    } else {
      setIsCorrect(false);
      onVerify(null);
    }
  };

  return (
    <div className="w-full my-2 space-y-1.5 font-sans">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
        <label className="flex items-center gap-1.5 text-zinc-300">
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          <span>Security Verification (Math Challenge)</span>
        </label>
        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Human Verification</span>
        </span>
      </div>

      <div
        className={`p-3 rounded-xl border transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
          isCorrect
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-sm'
            : 'bg-black/40 border-white/15 text-white hover:border-amber-500/40'
        }`}
      >
        {/* Math Question Display */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono font-bold text-sm tracking-wider select-none shadow-inner flex items-center gap-1.5">
            <span className="text-amber-300">{problem.num1}</span>
            <span className="text-zinc-400 font-extrabold">{problem.operator}</span>
            <span className="text-amber-300">{problem.num2}</span>
            <span className="text-zinc-400">=</span>
          </div>

          {/* User Answer Input */}
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="?"
              className={`w-16 h-9 text-center font-mono font-extrabold text-sm rounded-lg border outline-none transition-all ${
                isCorrect
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'bg-black/60 border-white/20 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50'
              }`}
              maxLength={4}
              aria-label="Math captcha answer"
            />
          </div>
        </div>

        {/* Status Indicator & Refresh Control */}
        <div className="flex items-center gap-2 ml-auto">
          {isCorrect ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified</span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400 hidden sm:inline-block">
              Type answer
            </span>
          )}

          <button
            type="button"
            onClick={generateNewProblem}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Generate new math question"
            aria-label="New math problem"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Cpu, FileCode, Clock, ShieldCheck, Zap, Copy, Check } from 'lucide-react';

interface BlueprintResult {
  title: string;
  recommendedStack: string[];
  executionDays: string;
  estimatedBudget: string;
  deliverables: string[];
  growthPlaybook: string[];
}

export const AIPlannerWidget: React.FC = () => {
  const [projectType, setProjectType] = useState('ecommerce');
  const [businessScale, setBusinessScale] = useState('startup');
  const [urgency, setUrgency] = useState('standard');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintResult | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let result: BlueprintResult;
      
      if (projectType === 'ecommerce') {
        result = {
          title: "High-Speed Direct-to-Consumer (D2C) Engine",
          recommendedStack: ["React 19 / Vite", "Tailwind CSS", "Razorpay / Stripe Gateway", "Edge CDN", "Google Schema & Analytics"],
          executionDays: urgency === 'express' ? "5-7 Days" : "10-14 Days",
          estimatedBudget: "₹18,000 – ₹28,000",
          deliverables: [
            "Sub-100ms LCP Zero-Lag Storefront",
            "Frictionless 1-Step Checkout Flow",
            "Automated WhatsApp Order Notification Webhook",
            "High-CTR Product Card Visual Hierarchy",
            "Mobile-First Responsive Layout"
          ],
          growthPlaybook: [
            "Configure Google My Business and Merchant Center",
            "Launch High-Contrast Thumbnails for Instagram Reels ads",
            "Implement Local SEO Schema targeting key metros"
          ]
        };
      } else if (projectType === 'creator') {
        result = {
          title: "Creator Authority & High-CTR Media Suite",
          recommendedStack: ["Adobe Premiere Pro 4K", "Photoshop CC", "ATS Bio Link Hub", "Dynamic Subtitles Engine"],
          executionDays: urgency === 'express' ? "2-3 Days" : "3-5 Days",
          estimatedBudget: "₹4,500 – ₹9,500",
          deliverables: [
            "10x High-CTR Psychological YouTube Thumbnails",
            "Dynamic Short-Form Reel Editing with Kinetic Captions",
            "Custom ATS-Friendly Speaker & Brand Bio Site",
            "Sound Engineered Audio & Cinematic Grading"
          ],
          growthPlaybook: [
            "A/B Test Thumbnails on high-velocity upload windows",
            "Hook rate retention optimization in first 3 seconds"
          ]
        };
      } else if (projectType === 'professional') {
        result = {
          title: "Executive Career Acceleration & ATS Profile",
          recommendedStack: ["Harvard ATS Formatting Engine", "Digital Bio Web Page", "Keyword Scoring Parser"],
          executionDays: urgency === 'express' ? "24-48 Hours" : "2-4 Days",
          estimatedBudget: "₹1,500 – ₹3,500",
          deliverables: [
            "ATS-Optimized Executive CV (98%+ Parser Score)",
            "Industry Keyword Alignment Matrix",
            "Interactive Portfolio Web Bio Link",
            "LinkedIn Profile Overhaul Suggestions"
          ],
          growthPlaybook: [
            "Direct application targeting with quantified metric bullets",
            "Executive outreach script templates"
          ]
        };
      } else {
        result = {
          title: "Enterprise Business Launch & Legal Registration Framework",
          recommendedStack: ["MSME Digital Portal", "Google Local Pack SEO", "Vite Enterprise Stack", "GST Pipeline"],
          executionDays: urgency === 'express' ? "4-6 Days" : "7-12 Days",
          estimatedBudget: "₹15,000 – ₹32,000",
          deliverables: [
            "Official MSME & Local Trade Certification setup",
            "GMB Top 3 Map Ranking Optimization",
            "Enterprise Corporate Profile Website",
            "Secure Digital Document Tracking Log"
          ],
          growthPlaybook: [
            "Regional NCR & Pan-India Citation Building",
            "Automated 5-Star Review Capture Funnel"
          ]
        };
      }

      setBlueprint(result);
      setIsGenerating(false);
    }, 600);
  };

  const copyBlueprint = () => {
    if (!blueprint) return;
    const text = `WALT DESIGNS & STUDIO - BUSINESS BLUEPRINT
Blueprint: ${blueprint.title}
Execution Timeline: ${blueprint.executionDays}
Budget Estimate: ${blueprint.estimatedBudget}
Tech Stack: ${blueprint.recommendedStack.join(', ')}
Key Deliverables:
${blueprint.deliverables.map(d => `- ${d}`).join('\n')}
Growth Playbook:
${blueprint.growthPlaybook.map(g => `- ${g}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#12141e] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Automated AI Planner Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Architect Your Business Blueprint
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Configure your parameters to receive a custom execution stack, deliverables matrix, and timeline.
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Param 1 */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
            1. Business Focus
          </label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full bg-[#181a26] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none cursor-pointer"
          >
            <option value="ecommerce">E-Commerce & D2C Brands</option>
            <option value="creator">Creator / YouTube Growth</option>
            <option value="professional">Executive Resume / Career</option>
            <option value="enterprise">Full Business & MSME Launch</option>
          </select>
        </div>

        {/* Param 2 */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
            2. Organization Stage
          </label>
          <select
            value={businessScale}
            onChange={(e) => setBusinessScale(e.target.value)}
            className="w-full bg-[#181a26] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none cursor-pointer"
          >
            <option value="startup">Seed / Early Indian Startup</option>
            <option value="creator">Individual Creator / Solo Founder</option>
            <option value="growing">Scaling Multi-Location Franchise</option>
          </select>
        </div>

        {/* Param 3 */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
            3. Turnaround Window
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full bg-[#181a26] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none cursor-pointer"
          >
            <option value="standard">Standard Milestone Track</option>
            <option value="express">Express Priority Rush</option>
          </select>
        </div>

      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 animate-spin text-black" />
              <span>Synthesizing Blueprint...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Custom Blueprint</span>
            </>
          )}
        </button>

        <span className="text-xs text-zinc-400 hidden sm:inline-block font-mono">
          Instant algorithm calculation • Zero lag
        </span>
      </div>

      {/* Blueprint Display Result */}
      {blueprint && (
        <div className="bg-[#0b0d14] border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">Synthesized Specification</span>
              <h4 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {blueprint.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={copyBlueprint}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>

              <a
                href="#enquiry-form"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-black flex items-center gap-1 transition-colors"
              >
                <span>Book This Stack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="text-zinc-500 block">Execution Matrix:</span>
              <span className="text-amber-400 font-bold text-sm">{blueprint.executionDays}</span>
            </div>
            <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="text-zinc-500 block">Affordable Estimate:</span>
              <span className="text-white font-bold text-sm">{blueprint.estimatedBudget}</span>
            </div>
            <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="text-zinc-500 block">On-Time Guarantee:</span>
              <span className="text-emerald-400 font-bold text-sm">100% Strictest SLAs</span>
            </div>
            <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="text-zinc-500 block">Direct Oversight:</span>
              <span className="text-zinc-200 font-bold text-sm">Priyanshu Kumar</span>
            </div>
          </div>

          {/* Deliverables List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              Handcrafted Architecture Deliverables:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {blueprint.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Tech Foundation:</span>
            {blueprint.recommendedStack.map((tech, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-cyan-300">
                {tech}
              </span>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

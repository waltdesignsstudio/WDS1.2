import React, { useState } from 'react';
import { 
  Code2, 
  FileText, 
  Video, 
  TrendingUp, 
  Stamp, 
  CheckCircle2, 
  Clock, 
  BadgeIndianRupee, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Layers, 
  Check, 
  HelpCircle,
  X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryForm } from '../components/EnquiryForm';
import { DIVISIONS, DivisionItem } from '../data/agencyData';

export const ServicesPage: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<DivisionItem | null>(null);

  const getDivisionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Video': return <Video className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Stamp': return <Stamp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080d16] text-zinc-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar currentPage="services" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* SERVICES HERO HEADER */}
        {/* ========================================================================= */}
        <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden border-b border-cyan-950/40">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Specialized Competence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Service Suite
            </h1>

            <p className="text-xs sm:text-base text-zinc-300 max-w-3xl mx-auto mt-2 leading-relaxed font-normal">
              Walt Designs & Studio offers handcrafted digital answers engineered for outstanding accuracy and click metrics with transparent structures and timely milestones.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-cyan-200/80">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">● 5 Dedicated Divisions</span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">● Zero-Lag Guarantee</span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">● Fixed Milestone SLAs</span>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 5 WALT DIVISIONS - DETAILED CARDS & MATRICES WITH SAMPLE IMAGES */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {DIVISIONS.map((division) => (
              <div
                key={division.id}
                id={division.id}
                className="bg-[#0c1220] border border-cyan-900/40 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-7 shadow-xl transition-all duration-200 group relative overflow-hidden"
              >
                {/* Division Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-cyan-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                      {getDivisionIcon(division.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Division 0{division.divisionNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/50 text-[11px] font-mono text-cyan-200">
                          {division.badge}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                        {division.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDivision(division)}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Inquire About Division</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Division Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                  
                  {/* Left Column: Sample Image & Description */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Sample Product Image */}
                    <div className="relative h-48 sm:h-60 rounded-xl overflow-hidden bg-zinc-950 border border-cyan-900/40">
                      <img 
                        src={division.image} 
                        alt={division.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-black/20"></div>
                      <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-cyan-500/40 text-xs font-mono text-cyan-300 font-semibold">
                        Sample: {division.sampleName}
                      </div>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {division.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Execution Matrix Box */}
                      <div className="bg-[#121b2d] border border-cyan-800/40 rounded-xl p-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>EXECUTION MATRIX</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white">
                          {division.executionMatrix}
                        </p>
                        <p className="text-[11px] text-zinc-400">Agreed milestone turnaround</p>
                      </div>

                      {/* Affordable Estimate Box */}
                      <div className="bg-[#121b2d] border border-cyan-800/40 rounded-xl p-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-amber-400 font-bold">
                          <BadgeIndianRupee className="w-3.5 h-3.5" />
                          <span>AFFORDABLE ESTIMATE</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-amber-300">
                          {division.affordableEstimate}
                        </p>
                        <p className="text-[11px] text-zinc-400">Transparent & zero hidden billing</p>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Standard Deliverables Checklist */}
                  <div className="lg:col-span-5 bg-[#0e1627] border border-cyan-900/50 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                        Standard Deliverables Included
                      </span>

                      <ul className="space-y-2">
                        {division.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200">
                            <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-cyan-900/40">
                      <a
                        href="#division-inquiry"
                        onClick={() => setSelectedDivision(division)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
                      >
                        <span>Need custom modifications for this division?</span>
                        <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>


        {/* ========================================================================= */}
        {/* TECHNICAL PILLARS */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-10 bg-[#060a12] border-t border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
                Engineering Tenets
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                The Walt Technical Doctrine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1 */}
              <div className="bg-[#0b101c] border border-cyan-900/50 rounded-xl p-5 space-y-2 hover:border-cyan-500/40 transition-all shadow-md">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Primacy of No-Lag
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We design and write codebase directly from raw states, avoiding cumbersome pre-built widgets that clog performance.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#0b101c] border border-cyan-900/50 rounded-xl p-5 space-y-2 hover:border-cyan-500/40 transition-all shadow-md">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  ATS CV Optimizations
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Our resume compilers run multiple verification passes matching standard corporate candidate criteria for maximum visibility.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#0b101c] border border-cyan-900/50 rounded-xl p-5 space-y-2 hover:border-cyan-500/40 transition-all shadow-md">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Full Regional Match
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Serving Delhi, Noida, Faridabad, and across India, our legal registration services support diverse business structures seamlessly.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* DIVISION INQUIRY PORTAL */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-12 relative" id="division-inquiry">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
                Direct Division Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Book Your Division Package
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Select your division and our team will contact you with a finalized milestone breakdown.
              </p>
            </div>

            <EnquiryForm 
              initialService={selectedDivision ? selectedDivision.title : 'Web Designing/Developing'}
              showTitle={false}
            />
          </div>
        </section>

      </main>

      {/* Division Modal */}
      {selectedDivision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-cyan-600/40 rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  {getDivisionIcon(selectedDivision.iconName)}
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">Division 0{selectedDivision.divisionNumber}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{selectedDivision.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDivision(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden h-40 sm:h-48 border border-cyan-800/40 relative">
              <img src={selectedDivision.image} alt={selectedDivision.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2.5 py-1 rounded text-xs font-mono text-cyan-300">
                Sample: {selectedDivision.sampleName}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedDivision.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 block">Execution Matrix</span>
                <span className="text-sm font-bold text-white">{selectedDivision.executionMatrix}</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 block">Affordable Estimate</span>
                <span className="text-sm font-bold text-amber-400">{selectedDivision.affordableEstimate}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
              >
                Close Window
              </button>
              <a
                href="#division-inquiry"
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Light Brown Footer with Movable Google Map */}
      <Footer />
    </div>
  );
};

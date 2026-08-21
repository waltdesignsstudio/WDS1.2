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
    <div className="min-h-screen bg-[#f0fdf4] text-zinc-900 flex flex-col selection:bg-emerald-600 selection:text-white font-sans">
      <Navbar currentPage="services" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* SERVICES HERO HEADER */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-10 overflow-hidden border-b border-emerald-200 bg-[#e7f9ee]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Specialized Agency Competence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight">
              Our Service Suite
            </h1>

            <p className="text-xs sm:text-base text-emerald-900/80 max-w-3xl mx-auto mt-2.5 leading-relaxed font-normal">
              Walt Designs & Studio offers handcrafted digital answers engineered for outstanding accuracy and click metrics with transparent structures and timely milestones.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-emerald-900">
              <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 shadow-sm font-semibold">● 5 Dedicated Divisions</span>
              <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 shadow-sm font-semibold">● Zero-Lag Guarantee</span>
              <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 shadow-sm font-semibold">● Fixed Milestone SLAs</span>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5 WALT DIVISIONS - DETAILED CARDS & MATRICES WITH SAMPLE IMAGES */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-14 relative bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {DIVISIONS.map((division) => (
              <div
                key={division.id}
                id={division.id}
                className="bg-white border border-emerald-200/80 hover:border-emerald-500 rounded-2xl p-5 sm:p-8 shadow-md hover:shadow-xl transition-all duration-200 group relative overflow-hidden"
              >
                {/* Division Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-emerald-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                      {getDivisionIcon(division.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                          Division 0{division.divisionNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 font-semibold">
                          {division.badge}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
                        {division.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDivision(division)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Inquire About Division</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Division Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                  
                  {/* Left Column: Sample Image & Description */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Sample Product Image */}
                    <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-zinc-100 border border-emerald-200 shadow-inner">
                      <img 
                        src={division.image} 
                        alt={division.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-md border border-emerald-400/40 text-xs font-mono text-emerald-200 font-semibold shadow-md">
                        Sample: {division.sampleName}
                      </div>
                    </div>

                    <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
                      {division.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      
                      {/* Execution Matrix Box */}
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-800 font-bold">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>EXECUTION MATRIX</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-emerald-950">
                          {division.executionMatrix}
                        </p>
                        <p className="text-[11px] text-emerald-700">Agreed milestone turnaround</p>
                      </div>

                      {/* Affordable Estimate Box */}
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-amber-800 font-bold">
                          <BadgeIndianRupee className="w-3.5 h-3.5 text-amber-600" />
                          <span>AFFORDABLE ESTIMATE</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-amber-900">
                          {division.affordableEstimate}
                        </p>
                        <p className="text-[11px] text-amber-700">Transparent & zero hidden billing</p>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Standard Deliverables Checklist */}
                  <div className="lg:col-span-5 bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold block border-b border-emerald-200 pb-2">
                        Standard Deliverables Included
                      </span>

                      <ul className="space-y-2.5">
                        {division.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                            <div className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-emerald-200">
                      <button
                        onClick={() => setSelectedDivision(division)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 group/link cursor-pointer"
                      >
                        <span>Need custom modifications for this division?</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </button>
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
        <section className="py-10 sm:py-14 bg-[#e8f8ed] border-t border-b border-emerald-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                Engineering Tenets
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1">
                The Walt Technical Doctrine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Pillar 1 */}
              <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-2.5 hover:border-emerald-400 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Primacy of No-Lag
                </h3>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  We design and write codebase directly from raw states, avoiding cumbersome pre-built widgets that clog performance.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-2.5 hover:border-emerald-400 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  ATS CV Optimizations
                </h3>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  Our resume compilers run multiple verification passes matching standard corporate candidate criteria for maximum visibility.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-2.5 hover:border-emerald-400 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Full Regional Match
                </h3>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  Serving Delhi, Noida, Faridabad, and across India, our legal registration services support diverse business structures seamlessly.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* DIVISION INQUIRY PORTAL */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-14 relative bg-[#f0fdf4]" id="division-inquiry">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                Direct Division Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1">
                Book Your Division Package
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-emerald-300 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  {getDivisionIcon(selectedDivision.iconName)}
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold">Division 0{selectedDivision.divisionNumber}</span>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900">{selectedDivision.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDivision(null)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden h-44 sm:h-52 border border-zinc-200 relative">
              <img src={selectedDivision.image} alt={selectedDivision.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2.5 left-2.5 bg-black/85 px-3 py-1 rounded-md text-xs font-mono text-emerald-300 font-semibold">
                Sample: {selectedDivision.sampleName}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {selectedDivision.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 font-semibold block text-[11px]">Execution Matrix</span>
                <span className="text-sm font-bold text-zinc-900">{selectedDivision.executionMatrix}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-800 font-semibold block text-[11px]">Affordable Estimate</span>
                <span className="text-sm font-bold text-amber-900">{selectedDivision.affordableEstimate}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold cursor-pointer"
              >
                Close Window
              </button>
              <a
                href="#division-inquiry"
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Proceed to Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Dark Brown Footer with Movable Google Map at bottom */}
      <Footer />
    </div>
  );
};

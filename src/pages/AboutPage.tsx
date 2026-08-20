import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Award, 
  Compass, 
  Flame, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Users, 
  FolderCheck,
  Star,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AGENCY_INFO } from '../data/agencyData';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0c0a] text-zinc-100 flex flex-col selection:bg-amber-600 selection:text-white">
      <Navbar currentPage="about" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* ABOUT HERO & STORY */}
        {/* ========================================================================= */}
        <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden border-b border-amber-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Creative Agency</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Walt Designs & Studio Story
              </h1>

              <div className="mt-3 space-y-2 text-xs sm:text-base text-zinc-300 leading-relaxed font-normal">
                <p>
                  Walt Designs & Studio was established to empower brands with elite digital engineering, bypassing cumbersome structures. Our approach is direct, stateful, and tailored to maximize human metrics.
                </p>
                <p>
                  Whether designing dynamic fullstack web applications, drafting ATS-friendly high-profile resumes, or conducting localized Google My Business SEO listings, our output remains completely bespoke and premium.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* FOUNDER & CREATIVE DIRECTOR SPOTLIGHT */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-[#181310] border border-amber-900/50 rounded-2xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Visual / Brand Logo Avatar */}
                <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <img 
                      src={AGENCY_INFO.logoUrl} 
                      alt="Walt Designs Studio Official" 
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl object-cover ring-2 ring-amber-500/30 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black px-2.5 py-0.5 rounded-full text-xs font-mono font-bold shadow-md">
                      Official Seal
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {AGENCY_INFO.founder}
                    </h3>
                    <p className="text-xs font-mono text-amber-400">
                      {AGENCY_INFO.founderRole}
                    </p>
                  </div>
                </div>

                {/* Founder Narrative & Quote */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="relative pl-4 sm:pl-6 border-l-2 border-amber-500/60">
                    <p className="text-base sm:text-xl italic text-amber-100 leading-snug">
                      "{AGENCY_INFO.founderQuote}"
                    </p>
                    <span className="block mt-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      — Priyanshu Kumar, Founder Signature
                    </span>
                  </div>

                  {/* 4 Key Milestone Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-amber-900/40">
                    <div className="bg-[#241a14] border border-amber-800/30 rounded-lg p-3">
                      <span className="text-xl sm:text-2xl font-bold text-white block">
                        120+
                      </span>
                      <span className="text-[11px] font-mono text-amber-300/80">
                        Customers Nationwide
                      </span>
                    </div>

                    <div className="bg-[#241a14] border border-amber-800/30 rounded-lg p-3">
                      <span className="text-xl sm:text-2xl font-bold text-white block">
                        80+
                      </span>
                      <span className="text-[11px] font-mono text-amber-300/80">
                        Projects Completed
                      </span>
                    </div>

                    <div className="bg-[#241a14] border border-amber-800/30 rounded-lg p-3">
                      <span className="text-xl sm:text-2xl font-bold text-amber-400 block">
                        4.1
                      </span>
                      <span className="text-[11px] font-mono text-amber-300/80">
                        Average User Rating
                      </span>
                    </div>

                    <div className="bg-[#241a14] border border-amber-800/30 rounded-lg p-3">
                      <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">
                        100%
                      </span>
                      <span className="text-[11px] font-mono text-amber-300/80">
                        On-Time Delivery
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* OPERATIONAL PILLARS: THE HANDCRAFTED STANDARD */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-10 bg-[#0a0807] border-t border-b border-amber-950/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                Operational Pillars
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                The Handcrafted Standard
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                We adhere strictly to our design philosophy so each division delivers world-class precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1: Artistic Precision */}
              <div className="bg-[#140f0c] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-5 space-y-2 shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Artistic Precision
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  No cookie-cutter templates. Every layout, typography selection, and alignment margin is handcrafted from scratch.
                </p>
              </div>

              {/* Pillar 2: Affordable Integrity */}
              <div className="bg-[#140f0c] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-5 space-y-2 shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Affordable Integrity
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Providing elite digital agency results without charging astronomical corporate prices.
                </p>
              </div>

              {/* Pillar 3: Algorithmic Edge */}
              <div className="bg-[#140f0c] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-5 space-y-2 shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Algorithmic Edge
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Whether writing clean code or editing YouTube video thumbnails, we optimize strictly for maximum speed, attention retention, and user metrics.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* OUR INDIAN FOOTPRINT & OFFICE LOCATIONS */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>National Coverage</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Our Indian Footprint
                </h2>

                <div className="space-y-3 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  <p>
                    With our operational core head office grounded in West Bengal, India, we have built physical collaboration linkages throughout the National Capital Region — covering Noida tech avenues, Delhi proper networks, and Faridabad industrial lines.
                  </p>
                  <p>
                    Our digital delivery mechanisms are fully remote-optimized, enabling clients all over India to access elite website engineering, video thumbnails, growth agency partnerships, and certified MSME licence filings instantly with no communication bottlenecks.
                  </p>
                </div>
              </div>

              {/* Office Locations Card */}
              <div className="lg:col-span-5 bg-[#17120e] border border-amber-900/50 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-white pb-2 border-b border-amber-900/40">
                  Office Locations & Channels
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-[#221812] rounded-lg border border-amber-800/30 space-y-0.5">
                    <span className="text-xs font-mono text-amber-400 uppercase font-semibold">Primary HQ</span>
                    <p className="text-white font-medium">West Bengal, India</p>
                  </div>

                  <div className="p-2.5 bg-[#221812] rounded-lg border border-amber-800/30 space-y-0.5">
                    <span className="text-xs font-mono text-amber-400 uppercase font-semibold">Local NCR Services</span>
                    <p className="text-white font-medium">Delhi, Faridabad, Noida (Virtual Presence & Mapping)</p>
                  </div>

                  <div className="p-2.5 bg-[#221812] rounded-lg border border-amber-800/30 space-y-0.5">
                    <span className="text-xs font-mono text-amber-400 uppercase font-semibold">E-Mail Address</span>
                    <p className="text-white font-mono">{AGENCY_INFO.email}</p>
                  </div>

                  <div className="p-2.5 bg-[#221812] rounded-lg border border-amber-800/30 space-y-0.5">
                    <span className="text-xs font-mono text-amber-400 uppercase font-semibold">Technical Coordinator</span>
                    <p className="text-white font-medium">Priyanshu Kumar (Founder) for seamless digital collaboration.</p>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href="/contact"
                    className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <span>Connect With Our Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Light Brown Footer with Movable Google Map */}
      <Footer />
    </div>
  );
};

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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      <Navbar currentPage="about" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* ABOUT HERO & STORY */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-10 overflow-hidden border-b border-zinc-200 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>The Creative Agency</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Walt Designs & Studio Story
              </h1>

              <div className="mt-3.5 space-y-2.5 text-xs sm:text-base text-zinc-700 leading-relaxed font-normal">
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
        <section className="py-10 sm:py-14 relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual / Brand Logo Avatar */}
                <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3.5">
                  <div className="relative">
                    <img 
                      src={AGENCY_INFO.logoUrl} 
                      alt="Walt Designs Studio Official" 
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover ring-4 ring-amber-500/20 shadow-xl"
                    />
                    <div className="absolute -bottom-2.5 -right-2.5 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md">
                      Official Seal
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">
                      {AGENCY_INFO.founder}
                    </h3>
                    <p className="text-xs font-mono font-bold text-amber-700">
                      {AGENCY_INFO.founderRole}
                    </p>
                  </div>
                </div>

                {/* Founder Narrative & Quote */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="relative pl-5 sm:pl-7 border-l-4 border-amber-500">
                    <p className="text-base sm:text-xl italic text-zinc-800 leading-relaxed font-serif">
                      "{AGENCY_INFO.founderQuote}"
                    </p>
                    <span className="block mt-3 text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
                      — Priyanshu Kumar, Founder Signature
                    </span>
                  </div>

                  {/* 4 Key Milestone Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-zinc-200">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 block">
                        120+
                      </span>
                      <span className="text-[11px] font-mono text-zinc-600 font-medium">
                        Customers Nationwide
                      </span>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 block">
                        80+
                      </span>
                      <span className="text-[11px] font-mono text-zinc-600 font-medium">
                        Projects Completed
                      </span>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 block">
                        4.1
                      </span>
                      <span className="text-[11px] font-mono text-zinc-600 font-medium">
                        Average User Rating
                      </span>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 block">
                        100%
                      </span>
                      <span className="text-[11px] font-mono text-zinc-600 font-medium">
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
        <section className="py-10 sm:py-14 bg-[#f8f9fa] border-t border-b border-zinc-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold block">
                Operational Pillars
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">
                The Handcrafted Standard
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1">
                We adhere strictly to our design philosophy so each division delivers world-class precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Pillar 1: Artistic Precision */}
              <div className="bg-white border border-zinc-200 hover:border-amber-400 rounded-2xl p-6 space-y-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Artistic Precision
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  No cookie-cutter templates. Every layout, typography selection, and alignment margin is handcrafted from scratch.
                </p>
              </div>

              {/* Pillar 2: Affordable Integrity */}
              <div className="bg-white border border-zinc-200 hover:border-emerald-400 rounded-2xl p-6 space-y-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Affordable Integrity
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  Providing elite digital agency results without charging astronomical corporate prices.
                </p>
              </div>

              {/* Pillar 3: Algorithmic Edge */}
              <div className="bg-white border border-zinc-200 hover:border-cyan-400 rounded-2xl p-6 space-y-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Algorithmic Edge
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  Whether writing clean code or editing YouTube video thumbnails, we optimize strictly for maximum speed, attention retention, and user metrics.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR INDIAN FOOTPRINT & OFFICE LOCATIONS */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-14 relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>National Coverage</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
                  Our Indian Footprint
                </h2>

                <div className="space-y-3 text-zinc-700 text-xs sm:text-sm leading-relaxed">
                  <p>
                    With our operational core head office grounded in West Bengal, India, we have built physical collaboration linkages throughout the National Capital Region — covering Noida tech avenues, Delhi proper networks, and Faridabad industrial lines.
                  </p>
                  <p>
                    Our digital delivery mechanisms are fully remote-optimized, enabling clients all over India to access elite website engineering, video thumbnails, growth agency partnerships, and certified MSME licence filings instantly with no communication bottlenecks.
                  </p>
                </div>
              </div>

              {/* Office Locations Card */}
              <div className="lg:col-span-5 bg-[#fafafa] border border-zinc-200 rounded-2xl p-5 sm:p-7 shadow-md space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 pb-2 border-b border-zinc-200">
                  Office Locations & Channels
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5 shadow-xs">
                    <span className="text-xs font-mono text-amber-700 uppercase font-bold">Primary HQ</span>
                    <p className="text-zinc-900 font-semibold">West Bengal, India</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5 shadow-xs">
                    <span className="text-xs font-mono text-amber-700 uppercase font-bold">Local NCR Services</span>
                    <p className="text-zinc-900 font-semibold">Delhi, Faridabad, Noida (Virtual Presence & Mapping)</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5 shadow-xs">
                    <span className="text-xs font-mono text-amber-700 uppercase font-bold">E-Mail Address</span>
                    <p className="text-zinc-900 font-mono font-semibold">{AGENCY_INFO.email}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5 shadow-xs">
                    <span className="text-xs font-mono text-amber-700 uppercase font-bold">Technical Coordinator</span>
                    <p className="text-zinc-900 font-semibold">Priyanshu Kumar (Founder) for seamless digital collaboration.</p>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href="/contact"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
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

      {/* Dark Brown Footer with Movable Google Map at bottom */}
      <Footer />
    </div>
  );
};

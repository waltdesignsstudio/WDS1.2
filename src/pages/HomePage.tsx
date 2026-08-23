import React from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  BadgeIndianRupee, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Users, 
  Headphones, 
  Activity,
  Layers,
  ArrowRight,
  Code2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CodingWatermark } from '../components/CodingWatermark';
import { ShowcaseGallery } from '../components/ShowcaseGallery';
import { FAQSection } from '../components/FAQSection';
import { EnquiryForm } from '../components/EnquiryForm';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { AGENCY_INFO, CORE_PILLARS, DIVISIONS } from '../data/agencyData';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar currentPage="home" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* HERO SECTION WITH CODING WATERMARK TRANSPARENT BACKGROUND */}
        {/* ========================================================================= */}
        <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden">
          <CodingWatermark />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-4">
              
              {/* Badge with Red Blinking Dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="font-bold tracking-wide">Zero-Lag Engineering & Pan-India Scale</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Walt Designs & Studio
              </h1>

              {/* Primary Lead Mission Text */}
              <p className="text-base sm:text-xl font-medium text-zinc-200 leading-snug max-w-3xl mx-auto">
                We engineer premium, professional digital products designed with zero lag. Scaling Indian startups, creators, and professionals with elite visual assets and fast execution.
              </p>

              {/* Secondary Dynamic Agency Offer Text */}
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Premium Website Design, Website Development, ATS Resume & CV Making, high-CTR Thumbnail Design, Video Editing, and Pan-India Business Registrations tailored to boost conversions.
              </p>

              {/* Hero Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/services"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore 5 Specialized Divisions</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#enquiry-form"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#151722] hover:bg-[#1f2233] text-zinc-200 hover:text-white border border-zinc-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Your Project</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                </a>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* MAGENTA THEMED SECTIONS BELOW HERO (STATS, PRODUCTS, COMMITMENTS, SHOWCASE, FORM) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-[#300538] via-[#1f0224] to-[#120115] relative text-white border-t border-fuchsia-900/40">
          
          {/* STATS SECTION */}
          <section className="relative z-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Stat 1 */}
              <div className="bg-[#24032b]/90 border border-fuchsia-700/40 rounded-2xl p-4 shadow-md hover:border-amber-400/60 transition-all group backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                    <AnimatedCounter end={120} suffix="+" duration={1200} />
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs font-mono text-fuchsia-200/80 uppercase font-bold">
                  {AGENCY_INFO.stats.customersLabel}
                </p>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#24032b]/90 border border-fuchsia-700/40 rounded-2xl p-4 shadow-md hover:border-amber-400/60 transition-all group backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                      <AnimatedCounter end={4.3} decimals={1} duration={1200} />
                    </span>
                    <span className="text-xs text-amber-300 font-mono font-bold">/ 5.0</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <p className="text-xs font-mono text-fuchsia-200/80 uppercase font-bold">
                  {AGENCY_INFO.stats.ratingLabel}
                </p>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#24032b]/90 border border-fuchsia-700/40 rounded-2xl p-4 shadow-md hover:border-amber-400/60 transition-all group backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                    <AnimatedCounter end={24} suffix="/7" duration={1200} />
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Headphones className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs font-mono text-fuchsia-200/80 uppercase font-bold">
                  {AGENCY_INFO.stats.supportLabel}
                </p>
              </div>

              {/* Stat 4 */}
              <div className="bg-[#24032b]/90 border border-fuchsia-700/40 rounded-2xl p-4 shadow-md hover:border-amber-400/60 transition-all group backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    <AnimatedCounter end={98} suffix="%" duration={1200} />
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs font-mono text-fuchsia-200/80 uppercase font-bold">
                  {AGENCY_INFO.stats.successRateLabel}
                </p>
              </div>

            </div>
          </section>


          {/* PRODUCT CARDS ACCORDING TO NAME WITH SAMPLE IMAGES */}
          <section className="py-8 sm:py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono mb-2 font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Our Products & Service Divisions</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Specialized Service Packages
                </h2>
                <p className="text-fuchsia-200/80 text-xs sm:text-sm mt-1.5">
                  Every division is equipped with dedicated specialists, sample deliverables, and transparent estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DIVISIONS.map((div) => (
                  <div 
                    key={div.id}
                    className="bg-[#24032b]/80 border border-fuchsia-800/60 hover:border-amber-400/60 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col group backdrop-blur-md"
                  >
                    {/* Sample Product Image with Label */}
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-black/60">
                      <img 
                        src={div.image} 
                        alt={div.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#24032b] via-transparent to-black/30"></div>
                      
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          {div.badge}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-[11px] font-mono text-zinc-200 bg-black/70 px-2 py-0.5 rounded truncate block">
                          {div.sampleName}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold mb-1">
                          <span>Division 0{div.divisionNumber}</span>
                          <span className="text-emerald-400">{div.affordableEstimate}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {div.title}
                        </h3>

                        <p className="text-fuchsia-100/70 text-xs mt-1 leading-relaxed line-clamp-3">
                          {div.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-fuchsia-900/60 flex items-center justify-between">
                        <span className="text-xs text-fuchsia-200/70 font-mono">
                          Turnaround: <span className="text-white font-bold">{div.executionMatrix}</span>
                        </span>

                        <a 
                          href={`/services#${div.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 group-hover:translate-x-0.5 transition-all"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>


          {/* CORE COMMITMENTS */}
          <section className="py-8 sm:py-10 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono mb-2 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>The Walt Commitment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Engineered For Maximum Reliability
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1 */}
                <div className="bg-[#24032b]/80 border border-fuchsia-800/60 hover:border-amber-400/50 rounded-2xl p-5 transition-all shadow-md group backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-amber-300 font-bold block mb-0.5">
                    Commitment 01
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">
                    On-time Service
                  </h3>
                  <p className="text-fuchsia-100/70 text-xs leading-relaxed">
                    Strictest compliance to agreed milestone timelines with zero drag.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#24032b]/80 border border-fuchsia-800/60 hover:border-amber-400/50 rounded-2xl p-5 transition-all shadow-md group backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                    <BadgeIndianRupee className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold block mb-0.5">
                    Commitment 02
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">
                    Affordable Prices
                  </h3>
                  <p className="text-fuchsia-100/70 text-xs leading-relaxed">
                    World-class premium designs engineered transparently without deep cost barriers.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#24032b]/80 border border-fuchsia-800/60 hover:border-amber-400/50 rounded-2xl p-5 transition-all shadow-md group backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-bold block mb-0.5">
                    Commitment 03
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">
                    Available all over India
                  </h3>
                  <p className="text-fuchsia-100/70 text-xs leading-relaxed">
                    Client nodes established key zones—including NCR and West Bengal headquarters.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#24032b]/80 border border-fuchsia-800/60 hover:border-amber-400/50 rounded-2xl p-5 transition-all shadow-md group backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-purple-300 font-bold block mb-0.5">
                    Commitment 04
                  </span>
                  <h3 className="text-base font-bold text-white mb-1">
                    High quality Service in budget
                  </h3>
                  <p className="text-fuchsia-100/70 text-xs leading-relaxed">
                    Exquisite elite-tier engineering and creative outcomes tailored to clear pricing targets.
                  </p>
                </div>

              </div>

            </div>
          </section>


          {/* EXQUISITE OUTCOMES / FEATURED AGENCY SHOWCASE */}
          <ShowcaseGallery />


          {/* FAQS SECTION */}
          <FAQSection />


          {/* DIRECT ENQUIRY FORM SECTION WITH GOLDEN FORM */}
          <section className="py-10 sm:py-16 relative" id="enquiry-form">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono mb-2 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>DIRECT PROJECT GATEWAY</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mt-1 tracking-tight">
                  Initiate Your Digital Project
                </h2>
                <p className="text-amber-200/80 text-xs sm:text-sm mt-1 font-medium">
                  Have a new website, resume build, video suite, or growth brief? Fill in the golden brief below.
                </p>
              </div>

              {/* Golden Styled Enquiry Form */}
              <EnquiryForm showTitle={false} theme="golden" />
            </div>
          </section>

        </div>

      </main>

      {/* Light Brown Footer with Movable Google Map */}
      <Footer />
    </div>
  );
};

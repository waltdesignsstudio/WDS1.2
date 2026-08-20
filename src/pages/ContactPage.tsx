import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ArrowUpRight, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryForm } from '../components/EnquiryForm';
import { AIPlannerWidget } from '../components/AIPlannerWidget';
import { AGENCY_INFO } from '../data/agencyData';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0a0d] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar currentPage="contact" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* CONTACT HERO HEADER */}
        {/* ========================================================================= */}
        <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden border-b border-amber-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inquiry Management</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Get In Touch With Us
            </h1>

            <p className="text-xs sm:text-base text-zinc-300 max-w-3xl mx-auto mt-2 leading-relaxed font-normal">
              Fill up our enquiry form, view our direct contact channels, or consult our automated AI planner model to design a comprehensive business blueprint.
            </p>

            {/* Guaranteed 12-Hour SLA Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-md">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Guaranteed first response in under 12 hours</span>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* DIRECT AGENCY ACCESS - 4 KEY CHANNELS */}
        {/* ========================================================================= */}
        <section className="py-6 sm:py-8 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                Direct Channels
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Direct Agency Access
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Consult our direct channels to bypass standard queues for instant coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Channel 1: Founder & Director */}
              <div className="bg-[#151216] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-4 space-y-2 transition-all group shadow-md">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase block">
                  FOUNDER & DIRECTOR
                </span>
                <h3 className="text-base font-bold text-white">
                  {AGENCY_INFO.founder}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Primary operational signatory for Walt Designs & Studio.
                </p>
              </div>

              {/* Channel 2: Executive Hotline */}
              <div className="bg-[#151216] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-4 space-y-2 transition-all group shadow-md">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase block">
                  EXECUTIVE HOTLINE
                </span>
                <a 
                  href={`tel:${AGENCY_INFO.phoneRaw}`}
                  className="text-base font-bold font-mono text-white hover:text-emerald-300 transition-colors block"
                >
                  {AGENCY_INFO.phone}
                </a>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Available for emergency web setup or urgent registration assistance.
                </p>
              </div>

              {/* Channel 3: Creative Directory */}
              <div className="bg-[#151216] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-4 space-y-2 transition-all group shadow-md">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block">
                  CREATIVE DIRECTORY
                </span>
                <a 
                  href={`mailto:${AGENCY_INFO.email}`}
                  className="text-xs font-bold font-mono text-white hover:text-cyan-300 transition-colors block truncate"
                >
                  {AGENCY_INFO.email}
                </a>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Checked continuously. Submit briefs directly to preserve high resolution.
                </p>
              </div>

              {/* Channel 4: Head Office Location */}
              <div className="bg-[#151216] border border-amber-900/40 hover:border-amber-500/40 rounded-xl p-4 space-y-2 transition-all group shadow-md">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-purple-400 font-bold uppercase block">
                  HEAD OFFICE LOCATION
                </span>
                <h3 className="text-base font-bold text-white">
                  {AGENCY_INFO.headOffice}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Direct physical registrations mapped and filed nationally.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* AUTOMATED AI PLANNER MODEL SECTION */}
        {/* ========================================================================= */}
        <section className="py-6 relative" id="ai-planner">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AIPlannerWidget />
          </div>
        </section>


        {/* ========================================================================= */}
        {/* LIVE INQUIRY FORM SECTION */}
        {/* ========================================================================= */}
        <section className="py-6 sm:py-8 relative" id="inquiry-form">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                Official Agency Intake
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Direct Inquiry Form
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                All submissions route directly to Founder Priyanshu Kumar with encrypted transmission.
              </p>
            </div>

            <EnquiryForm />
          </div>
        </section>

      </main>

      {/* Light Brown Footer with Movable Google Map */}
      <Footer />
    </div>
  );
};

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
    <div className="min-h-screen bg-[#4a0624] text-pink-50 flex flex-col selection:bg-pink-500 selection:text-white font-sans">
      <Navbar currentPage="contact" />

      <main className="flex-grow pt-14">
        
        {/* ========================================================================= */}
        {/* CONTACT HERO HEADER */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-10 overflow-hidden border-b border-pink-900/60 bg-[#3a041c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-mono font-bold mb-3 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Inquiry Management</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Get In Touch With Us
            </h1>

            <p className="text-xs sm:text-base text-pink-100/90 max-w-3xl mx-auto mt-2.5 leading-relaxed font-normal">
              Fill up our enquiry form, view our direct contact channels, or consult our automated AI planner model to design a comprehensive business blueprint.
            </p>

            {/* Guaranteed 12-Hour SLA Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#200210] border border-pink-400/30 text-amber-300 text-xs font-mono shadow-lg">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Guaranteed first response in under 12 hours</span>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* DIRECT AGENCY ACCESS - 4 KEY CHANNELS */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-10 relative bg-[#4a0624]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-300 font-bold block">
                Direct Channels
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Direct Agency Access
              </h2>
              <p className="text-pink-200/80 text-xs sm:text-sm mt-1">
                Consult our direct channels to bypass standard queues for instant coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Channel 1: Founder & Director */}
              <div className="bg-[#38041b] border border-pink-500/30 hover:border-pink-400 rounded-2xl p-5 space-y-2.5 transition-all group shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-pink-300 font-bold uppercase block">
                  FOUNDER & DIRECTOR
                </span>
                <h3 className="text-base font-bold text-white">
                  {AGENCY_INFO.founder}
                </h3>
                <p className="text-pink-200/70 text-xs leading-relaxed">
                  Primary operational signatory for Walt Designs & Studio.
                </p>
              </div>

              {/* Channel 2: Executive Hotline */}
              <div className="bg-[#38041b] border border-pink-500/30 hover:border-pink-400 rounded-2xl p-5 space-y-2.5 transition-all group shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase block">
                  EXECUTIVE HOTLINE
                </span>
                <a 
                  href={`tel:${AGENCY_INFO.phoneRaw}`}
                  className="text-base font-bold font-mono text-white hover:text-emerald-300 transition-colors block"
                >
                  {AGENCY_INFO.phone}
                </a>
                <p className="text-pink-200/70 text-xs leading-relaxed">
                  Available for emergency web setup or urgent registration assistance.
                </p>
              </div>

              {/* Channel 3: Creative Directory */}
              <div className="bg-[#38041b] border border-pink-500/30 hover:border-pink-400 rounded-2xl p-5 space-y-2.5 transition-all group shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase block">
                  CREATIVE DIRECTORY
                </span>
                <a 
                  href={`mailto:${AGENCY_INFO.email}`}
                  className="text-xs font-bold font-mono text-white hover:text-cyan-200 transition-colors block truncate"
                >
                  {AGENCY_INFO.email}
                </a>
                <p className="text-pink-200/70 text-xs leading-relaxed">
                  Checked continuously. Submit briefs directly to preserve high resolution.
                </p>
              </div>

              {/* Channel 4: Head Office Location */}
              <div className="bg-[#38041b] border border-pink-500/30 hover:border-pink-400 rounded-2xl p-5 space-y-2.5 transition-all group shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-bold uppercase block">
                  HEAD OFFICE LOCATION
                </span>
                <h3 className="text-base font-bold text-white">
                  {AGENCY_INFO.headOffice}
                </h3>
                <p className="text-pink-200/70 text-xs leading-relaxed">
                  Direct physical registrations mapped and filed nationally.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* AUTOMATED AI PLANNER MODEL SECTION */}
        {/* ========================================================================= */}
        <section className="py-8 bg-[#3d051e] border-y border-pink-900/60 relative" id="ai-planner">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AIPlannerWidget />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE INQUIRY FORM SECTION */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-12 relative bg-[#4a0624]" id="inquiry-form">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-7">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-300 font-bold block">
                Official Agency Intake
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Direct Inquiry Form
              </h2>
              <p className="text-pink-200/80 text-xs sm:text-sm mt-1">
                All submissions route directly to Founder Priyanshu Kumar with encrypted transmission.
              </p>
            </div>

            <EnquiryForm />
          </div>
        </section>

      </main>

      {/* Dark Brown Footer with Movable Google Map at bottom */}
      <Footer />
    </div>
  );
};

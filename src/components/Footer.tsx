import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#2d180f] text-[#f5ebe1] border-t border-[#4a2b1c] pt-12 pb-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* ========================================================================= */}
        {/* 1. MAIN AGENCY INFORMATION GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-[#4d2c1c]">
          
          {/* Col 1 & 2: Brand Profile & Executive Signatory */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={AGENCY_INFO.logoUrl} 
                alt="Walt Designs & Studio" 
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/40 shadow-lg"
              />
              <div>
                <span className="font-bold text-xl text-white block leading-tight">
                  {AGENCY_INFO.name}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  Zero-Lag Creative Engineering
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#d4beb0] leading-relaxed max-w-md">
              We engineer premium, professional digital products designed with zero lag. We scale Indian startups, creators, and professionals with bespoke websites, ATS-proof resumes, high-CTR media, and streamlined business registrations.
            </p>

            <div className="bg-[#1f1009] border border-[#52301f] rounded-xl p-4 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                <span className="uppercase tracking-wider">Executive Signatory</span>
                <span className="text-zinc-400 font-normal">Founder & Creative Director</span>
              </div>
              <p className="text-sm font-bold text-white">
                Priyanshu Kumar
              </p>
              <p className="text-xs text-[#d1b8a7] italic leading-relaxed">
                "We set out to challenge the average agency narrative in India. No slow templates, no generic templates, and no hidden billing brackets. Every Walt project gets my direct focus and execution signature."
              </p>
            </div>
          </div>

          {/* Col 3: Specialized Agency Divisions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Agency Divisions
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#d9c5b8]">
              {DIVISIONS.map((div) => (
                <li key={div.id}>
                  <a 
                    href={`/services#${div.id}`} 
                    className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-2 group"
                  >
                    <span className="text-amber-400 font-mono font-bold text-[11px]">0{div.divisionNumber}</span>
                    <span className="truncate group-hover:text-amber-200">{div.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#d9c5b8]">
              <li>
                <a href="/" className="hover:text-white hover:underline transition-colors block">Home Page</a>
              </li>
              <li>
                <a href="/services" className="hover:text-white hover:underline transition-colors block">Services & Pricing</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white hover:underline transition-colors block">About Walt Story</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white hover:underline transition-colors block">Direct Contact & Inquiry</a>
              </li>
              <li>
                <a href="/contact#ai-planner" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Business Blueprint</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Direct Contact
            </h4>
            
            <div className="space-y-2 text-xs text-[#e8d5c8]">
              <a 
                href={`tel:${AGENCY_INFO.phoneRaw}`} 
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1f1009] hover:bg-[#3d2114] border border-[#52301f] transition-all group"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-white">{AGENCY_INFO.phone}</span>
              </a>

              <a 
                href={`mailto:${AGENCY_INFO.email}`} 
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1f1009] hover:bg-[#3d2114] border border-[#52301f] transition-all group"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate font-semibold text-white">{AGENCY_INFO.email}</span>
              </a>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1f1009] border border-[#52301f]">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-[#d9c5b8]">{AGENCY_INFO.headOffice}</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="https://wa.me/918276825128?text=Hello%20Walt%20Designs%20%26%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold bg-[#4a154b] hover:bg-[#631c64] text-white transition-all shadow-md cursor-pointer border border-[#7a227b]"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE GOOGLE MAP (AT THE BOTTOM BELOW ALL SECTIONS) */}
        {/* ========================================================================= */}
        <div className="bg-[#1f1009] border border-[#52301f] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#3d2114]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Operational Grid & Head Office</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Explore Our Indian Footprint
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#2d180f] border border-[#5a3321] text-amber-200 font-medium">
                HQ: West Bengal
              </span>
              <span className="px-3 py-1 rounded-full bg-[#2d180f] border border-[#5a3321] text-amber-200 font-medium">
                Hubs: Delhi • Noida • Faridabad
              </span>
              <a 
                href="https://maps.google.com/?q=West+Bengal,+India" 
                target="_blank" 
                rel="noreferrer"
                className="px-3.5 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map (Movable, Zoomable, Interactive) */}
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-[#52301f] shadow-inner relative group">
            <iframe
              title="Walt Designs & Studio Operational Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770732.1837492585!2d85.36248446101183!3d22.98675688537651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sWest%20Bengal!5e0!3m2!1sen!2sin!4v1708000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>

            <div className="absolute bottom-3 left-3 bg-[#1e130a]/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-amber-500/40 text-xs font-mono text-amber-200 pointer-events-none shadow-lg">
              <span className="text-amber-400 font-bold">● HQ Node:</span> West Bengal, India | Serving Pan-India
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM COPYRIGHT & SECURITY BAR */}
        {/* ========================================================================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a88d7c]">
          <p>© {currentYear} {AGENCY_INFO.name}. All rights reserved. Registered in India.</p>
          <div className="flex items-center gap-4 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              Guaranteed Response in &lt;12 Hours
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Zero-Lag Engineering
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

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
    <footer className="relative bg-[#b8916d] text-[#1c1209] border-t border-[#946e4c] pt-10 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Interactive Movable Google Map Section */}
        <div className="mb-8 bg-[#f5ebe1] border border-[#a47b56] rounded-xl p-3.5 sm:p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#d8c2ad]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#733f17]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Active Operational Grid & Head Office</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1e130a] mt-0.5">
                Explore Our Indian Footprint
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-[#e8d8ca] border border-[#ba9676] text-[#331c0e] font-medium">
                HQ: West Bengal
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#e8d8ca] border border-[#ba9676] text-[#331c0e] font-medium">
                Hubs: Delhi • Noida • Faridabad
              </span>
              <a 
                href="https://maps.google.com/?q=West+Bengal,+India" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-[#29072e] hover:bg-[#3d0b44] text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map (Movable, Zoomable, Interactive) */}
          <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-[#b89574] shadow-inner relative group">
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

            <div className="absolute bottom-2.5 left-2.5 bg-[#1e130a]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#c29b74]/40 text-xs font-mono text-amber-200 pointer-events-none shadow-md">
              <span className="text-amber-400 font-bold">● HQ Node:</span> West Bengal, India | Serving Pan-India
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-8 border-b border-[#9c7452]">
          
          {/* Col 1 & 2: Brand Profile & Founder Signature */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={AGENCY_INFO.logoUrl} 
                alt="Walt Designs & Studio" 
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-[#29072e] shadow-md"
              />
              <div>
                <span className="font-bold text-lg text-[#1e130a] block leading-tight">
                  {AGENCY_INFO.name}
                </span>
                <span className="text-xs font-semibold text-[#542d10]">
                  Zero-Lag Creative Engineering
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#382212] leading-relaxed max-w-md">
              {AGENCY_INFO.tagline} We scale Indian startups, creators, and professionals with bespoke websites, ATS-proof resumes, high-CTR media, and streamlined business registrations.
            </p>

            <div className="bg-[#ebd9c8] border border-[#a47952] rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#5e2e0e] font-bold">
                <span className="uppercase">Executive Signatory</span>
                <span>{AGENCY_INFO.founderRole}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1e130a]">
                {AGENCY_INFO.founder}
              </p>
              <p className="text-xs text-[#4a2912] italic">
                "{AGENCY_INFO.founderQuote}"
              </p>
            </div>
          </div>

          {/* Col 3: Specialized Divisions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d270b]">
              Agency Divisions
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-[#2d180b]">
              {DIVISIONS.map((div) => (
                <li key={div.id}>
                  <a 
                    href={`https://www.waltdesignsstudio.in/services#${div.id}`} 
                    className="hover:text-black transition-colors flex items-center gap-1 group"
                  >
                    <span className="text-[#6e370f] font-mono">0{div.divisionNumber}</span>
                    <span className="truncate">{div.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Fast Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d270b]">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-[#2d180b]">
              <li>
                <a href="https://www.waltdesignsstudio.in/index" className="hover:text-black transition-colors">Home Page</a>
              </li>
              <li>
                <a href="https://www.waltdesignsstudio.in/services" className="hover:text-black transition-colors">Services & Pricing</a>
              </li>
              <li>
                <a href="https://www.waltdesignsstudio.in/about" className="hover:text-black transition-colors">About Walt Story</a>
              </li>
              <li>
                <a href="https://www.waltdesignsstudio.in/contact" className="hover:text-black transition-colors">Direct Contact & Inquiry</a>
              </li>
              <li>
                <a href="https://www.waltdesignsstudio.in/contact#ai-planner" className="hover:text-black transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#6e370f]" />
                  <span>AI Business Blueprint</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Hotline & Channels */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d270b]">
              Direct Contact
            </h4>
            
            <div className="space-y-2 text-xs text-[#2b160a]">
              <a 
                href={`tel:${AGENCY_INFO.phoneRaw}`} 
                className="flex items-center gap-2 p-2 rounded-lg bg-[#e2ccb9] hover:bg-[#d8beaa] border border-[#a47b56] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#5e2e0e] shrink-0" />
                <span className="font-semibold">{AGENCY_INFO.phone}</span>
              </a>

              <a 
                href={`mailto:${AGENCY_INFO.email}`} 
                className="flex items-center gap-2 p-2 rounded-lg bg-[#e2ccb9] hover:bg-[#d8beaa] border border-[#a47b56] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#5e2e0e] shrink-0" />
                <span className="truncate font-semibold">{AGENCY_INFO.email}</span>
              </a>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#e2ccb9] border border-[#a47b56]">
                <MapPin className="w-3.5 h-3.5 text-[#5e2e0e] shrink-0" />
                <span className="font-medium">{AGENCY_INFO.headOffice}</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="https://wa.me/918276825128?text=Hello%20Walt%20Designs%20%26%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-[#29072e] hover:bg-[#3d0b44] text-white transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#452712]">
          <p>© {currentYear} {AGENCY_INFO.name}. All rights reserved. Registered in India.</p>
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1 text-[#1c4728] font-bold">
              <Clock className="w-3 h-3" />
              Guaranteed Response in &lt;12 Hours
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#5e2e0e]" />
              Zero-Lag Engineering
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

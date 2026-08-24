import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  FileText
} from 'lucide-react';
import { AGENCY_INFO, DIVISIONS } from '../data/agencyData';

interface EnquiryFormProps {
  initialService?: string;
  className?: string;
  showTitle?: boolean;
  theme?: 'dark' | 'golden';
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ 
  initialService = 'Web Designing/Developing',
  className = '',
  showTitle = true,
  theme = 'golden'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service: initialService,
    details: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(AGENCY_INFO.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Phone: formData.phone,
          Email: formData.email,
          Location: formData.location,
          Service: formData.service,
          Project_Details: formData.details,
          Submitted_At: new Date().toISOString(),
          Agency_Portal: 'Walt Designs & Studio Official'
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'There was an issue sending your inquiry. Please reach out directly via WhatsApp or Phone.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      service: initialService,
      details: ''
    });
    setStatus('idle');
  };

  const isGold = theme === 'golden';

  return (
    <div className={`relative ${
      isGold 
        ? 'bg-gradient-to-b from-[#1c1404] via-[#161003] to-[#120c02] border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.22)]' 
        : 'bg-[#10121a] border border-white/10 shadow-2xl'
    } rounded-3xl p-6 sm:p-8 backdrop-blur-xl ${className}`}>
      
      {showTitle && (
        <div className="mb-4 pb-3 border-b border-amber-400/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono mb-1.5 font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Direct Client Pipeline</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Submit Your Project Brief
          </h3>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-0.5 font-medium">
            Fill in your specifications below. We review all briefs and respond within 12 hours guaranteed.
          </p>
        </div>
      )}

      {status === 'success' ? (
        <div className="py-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            Inquiry Received Successfully!
          </h4>
          
          <p className="text-zinc-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Thank you, <span className="text-amber-400 font-semibold">{formData.name}</span>. Founder Prince Kumar and our senior technical team have received your project details for <span className="text-amber-300">"{formData.service}"</span>.
          </p>

          <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl max-w-md mx-auto text-xs text-zinc-400 text-left space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Contact Phone:</span>
              <span className="text-zinc-200">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Region:</span>
              <span className="text-zinc-200">{formData.location || 'India'}</span>
            </div>
            <div className="flex justify-between">
              <span>Guaranteed Response:</span>
              <span className="text-emerald-400 font-bold">&lt; 12 Hours</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-medium transition-colors"
            >
              Submit Another Inquiry
            </button>
            <a
              href="https://wa.me/918276825128?text=Hi%2C%20I%20just%20submitted%20an%20inquiry%20on%20Walt%20Designs%20Studio."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Instant WhatsApp Connect</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {status === 'error' && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Submission Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Field: Name */}
            <div className="space-y-1">
              <label htmlFor="name" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isGold ? 'text-amber-400/80' : 'text-zinc-500'}`} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-amber-200/40 transition-all outline-none ${
                    isGold
                      ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                      : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Field: Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
                Phone / WhatsApp Number <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Phone className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isGold ? 'text-amber-400/80' : 'text-zinc-500'}`} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-amber-200/40 transition-all outline-none font-mono ${
                    isGold
                      ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                      : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Field: Email */}
            <div className="space-y-1">
              <label htmlFor="email" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isGold ? 'text-amber-400/80' : 'text-zinc-500'}`} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-amber-200/40 transition-all outline-none ${
                    isGold
                      ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                      : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Field: Location / Region */}
            <div className="space-y-1">
              <label htmlFor="location" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
                Location / Region <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <MapPin className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isGold ? 'text-amber-400/80' : 'text-zinc-500'}`} />
                <input
                  id="location"
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Delhi NCR, West Bengal, Bengaluru..."
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-amber-200/40 transition-all outline-none ${
                    isGold
                      ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                      : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
              </div>
            </div>

          </div>

          {/* Field: Service Selection */}
          <div className="space-y-1">
            <label htmlFor="service" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
              Select Required Service Division <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <select
                id="service"
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm text-white transition-all outline-none cursor-pointer ${
                  isGold
                    ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                    : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              >
                {DIVISIONS.map((div) => (
                  <option key={div.id} value={div.title} className="bg-[#1c1404] text-amber-100">
                    Division {div.divisionNumber}: {div.title} ({div.affordableEstimate})
                  </option>
                ))}
                <option value="Custom Multi-Division Package" className="bg-[#1c1404] text-amber-100">
                  Custom Multi-Division Bundle
                </option>
              </select>
            </div>
          </div>

          {/* Field: Project Details */}
          <div className="space-y-1">
            <label htmlFor="details" className={`block text-xs font-semibold ${isGold ? 'text-amber-200' : 'text-zinc-300'}`}>
              Project Details & Requirements <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <textarea
                id="details"
                name="details"
                required
                rows={3}
                value={formData.details}
                onChange={handleChange}
                placeholder="Share your goals, target launch timeline, reference designs, or specific specifications..."
                className={`w-full rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-amber-200/40 transition-all outline-none resize-none ${
                  isGold
                    ? 'bg-[#221a05] border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xs'
                    : 'bg-[#161822] border border-zinc-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Response guarantee: &lt;12 hrs</span>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="relative group overflow-hidden w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ring-2 ring-amber-300 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-950" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-950 group-hover:rotate-12 transition-transform" />
                  <span className="uppercase tracking-wider">Send Project Inquiry</span>
                  <Send className="w-4 h-4 text-purple-950" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Transmission
        </span>
        <span className="text-zinc-500">Guaranteed Response Under 12 Hours</span>
      </div>

    </div>
  );
};

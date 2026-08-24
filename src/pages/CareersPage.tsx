import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Award,
  GraduationCap,
  Building,
  Laptop,
  Check,
  MessageCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CareersPage: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    place: '',
    email: '',
    age: '',
    dob: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formspree.io/f/mqpzoyao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          role: 'Sales Assistant Manager (Freelance)',
          name: formData.name,
          phone_number: formData.number,
          place: formData.place,
          email: formData.email,
          age: formData.age,
          date_of_birth: formData.dob,
          submission_date: new Date().toISOString(),
          application_source: 'Walt Designs & Studio Careers Portal',
        }),
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        const data = await response.json();
        if (data && data.errors) {
          setErrorMessage(data.errors.map((error: any) => error.message).join(', '));
        } else {
          setErrorMessage('Unable to submit your application right now. Please try again.');
        }
        setFormStatus('error');
      }
    } catch {
      setErrorMessage('Network error while submitting. Please check your internet connection.');
      setFormStatus('error');
    }
  };

  const handleResetModal = () => {
    setIsApplyModalOpen(false);
    setFormStatus('idle');
    setFormData({
      name: '',
      number: '',
      place: '',
      email: '',
      age: '',
      dob: '',
    });
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Navigation */}
      <Navbar currentPage="careers" />

      {/* Main Careers Content Area */}
      <main className="pt-24 sm:pt-28 pb-20">
        
        {/* ========================================================================= */}
        {/* HERO SECTION (Clean White Background) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white border-b border-zinc-200/80 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Heading & Introduction */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>1 Freelance Role Available</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
                  Work with us...
                </h1>

                <p className="text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
                  Join <strong className="text-zinc-900 font-bold">Walt Designs & Studio</strong> as a remote Sales Assistant Manager. Earn performance-based incentives on every closed client with 100% remote flexibility and supportive company data guidance.
                </p>

                {/* Highlights Pill Badges */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <div className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Work From Home (WFH)</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rs. 1,200 / Client</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Zero Investment</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-700" />
                    <span>Freshers Welcome</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Apply Now for this Role</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Sample Images Grid (Modern Work & Team) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                      alt="Remote professional working on laptop"
                      className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                      alt="Modern agency collaborative meeting"
                      className="w-full h-32 sm:h-36 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                      alt="Executive communication and client sales"
                      className="w-full h-32 sm:h-36 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"
                      alt="Dedicated workspace and digital growth"
                      className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FREELANCE JOB DETAILS CARD SECTION */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 bg-zinc-50/70 border-b border-zinc-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* The Main Job Card */}
            <div className="bg-white rounded-3xl border-2 border-zinc-300 shadow-xl overflow-hidden font-sans">
              
              {/* Card Header (Red Accent Bar with Status) */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Open Opportunity</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Freelance Job Details:-
                  </h2>
                  <p className="text-xs sm:text-sm text-red-100 font-medium">
                    Walt Designs & Studio • Corporate Growth & Client Acquisitions
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-red-700 hover:bg-amber-300 hover:text-red-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Apply Now</span>
                </button>
              </div>

              {/* Card Body: Key Attributes Grid */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Age */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-extrabold">
                      18+
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Age</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">18+ Years</p>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Qualification</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">10th Passed (with English)</p>
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Job Type</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">Freelancing (Commision Based)</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Role</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">Sales Assistant Manager</p>
                    </div>
                  </div>

                  {/* Work Domain */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Work Domain</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">Work From Home (WFH)</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Location</span>
                      <p className="text-sm sm:text-base font-extrabold text-zinc-900">Remote (Anywhere in India)</p>
                    </div>
                  </div>

                </div>

                {/* Salary & Earnings Section */}
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>Compensation Matrix</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold text-zinc-700">Salary (Performance Based):</span>
                      <span className="text-lg sm:text-xl font-black text-emerald-800">
                        Rs. 1,200 / client
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-950 font-mono">
                      💰 e.g. 10 Clients Closed = 10 × Rs. 1,200 = <span className="text-emerald-700 underline font-black text-base">Rs. 12,000/-</span>
                    </div>

                    <p className="text-xs text-emerald-900 font-medium pt-1">
                      <strong>Basic Commission Range:</strong> Rs. 1,200/client (can be promoted to higher leadership commission tiers according to monthly performance).
                    </p>
                  </div>
                </div>

                {/* Skills Required */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono block">
                    Skills :-
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs font-bold text-zinc-800 shadow-2xs">
                      💬 Communication Skills
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs font-bold text-zinc-800 shadow-2xs">
                      📊 Google Sheet & Excel
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs font-bold text-zinc-800 shadow-2xs">
                      🌐 Language (Hindi / English / Regional)
                    </span>
                  </div>
                </div>

                {/* IMPORTANT NOTES (Numbered 1-6) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Important Notes & Clarifications :-</span>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-800 font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">This is an Investmentless work.</strong> (Never pay any money. Walt Designs & Studio does NOT charge registration or joining fees).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">Salary based on Performance</strong> — earn directly based on active closed leads and client conversions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">This is not a HR Hiring work.</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">This is not a Demat opening job.</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        5
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">Some Data will be provided by company for Support</strong> (Assigned lead pipelines, product decks, and scripts).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        6
                      </span>
                      <span>
                        <strong className="text-zinc-950 font-bold">Freshers can apply.</strong> Complete training, objection playbooks, and guidelines will be shared.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Call to Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100 border border-zinc-200">
                  <div>
                    <h3 className="text-sm font-extrabold text-zinc-900">
                      If Interested then apply now
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Click below to open the application form and submit your details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY JOIN WALT DESIGNS STUDIO (Sample Workspace Images & Culture) */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
                Remote Growth Culture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Empowering Independent Sales Talents
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600">
                Work from any city in India, manage your own working schedule, and receive instant performance commissions directly to your bank account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  100% Remote Flexibility
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Work from home, college, or anywhere. No daily office travel or fixed rigid shift timings.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Direct Commission Payouts
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Rs. 1,200 per successfully closed client with transparent digital verification and weekly payout sync.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Full Company Guidance
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Get high-converting WhatsApp scripts, pitch decks, objection playbooks, and company lead data for support.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* POP-UP APPLICATION MODAL (Formspree Integration: https://formspree.io/f/mqpzoyao) */}
      {/* ========================================================================= */}
      {isApplyModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleResetModal();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade"
        >
          <div className="relative w-full max-w-lg bg-white border-2 border-red-600/90 rounded-3xl shadow-2xl overflow-hidden font-sans text-zinc-900 animate-modal-pop max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white flex items-center justify-between border-b border-red-500/40 shrink-0">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-red-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Job Application Form</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Sales Assistant Manager
                </h3>
              </div>

              <button
                type="button"
                onClick={handleResetModal}
                className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                aria-label="Close application modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              
              {/* SUCCESS STATE */}
              {formStatus === 'success' ? (
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-zinc-950">
                      Application Submitted Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm mx-auto">
                      Thank you, <strong>{formData.name}</strong>. Your application has been dispatched to the Walt Talent Onboarding Desk. Our recruitment coordinator will review your profile and reach out via WhatsApp/Call.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600">
                    Form Reference: <strong>Formspree / mqpzoyao</strong>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetModal}
                      className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* APPLICATION FORM */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Error Notification */}
                  {formStatus === 'error' && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{errorMessage || 'Failed to submit application. Please try again.'}</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    
                    {/* 1. Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-600" />
                        <span>Full Name <span className="text-red-600">*</span></span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                      />
                    </div>

                    {/* 2. Number (Phone / WhatsApp) */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-red-600" />
                        <span>Phone / WhatsApp Number <span className="text-red-600">*</span></span>
                      </label>
                      <input
                        type="tel"
                        name="number"
                        required
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all font-mono"
                      />
                    </div>

                    {/* 3. Place (City / State) */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>Place (City & State) <span className="text-red-600">*</span></span>
                      </label>
                      <input
                        type="text"
                        name="place"
                        required
                        value={formData.place}
                        onChange={handleChange}
                        placeholder="e.g. Patna, Bihar or Delhi NCR"
                        className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                      />
                    </div>

                    {/* 4. Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-red-600" />
                        <span>Email Address <span className="text-red-600">*</span></span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul.sharma@example.com"
                        className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                      />
                    </div>

                    {/* 5. Age & 6. DOB in 2-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* Age */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-red-600" />
                          <span>Age (18+) <span className="text-red-600">*</span></span>
                        </label>
                        <input
                          type="number"
                          name="age"
                          min="18"
                          max="99"
                          required
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g. 21"
                          className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all font-mono"
                        />
                      </div>

                      {/* DOB */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-600" />
                          <span>Date of Birth (DOB) <span className="text-red-600">*</span></span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          required
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none transition-all font-mono"
                        />
                      </div>

                    </div>

                  </div>

                  {/* Submission Notice */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-normal">
                    By clicking submit, you confirm that you meet the 10th Passed + English qualification and are ready for performance-based commission freelancing.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending to Formspree...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application Now</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500 font-mono shrink-0">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Investment Guaranteed</span>
              </span>
              <span>Walt Careers Desk</span>
            </div>

          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

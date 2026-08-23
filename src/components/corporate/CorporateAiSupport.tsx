import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  DollarSign,
  Calendar,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DIVISIONS, AGENCY_INFO } from '../../data/agencyData';
import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
}

const QUICK_PROMPTS = [
  { label: 'Attendance Rules', prompt: 'How does daily attendance locking and midnight unlock work?' },
  { label: 'Sales Commission', prompt: 'Explain the commission rates, target indices, and incentive bonuses.' },
  { label: 'Division 01 Deliverables', prompt: 'What deliverables are included in Web Designing & Developing packages?' },
  { label: 'Handling Client Objections', prompt: 'How should I pitch to a client who thinks the website price is high?' },
  { label: 'Daily Data Reports', prompt: 'How do I log and verify closed client deals in Data Reports?' },
  { label: 'Expected Leads Follow-up', prompt: 'Give me a WhatsApp follow-up script for an interested prospect.' },
];

export const CorporateAiSupport: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const { profile } = useAuth();
  const corporateId = profile?.corporateUserId || 'WDS-EXEC';
  const employeeName = profile?.name || 'Executive';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${employeeName} (${corporateId})! 👋\n\nI am your Walt Corporate AI Help & Strategy Desk Assistant. I'm here 24/7 to assist you with sales closing scripts, commission policies, attendance protocols, expected lead conversions, and agency division specifics.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getKnowledgeResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('attendance') || q.includes('midnight') || q.includes('lock') || q.includes('reject') || q.includes('approve') || q.includes('hour')) {
      return `📅 **Walt Corporate Attendance Protocol**:
1. **1 Submission Per Calendar Day**: You can log attendance once per day between 00:00 and 23:59.
2. **Auto-Lock & Midnight Unlock**: Once submitted, your log is locked to prevent duplication and automatically unlocks at 12:00 AM midnight.
3. **Status Indicators**:
   • 🟢 **Approved**: Verified by Corporate Admin (Full credit logged)
   • 🟡 **Pending**: Awaiting administrative sync
   • 🟠 **In Review**: Administrator is verifying daily calls/outreach
   • 🔴 **Rejected**: Review rejected; check with admin for corrections.
4. **Requirement**: Minimum 8 daily productive work hours and expected client count logged.`;
    }

    if (q.includes('commission') || q.includes('target') || q.includes('salary') || q.includes('incentive') || q.includes('earnings') || q.includes('money')) {
      return `💰 **Corporate Compensation & Incentive Structure**:
• **Base Pay**: Guaranteed baseline monthly salary as assigned in your enterprise contract.
• **Performance Incentives**: 
  - Standard Deal Commission: **8% to 15%** of closed project volume.
  - Quarterly Target Achievement Bonus: Extra **5% cash incentive** when exceeding 100% target index.
  - High Volume Bonus: Top 3 Leaderboard rank holders receive additional quarterly recognition payouts.
• **Leaderboard Standings**: Updated in real-time as soon as Admin confirms closed client projects!`;
    }

    if (q.includes('division') || q.includes('service') || q.includes('package') || q.includes('deliverable') || q.includes('price')) {
      return `📦 **Walt Agency 5 Core Service Divisions**:
1. **Division 01 - Web Designing / Developing**: Custom responsive UI/UX, React/Next.js/WordPress development, SEO setup, 3-7 day turnaround. (Starts at ₹3,999 - ₹19,999+)
2. **Division 02 - ATS Resume & CV**: Recruiter-optimized keywords, PDF + Word formats, 24-48 hr delivery. (₹499 - ₹1,499)
3. **Division 03 - High-CTR YouTube Thumbnails**: 1080p Photoshop compositions, high contrast & curiosity hooks. (₹299 - ₹999/pack)
4. **Division 04 - Short & Long Video Editing**: Reels, Shorts, Podcasts, 4K color grading, dynamic sound design. (₹799 - ₹4,999+)
5. **Division 05 - Pan-India Business Registrations**: MSME, GST, Udyam, Private Limited consultancy. (₹999 - ₹7,499)
*Tip: Multi-division bundles convert 35% higher when pitched together!*`;
    }

    if (q.includes('objection') || q.includes('expensive') || q.includes('discount') || q.includes('pitch') || q.includes('client')) {
      return `🎯 **Client Objection Handling Playbook**:
• **Objection: "Your price is slightly higher than freelancers."**
  👉 *Response Script*: *"I completely understand! The difference is that freelancers often disappear or leave you with buggy code. With Walt Designs & Studio, you get a dedicated engineering team, zero-lag performance, structured milestones, 1-year technical support, and strict guaranteed delivery."*
• **Objection: "Can you give a discount?"**
  👉 *Response Script*: *"Instead of compromising on quality by cutting the price, what I can do today is include free premium SEO setup and 3 extra revision cycles worth ₹4,000 complimentary if we lock the project brief today."*`;
    }

    if (q.includes('script') || q.includes('whatsapp') || q.includes('follow up') || q.includes('follow-up') || q.includes('message')) {
      return `💬 **High-Converting WhatsApp Outreach Script**:
*"Hi [Client Name]! 👋 This is ${employeeName} from Walt Designs & Studio.*

*Following up regarding your inquiry for ${DIVISIONS[0].title}. We have reserved a priority onboarding slot for your project this week, which includes zero-lag architecture and custom deliverables.*

*Would you have 5 minutes today for a quick walkthrough or should I send over the sample design deck?*

*Best regards,*
*${employeeName} | Corporate Sales Manager | Walt Designs & Studio"*`;
    }

    return `💡 **Executive Advisory**:
As a corporate sales executive at Walt Designs & Studio:
1. **Prioritize Expected Data**: Contact assigned client leads within 15 minutes of assignment.
2. **Update Status**: Remember to switch lead status to "Interested" or "Not Interested" promptly.
3. **Daily Reports**: Submit all daily outreach numbers before 10:00 PM for verification.
4. For urgent escalations, reach Founder Priyanshu Kumar directly at +91 8276825128.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      let aiResponseText = '';
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the specialized Corporate AI Strategy & Employee Help Desk Assistant for "Walt Designs & Studio" (Founder: Priyanshu Kumar, HQ: Delhi NCR & West Bengal).
Employee Info: Name: ${employeeName}, Corporate ID: ${corporateId}, Role: ${profile?.corporateRole || 'Sales Executive'}.
Provide clear, actionable, corporate-grade answers on agency services (Web Dev, Resume, Thumbnails, Video Editing, Business Registration), commission structure (8-15% incentives + bonuses), attendance rules (1/day locked until midnight, approved/pending/in-review/rejected statuses), and high-conversion client objection scripts. Keep answers concise, highly professional, structured with bullet points.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: text,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });
        aiResponseText = response.text || '';
      }

      if (!aiResponseText) {
        // High quality grounded knowledge fallback
        aiResponseText = getKnowledgeResponse(text);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('AI Gen error, using corporate fallback:', err);
      const fallbackText = getKnowledgeResponse(text);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-purple-900/40 overflow-hidden flex flex-col h-[85vh] max-h-[700px] animate-modal-pop transform">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#2d0538] to-purple-950 text-white flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                  Corporate AI Assistant & Help Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-purple-950 font-mono">
                  LIVE 24/7
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Logged as: <strong className="font-mono text-white">{employeeName}</strong> ({corporateId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-gradient-to-b from-purple-50/40 via-white to-amber-50/30 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-900 text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-900 to-[#3b0764] text-white rounded-tr-none'
                      : 'bg-white border border-purple-100 text-zinc-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 font-mono text-right ${
                      isUser ? 'text-purple-200' : 'text-zinc-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-purple-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none p-3.5 text-xs text-purple-950 flex items-center gap-2 shadow-xs">
                <span className="animate-pulse font-bold">AI Assistant is analyzing enterprise guidelines...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Chips */}
        <div className="px-4 py-2.5 bg-amber-50/70 border-t border-amber-200/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-bold text-amber-900 uppercase font-mono shrink-0 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-700" /> Quick Topics:
          </span>
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:border-purple-600 hover:bg-purple-50 text-purple-950 text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-zinc-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about sales scripts, attendance locks, target earnings, division packages..."
            className="flex-1 bg-zinc-50 border border-zinc-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder-zinc-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 disabled:opacity-40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:pointer-events-none"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

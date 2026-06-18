import React, { useState, useEffect } from 'react';
import { QrCode, Shield, Zap, Globe, Link, Wifi, CreditCard, MessageCircle, FileText, Phone, CheckCircle2 } from 'lucide-react';
import { QR_TOOLS, QRTool } from './data/tools';
import QRCodeGenerator from './components/QRCodeGenerator';
import SaaSPaymentModal from './components/SaaSPaymentModal';
import { authService, UserStats } from './lib/firebase';

const getToolIcon = (type: string) => {
  switch (type) {
    case 'url': return <Link className="w-5 h-5" />;
    case 'wifi': return <Wifi className="w-5 h-5" />;
    case 'crypto': return <CreditCard className="w-5 h-5" />;
    case 'vcard': return <FileText className="w-5 h-5" />;
    case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
    case 'phone': return <Phone className="w-5 h-5" />;
    default: return <Globe className="w-5 h-5" />;
  }
};

export default function App() {
  const [activeTool, setActiveTool] = useState<QRTool>(QR_TOOLS[0]);
  const [user, setUser] = useState<UserStats | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [scans, setScans] = useState(49284);

  useEffect(() => {
    const refreshUser = async () => {
      const current = await authService.getCurrentUser();
      setUser(current);
    };
    refreshUser();

    const interval = setInterval(() => {
      if (Math.random() > 0.5) setScans(s => s + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#040408] text-[#F2F2FF] font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        h1, h2, h3, h4, h5, h6, .font-syne { font-family: 'Syne', sans-serif; }
        
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124,110,250,0.13), transparent 65%),
                      radial-gradient(ellipse 50% 40% at 80% 65%, rgba(192,132,252,0.07), transparent 60%),
                      radial-gradient(ellipse 40% 50% at 50% 0%, rgba(124,110,250,0.09), transparent 60%);
          animation: glow 9s ease-in-out infinite alternate;
        }
        @keyframes glow { 0% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#040408]/90 backdrop-blur-xl border-b border-[#1C1C2E]">
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="font-syne font-extrabold text-[19px] tracking-tight">
              A2Z<em className="font-normal not-italic text-[#A89EFF]">QR</em>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-[#8080A0] tracking-widest uppercase">
                {scans.toLocaleString()} Created
              </span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-[#12121E] border border-[#28283E] rounded-full text-xs font-medium">
                {user.isPro ? (
                  <span className="flex items-center gap-1.5 text-[#F472B6] font-bold">
                    <Shield className="w-3.5 h-3.5" /> PRO
                  </span>
                ) : (
                  <span className="text-[#8080A0]">FREE</span>
                )}
                <span className="w-px h-3 bg-[#28283E]"></span>
                <button 
                  onClick={() => { authService.logout(); setUser(null); }}
                  className="text-[#A89EFF] hover:text-white font-bold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all line-clamp-1 truncate"
              >
                Go Pro
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        <div className="hero-glow"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-syne text-[clamp(30px,5.5vw,58px)] font-extrabold tracking-tight leading-[1.05] mb-4">
            QR codes that look<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#A89EFF] via-[#C4B5FD] to-[#F472B6]">
              unlike anything else
            </span>
          </h1>
          <p className="text-[15px] text-[#8080A0] max-w-md mx-auto leading-relaxed mb-10">
            Choose a specialized tool. Enter your data. Generate high-resolution tracker tags tailored for your business.
          </p>
          
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10 text-xs font-semibold text-[#8080A0]">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free Forever Base</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Open Source Powered</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Expiry</span>
          </div>
        </div>
      </section>

      {/* Square Tools Grid */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 mb-10">
        <div className="mb-4 text-center">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#7C6EFA]">Select Tool Type ({QR_TOOLS.length} Available)</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#28283E] scrollbar-track-transparent">
          {QR_TOOLS.map((tool) => {
            const isActive = activeTool.slug === tool.slug;
            return (
              <button
                key={tool.slug}
                onClick={() => setActiveTool(tool)}
                className={`flex flex-col items-center justify-center text-center gap-2 p-3 aspect-square rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 border ${
                  isActive 
                    ? 'bg-[#12121E] border-[#7C6EFA] text-white shadow-[0_0_20px_rgba(124,110,250,0.15)] ring-1 ring-[#7C6EFA]' 
                    : 'bg-[#0A0A12] border-[#1C1C2E] text-[#8080A0] hover:border-[#28283E] hover:bg-[#12121E]'
                }`}
              >
                {getToolIcon(tool.type)}
                <span className="line-clamp-2 leading-tight">
                  {tool.name.replace(' QR Code', '').replace(' Generator', '').replace(' QR', '')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Generator Applet */}
      <section className="relative z-10 flex-1 w-full max-w-[800px] mx-auto px-4 pb-20">
        <div className="bg-[#0A0A12] border border-[#28283E] rounded-[22px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(124,110,250,0.05)]">
          <QRCodeGenerator 
            tool={activeTool} 
            user={user} 
            onOpenPayModal={() => setIsPayModalOpen(true)}
          />
        </div>
      </section>

      {/* Trust & Footer */}
      <footer className="border-t border-[#1C1C2E] py-14">
        <div className="max-w-[1100px] mx-auto px-5 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white mb-4">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="font-syne font-extrabold text-[19px] tracking-tight mb-2">
            A2Z<em className="font-normal not-italic text-[#A89EFF]">QR</em>
          </span>
          <p className="text-[12px] text-[#42425A] mb-1">
            © 2026 A2ZQR · Clean generation in your browser
          </p>
          <p className="text-[10px] text-[#42425A]">
            Powered by Open Source Community & <a href="https://github.com/qr-code-styling/qr-code-styling" target="_blank" rel="noreferrer" className="text-[#A89EFF] hover:underline">qr-code-styling</a>
          </p>
        </div>
      </footer>

      <SaaSPaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        initialUser={user}
        onPaymentSuccess={(u) => setUser(u)}
      />
    </div>
  );
}

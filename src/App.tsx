import React, { useState, useEffect } from 'react';
import { QrCode, Shield, Zap, Globe, Link, Wifi, CreditCard, MessageCircle, FileText, Phone, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Sparkles, HelpCircle, Box, LayoutGrid, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { QR_TOOLS, QRTool } from './data/tools';
import QRCodeGenerator from './components/QRCodeGenerator';
import SaaSPaymentModal from './components/SaaSPaymentModal';
import AssetLibraryViewer from './components/AssetLibraryViewer';
import PremiumTemplates from './components/PremiumTemplates';
import TemplateEditor from './components/TemplateEditor';
import LandingPage from './components/LandingPage';
import { authService, UserStats } from './lib/firebase';

import { TOOL_CONTENT_DATABASE } from './data/toolContent';
import { FAQS_DATABASE, DEFAULT_FAQ } from './data/faqs';
import { RELATED_TOOLS_DATABASE } from './data/relatedTools';

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

const getToolContent = (tool: QRTool) => {
  const matchKey = Object.keys(TOOL_CONTENT_DATABASE).find(k => tool.id === k || tool.id.includes(k) || k.includes(tool.id));
  if (matchKey) {
    return TOOL_CONTENT_DATABASE[matchKey];
  }

  const cleanName = tool.name
    .replace('QR Code', '')
    .replace('Generator', '')
    .replace('Maker', '')
    .replace('Creator', '')
    .trim();

  let dynamicUseCases = [
    `Direct Channel Sharing: Place your ${cleanName} code on printed materials or digital banner screens.`,
    `Frictionless Access: Let users bypass typing long, complicated link protocols manually with a quick scan.`,
    `Instant Promotions: Add vectors onto posters or packaging labels to drive higher scanner engagement rates.`
  ];

  if (tool.category === 'Crypto & Web3') {
    dynamicUseCases = [
      `Secure Wallet Sharing: Show QR vectors to safely receive decentralized ${cleanName} transfer payments.`,
      `Over-the-Counter Checkouts: Frame custom printed stickers next to cashier desks for convenient local payments.`,
      `Verified Address Verification: Instantly verify receiving blockchain addresses to completely eliminate manual copy-paste typos.`
    ];
  } else if (tool.category === 'Social Media') {
    dynamicUseCases = [
      `Instant Profile Growth: Direct offline clients to subscribe, follow, or interact with your ${cleanName} portal.`,
      `Content Distribution Hub: Embed within newsletters, video guides, and flyers to share modern interactive stories.`,
      `High-Speed Engagements: Let scanners immediately double-tap, like, retweet, or comment on your target feeds safely.`
    ];
  } else if (tool.category === 'Business & Promo') {
    dynamicUseCases = [
      `Polished NFC Business Cards: Embed customized ${cleanName} codes onto modern, contact-free business cards.`,
      `Retail Window Signages: Distribute scans across storefront showcases, pamphlets, and catalog sheets.`,
      `Lead Generation Portals: Place custom frames inside display stands to capture client inquiry forms.`
    ];
  } else if (tool.category === 'E-Commerce') {
    dynamicUseCases = [
      `Dynamic Purchase Links: Guide offline buyers to immediate secure ${cleanName} product checkout points.`,
      `Post-Purchase Inserts: Apply branded stickers inside shipping boxes to encourage instant feedback and support rating reviews.`,
      `Special Outlet Discounts: Deliver custom barcode voucher layouts at checkout points to secure repeat consumers.`
    ];
  }

  return {
    seoTitle: `${tool.name} Generator | Free Permanent QR Suite`,
    metaDescription: `${tool.description} Fast, robust, and permanent with zero-expiries. Customize and download high-DPI vectors in seconds.`,
    heroTitle: `${tool.name}`,
    heroSubtitle: tool.description,
    useCases: dynamicUseCases,
    benefits: [
      `Permanent Static Layout: Generated ${cleanName} patterns remain valid forever and never expire.`,
      `Zero Setup Backlogs: Direct device-to-address redirection requires no cloud servers or background accounts.`,
      `Full-Scope Customization: Personalize foreground and backend matrix designs using professional palette swatches.`
    ],
    bestPractices: [
      `Keep High Contrast: Maintain brilliant focal visibility by combining classic white backdrops with dark colors.`,
      `Utilize Calling Frames: Place clear instructional phrases such as "Scan to Connect" or "Scan to Pay" directly next to code blocks.`,
      `Double-Test Live Outputs: Always perform test scans with native Android and iOS devices before publishing large-scale print batches.`
    ]
  };
};

const getToolFAQs = (toolId: string) => {
  const matchKey = Object.keys(FAQS_DATABASE).find(k => toolId.includes(k) || k.includes(toolId));
  if (matchKey) {
    return FAQS_DATABASE[matchKey];
  }
  return DEFAULT_FAQ;
};

const getRelatedToolsItems = (toolId: string, allTools: QRTool[]) => {
  const matchKey = Object.keys(RELATED_TOOLS_DATABASE).find(k => toolId.includes(k) || k.includes(toolId));
  const ids = matchKey ? RELATED_TOOLS_DATABASE[matchKey].relatedIds : ['website-url', 'wifi-password', 'vcard-contact'];
  return allTools.filter(t => ids.some(id => t.id === id || t.slug.includes(id) || id.includes(t.id)));
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [directTemplateToEdit, setDirectTemplateToEdit] = useState<any | null>(null);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [activeTool, setActiveTool] = useState<QRTool>(QR_TOOLS[0]);
  const [showAllTools, setShowAllTools] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [user, setUser] = useState<UserStats | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [scans, setScans] = useState(49284);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const toolContent = getToolContent(activeTool);
  const toolFAQs = getToolFAQs(activeTool.id);
  const relatedTools = getRelatedToolsItems(activeTool.id, QR_TOOLS);

  const UI_CATEGORIES = [
    { label: 'All', filter: () => true },
    { label: '🏢 Business', filter: (t: QRTool) => t.category === 'B2B & Compliance' || t.category === 'Real Estate & Auto' || t.category === 'Crypto & Payments' || t.category === 'Business' },
    { label: '🍽️ Restaurant', filter: (t: QRTool) => t.category === 'Restaurant & Hospitality' || t.category === 'Restaurant' },
    { label: '🎉 Events', filter: (t: QRTool) => t.category === 'Education & Events' || t.category === 'Cultural & Festive' || t.category === 'Events' },
    { label: '❤️ Personal', filter: (t: QRTool) => t.category === 'Utilities & Daily Life' || t.category === 'Emotional & Safety' || t.category === 'Healthcare & Medical' || t.category === 'India Regional & Civic' || t.category === 'Personal' },
    { label: '🎨 Art & Math QR', filter: (t: QRTool) => t.category === 'Technical & Math' || t.category === 'Cyber Security & Privacy' || t.category === 'Art QR' },
  ];

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

  const handleEnterFromLanding = (toolId?: string, searchStr?: string, categoryName?: string) => {
    setShowLanding(false);

    if (toolId) {
      const match = QR_TOOLS.find(t => t.id === toolId || t.slug === toolId);
      if (match) {
        setActiveTool(match);
        setActiveCategory('All');
        setTimeout(() => {
          document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }

    if (searchStr) {
      const query = searchStr.toLowerCase();
      const match = QR_TOOLS.find(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.keywords.some(k => k.toLowerCase().includes(query)) ||
        t.category.toLowerCase().includes(query)
      );
      if (match) {
        setActiveTool(match);
        setActiveCategory('All');
        setTimeout(() => {
          document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }

    if (categoryName) {
      const foundCategory = UI_CATEGORIES.find(c => c.label.toLowerCase().includes(categoryName.toLowerCase()));
      if (foundCategory) {
        setActiveCategory(foundCategory.label);
        const firstTool = QR_TOOLS.find(t => foundCategory.filter(t));
        if (firstTool) {
          setActiveTool(firstTool);
        }
        setTimeout(() => {
          document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  if (directTemplateToEdit) {
    return (
      <TemplateEditor 
        template={directTemplateToEdit} 
        user={user}
        onOpenPayModal={() => setIsPayModalOpen(true)}
        onBack={() => setDirectTemplateToEdit(null)}
      />
    );
  }

  if (showLanding) {
    return (
      <LandingPage 
        onEnter={handleEnterFromLanding} 
        onSelectTemplate={setDirectTemplateToEdit}
      />
    );
  }

  if (showAssetLibrary) {
    return <AssetLibraryViewer onBack={() => setShowAssetLibrary(false)} />;
  }

  if (showTemplateGallery) {
    return (
      <PremiumTemplates 
        user={user} 
        onOpenPayModal={() => setIsPayModalOpen(true)} 
        onBack={() => setShowTemplateGallery(false)} 
      />
    );
  }

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setShowLanding(true)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="font-syne font-extrabold text-[19px] tracking-tight">
                A2Z<em className="font-normal not-italic text-[#A89EFF]">QR</em>
              </span>
            </div>
            
            <button 
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12121E] border border-[#28283E] text-[11px] font-bold text-[#A89EFF] hover:text-white rounded-lg hover:bg-[#1C1C2E] transition-all shadow-sm"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="/dashboard.html"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#12121E] border border-[#28283E] text-xs font-bold text-[#A89EFF] rounded-lg hover:text-white hover:border-[#7C6EFA] transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Console Panel
            </a>

            <button 
              onClick={() => setShowTemplateGallery(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <LayoutGrid className="w-4 h-4" />
              Templates
            </button>
            <div className="hidden md:flex items-center gap-1.5 mr-2">
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
          <h1 className="font-syne text-[clamp(28px,5.5vw,52px)] font-extrabold tracking-tight leading-[1.05] mb-4">
            Free Forever <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#A89EFF] via-[#C4B5FD] to-[#F472B6]">
              QR Codes
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6 text-sm font-semibold text-[#8080A0]">
            <span className="text-emerald-400 font-bold">No Expiry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#28283E]"></span>
            <span className="text-emerald-400 font-bold">No Scan Limits</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#28283E]"></span>
            <span className="text-emerald-400 font-bold">Privacy First</span>
          </div>

          <p className="text-[16px] text-[#A89EFF] max-w-md mx-auto leading-relaxed mb-10 font-medium">
            100+ QR Solutions for Business, Events & Personal Use
          </p>

          <div className="mb-12">
            <button 
              onClick={() => {
                document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:opacity-90 text-white text-[15px] font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(124,110,250,0.3)] hover:shadow-[0_0_40px_rgba(124,110,250,0.4)]"
            >
              Generate QR — It's Free
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap text-xs font-bold text-[#42425A] uppercase tracking-wider">
            <span>Restaurant</span>
            <span>•</span>
            <span>Airbnb</span>
            <span>•</span>
            <span>Wedding</span>
            <span>•</span>
            <span>Resume</span>
            <span>•</span>
            <span>UPI</span>
            <span>•</span>
            <span>Portfolio</span>
          </div>
        </div>
      </section>

      {/* Main Generator Applet */}
      <section id="generator-section" className="relative z-10 w-full max-w-[800px] mx-auto px-4 pb-12 pt-4">
        <div className="bg-[#0A0A12] border border-[#28283E] rounded-[22px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(124,110,250,0.05)]">
          <QRCodeGenerator 
            tool={activeTool} 
            user={user} 
            onOpenPayModal={() => setIsPayModalOpen(true)}
          />
        </div>
      </section>

      {/* Programmatic Schema-Driven Landing Content & Interactive FAQs */}
      <section className="relative z-10 w-full max-w-[850px] mx-auto px-4 pb-16">
        {/* Dynamic Header description block */}
        <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C6EFA]/5 rounded-full blur-2xl group-hover:bg-[#7C6EFA]/10 transition-colors duration-300"></div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#7C6EFA] bg-[#7C6EFA]/10 px-3 py-1 rounded-full mb-3 inline-block">
            Programmatic Metadata Guide
          </span>
          <h2 className="font-syne text-xl md:text-2xl font-bold text-white mb-2">
            {toolContent.heroTitle}
          </h2>
          <p className="text-sm text-[#8080A0] mb-6 leading-relaxed">
            {toolContent.heroSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#1C1C2E]">
            {/* Hindi localized titles */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">हिंदी विवरण (Hindi Localization)</span>
              <p className="font-bold text-sm text-white">{activeTool.hindiTitle || "निःशुल्क क्यूआर कोड"}</p>
              <p className="text-xs text-[#8080A0] leading-relaxed">{activeTool.hindiDesc || "स्थायी कोड बनाएं।"}</p>
            </div>
            <div className="bg-[#12121E]/40 border border-[#28283E]/40 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[8px] font-bold uppercase text-[#7C6EFA] tracking-widest block mb-1">Keywords mapped</span>
              <div className="flex flex-wrap gap-1.5">
                {activeTool.keywords.slice(0, 4).map(kw => (
                  <span key={kw} className="text-[10px] bg-black/40 text-[#8080A0] px-2 py-0.5 rounded border border-[#1C1C2E]">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits, Use cases & Best practices bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A0A12] border border-[#1C1C2E] p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <Sparkles className="w-4 h-4" /> Real Use Cases
              </span>
              <ul className="space-y-3.5 text-xs text-[#8080A0] leading-relaxed">
                {toolContent.useCases.map((uc, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#F59E0B] font-bold shrink-0">•</span>
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#0A0A12] border border-[#1C1C2E] p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <CheckCircle2 className="w-4 h-4" /> Lifetime Benefits
              </span>
              <ul className="space-y-3.5 text-xs text-[#8080A0] leading-relaxed">
                {toolContent.benefits.map((bn, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{bn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#0A0A12] border border-[#1C1C2E] p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[#C084FC] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <BookOpen className="w-4 h-4" /> Best Scan Practices
              </span>
              <ul className="space-y-3.5 text-xs text-[#8080A0] leading-relaxed">
                {toolContent.bestPractices.map((bp, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#C084FC] font-mono font-bold shrink-0">{i+1}.</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive FAQ accordion */}
        <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 mb-8">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C6EFA] bg-[#7C6EFA]/10 px-2.5 py-1 rounded-full mb-3 inline-block">
            Frequently Asked Questions
          </span>
          <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#7C6EFA]" /> Helpful Question & Answer Mappings ({toolFAQs.length})
          </h3>
          <div className="space-y-3">
            {toolFAQs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="border border-[#141424] bg-black/20 rounded-xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:bg-[#12121E]/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#7C6EFA]" /> : <ChevronDown className="w-4 h-4 text-[#8080A0]" />}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-[#8080A0] border-t border-[#141424] leading-relaxed bg-[#12121E]/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Programmatic Related Companion Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
            <h4 className="font-syne text-xs font-bold uppercase tracking-wider text-[#8080A0] mb-4">
              ✨ recommended companion generators for {activeTool.name.replace(' QR Code', '').replace(' Generator','')}:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedTools.map(companion => (
                <button
                  key={companion.slug}
                  onClick={() => {
                    setActiveTool(companion);
                    document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-[#141424] bg-[#0A0A12]/80 text-left hover:border-[#7C6EFA] hover:bg-[#12121E] transition-all group"
                >
                  <div className="text-[#8080A0] group-hover:text-[#7C6EFA] shrink-0 transition-colors">
                    {getToolIcon(companion.type || 'url')}
                  </div>
                  <span className="text-[11px] font-bold text-[#8080A0] group-hover:text-white line-clamp-1 leading-none transition-colors">
                    {companion.name.replace(' QR Code', '').replace(' Generator', '').replace(' QR', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Popular Use Cases */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 mb-20">
        <h2 className="font-syne text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#F59E0B]" /> Popular Use Cases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'Restaurant Menu QR', desc: 'Scan to view digital menu', icon: <FileText className="w-5 h-5" />, color: 'from-orange-400 to-red-500' },
            { title: 'Wedding RSVP QR', desc: 'Collect RSVPs instantly', icon: <MessageCircle className="w-5 h-5" />, color: 'from-pink-400 to-rose-500' },
            { title: 'Resume QR', desc: 'Link to your linkedin', icon: <Link className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500' },
            { title: 'Portfolio QR', desc: 'Showcase your work', icon: <Globe className="w-5 h-5" />, color: 'from-purple-400 to-fuchsia-500' },
            { title: 'Property QR', desc: 'Real estate listings', icon: <FileText className="w-5 h-5" />, color: 'from-emerald-400 to-teal-500' },
            { title: 'Event Registration', desc: 'Quick check-ins', icon: <CheckCircle2 className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' }
          ].map((useCase) => (
            <div key={useCase.title} className="bg-[#0A0A12] border border-[#1C1C2E] rounded-xl p-5 hover:border-[#28283E] transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${useCase.color} p-[1px] mb-4 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-[#12121E] rounded-[7px] flex items-center justify-center text-white">
                  {useCase.icon}
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-white mb-1">{useCase.title}</h3>
              <p className="text-xs text-[#8080A0]">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Gallery */}
      <section className="relative z-10 mb-20 overflow-hidden py-10 border-y border-[#1C1C2E] bg-[#0A0A12]/50">
        <div className="max-w-5xl mx-auto px-4 text-center mb-10">
          <h2 className="font-syne text-3xl font-extrabold mb-3">Beautiful QR Designs</h2>
          <p className="text-sm text-[#8080A0]">Never use a boring black-and-white QR code again.</p>
        </div>
        
        <div className="flex justify-center flex-wrap items-center gap-6 md:gap-10 max-w-5xl mx-auto px-4">
          {[
            { name: 'Wedding RSVP', color: 'bg-rose-500', url: 'https://api.qrserver.com/v1/create-qr-code/?data=wedding&color=ffffff&bgcolor=be123c' },
            { name: 'Restaurant', color: 'bg-[#7C6EFA]', url: 'https://api.qrserver.com/v1/create-qr-code/?data=restaurant&color=ffffff&bgcolor=1C1C2E' },
            { name: 'Airbnb', color: 'bg-emerald-500', url: 'https://api.qrserver.com/v1/create-qr-code/?data=airbnb&color=ffffff&bgcolor=10B981', scale: true },
            { name: 'Arabic Brand', color: 'bg-[#F59E0B]', url: 'https://api.qrserver.com/v1/create-qr-code/?data=arabic&color=ffffff&bgcolor=F59E0B' },
            { name: 'Property', color: 'bg-indigo-500', url: 'https://api.qrserver.com/v1/create-qr-code/?data=property&color=ffffff&bgcolor=4f46e5' },
            { name: 'Portfolio', color: 'bg-[#2DD4BF]', url: 'https://api.qrserver.com/v1/create-qr-code/?data=portfolio&color=ffffff&bgcolor=0f766e' },
            { name: 'Fibonacci', color: 'bg-[#A89EFF]', url: 'https://api.qrserver.com/v1/create-qr-code/?data=fibonacci&color=ffffff&bgcolor=312e81' },
            { name: 'Resume', color: 'bg-[#F472B6]', url: 'https://api.qrserver.com/v1/create-qr-code/?data=resume&color=ffffff&bgcolor=831843' }
          ].map((img, i) => (
            <div key={i} className={`relative group ${img.scale ? 'w-32 h-32 z-10' : 'w-24 h-24'}`}>
              <div className={`absolute inset-0 ${img.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              <img src={img.url} className={`relative w-full h-full rounded-2xl border-4 ${img.scale ? 'border-[#12121E]' : 'border-[#1C1C2E]'} shadow-2xl transition-transform ${img.scale ? 'scale-110 group-hover:scale-125' : 'hover:scale-110 hover:-rotate-3'}`} alt={img.name} />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#12121E] border border-[#28283E] text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 100+ QR Solutions Grid */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 mb-20" id="directory">
        <div className="text-center mb-8">
          <h2 className="font-syne text-3xl font-extrabold mb-3">100+ QR Solutions</h2>
          <p className="text-sm text-[#8080A0]">Find the exact tracking & sharing tool you need.</p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {UI_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.label 
                  ? 'bg-[#12121E] border-[#7C6EFA] text-white shadow-[0_0_15px_rgba(124,110,250,0.2)]' 
                  : 'bg-[#0A0A12] border-[#1C1C2E] text-[#8080A0] hover:border-[#28283E] hover:text-white hover:bg-[#12121E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#7C6EFA]">
            {activeCategory === 'All' ? `All Tools (${QR_TOOLS.length})` : `${activeCategory} Tools`}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#28283E] scrollbar-track-transparent">
          {QR_TOOLS.filter(UI_CATEGORIES.find(c => c.label === activeCategory)?.filter || (() => true)).map((tool) => {
            const isActive = activeTool.slug === tool.slug;
            return (
              <button
                key={tool.slug}
                onClick={() => {
                  setActiveTool(tool);
                  document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
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

      {/* Features Section */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 mb-20 text-center">
        <h2 className="font-syne text-3xl font-extrabold mb-10">Why EZQR.IO?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Free Forever Base</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">Unlimited creation for all fundamental static QR codes.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-[#F472B6]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Privacy First</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">Data is converted to QR on your device. We don't track your content.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-[#7C6EFA]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">No Expiry</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">Your static QR codes will never stop working. Ever.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-[#F59E0B]">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">100+ Solutions</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">The largest library of specific QR generation tools.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Beautiful Designs</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">Export directly to high-res, styled, and colorful patterns.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center mb-4 text-indigo-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Business Ready</h3>
            <p className="text-xs text-[#8080A0] max-w-[200px]">From restaurant menus to real estate property links.</p>
          </div>
        </div>
      </section>

      {/* Trust & Footer */}
      <footer className="border-t border-[#1C1C2E] py-14">
        <div className="max-w-[1100px] mx-auto px-5 text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white mb-4">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="font-syne font-extrabold text-[19px] tracking-tight mb-2">
            EZ<em className="font-normal not-italic text-[#A89EFF]">QR.IO</em>
          </span>
          <p className="text-[12px] text-[#42425A] mb-1">
            © 2026 EZQR.IO · Clean generation in your browser
          </p>
          <p className="text-[10px] text-[#28283E]">
            Powered by open source
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

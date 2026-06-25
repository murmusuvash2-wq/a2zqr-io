import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Crown, Box, LayoutGrid, Image as ImageIcon, Download, ArrowLeft, Wand2, Loader2, Shuffle, Lock, Unlock, Check, AlertCircle, Eye } from 'lucide-react';
import TemplateEditor from './TemplateEditor';
import { UserStats } from '../lib/firebase';

const CATEGORIES = ['All', 'Posters', 'vCards', 'Social Media', 'Badges', 'Events'];

export const DUMMY_TEMPLATES = [
  {
    id: 't-kawaii-pastel',
    title: 'Kawaii Pastel Doodles',
    category: 'Social Media',
    type: 'Free',
    layoutType: 'kawaii_pastel',
    imgUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
    description: 'Charming pastel pink layout with floating sweet treats, cherries, tulips, and teddy faces.',
    bgType: 'gradient',
    gradient: {
      from: '#FFF0F5',
      to: '#FFE4E1',
      angle: '135deg'
    },
    qrConfig: {
      fgColor: '#881B1B',
      bgColor: '#FFFFFF',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'SCAN HERE!', x: 95, y: 75, color: '#881B1B', fontSize: 28 },
      { content: 'telegram @designtekek', x: 85, y: 125, color: '#991B1B', fontSize: 15 },
      { content: 'NAMA STORE PRESET', x: 110, y: 485, color: '#881B1B', fontSize: 13 }
    ]
  },
  {
    id: 't-mascot-bear',
    title: 'Mascot Bear Signboard',
    category: 'Badges',
    type: 'Pro',
    layoutType: 'mascot_bear',
    imgUrl: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&q=80&w=400',
    description: 'Adorable cartoon bear holding up a custom chalkboard signboard hosting your QR.',
    bgType: 'gradient',
    gradient: {
      from: '#FEF3C7',
      to: '#FDE68A',
      angle: '180deg'
    },
    qrConfig: {
      fgColor: '#1E293B',
      bgColor: '#FFFFFF',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'SAY HELLO!', x: 110, y: 60, color: '#78350F', fontSize: 26 },
      { content: 'SCAN MY CUTE PASS', x: 100, y: 515, color: '#78350F', fontSize: 15 }
    ]
  },
  {
    id: 't-art-pencil',
    title: 'Artistic Sketch Portrait',
    category: 'Posters',
    type: 'Pro',
    layoutType: 'artistic_portrait',
    imgUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
    description: 'Charcoal pencil-sketch fine art merging a custom QR code beautifully into a paper texture.',
    bgType: 'gradient',
    gradient: {
      from: '#FAF9F6',
      to: '#F4F1EA',
      angle: '180deg'
    },
    qrConfig: {
      fgColor: '#1C1C1C',
      bgColor: 'transparent',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'ARTISTIC PORTRAIT', x: 80, y: 55, color: '#111111', fontSize: 24 },
      { content: 'SCAN TO SEE ARTIST PORTFOLIO', x: 50, y: 505, color: '#333333', fontSize: 14 }
    ]
  },
  {
    id: 't-japan-travel',
    title: 'Kyoto Sakura Travel Map',
    category: 'Events',
    type: 'Pro',
    layoutType: 'japan_travel',
    imgUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400',
    description: 'Traditional flat illustrations with Mt. Fuji, pagodas, red torii gates, and cherry blossoms.',
    bgType: 'gradient',
    gradient: {
      from: '#EFF6FF',
      to: '#DBEAFE',
      angle: '180deg'
    },
    qrConfig: {
      fgColor: '#1E3A8A',
      bgColor: '#FFFFFF',
      dotsStyle: 'classy',
      cornersStyle: 'square'
    },
    textElements: [
      { content: '日本留学', x: 130, y: 60, color: '#C2410C', fontSize: 26 },
      { content: 'JAPAN EDUCATION GUIDE', x: 70, y: 515, color: '#1E293B', fontSize: 15 }
    ]
  },
  {
    id: 't-1',
    title: 'Luxury Gold vCard',
    category: 'vCards',
    type: 'Pro',
    imgUrl: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&q=80&w=400',
    description: 'A stunning dark and gold layout for premium business contacts.',
    bgType: 'gradient',
    gradient: {
      from: '#1C1917',
      to: '#0C0A09',
      angle: '135deg'
    },
    qrConfig: {
      fgColor: '#E2B53E',
      bgColor: '#1C1917',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'GOLDEN CONTACT CARD', x: 50, y: 80, color: '#E2B53E', fontSize: 24 },
      { content: 'SCAN TO SAVE VCARD', x: 80, y: 480, color: '#A8A29E', fontSize: 16 }
    ]
  },
  {
    id: 't-2',
    title: 'Minimalist Cafe Menu',
    category: 'Posters',
    type: 'Free',
    imgUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400',
    description: 'Clean scan-to-view menu poster with natural aesthetic.',
    bgType: 'gradient',
    gradient: {
      from: '#F5F5F4',
      to: '#E7E5E4',
      angle: '180deg'
    },
    qrConfig: {
      fgColor: '#1C1917',
      bgColor: '#F5F5F4',
      dotsStyle: 'classy',
      cornersStyle: 'square'
    },
    textElements: [
      { content: 'THE SEED CAFE', x: 90, y: 80, color: '#1C1917', fontSize: 28 },
      { content: 'SCAN TO BROWSE TODAY’S MENU', x: 50, y: 480, color: '#78716C', fontSize: 16 }
    ]
  },
  {
    id: 't-3',
    title: 'Cyberpunk Event Pass',
    category: 'Events',
    type: 'Pro',
    imgUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=400',
    description: 'Neon styled entrance pass for modern tech events.',
    bgType: 'gradient',
    gradient: {
      from: '#090514',
      to: '#1C0D30',
      angle: '135deg'
    },
    qrConfig: {
      fgColor: '#D946EF',
      bgColor: 'transparent',
      dotsStyle: 'dots',
      cornersStyle: 'dot'
    },
    textElements: [
      { content: 'NEO-LIGHT CONVENTION', x: 45, y: 80, color: '#F43F5E', fontSize: 25 },
      { content: 'SECURE ADMISSION TICKET', x: 80, y: 480, color: '#D946EF', fontSize: 16 }
    ]
  },
  {
    id: 't-4',
    title: 'Wedding RSVP Frame',
    category: 'Posters',
    type: 'Pro',
    imgUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
    description: 'Elegant floral border design for quick guest responses.',
    bgType: 'gradient',
    gradient: {
      from: '#FAF8F5',
      to: '#ECE4DB',
      angle: '135deg'
    },
    qrConfig: {
      fgColor: '#8C7A6B',
      bgColor: '#FAF8F5',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'The Wedding of Julia & Mark', x: 40, y: 80, color: '#8C7A6B', fontSize: 24 },
      { content: 'PLEASE SCAN TO RESPOND', x: 75, y: 480, color: '#B0A296', fontSize: 16 }
    ]
  },
  {
    id: 't-5',
    title: 'Real Estate Signage',
    category: 'Posters',
    type: 'Free',
    imgUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400',
    description: 'High visibility outdoor sign for property viewings.',
    bgType: 'gradient',
    gradient: {
      from: '#0F172A',
      to: '#1E293B',
      angle: '90deg'
    },
    qrConfig: {
      fgColor: '#38BDF8',
      bgColor: '#FFFFFF',
      dotsStyle: 'square',
      cornersStyle: 'square'
    },
    textElements: [
      { content: 'OPEN HOUSE TODAY', x: 60, y: 80, color: '#FFFFFF', fontSize: 26 },
      { content: 'SCAN FOR VIRTUAL HD TOUR', x: 60, y: 480, color: '#38BDF8', fontSize: 16 }
    ]
  },
  {
    id: 't-6',
    title: 'Instagram Follow Badge',
    category: 'Social Media',
    type: 'Free',
    imgUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400',
    description: 'Bold gradient badge to grow your social audience.',
    bgType: 'gradient',
    gradient: {
      from: '#405DE6',
      to: '#C13584',
      angle: '45deg'
    },
    qrConfig: {
      fgColor: '#FFFFFF',
      bgColor: 'transparent',
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded'
    },
    textElements: [
      { content: 'JOIN THE COMMUNITY', x: 55, y: 80, color: '#FFFFFF', fontSize: 24 },
      { content: 'SCAN TO FOLLOW INSTAGRAM', x: 60, y: 480, color: '#FFD700', fontSize: 16 }
    ]
  },
  {
    id: 't-7',
    title: 'Scan Me Sticker Pack',
    category: 'Badges',
    type: 'Free',
    imgUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=400',
    description: 'High contrast circular stickers for product packaging.',
    bgType: 'gradient',
    gradient: {
      from: '#EA580C',
      to: '#7C2D12',
      angle: '135deg'
    },
    qrConfig: {
      fgColor: '#FFFFFF',
      bgColor: '#1E293B',
      dotsStyle: 'square',
      cornersStyle: 'square'
    },
    textElements: [
      { content: 'FRESH & ORGANIC', x: 75, y: 80, color: '#FFFFFF', fontSize: 24 },
      { content: 'SCAN FOR QUALITY PLEDGE', x: 60, y: 480, color: '#F97316', fontSize: 16 }
    ]
  },
  {
    id: 't-8',
    title: 'Corporate ID Card',
    category: 'vCards',
    type: 'Pro',
    imgUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    description: 'Secure, professional identification badge layout.',
    bgType: 'gradient',
    gradient: {
      from: '#1E3A8A',
      to: '#0F172A',
      angle: '180deg'
    },
    qrConfig: {
      fgColor: '#60A5FA',
      bgColor: '#0F172A',
      dotsStyle: 'classy',
      cornersStyle: 'square'
    },
    textElements: [
      { content: 'SECURE WORKSPACE ID', x: 60, y: 80, color: '#FFFFFF', fontSize: 24 },
      { content: 'RFID ENABLED • SCAN PASS', x: 65, y: 480, color: '#60A5FA', fontSize: 16 }
    ]
  }
];

const PRESET_IDEAS = [
  "A modern cyberpunk neon gaming arcade ticket with bright pink and blue grids",
  "A luxurious gold and black leaf floral RSVP card for a premium wedding",
  "A warm organic minimal matcha coffee shop menu board in wood-colored theme",
  "A bold dark red techno underground rave event pass",
  "A clean tech company conference check-in badge"
];

const LOADING_STEPS = [
  "✦ Reading your creative concept...",
  "✦ Mapping color swatches & font sizes...",
  "✦ Positioning visual QR scanner targets...",
  "✦ Aligning brand vectors & coordinates...",
  "✦ Finalizing elegant design layout..."
];

export default function PremiumTemplates({ 
  user, 
  onOpenPayModal, 
  onBack 
}: { 
  user: UserStats | null, 
  onOpenPayModal: () => void, 
  onBack: () => void 
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  
  // Admin Mode states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Daily dynamic templates from Gemini
  const [dailyTheme, setDailyTheme] = useState<any>(null);
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [dailyTemplates, setDailyTemplates] = useState<any[]>([]);

  // Prompt states
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [genError, setGenError] = useState<string | null>(null);

  // Load custom templates from localStorage
  const [templates, setTemplates] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ezqr_ai_templates');
      const parsed = saved ? JSON.parse(saved) : [];
      return [...parsed, ...DUMMY_TEMPLATES];
    } catch {
      return DUMMY_TEMPLATES;
    }
  });

  useEffect(() => {
    const fetchDailyTemplates = async () => {
      setIsDailyLoading(true);
      try {
        const response = await fetch('/api/daily-templates');
        if (!response.ok) {
          throw new Error('Failed to fetch daily templates');
        }
        const data = await response.json();
        setDailyTheme({
          date: data.date,
          dayName: data.dayName,
          themeTitle: data.themeTitle
        });
        
        // Map Unsplash images if needed for daily templates
        const mappedTemplates = (data.templates || []).map((t: any) => {
          if (t.bgType === 'image' && t.imageSearchTerm) {
            t.imgUrl = `https://images.unsplash.com/featured/400x533/?${encodeURIComponent(t.imageSearchTerm)}`;
          } else if (!t.imgUrl) {
            t.imgUrl = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400';
          }
          t.isDaily = true;
          return t;
        });

        setDailyTemplates(mappedTemplates);
      } catch (err) {
        console.error("Error fetching daily templates:", err);
      } finally {
        setIsDailyLoading(false);
      }
    };

    fetchDailyTemplates();
  }, []);

  // Unified list of templates: daily templates displayed first
  const combinedAllTemplates = [
    ...dailyTemplates,
    ...templates
  ];

  const filteredCombinedTemplates = activeTab === 'All'
    ? combinedAllTemplates
    : combinedAllTemplates.filter(t => t.category === activeTab);

  // Trigger Gemini API call on our backend
  const handleGenerateTemplate = async () => {
    if (!promptInput.trim()) return;
    
    setIsGenerating(true);
    setGenError(null);
    setCurrentStep(0);

    // Dynamic steps simulator
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2000);

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const generatedTemplate = await response.json();
      
      // Assign a unique ID
      generatedTemplate.id = `ai-${Date.now()}`;
      generatedTemplate.type = 'Pro'; // All AI templates are pro-quality!
      
      // Set default image source URL if gradient is not selected
      if (generatedTemplate.bgType === 'image' && generatedTemplate.imageSearchTerm) {
        generatedTemplate.imgUrl = `https://images.unsplash.com/featured/400x533/?${encodeURIComponent(generatedTemplate.imageSearchTerm)}`;
      } else {
        generatedTemplate.imgUrl = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400';
      }

      // Prepend to templates array
      const updatedTemplates = [generatedTemplate, ...templates];
      setTemplates(updatedTemplates);
      localStorage.setItem('ezqr_ai_templates', JSON.stringify(updatedTemplates.filter(t => t.id.startsWith('ai-'))));
      
      // Auto-select generated template to enter full editor!
      setSelectedTemplate(generatedTemplate);
      setPromptInput('');
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Failed to communicate with Gemini. Please make sure the server is fully started and environment variables are active.');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (preset: string) => {
    setPromptInput(preset);
  };

  const handleClearCustomTemplates = () => {
    if (confirm("Are you sure you want to clear your AI generated designs?")) {
      localStorage.removeItem('ezqr_ai_templates');
      setTemplates(DUMMY_TEMPLATES);
    }
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminMode(true);
      setShowAdminModal(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Invalid passcode. Try "admin123"');
    }
  };

  if (selectedTemplate) {
    return (
      <TemplateEditor 
        template={selectedTemplate} 
        user={user}
        onOpenPayModal={onOpenPayModal}
        onBack={() => setSelectedTemplate(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#040408] text-[#F2F2FF] font-sans">
      
      {/* Header */}
      <header className="bg-[#0A0A12] border-b border-[#1C1C2E] px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="text-[#8080A0] hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="h-6 w-px bg-[#1C1C2E]"></div>
          <div>
            <h1 className="font-syne text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#A89EFF]" />
              Premium Templates Gallery
            </h1>
            <p className="text-[11px] text-[#8080A0] mt-1 tracking-widest uppercase font-bold">
              High-End Coordinated Art & Poster Frames
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Creator/Admin Panel Authorization Trigger */}
          <button
            onClick={() => isAdminMode ? setIsAdminMode(false) : setShowAdminModal(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
              isAdminMode 
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/25' 
                : 'bg-[#12121E] text-[#8080A0] border-[#28283E] hover:text-white hover:bg-[#1C1C2E]'
            }`}
          >
            {isAdminMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isAdminMode ? 'Creator: Admin Active' : 'Creator Panel'}
          </button>

          {isAdminMode && templates.some(t => t.id.startsWith('ai-')) && (
            <button 
              onClick={handleClearCustomTemplates}
              className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
            >
              Clear AI Layouts
            </button>
          )}

          <div className="bg-[#7C6EFA]/10 text-[#A89EFF] px-4 py-2 rounded-lg text-xs font-bold border border-[#7C6EFA]/20 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Template Engine Active
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-56 bg-[#0A0A12]/50 border-r border-[#1C1C2E] p-6 shrink-0">
          <h3 className="text-xs font-bold text-[#8080A0] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" /> Categories
          </h3>
          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-4 md:pb-0 scrollbar-none">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap md:w-full ${
                  activeTab === category 
                    ? 'bg-[#12121E] text-white border border-[#28283E]' 
                    : 'text-[#8080A0] hover:text-white hover:bg-[#12121E]/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Gallery Container */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Gemini AI Layout Lab & Curated Challenge Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* AI Generator Lab */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#0F0F24]/90 to-[#181838]/80 rounded-2xl border border-[#2A2A54]/50 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C6EFA]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              
              <div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#7C6EFA]/15 rounded-xl border border-[#7C6EFA]/30">
                    <Wand2 className="w-6 h-6 text-[#A89EFF] animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-syne text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#A89EFF]" />
                        Gemini AI Studio Mockup
                      </h2>
                      <span className="bg-[#7C6EFA]/20 text-[#A89EFF] text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#7C6EFA]/30">
                        Premium AI Customizer
                      </span>
                    </div>
                    <p className="text-xs text-[#8080A0] mt-1 leading-relaxed">
                      Type your creative theme below (e.g. <em>"Organic green coffee menu"</em>, <em>"Cyberpunk DJ ticket"</em>, <em>"Elegant wedding gold"</em>). Gemini will design custom color swatches, coordinate font offsets, floating emojis, and vector hand-drawn outlines!
                    </p>
                  </div>
                </div>

                {/* Input Box */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    placeholder="Describe your design mockup... e.g. Neon Cyberpunk underground club flyer"
                    disabled={isGenerating}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateTemplate();
                    }}
                    className="flex-1 bg-[#06060F]/95 border border-[#1C1C2E] focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#4E4E6E] outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={handleGenerateTemplate}
                    disabled={isGenerating || !promptInput.trim()}
                    className="bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:opacity-90 disabled:opacity-40 text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg select-none shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Design Mockup
                      </>
                    )}
                  </button>
                </div>

                {/* Steps & loading simulator */}
                {isGenerating && (
                  <div className="mt-5 bg-[#06060F]/80 border border-[#1C1C2E] p-4 rounded-xl flex flex-col gap-3 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#A89EFF]">
                      <span>{LOADING_STEPS[currentStep]}</span>
                      <span>Step {currentStep + 1} of {LOADING_STEPS.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#121226] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] transition-all duration-1000 rounded-full" 
                        style={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error messaging */}
                {genError && (
                  <div className="mt-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl leading-relaxed">
                    {genError}
                  </div>
                )}
              </div>

              {/* Quick Presets */}
              <div className="mt-5 pt-4 border-t border-[#1C1C2E]">
                <div className="text-[10px] font-bold text-[#8080A0] uppercase tracking-wider mb-2.5">
                  Creative Mockup Starters
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IDEAS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetSelect(preset)}
                      disabled={isGenerating}
                      className="bg-[#0A0A1F] hover:bg-[#121235] border border-[#1C1C3F] hover:border-[#7C6EFA]/40 text-[#8080C0] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left truncate max-w-full"
                    >
                      ✦ {preset.length > 55 ? preset.substring(0, 52) + '...' : preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live AI Daily Curated Challenge */}
            <div className="lg:col-span-5 bg-[#0B0B18]/70 border border-[#23233D] rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C6EFA]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 flex items-center gap-1.5">
                    LIVE AI AUTO-SYNC ACTIVE
                  </span>
                </div>
                
                <div>
                  <h2 className="font-syne text-lg font-bold text-white tracking-tight leading-snug">
                    Today: {dailyTheme?.themeTitle || "Artistic Poster Frames"}
                  </h2>
                  <p className="text-[11px] text-[#8080A0] leading-relaxed mt-2">
                    Our dynamic design pipeline connects with Gemini every 24 hours to automatically generate 10 fresh, beautifully coordinated art prints, contact cards, badges, and scanner posters. Today is <strong className="text-white">{dailyTheme?.dayName || "Design Day"}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-[#121226]/80 border border-[#23233D] p-3 rounded-xl text-center">
                  <span className="block text-[8px] text-[#8080A0] font-bold uppercase tracking-wider">Date</span>
                  <span className="block text-white font-mono text-xs font-bold mt-1">
                    {dailyTheme?.date || new Date().toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="bg-[#121226]/80 border border-[#23233D] p-3 rounded-xl text-center">
                  <span className="block text-[8px] text-[#8080A0] font-bold uppercase tracking-wider">Day</span>
                  <span className="block text-[#A89EFF] text-xs font-bold mt-1">
                    {dailyTheme?.dayName || "Design Day"}
                  </span>
                </div>
                <div className="bg-[#121226]/80 border border-[#23233D] p-3 rounded-xl text-center">
                  <span className="block text-[8px] text-[#8080A0] font-bold uppercase tracking-wider">Spotlight</span>
                  <span className="block text-emerald-400 text-xs font-bold mt-1 truncate">
                    {dailyTheme ? (dailyTheme.dayName === "Sunday" || dailyTheme.dayName === "Thursday" ? "Posters" : dailyTheme.dayName === "Monday" ? "Badges" : dailyTheme.dayName === "Tuesday" ? "vCards" : dailyTheme.dayName === "Wednesday" ? "Social Media" : dailyTheme.dayName === "Friday" ? "Events" : "Events") : "All"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Template Gallery Title */}
          <div className="pt-2">
            <h2 className="font-syne text-lg font-bold text-white mb-2">
              Coordinated Template Catalog
            </h2>
            <p className="text-xs text-[#8080A0]">
              Browse unified, high-contrast creative templates & live AI designs. Click any design card to enter the editor.
            </p>
          </div>

          {isDailyLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#07070F] border border-[#16162E] rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-[#12121F] rounded-xl flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#7C6EFA] animate-spin" />
                  </div>
                  <div className="h-4 bg-[#12121F] rounded-md w-3/4"></div>
                  <div className="h-3 bg-[#12121F] rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCombinedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredCombinedTemplates.map(template => {
                const isAiGenerated = template.id.startsWith('ai-') || template.isDaily;
                
                let previewBgStyle: React.CSSProperties = {
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                };

                if (template.bgType === 'gradient' && template.gradient) {
                  const { from, to, via, angle = '135deg' } = template.gradient;
                  previewBgStyle.background = `linear-gradient(${angle}, ${from}, ${via ? via + ', ' : ''}${to})`;
                } else {
                  previewBgStyle.backgroundImage = `url(${template.imgUrl})`;
                }

                return (
                  <div 
                    key={template.id} 
                    className={`group relative bg-[#0A0A12] border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg flex flex-col ${
                      template.isDaily 
                        ? 'border-rose-500/25 hover:border-rose-500/60 hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]' 
                        : 'border-[#1C1C2E] hover:border-[#7C6EFA]/50 hover:shadow-[0_8px_30px_rgba(124,110,250,0.15)]'
                    }`}
                  >
                    {/* Image Canvas Container */}
                    <div className="aspect-[3/4] overflow-hidden relative bg-[#12121E]" style={previewBgStyle}>
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-transparent to-transparent opacity-90"></div>
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[90%]">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold tracking-wider text-white border border-white/10 uppercase">
                          {template.category}
                        </span>
                        {template.isDaily ? (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500/90 to-amber-500/90 backdrop-blur-md rounded text-[10px] font-black tracking-wider text-white border border-rose-500/20 uppercase flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-yellow-300" /> Daily AI
                          </span>
                        ) : isAiGenerated ? (
                          <span className="px-2 py-0.5 bg-[#7C6EFA]/80 backdrop-blur-md rounded text-[10px] font-bold tracking-wider text-white border border-[#7C6EFA]/30 uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Custom
                          </span>
                        ) : null}
                      </div>

                      <div className="absolute top-3 right-3">
                        {template.type === 'Pro' ? (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-[10px] font-bold tracking-wider text-white uppercase flex items-center gap-1 shadow-lg">
                            <Crown className="w-3 h-3" /> PRO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#1C1C2E]/80 backdrop-blur-md rounded text-[10px] font-bold tracking-wider text-[#A89EFF] border border-[#28283E] uppercase">
                            FREE
                          </span>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <button 
                          onClick={() => setSelectedTemplate(template)}
                          className="bg-[#7C6EFA] hover:bg-[#6b5ded] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                        >
                          <Eye className="w-4 h-4" /> Personalize Design
                        </button>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 bg-[#0A0A12] relative z-10 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-syne text-sm font-bold text-white mb-1 group-hover:text-[#A89EFF] transition-colors line-clamp-1">
                          {template.title}
                        </h3>
                        <p className="text-xs text-[#8080A0] leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between border-t border-[#1C1C2E] pt-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8080A0] uppercase tracking-wider">
                          <ImageIcon className="w-3.5 h-3.5" /> High-DPI Vector
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[#8080A0] text-sm border border-dashed border-[#1C1C2E] rounded-2xl bg-[#07070F]">
              No templates found matching category "{activeTab}". Please try selection "All" or other filters!
            </div>
          )}

        </div>

      </div>

      {/* Auth Passcode Dialog Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0A0A14] border border-[#28283E] rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
            <div className="text-center space-y-3 mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#7C6EFA]/10 flex items-center justify-center border border-[#7C6EFA]/20">
                <Lock className="w-5 h-5 text-[#A89EFF]" />
              </div>
              <h3 className="font-syne text-lg font-bold text-white">Creator Panel Access</h3>
              <p className="text-xs text-[#8080A0]">
                Enter creator security passcode to unlock backend Gemini AI Prompt generator tools.
              </p>
            </div>

            <form onSubmit={handleAdminVerify} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Passcode (e.g. admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#06060F] border border-[#28283E] focus:border-[#7C6EFA] focus:ring-1 focus:ring-[#7C6EFA] text-white placeholder-[#4E4E6E] rounded-xl px-4 py-3 text-sm text-center outline-none transition-all"
                  autoFocus
                />
              </div>

              {adminError && (
                <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword('');
                    setAdminError('');
                  }}
                  className="flex-1 bg-[#12121E] hover:bg-[#1C1C2E] text-[#8080A0] hover:text-white border border-[#28283E] font-bold text-sm py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:opacity-90 text-white font-bold text-sm py-2.5 rounded-xl transition-opacity shadow-lg"
                >
                  Unlock Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

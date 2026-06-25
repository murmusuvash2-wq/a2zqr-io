import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Download, Type, MousePointer2, Lock, Unlock, Sparkles, 
  Plus, Trash2, Globe, HelpCircle, CheckCircle2, Sliders, Crown, Settings2,
  LayoutTemplate, FileText, Tags, Square, Palette, Eye, RefreshCw, Layers,
  Check, Image as ImageIcon, CircleDot, Coffee, Wifi, Smartphone, Minimize2
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { UserStats } from '../lib/firebase';

interface TemplateEditorProps {
  template: any;
  user: UserStats | null;
  onOpenPayModal: () => void;
  onBack: () => void;
}

// Mockup backgrounds and sizing definitions
const MOCKUP_DETAILS: Record<string, { name: string; bgUrl: string; cardStyle: React.CSSProperties }> = {
  cafe_stand: {
    name: "☕ Bistro Table Stand",
    bgUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.52) perspective(1000px) rotateX(12deg) rotateY(-8deg) rotateZ(3deg) translateY(-10px)',
      boxShadow: '30px 30px 45px rgba(0,0,0,0.7), -5px -5px 15px rgba(255,255,255,0.05)',
    }
  },
  restaurant_stand: {
    name: "🍽️ Luxury Dinner Stand",
    bgUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.48) perspective(800px) rotateX(10deg) rotateY(12deg) translateY(0px)',
      boxShadow: '-35px 25px 50px rgba(0,0,0,0.8)',
    }
  },
  business_card: {
    name: "💼 Textured Slate Card",
    bgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.38) perspective(1200px) rotateX(45deg) rotateY(-6deg) rotateZ(-34deg) translateZ(40px) translateY(35px)',
      boxShadow: '15px 45px 65px rgba(0,0,0,0.9)',
    }
  },
  shop_sticker: {
    name: "🛍️ Boutique Window Decal",
    bgUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.54) perspective(1200px) rotateY(-4deg)',
      boxShadow: 'inset 0 0 120px rgba(255,255,255,0.12), 0 20px 40px rgba(0,0,0,0.3)',
      opacity: 0.94,
    }
  },
  wall_poster: {
    name: "🎨 Gallery Spotlight Wall",
    bgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.48) translateY(-25px)',
      boxShadow: '0 45px 90px rgba(0,0,0,0.85), inset 0 0 25px rgba(255,255,255,0.06)',
      border: '14px solid #1A1A1A',
    }
  },
  smartphone: {
    name: "📱 Lifestyle Mobile",
    bgUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', 
    cardStyle: {
      transform: 'scale(0.4) perspective(900px) rotateY(12deg) rotateX(6deg) rotateZ(1deg) translateY(-15px)',
      boxShadow: '20px 30px 45px rgba(0,0,0,0.65)',
    }
  }
};

// Auto-Contrast calculation helper
function getContrastRatio(fgHex: string, bgHex: string) {
  if (bgHex === 'transparent' || !bgHex) bgHex = '#ffffff';
  if (!fgHex) fgHex = '#000000';
  
  const parseHex = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c+c).join('');
    return {
      r: parseInt(clean.substring(0, 2), 16) || 0,
      g: parseInt(clean.substring(2, 4), 16) || 0,
      b: parseInt(clean.substring(4, 6), 16) || 0
    };
  };

  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  
  const lum = (color: {r:number; g:number; b:number}) => {
    const a = [color.r, color.g, color.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = lum(fg) + 0.05;
  const l2 = lum(bg) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

export default function TemplateEditor({ 
  template, 
  user, 
  onOpenPayModal, 
  onBack 
}: TemplateEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  // Local Template mutable state representing the "Experience Engine"
  const [localTemplate, setLocalTemplate] = useState(() => ({
    ...template,
    qrConfig: {
      fgColor: template.qrConfig?.fgColor || '#1E1E2F',
      bgColor: template.qrConfig?.bgColor || '#FFFFFF',
      dotsStyle: template.qrConfig?.dotsStyle || 'rounded',
      cornersStyle: template.qrConfig?.cornersStyle || 'extra-rounded',
    }
  }));
  
  // Tracking whether we are in Simple Personalize Form mode or Advanced Drag-&-Drop Canvas mode
  const [isFullCustomizeMode, setIsFullCustomizeMode] = useState(false);
  
  // Premium Layout Engine States
  const [activeTab, setActiveTab] = useState<'template' | 'poster' | 'sticker' | 'frame' | 'qr_style' | 'mockup'>('template');
  const [selectedMockup, setSelectedMockup] = useState<string>('none');
  const [posterFormat, setPosterFormat] = useState<'instagram' | 'a3' | 'a4' | 'flyer' | 'counter_stand'>('instagram');
  const [showSafeGuides, setShowSafeGuides] = useState(false);
  
  const [stickerSize, setStickerSize] = useState<'40mm' | '60mm' | '80mm' | '100mm'>('60mm');
  const [stickerShape, setStickerShape] = useState<'circle' | 'square' | 'die_cut'>('die_cut');
  const [stickerText, setStickerText] = useState('SCAN ME');
  const [stickerIcon, setStickerIcon] = useState<'none' | 'coffee' | 'wifi' | 'shop' | 'star'>('none');
  const [stickerEnabled, setStickerEnabled] = useState(false);
  
  const [frameStyle, setFrameStyle] = useState<'none' | 'luxury_gold' | 'neon_accent' | 'minimalist_outline' | 'cherry_blossom'>('none');
  const [logoOverlay, setLogoOverlay] = useState<'none' | 'wifi' | 'coffee' | 'location'>('none');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // QR code target input data
  const [qrData, setQrData] = useState('https://ezqr.io');

  // Dynamic text elements state
  const [elements, setElements] = useState(() => {
    if (localTemplate.textElements && localTemplate.textElements.length > 0) {
      return localTemplate.textElements.map((el: any, i: number) => ({
        id: `el-${i}`,
        type: 'text',
        content: el.content,
        x: el.x || 50,
        y: el.y || 80 + (i * 40),
        color: el.color || '#ffffff',
        fontSize: el.fontSize || 22,
        isEditing: false
      }));
    }
    return [
      { id: '1', type: 'text', content: 'SCAN TO CONNECT', x: 80, y: 80, color: '#ffffff', fontSize: 22, isEditing: false },
      { id: '2', type: 'text', content: localTemplate.title, x: 50, y: 120, color: '#A89EFF', fontSize: 26, isEditing: false }
    ];
  });
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize and update the QR Code on input/template styling change
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      
      const qrColor = localTemplate.qrConfig?.fgColor || '#1E1E2F';
      const qrBg = localTemplate.qrConfig?.bgColor || '#FFFFFF';
      const dotsStyle = localTemplate.qrConfig?.dotsStyle || 'rounded';
      const cornersStyle = localTemplate.qrConfig?.cornersStyle || 'extra-rounded';

      let logoUrl = '';
      if (logoOverlay === 'wifi') logoUrl = 'https://api.iconify.design/lucide:wifi.svg?color=' + encodeURIComponent(qrColor);
      if (logoOverlay === 'coffee') logoUrl = 'https://api.iconify.design/lucide:coffee.svg?color=' + encodeURIComponent(qrColor);
      if (logoOverlay === 'location') logoUrl = 'https://api.iconify.design/lucide:map-pin.svg?color=' + encodeURIComponent(qrColor);

      const qrCode = new QRCodeStyling({
        width: 170,
        height: 170,
        data: qrData,
        dotsOptions: {
          color: qrColor,
          type: dotsStyle as any
        },
        backgroundOptions: {
          color: qrBg
        },
        cornersSquareOptions: {
          color: qrColor,
          type: cornersStyle as any
        },
        image: logoUrl || undefined,
        imageOptions: {
          crossOrigin: 'anonymous',
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 4
        }
      });
      
      qrCode.append(qrRef.current);
      qrCodeInstance.current = qrCode;
    }
  }, [localTemplate, qrData, logoOverlay]);

  // Handle Drag & Drop logic (Active ONLY in Pro Full Customize Mode)
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isFullCustomizeMode) return; // Prevent drag-drop if not in Pro mode
    if (elements.find(el => el.id === id)?.isEditing) return;
    
    setSelectedId(id);
    setIsDragging(true);
    
    const el = document.getElementById(`element-${id}`);
    if (el && canvasRef.current) {
      const rect = el.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedId && canvasRef.current && isFullCustomizeMode) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      setElements(prev => prev.map(el => 
        el.id === selectedId 
          ? { ...el, x: Math.max(0, Math.min(320, newX)), y: Math.max(0, Math.min(560, newY)) }
          : el
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (id: string) => {
    if (!isFullCustomizeMode) return; // Block double click edit if not in Pro mode
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, isEditing: true } : el
    ));
  };

  const handleTextChange = (id: string, newText: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, content: newText } : el
    ));
  };

  const handleBlur = (id: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, isEditing: false } : el
    ));
  };

  const addTextElement = () => {
    if (!isFullCustomizeMode) return;
    setElements([...elements, {
      id: Date.now().toString(),
      type: 'text',
      content: 'Custom Text',
      x: 100,
      y: 160,
      color: '#ffffff',
      fontSize: 24,
      isEditing: false
    }]);
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDownload = () => {
    if (localTemplate.type === 'Pro' && !user?.isPro) {
      onOpenPayModal();
      return;
    }
    alert('Success: Preparing your personalized high-DPI creative poster frame for secure download!');
  };

  // Build the background style based on localTemplate parameters
  const canvasStyle: React.CSSProperties = {
    width: '400px',
    height: '600px',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  if (localTemplate.bgType === 'gradient' && localTemplate.gradient) {
    const { from, to, via, angle = '135deg' } = localTemplate.gradient;
    canvasStyle.background = `linear-gradient(${angle}, ${from}, ${via ? via + ', ' : ''}${to})`;
  } else {
    const bgImgUrl = localTemplate.imgUrl || (localTemplate.imageSearchTerm 
      ? `https://images.unsplash.com/featured/400x600/?${encodeURIComponent(localTemplate.imageSearchTerm)}`
      : 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=400');
    canvasStyle.backgroundImage = `url(${bgImgUrl})`;
  }

  return (
    <div className="flex flex-col h-screen bg-[#040408] text-[#F2F2FF] font-sans">
      
      {/* Header */}
      <header className="bg-[#0A0A12] border-b border-[#1C1C2E] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-[#8080A0] hover:text-white flex items-center gap-2 text-sm font-bold transition-colors bg-[#12121E] px-3 py-1.5 rounded-lg border border-[#28283E]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </button>
          <div className="h-6 w-px bg-[#1C1C2E]"></div>
          <div>
            <h1 className="font-syne text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Editing: {localTemplate.title}
              {localTemplate.type === 'Pro' && (
                <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </span>
              )}
            </h1>
            <p className="text-[10px] text-[#8080A0] uppercase tracking-wider font-bold mt-0.5">
              {localTemplate.category} • {isFullCustomizeMode ? "👑 Advanced Canvas Mode" : "✏️ Simple Personalize Mode"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Design
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Toolbar - Drag and drop status */}
        <div className="w-16 bg-[#0A0A12] border-r border-[#1C1C2E] flex flex-col items-center py-5 gap-4">
          <button 
            disabled={!isFullCustomizeMode}
            onClick={() => setSelectedId(null)}
            className={`p-3 rounded-xl transition-all relative ${
              isFullCustomizeMode 
                ? 'bg-[#7C6EFA]/10 text-[#7C6EFA] border border-[#7C6EFA]/30 hover:bg-[#1C1C2E]' 
                : 'text-[#4E4E6E] cursor-not-allowed'
            }`}
            title={isFullCustomizeMode ? "Select Tool" : "Canvas Pointer (Locked - Upgrade to Customize)"}
          >
            <MousePointer2 className="w-5 h-5" />
            {!isFullCustomizeMode && (
              <span className="absolute -bottom-1 -right-1 bg-[#121226] border border-[#28283E] text-amber-500 p-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
              </span>
            )}
          </button>

          <button 
            disabled={!isFullCustomizeMode}
            onClick={addTextElement}
            className={`p-3 rounded-xl transition-all relative ${
              isFullCustomizeMode 
                ? 'text-[#8080A0] hover:text-white hover:bg-[#12121E] border border-transparent' 
                : 'text-[#4E4E6E] cursor-not-allowed'
            }`}
            title={isFullCustomizeMode ? "Add Text Layer" : "Add Text Layer (Locked - Upgrade to Customize)"}
          >
            <Type className="w-5 h-5" />
            {!isFullCustomizeMode && (
              <span className="absolute -bottom-1 -right-1 bg-[#121226] border border-[#28283E] text-amber-500 p-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
              </span>
            )}
          </button>
        </div>

        {/* Canvas Workspace Area */}
        <div 
          className="flex-1 bg-[#040408] flex flex-col items-center justify-center p-6 sm:p-12 overflow-auto relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Helpful user banner */}
          <div className="mb-4 text-center select-none flex items-center gap-2">
            <span className="inline-block bg-[#0B0B18]/80 text-[#8080A0] text-[10px] sm:text-xs font-bold border border-[#1F1F35] px-4 py-1.5 rounded-full shadow-md">
              {selectedMockup !== 'none' 
                ? `📺 Previewing: Real-world Mockup Mode (${MOCKUP_DETAILS[selectedMockup].name})` 
                : isFullCustomizeMode 
                  ? "💡 Pro Canvas: Drag and drop text elements anywhere on the card!" 
                  : "✏️ Live Preview: Personalize text fields and URLs instantly below."
              }
            </span>
            {showSafeGuides && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-500/30">
                Print Guides Active
              </span>
            )}
          </div>

          {/* Mockup Container Wrapper */}
          <div className={`transition-all duration-500 relative ${selectedMockup !== 'none' ? "w-[640px] h-[460px] rounded-3xl overflow-hidden border border-[#23233D] flex items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.8)]" : ""}`}>
            {selectedMockup !== 'none' && (
              <>
                <img 
                  src={MOCKUP_DETAILS[selectedMockup].bgUrl} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 select-none pointer-events-none" 
                  referrerPolicy="no-referrer"
                  alt="Mockup Frame"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 z-1 pointer-events-none"></div>
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono border border-white/10 z-10 flex items-center gap-1 text-[#A89EFF]">
                  <Eye className="w-3.5 h-3.5" /> Physical Environment Mockup
                </div>
              </>
            )}

            {/* Actual Canvas Card Frame */}
            <div 
              ref={canvasRef}
              className={`relative shadow-2xl overflow-hidden border transition-all duration-500 ${
                selectedMockup !== 'none' 
                  ? 'rounded-[16px] origin-center z-10' 
                  : 'rounded-3xl'
              } ${
                isFullCustomizeMode 
                  ? 'border-[#7C6EFA]/40 shadow-[0_15px_50px_rgba(124,110,250,0.15)]' 
                  : 'border-[#28283E]'
              }`}
              style={{
                ...canvasStyle,
                ...(selectedMockup !== 'none' ? MOCKUP_DETAILS[selectedMockup].cardStyle : {})
              }}
              onClick={(e) => {
                if (e.target === canvasRef.current) setSelectedId(null);
              }}
            >
              {/* Dark glass backdrop overlay for visual pop (except for artistic sketch) */}
              {localTemplate.layoutType !== 'artistic_portrait' && (
                <div className="absolute inset-0 bg-black/15 pointer-events-none z-0"></div>
              )}

              {/* Safe Margin Guides box overlay */}
              {showSafeGuides && (
                <div className="absolute inset-5 border border-dashed border-emerald-500/35 rounded-xl pointer-events-none z-40 flex flex-col justify-between p-2 select-none">
                  <div className="flex justify-between text-[8px] font-mono text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded w-max">
                    <span>CROP GUIDE (SAFE BOUNDS 5%)</span>
                  </div>
                  {/* Visual print markers */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                  <div className="self-end text-[8px] font-mono text-emerald-400/60">
                    400x600 px • Print-Ready
                  </div>
                </div>
              )}

              {/* =======================================================
                  DECORATIVE FRAMES OVERLAYS
                  ======================================================= */}
              {frameStyle === 'luxury_gold' && (
                <>
                  <div className="absolute inset-5 border-2 border-amber-400/40 rounded-xl pointer-events-none z-20"></div>
                  <div className="absolute inset-7 border border-amber-500/20 rounded-lg pointer-events-none z-20"></div>
                  {/* Corner Ornaments */}
                  <div className="absolute top-6 left-6 text-amber-400/60 font-serif text-sm pointer-events-none z-20">✦</div>
                  <div className="absolute top-6 right-6 text-amber-400/60 font-serif text-sm pointer-events-none z-20">✦</div>
                  <div className="absolute bottom-6 left-6 text-amber-400/60 font-serif text-sm pointer-events-none z-20">✦</div>
                  <div className="absolute bottom-6 right-6 text-amber-400/60 font-serif text-sm pointer-events-none z-20">✦</div>
                </>
              )}
              {frameStyle === 'neon_accent' && (
                <>
                  <div className="absolute inset-5 border-2 border-pink-500/40 rounded-xl pointer-events-none z-20 shadow-[0_0_15px_rgba(236,72,153,0.3)]"></div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 z-20"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 z-20"></div>
                </>
              )}
              {frameStyle === 'minimalist_outline' && (
                <div className="absolute inset-4 border border-white/25 rounded-2xl pointer-events-none z-20"></div>
              )}
              {frameStyle === 'cherry_blossom' && (
                <>
                  <div className="absolute top-6 left-8 text-xl animate-pulse pointer-events-none z-20 select-none">🌸</div>
                  <div className="absolute top-[160px] right-6 text-sm animate-bounce pointer-events-none z-20 select-none" style={{ animationDuration: '4s' }}>🌸</div>
                  <div className="absolute bottom-[180px] left-6 text-xs animate-bounce pointer-events-none z-20 select-none" style={{ animationDuration: '5s' }}>🌸</div>
                  <div className="absolute bottom-6 right-10 text-xl animate-pulse pointer-events-none z-20 select-none">🌸</div>
                </>
              )}

              {/* =======================================================
                  LAYOUT ARTWORK 1: KAWAII PASTEL DOODLE CARD (Free)
                  ======================================================= */}
              {localTemplate.layoutType === 'kawaii_pastel' && (
                <>
                  {/* Checkered/grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: "radial-gradient(#881B1B 1.5px, transparent 1.5px)", backgroundSize: '16px 16px' }}></div>
                  
                  {/* Floating stickers and illustrations */}
                  <div className="absolute top-[20px] left-[20px] text-4xl animate-bounce pointer-events-none z-10" style={{ animationDuration: '3s' }} title="Cherry">🍒</div>
                  <div className="absolute top-[35px] right-[25px] text-4xl animate-pulse pointer-events-none z-10" style={{ animationDuration: '4s' }} title="Strawberry">🍓</div>
                  <div className="absolute top-[130px] left-[15px] text-3.5xl rotate-12 pointer-events-none z-10" title="Boba">🧋</div>
                  <div className="absolute top-[150px] right-[20px] text-3.5xl -rotate-12 pointer-events-none z-10" title="Tulip">🌷</div>
                  
                  {/* Stars & Ribbons */}
                  <div className="absolute top-[105px] left-[130px] text-lg text-amber-500 animate-spin pointer-events-none z-10" style={{ animationDuration: '10s' }}>✨</div>
                  <div className="absolute top-[105px] right-[130px] text-lg text-amber-500 animate-spin pointer-events-none z-10" style={{ animationDuration: '8s' }}>✨</div>
                  <div className="absolute top-[425px] left-[60px] text-xl text-pink-400 animate-pulse pointer-events-none z-10">💖</div>
                  <div className="absolute top-[425px] right-[60px] text-xl text-pink-400 animate-pulse pointer-events-none z-10">💖</div>

                  <div className="absolute bottom-[90px] left-[25px] text-4xl pointer-events-none z-10" title="Cupcake">🧁</div>
                  <div className="absolute bottom-[85px] right-[20px] text-4xl pointer-events-none z-10" title="Bear">🐻</div>
                  
                  {/* Outer frame border */}
                  <div className="absolute inset-4 border-2 border-dashed border-[#881B1B]/20 rounded-2xl pointer-events-none"></div>
                </>
              )}

              {/* =======================================================
                  LAYOUT ARTWORK 2: MASCOT BEAR SIGNBOARD (Pro)
                  ======================================================= */}
              {localTemplate.layoutType === 'mascot_bear' && (
                <>
                  {/* Wood floor shadow at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-28 bg-[#78350F]/20 blur-lg pointer-events-none"></div>

                  {/* Left & Right Ears */}
                  <div className="absolute left-[125px] top-[145px] w-14 h-14 bg-[#B45309] rounded-full border-4 border-[#78350F] flex items-center justify-center shadow-inner z-0 pointer-events-none">
                    <div className="w-6 h-6 bg-[#F59E0B] rounded-full"></div>
                  </div>
                  <div className="absolute right-[125px] top-[145px] w-14 h-14 bg-[#B45309] rounded-full border-4 border-[#78350F] flex items-center justify-center shadow-inner z-0 pointer-events-none">
                    <div className="w-6 h-6 bg-[#F59E0B] rounded-full"></div>
                  </div>

                  {/* Bear head behind the signboard */}
                  <div className="absolute left-[130px] top-[150px] w-[140px] h-[115px] bg-[#D97706] rounded-full border-4 border-[#78350F] flex flex-col items-center justify-start pt-3 shadow-md z-0 pointer-events-none">
                    {/* Eyes with white shiny highlights */}
                    <div className="flex gap-7 mt-2">
                      <div className="w-3.5 h-3.5 bg-slate-950 rounded-full relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <div className="w-3.5 h-3.5 bg-slate-950 rounded-full relative">
                        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    {/* Snout with nose and smile */}
                    <div className="w-14 h-11 bg-amber-100 rounded-full border border-[#D97706] mt-1 relative flex flex-col items-center justify-center">
                      <div className="w-5 h-3 bg-stone-900 rounded-full"></div>
                      <div className="w-4 h-1 bg-amber-800/40 rounded-full mt-0.5"></div>
                    </div>
                  </div>

                  {/* Left paw clutching the signboard frame */}
                  <div className="absolute left-[55px] top-[280px] w-16 h-12 bg-[#B45309] rounded-full border-4 border-[#78350F] flex items-center justify-center shadow-lg z-10 pointer-events-none">
                    <div className="flex gap-0.5">
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                    </div>
                  </div>
                  {/* Right paw clutching the signboard frame */}
                  <div className="absolute right-[55px] top-[280px] w-16 h-12 bg-[#B45309] rounded-full border-4 border-[#78350F] flex items-center justify-center shadow-lg z-10 pointer-events-none">
                    <div className="flex gap-0.5">
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                      <div className="w-2.5 h-2 bg-amber-950 rounded-full"></div>
                    </div>
                  </div>
                </>
              )}

              {/* =======================================================
                  LAYOUT ARTWORK 3: ARTISTIC SKETCH PORTRAIT (Pro)
                  ======================================================= */}
              {localTemplate.layoutType === 'artistic_portrait' && (
                <>
                  {/* Textured paper grain background */}
                  <div className="absolute inset-0 mix-blend-multiply opacity-[0.22] pointer-events-none z-1" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cartographer.png')" }}></div>
                  
                  {/* Woman Portrait Sketch Outline - Placed precisely above the QR code */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <svg viewBox="0 0 400 600" className="w-full h-full text-slate-800 opacity-[0.95]">
                      {/* Main Head Contour & Jawline */}
                      <path d="M195,160 C195,185 200,205 212,215 C218,220 225,222 232,218" fill="none" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                      
                      {/* Nose & Profile line (turned sideways) */}
                      <path d="M205,110 C200,120 192,132 189,140 C188,142 189,144 191,144 L198,144 C193,150 190,158 195,160" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Lips & Mouth sketch */}
                      <path d="M194,172 C197,172 202,173 200,177 C198,180 195,180 194,178" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
                      <path d="M196,175 C199,175 201,176 200,177" fill="none" stroke="#2D2D2D" strokeWidth="1" />

                      {/* Eye and Eyebrow details */}
                      <path d="M206,132 C209,131 214,132 216,135" fill="none" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M208,138 C210,137 214,138 215,141 C214,143 210,144 208,141 Z" fill="#2D2D2D" />
                      <path d="M215,140 L218,138" stroke="#2D2D2D" strokeWidth="1" />
                      
                      {/* Ear sketch */}
                      <path d="M245,155 C242,150 240,155 240,160 C240,165 244,168 246,165" fill="none" stroke="#2D2D2D" strokeWidth="1.5" />

                      {/* Neck lines linking to shoulders */}
                      <path d="M212,216 C215,228 218,242 218,252" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
                      <path d="M238,208 C242,220 245,235 245,250" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Shoulders / Dress outline wrapping around the QR code (QR is at x: 105 to 295, y: 250 to 440) */}
                      {/* Left Shoulder line - curves out then drops straight */}
                      <path d="M218,252 C200,255 130,265 102,280 C93,283 93,290 96,305 L96,445 C96,458 112,464 140,464" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
                      
                      {/* Right Shoulder line - curves back and down */}
                      <path d="M245,250 C265,255 285,268 298,285 C307,292 307,300 304,315 L304,445 C304,458 288,464 260,464" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />

                      {/* Charcoal sketch border connections under the QR */}
                      <path d="M140,464 L260,464" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />

                      {/* Flowing hair strands cascading down */}
                      {/* Hair strands on the right (back of the head) */}
                      <path d="M230,95 C270,100 295,120 298,155 C302,190 295,220 280,245 C270,260 255,275 240,290" fill="none" stroke="#1A1A1A" strokeWidth="4" />
                      <path d="M225,92 C280,105 305,135 308,180 C310,220 300,255 285,280" fill="none" stroke="#2D2D2D" strokeWidth="2" />
                      
                      {/* Hair strands on the left (flowing over the neck/face) */}
                      <path d="M215,95 C180,105 175,135 178,170 C180,200 190,225 200,240 C205,248 208,265 205,280 C202,295 190,320 180,340" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M205,100 C175,115 165,150 168,190 C170,220 180,245 192,265 C198,275 200,290 195,305" fill="none" stroke="#2D2D2D" strokeWidth="2" />

                      {/* Crown of head hair sketch lines */}
                      <path d="M210,100 C230,95 250,105 260,115" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                    </svg>
                  </div>

                  {/* Elegant thick charcoal border frame */}
                  <div className="absolute inset-5 border-[12px] border-[#1C1C1C] rounded-2xl pointer-events-none z-10"></div>
                  <div className="absolute inset-8 border border-[#1C1C1C]/15 pointer-events-none z-10"></div>
                </>
              )}

              {/* =======================================================
                  LAYOUT ARTWORK 4: KYOTO SAKURA TRAVEL MAP (Pro)
                  ======================================================= */}
              {localTemplate.layoutType === 'japan_travel' && (
                <>
                  {/* Rising sun backdrop right behind the QR */}
                  <div className="absolute left-[110px] top-[210px] w-[180px] h-[180px] bg-red-600 rounded-full opacity-[0.75] blur-[2px] pointer-events-none z-0"></div>

                  {/* Floating Mount Fuji peak at the top behind elements */}
                  <div className="absolute top-[130px] inset-x-0 flex justify-center opacity-30 z-0 pointer-events-none">
                    <div className="w-56 h-28 bg-blue-900/40 relative" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                      {/* Snow cap peak overlay */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-white" style={{ clipPath: 'polygon(50% 0%, 25% 100%, 75% 100%)' }}></div>
                    </div>
                  </div>

                  {/* Drift cherry blossoms 🌸 */}
                  <div className="absolute top-[140px] left-[35px] text-2xl animate-pulse pointer-events-none z-10" style={{ animationDuration: '3.5s' }}>🌸</div>
                  <div className="absolute top-[170px] right-[45px] text-2xl animate-pulse pointer-events-none z-10" style={{ animationDuration: '4s' }}>🌸</div>
                  <div className="absolute bottom-[130px] left-[50px] text-xl animate-bounce pointer-events-none z-10" style={{ animationDuration: '5s' }}>🌸</div>
                  <div className="absolute bottom-[170px] right-[30px] text-xl animate-bounce pointer-events-none z-10" style={{ animationDuration: '6s' }}>🌸</div>

                  {/* Japanese Traditional Landmarks */}
                  <div className="absolute bottom-[80px] left-[35px] text-4.5xl drop-shadow-md select-none pointer-events-none z-10" title="Torii Gate">⛩️</div>
                  <div className="absolute bottom-[80px] right-[35px] text-4.5xl drop-shadow-md select-none pointer-events-none z-10" title="Pagoda Temple">🛕</div>

                  {/* Waves at bottom */}
                  <div className="absolute bottom-16 inset-x-0 h-4 bg-blue-400/20 backdrop-blur-3xs rounded-full pointer-events-none z-0"></div>
                </>
              )}

              {/* =======================================================
                  LAYOUT ARTWORK 5: GEMINI DYNAMIC CUSTOM LAYOUT (AI Generated)
                  ======================================================= */}
              {(localTemplate.layoutType === 'dynamic_custom' || localTemplate.visualOverlay) && (
                <>
                  {/* Paper texture overlay */}
                  {localTemplate.visualOverlay?.texture && (
                    <div className="absolute inset-0 mix-blend-multiply opacity-[0.25] pointer-events-none z-1" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cartographer.png')" }}></div>
                  )}

                  {/* Procedural background theme accent highlights */}
                  {localTemplate.visualOverlay?.themeType === 'cyberpunk_glow' && (
                    <>
                      <div className="absolute inset-0 bg-radial from-transparent via-[#7C6EFA]/5 to-transparent pointer-events-none"></div>
                      <div className="absolute top-[80px] left-[40px] w-12 h-12 rounded-full border border-[#C084FC]/30 animate-pulse pointer-events-none"></div>
                      <div className="absolute bottom-[100px] right-[40px] w-16 h-16 rounded-full border border-[#7C6EFA]/20 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>
                    </>
                  )}
                  {localTemplate.visualOverlay?.themeType === 'luxurious_elegant' && (
                    <div className="absolute inset-0 border-[2px] border-amber-500/20 m-6 rounded-xl pointer-events-none"></div>
                  )}
                  {localTemplate.visualOverlay?.themeType === 'organic_minimal' && (
                    <div className="absolute top-[60px] right-[50px] w-[140px] h-[140px] bg-amber-100/10 rounded-full blur-2xl pointer-events-none"></div>
                  )}

                  {/* Custom SVG Paths generated by Gemini */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <svg viewBox="0 0 400 600" className="w-full h-full">
                      {/* Render custom paths from Gemini */}
                      {localTemplate.visualOverlay?.svgPaths && Array.isArray(localTemplate.visualOverlay.svgPaths) && 
                        localTemplate.visualOverlay.svgPaths.map((path: any, idx: number) => (
                          <path 
                            key={idx}
                            d={path.d} 
                            stroke={path.stroke || '#FFFFFF'} 
                            strokeWidth={path.strokeWidth || 2} 
                            fill={path.fill || 'none'} 
                            opacity={path.opacity ?? 0.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ))
                      }

                      {/* Procedural fallback vector illustrations if no custom paths exist */}
                      {(!localTemplate.visualOverlay?.svgPaths || localTemplate.visualOverlay.svgPaths.length === 0) && (
                        <>
                          {localTemplate.visualOverlay?.themeType === 'cyberpunk_glow' && (
                            <>
                              {/* Circuit lines */}
                              <path d="M40,100 L120,100 L140,120 M360,100 L280,100 L260,120" stroke="#7C6EFA" strokeWidth="1.5" fill="none" opacity="0.6" />
                              <path d="M40,500 L120,500 L140,480 M360,500 L280,500 L260,480" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.6" />
                              {/* Target grids around QR */}
                              <path d="M90,200 L90,180 L110,180 M310,200 L310,180 L290,180 M90,420 L90,440 L110,440 M310,420 L310,440 L290,440" stroke="#00F0FF" strokeWidth="2" fill="none" opacity="0.8" />
                            </>
                          )}
                          {localTemplate.visualOverlay?.themeType === 'luxurious_elegant' && (
                            <>
                              {/* Golden delicate geometric loops */}
                              <path d="M200,30 C300,30 350,150 350,200 C350,250 280,280 200,280 C120,280 50,250 50,200 C50,150 100,30 200,30 Z" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.25" />
                              <path d="M200,60 C260,60 300,140 300,200 C300,260 250,290 200,290 C150,290 100,260 100,200 C100,140 140,60 200,60 Z" stroke="#F59E0B" strokeWidth="0.5" fill="none" opacity="0.2" />
                            </>
                          )}
                          {localTemplate.visualOverlay?.themeType === 'organic_minimal' && (
                            <>
                              {/* Organic abstract blob line */}
                              <path d="M50,130 Q120,90 220,150 T350,130" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.3" />
                              {/* Leaf Branch lines */}
                              <path d="M40,180 Q60,150 80,160 M80,160 Q70,175 60,185 M55,140 Q75,130 90,145" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.5" />
                            </>
                          )}
                          {localTemplate.visualOverlay?.themeType === 'cute_kawaii' && (
                            <>
                              {/* Little stars and clouds */}
                              <path d="M40,110 C50,100 65,100 70,110 C75,100 90,105 95,115 C100,125 80,135 60,135 C45,135 35,125 40,110 Z" stroke="#FFA6C9" strokeWidth="1.5" fill="none" opacity="0.6" />
                              <path d="M310,140 C320,130 335,130 340,140 C345,130 360,135 365,145 C370,155 350,165 330,165 C315,165 305,155 310,140 Z" stroke="#FFA6C9" strokeWidth="1.5" fill="none" opacity="0.6" />
                            </>
                          )}
                          {localTemplate.visualOverlay?.themeType === 'retro_arcade' && (
                            <>
                              {/* Pixel stars / cross hairs */}
                              <path d="M35,120 L55,120 M45,110 L45,130" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.5" />
                              <path d="M345,150 L365,150 M355,140 L355,160" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.5" />
                              <path d="M40,540 L360,540" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
                            </>
                          )}
                          {localTemplate.visualOverlay?.themeType === 'neon_art' && (
                            <>
                              {/* Glowing squiggles */}
                              <path d="M30,140 Q100,80 200,140 T370,140" stroke="#EC4899" strokeWidth="2.5" fill="none" opacity="0.75" />
                              <path d="M30,145 Q100,85 200,145 T370,145" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.9" />
                            </>
                          )}
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Floating Emojis */}
                  {localTemplate.visualOverlay?.emojis && Array.isArray(localTemplate.visualOverlay.emojis) && 
                    localTemplate.visualOverlay.emojis.map((em: any, idx: number) => (
                      <div 
                        key={idx}
                        className="absolute animate-bounce pointer-events-none select-none z-10"
                        style={{ 
                          left: `${em.x}px`, 
                          top: `${em.y}px`, 
                          fontSize: `${em.size || 24}px`,
                          animationDuration: `${3 + (idx % 3)}s` 
                        }}
                      >
                        {em.char}
                      </div>
                    ))
                  }

                  {/* Borders overlay */}
                  {localTemplate.visualOverlay?.borderStyle === 'dashed' && (
                    <div className="absolute inset-5 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none z-10"></div>
                  )}
                  {localTemplate.visualOverlay?.borderStyle === 'thick_dark' && (
                    <>
                      <div className="absolute inset-5 border-[12px] border-slate-900 rounded-2xl pointer-events-none z-10"></div>
                      <div className="absolute inset-8 border border-slate-900/15 pointer-events-none z-10"></div>
                    </>
                  )}
                  {localTemplate.visualOverlay?.borderStyle === 'cyber_brackets' && (
                    <div className="absolute inset-5 pointer-events-none z-10">
                      {/* Top-left corner */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400"></div>
                      {/* Top-right corner */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400"></div>
                      {/* Bottom-left corner */}
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400"></div>
                      {/* Bottom-right corner */}
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400"></div>
                    </div>
                  )}
                </>
              )}

              {/* =======================================================
                  INTERACTIVE STICKER BADGE CONTAINER
                  ======================================================= */}
              {stickerEnabled ? (
                <div 
                  className={`absolute left-[70px] top-[180px] w-[260px] h-[260px] flex flex-col items-center justify-between p-4 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-900 z-35 transition-all duration-300 ${
                    stickerShape === 'circle' 
                      ? 'rounded-full' 
                      : stickerShape === 'die_cut' 
                        ? 'rounded-[40px] border-dashed border-pink-500 bg-gradient-to-br from-white to-pink-50/50' 
                        : 'rounded-2xl'
                  }`}
                  style={{
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 0 15px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Sticker Header / Icon */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {stickerIcon === 'coffee' && <Coffee className="w-5 h-5 text-amber-700 animate-bounce" />}
                    {stickerIcon === 'wifi' && <Wifi className="w-5 h-5 text-blue-600 animate-pulse" />}
                    {stickerIcon === 'shop' && <CircleDot className="w-5 h-5 text-emerald-600" />}
                    {stickerIcon === 'star' && <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />}
                    
                    <span className="text-[11px] uppercase font-black tracking-widest text-slate-800 font-syne">
                      {stickerText}
                    </span>
                  </div>

                  {/* Aligned QR Code inside sticker */}
                  <div className="w-[170px] h-[170px] flex items-center justify-center rounded-xl overflow-hidden bg-white border border-slate-100 shadow-inner">
                    <div ref={qrRef} className="w-[170px] h-[170px] flex items-center justify-center overflow-hidden" />
                  </div>

                  {/* Size tag at sticker footer */}
                  <div className="bg-slate-900 text-white text-[8px] font-mono px-2 py-0.5 rounded-full select-none mb-1">
                    PRINT SIZE: {stickerSize} ({stickerShape.toUpperCase()})
                  </div>
                </div>
              ) : (
                /* Regular Flat QR Code Placement */
                <div 
                  className={`absolute transition-transform flex items-center justify-center p-2.5 ${
                    localTemplate.layoutType === 'artistic_portrait'
                      ? 'left-[105px] top-[262px] w-[190px] h-[190px]'
                      : 'left-[105px] top-[215px] w-[190px] h-[190px] rounded-2xl shadow-2xl'
                  }`}
                  style={{ 
                    backgroundColor: localTemplate.layoutType === 'artistic_portrait' ? 'transparent' : (localTemplate.qrConfig?.bgColor || '#FFFFFF'),
                    boxShadow: localTemplate.layoutType === 'artistic_portrait'
                      ? 'none'
                      : localTemplate.layoutType === 'mascot_bear' 
                        ? '0 30px 70px rgba(0, 0, 0, 0.75), inset 0 0 10px rgba(0,0,0,0.1)' 
                        : '0 25px 60px rgba(0, 0, 0, 0.55)',
                    border: localTemplate.layoutType === 'kawaii_pastel' 
                      ? '4px solid #FFA6C9' 
                      : localTemplate.layoutType === 'mascot_bear'
                        ? '8px solid #92400E'
                        : localTemplate.layoutType === 'artistic_portrait'
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div ref={qrRef} className="w-[170px] h-[170px] flex items-center justify-center overflow-hidden rounded-xl" />
                </div>
              )}

              {/* Card Text Layers */}
              {elements.map(el => (
                <div
                  key={el.id}
                  id={`element-${el.id}`}
                  className={`absolute transition-all ${
                    isFullCustomizeMode 
                      ? 'cursor-move hover:ring-2 hover:ring-[#7C6EFA]/40 p-1 rounded-lg' 
                      : 'cursor-default p-1'
                  } ${selectedId === el.id && isFullCustomizeMode ? 'ring-2 ring-[#7C6EFA] ring-offset-2 ring-offset-[#12121E]' : ''}`}
                  style={{
                    left: el.x,
                    top: el.y,
                    color: el.color,
                    fontSize: `${el.fontSize}px`,
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 'bold',
                    textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  onDoubleClick={() => handleDoubleClick(el.id)}
                >
                  {el.isEditing && isFullCustomizeMode ? (
                    <input
                      type="text"
                      value={el.content}
                      autoFocus
                      className="bg-black/60 border border-[#7C6EFA]/60 outline-none focus:ring-0 p-1 rounded font-bold text-white text-center"
                      style={{ color: el.color, fontSize: `${el.fontSize}px`, width: `${Math.max(5, el.content.length + 1)}ch` }}
                      onChange={(e) => handleTextChange(el.id, e.target.value)}
                      onBlur={() => handleBlur(el.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlur(el.id);
                      }}
                    />
                  ) : (
                    el.content
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar Form & Properties Control Center */}
        <div className="w-[380px] bg-[#0A0A12] border-l border-[#1C1C2E] p-6 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
          
          <div className="space-y-6">
            
            {/* Mode Selector Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#8080A0] uppercase tracking-wider font-extrabold block">
                Editor Mode Controls
              </label>
              <div className="grid grid-cols-2 bg-[#12121E] p-1 rounded-xl border border-[#28283E]">
                <button 
                  type="button"
                  onClick={() => setIsFullCustomizeMode(false)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    !isFullCustomizeMode 
                      ? 'bg-[#7C6EFA] text-white shadow-md' 
                      : 'text-[#8080A0] hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Simple Form
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (user?.isPro) {
                      setIsFullCustomizeMode(true);
                    } else {
                      onOpenPayModal();
                    }
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
                    isFullCustomizeMode 
                      ? 'bg-[#7C6EFA] text-white shadow-md' 
                      : 'text-[#8080A0] hover:text-white'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>Full Customize</span>
                  {!user?.isPro && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Experience Engine Tab Swapper */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#8080A0] uppercase tracking-wider font-extrabold block">
                Experience Engine Layers
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#12121E] p-1 rounded-xl border border-[#28283E]">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('template')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'template' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>Base</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('poster')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'poster' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Poster</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('frame')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'frame' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Frame</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('sticker')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'sticker' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <Tags className="w-3.5 h-3.5" />
                  <span>Sticker</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('qr_style')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'qr_style' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>QR Layer</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('mockup')} 
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${activeTab === 'mockup' ? 'bg-[#7C6EFA]/20 text-white border border-[#7C6EFA]/40' : 'text-[#8080A0] hover:text-white'}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mockup</span>
                </button>
              </div>
            </div>

            {/* TAB CONTAINER 1: BASE TEMPLATE SELECTION */}
            {activeTab === 'template' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Base Layout Design</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Select a premium handcrafted base artwork direction.</p>
                </div>

                {/* Category Pill Buttons */}
                <div className="flex flex-wrap gap-1">
                  {['all', 'restaurant', 'coffee', 'hotel', 'wedding', 'creative'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`text-[9px] uppercase font-bold px-2 py-1 rounded transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#7C6EFA] text-white'
                          : 'bg-[#121226] text-[#8080A0] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid list of presets */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'kawaii_pastel', name: '🍒 Cute Pastel', cat: 'creative' },
                    { id: 'mascot_bear', name: '🐻 Mascot Bear', cat: 'coffee' },
                    { id: 'artistic_portrait', name: '✏️ Portrait Sketch', cat: 'creative' },
                    { id: 'japan_travel', name: '⛩️ Japan Travel', cat: 'hotel' },
                    { id: 'dynamic_custom', name: '✨ AI Generated', cat: 'restaurant' },
                  ]
                  .filter(p => selectedCategory === 'all' || p.cat === selectedCategory)
                  .map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        // Preload selected template structure
                        setLocalTemplate(prev => ({
                          ...prev,
                          layoutType: preset.id as any,
                          themeName: preset.name
                        }));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        localTemplate.layoutType === preset.id
                          ? 'bg-[#7C6EFA]/10 border-[#7C6EFA] text-white'
                          : 'bg-[#121226]/50 border-[#28283E] text-[#8080A0] hover:text-white hover:border-[#38385E]'
                      }`}
                    >
                      <span className="text-[11px] font-extrabold block truncate">{preset.name}</span>
                      <span className="text-[8px] text-[#4E4E6E] block uppercase font-mono mt-0.5">{preset.cat} category</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTAINER 2: POSTER CONFIGURATION */}
            {activeTab === 'poster' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Poster Sizing & Safe Guides</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Define aspect ratios, crop margins, and print setups.</p>
                </div>

                {/* Sizing grid */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Physical Sizing Aspect</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'standard', name: 'A4 Portrait', desc: '400x600 px' },
                      { id: 'square', name: 'Square Sticker', desc: '450x450 px' },
                      { id: 'instagram_story', name: 'Tall Banner', desc: '400x710 px' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPosterFormat(f.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          posterFormat === f.id
                            ? 'bg-[#7C6EFA]/20 border-[#7C6EFA] text-white'
                            : 'bg-[#121226] border-[#28283E] text-[#8080A0]'
                        }`}
                      >
                        <span className="text-[10px] font-bold block">{f.name}</span>
                        <span className="text-[8px] opacity-60 font-mono block">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safe Margins switch */}
                <div className="bg-[#121226]/50 p-3 rounded-xl border border-[#28283E] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Print-Ready Safe Margins</span>
                    <span className="text-[9px] text-[#8080A0] block">Render dashed boundary lines for printing.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSafeGuides(!showSafeGuides)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${showSafeGuides ? 'bg-emerald-500' : 'bg-[#28283E]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${showSafeGuides ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTAINER 3: DECORATIVE FRAMES */}
            {activeTab === 'frame' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Decorative Frame Overlays</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Framing layers built to enclose and elevate the design.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', name: '🚫 No Frame', desc: 'Clean borderless' },
                    { id: 'luxury_gold', name: '✦ Luxury Gold', desc: 'Elegant double border' },
                    { id: 'neon_accent', name: '⚡ Neon Accent', desc: 'Glowing techno borders' },
                    { id: 'minimalist_outline', name: '▫️ Minimal Line', desc: 'Modern thin outlines' },
                    { id: 'cherry_blossom', name: '🌸 Cherry Blossom', desc: 'Floating petalled frame' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrameStyle(f.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        frameStyle === f.id
                          ? 'bg-[#7C6EFA]/15 border-[#7C6EFA] text-white shadow-lg'
                          : 'bg-[#121226]/50 border-[#28283E] text-[#8080A0] hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-extrabold block">{f.name}</span>
                      <span className="text-[9px] text-[#4E4E6E] block mt-0.5">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTAINER 4: STICKER BADGES */}
            {activeTab === 'sticker' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Physical Sticker Badges</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Group the QR into a cutout sticker form with tags.</p>
                </div>

                {/* Toggle */}
                <div className="bg-[#121226]/50 p-3 rounded-xl border border-[#28283E] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Enable Sticker Badge Wrapper</span>
                    <span className="text-[9px] text-[#8080A0] block">Add customizable physical outline badge.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStickerEnabled(!stickerEnabled)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${stickerEnabled ? 'bg-[#7C6EFA]' : 'bg-[#28283E]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${stickerEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {stickerEnabled && (
                  <div className="space-y-3.5 p-3.5 bg-[#121226]/40 border border-[#28283E] rounded-2xl animate-fade-in">
                    {/* Header text */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Sticker Ribbon Text</label>
                      <input
                        type="text"
                        value={stickerText}
                        onChange={(e) => setStickerText(e.target.value)}
                        className="w-full bg-[#06060F] border border-[#28283E] text-xs px-3 py-2 rounded-lg text-white"
                        placeholder="Scan To Order"
                      />
                    </div>

                    {/* Shape select */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Badge Contour Shape</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'rounded_rect', name: 'Curved' },
                          { id: 'circle', name: 'Circle' },
                          { id: 'die_cut', name: 'Die-Cut' }
                        ].map(sh => (
                          <button
                            key={sh.id}
                            type="button"
                            onClick={() => setStickerShape(sh.id as any)}
                            className={`py-1 rounded text-[10px] font-bold border transition-all ${
                              stickerShape === sh.id
                                ? 'bg-[#7C6EFA] text-white border-transparent'
                                : 'bg-[#0A0A12] border-[#28283E] text-[#8080A0]'
                            }`}
                          >
                            {sh.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Sticker Decor Icon</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: 'coffee', label: '☕ Cafe' },
                          { id: 'wifi', label: '📶 Wifi' },
                          { id: 'shop', label: '🛍️ Store' },
                          { id: 'star', label: '⭐ VIP' }
                        ].map(ico => (
                          <button
                            key={ico.id}
                            type="button"
                            onClick={() => setStickerIcon(ico.id as any)}
                            className={`py-1 text-[9px] font-bold border rounded transition-all ${
                              stickerIcon === ico.id
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                                : 'bg-[#0A0A12] border-[#28283E] text-[#8080A0]'
                            }`}
                          >
                            {ico.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Physical Size */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Print Dimension Sizing</label>
                      <select
                        value={stickerSize}
                        onChange={(e) => setStickerSize(e.target.value)}
                        className="w-full bg-[#06060F] border border-[#28283E] text-xs px-3 py-2 rounded-lg text-white"
                      >
                        <option value="50mm x 50mm">Small (50mm / 2")</option>
                        <option value="75mm x 75mm">Medium (75mm / 3")</option>
                        <option value="100mm x 100mm">Large (100mm / 4")</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTAINER 5: QR LAYER PROPERTIES */}
            {activeTab === 'qr_style' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">QR Code Personalization</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Customize content destination and contrast styles.</p>
                </div>

                {/* URL Field */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-bold block flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#A89EFF]" />
                    <span>Scan Target URL / Content</span>
                  </label>
                  <input
                    type="text"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder="https://suvash-design.com"
                    className="w-full bg-[#06060F] border border-[#28283E] focus:border-[#7C6EFA] text-xs rounded-xl px-4 py-3 text-white outline-none"
                  />
                </div>

                {/* Contrast Helper Warning */}
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/20 rounded-xl text-[9px] text-amber-200 leading-normal flex items-start gap-1.5">
                  <span className="text-xs">⚠️</span>
                  <span><strong>Scan Validation:</strong> Safe margins & high-contrast validation active. Keep the dots dark on light backgrounds.</span>
                </div>

                {/* Color customization */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8080A0] block">QR Dots Color</label>
                    <input
                      type="color"
                      value={localTemplate.qrConfig?.fgColor || '#000000'}
                      onChange={(e) => {
                        setLocalTemplate(prev => ({
                          ...prev,
                          qrConfig: {
                            ...prev.qrConfig,
                            fgColor: e.target.value
                          }
                        }));
                      }}
                      className="w-full h-8 bg-transparent cursor-pointer rounded border border-[#28283E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8080A0] block">QR Fill BG Color</label>
                    <input
                      type="color"
                      value={localTemplate.qrConfig?.bgColor || '#FFFFFF'}
                      onChange={(e) => {
                        setLocalTemplate(prev => ({
                          ...prev,
                          qrConfig: {
                            ...prev.qrConfig,
                            bgColor: e.target.value
                          }
                        }));
                      }}
                      className="w-full h-8 bg-transparent cursor-pointer rounded border border-[#28283E]"
                    />
                  </div>
                </div>

                {/* Logo Overlays */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#8080A0] uppercase font-bold block">Center Logo Badge Overlay</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'wifi', label: '📶 Wifi' },
                      { id: 'coffee', label: '☕ Cafe' },
                      { id: 'location', label: '📍 Map' },
                    ].map(log => (
                      <button
                        key={log.id}
                        type="button"
                        onClick={() => setLogoOverlay(log.id as any)}
                        className={`py-1.5 rounded text-[10px] font-semibold border transition-all ${
                          logoOverlay === log.id
                            ? 'bg-[#7C6EFA] border-transparent text-white'
                            : 'bg-[#121226] border-[#28283E] text-[#8080A0]'
                        }`}
                      >
                        {log.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simple Mode Element text content list */}
                {!isFullCustomizeMode && (
                  <div className="space-y-3 pt-3 border-t border-[#1C1C2E]">
                    <span className="text-[10px] text-[#8080A0] uppercase tracking-wider font-extrabold block">
                      Text Customizations
                    </span>
                    {elements.map((el, index) => (
                      <div key={el.id} className="space-y-1.5">
                        <label className="text-[11px] text-[#8080A0] font-bold block">
                          Card Header Line {index + 1}:
                        </label>
                        <input
                          type="text"
                          value={el.content}
                          onChange={(e) => handleTextChange(el.id, e.target.value)}
                          className="w-full bg-[#06060F] border border-[#28283E] text-xs rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTAINER 6: REAL-WORLD MOCKUPS */}
            {activeTab === 'mockup' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[#1C1C2E] pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Real-world Mockup Engine</h4>
                  <p className="text-[10px] text-[#8080A0] mt-0.5">Review poster prints live inside physical environments.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'none', name: '🚫 Disable Mockup Frame', desc: 'Flat 2D Canvas workspace layout.' },
                    { id: 'coffee_shop', name: '☕ Cozy Cafe Table Stand', desc: 'Wooden background with warm plants.' },
                    { id: 'restaurant_table', name: '🍽️ Fine Dining Plate Setup', desc: 'Sleek tabletop with premium linen.' },
                    { id: 'shop_window', name: '🛍️ Modern Boutique Counter', desc: 'High-class glass shelf with glowing light.' },
                  ].map(mock => (
                    <button
                      key={mock.id}
                      type="button"
                      onClick={() => setSelectedMockup(mock.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMockup === mock.id
                          ? 'bg-[#7C6EFA]/15 border-[#7C6EFA] text-white shadow-lg'
                          : 'bg-[#121226]/50 border-[#28283E] text-[#8080A0] hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-extrabold block">{mock.name}</span>
                      <span className="text-[9px] text-[#4E4E6E] block mt-0.5">{mock.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRO CUSTOMIZER CONDITIONAL (For full custom position details) */}
            {isFullCustomizeMode && (
              <div className="space-y-4 pt-4 border-t border-[#1C1C2E] animate-fade-in">
                {selectedId ? (
                  <div className="p-3.5 bg-[#121226]/50 border border-[#28283E] rounded-xl space-y-3">
                    <span className="text-[10px] text-[#A89EFF] font-bold uppercase tracking-wider block">
                      Active Text Properties
                    </span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] block">Layer Content</label>
                      <input
                        type="text"
                        value={elements.find(e => e.id === selectedId)?.content || ''}
                        onChange={(e) => handleTextChange(selectedId, e.target.value)}
                        className="w-full bg-[#06060F] border border-[#28283E] text-xs rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#8080A0] block">Font Swatch Color</label>
                      <div className="flex gap-1.5">
                        <input 
                          type="color" 
                          value={elements.find(e => e.id === selectedId)?.color || '#ffffff'}
                          onChange={(e) => {
                            setElements(prev => prev.map(el => 
                              el.id === selectedId ? { ...el, color: e.target.value } : el
                            ));
                          }}
                          className="w-8 h-8 bg-transparent cursor-pointer rounded border border-[#28283E]"
                        />
                        <input
                          type="text"
                          value={elements.find(e => e.id === selectedId)?.color || '#ffffff'}
                          onChange={(e) => {
                            setElements(prev => prev.map(el => 
                              el.id === selectedId ? { ...el, color: e.target.value } : el
                            ));
                          }}
                          className="flex-1 bg-[#06060F] border border-[#28283E] text-xs font-mono rounded-lg px-2 py-1 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#8080A0]">
                        <span>Font Size</span>
                        <span className="font-bold text-white">{elements.find(e => e.id === selectedId)?.fontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" 
                        max="72"
                        value={elements.find(e => e.id === selectedId)?.fontSize || 24}
                        onChange={(e) => {
                          setElements(prev => prev.map(el => 
                            el.id === selectedId ? { ...el, fontSize: parseInt(e.target.value) } : el
                          ));
                        }}
                        className="w-full accent-[#7C6EFA]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteElement(selectedId)}
                      className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Layer
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-[#8080A0] text-[10px] border border-dashed border-[#28283E] rounded-xl px-3 leading-normal bg-[#06060F]/20">
                    💡 Hint: Click or double click text blocks directly on the canvas preview card to relocate, resize, colorize, or customize!
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer security badge inside form */}
          <div className="mt-8 pt-4 border-t border-[#1C1C2E] flex items-center gap-2 justify-center text-[10px] text-[#42425A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Secure HD Vector Generation Active</span>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Activity, MapPin, Smartphone, ArrowUpRight, BarChart3, ScanLine, User,
  LayoutDashboard, QrCode, LayoutGrid, FileText, Tags, Square, Library,
  Sparkles, Eye, Layers, UploadCloud, Tag, Search, BookOpen, Settings,
  CreditCard, ArrowLeft, Lock, Mail, Key, CheckCircle2, Trash2, Plus,
  Download, RefreshCw, Sliders, Globe, Laptop, ChevronRight, TrendingUp,
  UserCheck, Compass, HelpCircle, AlertCircle, Sparkle, Settings2, FileCode, Check
} from 'lucide-react';

// Custom theme colors matching our elite dark space workspace
const COLORS = {
  primary: '#7C6EFA',
  primaryLight: '#A89EFF',
  secondary: '#C084FC',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#F2F2FF',
  textMuted: '#8080A0',
  grid: '#1C1C2E',
  bg: '#0A0A12',
  cardBg: '#12121E'
};

// Fixed Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@a2zqr.com',
  password: 'admin'
};

export default function Dashboard() {
  // Session authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user'>(() => {
    return (localStorage.getItem('dashboardUserRole') as 'admin' | 'user') || 'admin';
  });

  // Navigation Active Tab state matching all 17 modules
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'analytics';
  });

  // State persistence engines
  const [dynamicQRs, setDynamicQRs] = useState(() => {
    const saved = localStorage.getItem('dashboardDynamicQRs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'qr-1', name: 'Cozy Cafe Dessert Menu', targetUrl: 'https://cozycafe.com/menu', shortUrl: 'https://ezqr.io/s/cozy', scans: 1420, date: '2026-05-12', category: 'Restaurant' },
      { id: 'qr-2', name: 'VIP Wedding RSVP', targetUrl: 'https://wedding.suvash-design.com/rsvp', shortUrl: 'https://ezqr.io/s/rsvp-suvash', scans: 950, date: '2026-06-01', category: 'Events' },
      { id: 'qr-3', name: 'Boutique Wi-Fi Access', targetUrl: 'WIFI:S:Boutique_WiFi;T:WPA;P:guest123;;', shortUrl: 'https://ezqr.io/s/wifi-boutique', scans: 340, date: '2026-06-10', category: 'Business' },
      { id: 'qr-4', name: 'Elite Real Estate Showcase', targetUrl: 'https://luxuryvillas.co/mumbai-penthouse', shortUrl: 'https://ezqr.io/s/mumbai-pent', scans: 180, date: '2026-06-20', category: 'Business' }
    ];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dashboardCategories');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'cat-1', name: 'Restaurant & Hospitality', count: 18, color: '#F59E0B' },
      { id: 'cat-2', name: 'Real Estate & Property', count: 12, color: '#10B981' },
      { id: 'cat-3', name: 'Wedding & Social Fest', count: 25, color: '#EF4444' },
      { id: 'cat-4', name: 'Creative Portfolio & vCard', count: 32, color: '#7C6EFA' }
    ];
  });

  const [customTemplates, setCustomTemplates] = useState(() => {
    const saved = localStorage.getItem('dashboardCustomTemplates');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'recipe-1', name: 'Champagne Double-Border Frame', theme: 'luxury', frame: 'gold-luxe', bg: '#0F0E14', font: 'Syne', elements: 3 },
      { id: 'recipe-2', name: 'Sakura Pastel Circle Badge', theme: 'creative', frame: 'sakura-blossom', bg: '#FFEBF0', font: 'Inter', elements: 2 },
      { id: 'recipe-3', name: 'Neon Cyberpunk Table QR', theme: 'restaurant', frame: 'neon-cyber', bg: '#05020D', font: 'Fira Code', elements: 4 }
    ];
  });

  const [uploadedAssets, setUploadedAssets] = useState(() => {
    const saved = localStorage.getItem('dashboardUploadedAssets');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'up-1', name: 'Cozy_Cafe_Logo_Gold.svg', size: '24 KB', type: 'image/svg+xml', date: '2026-06-15' },
      { id: 'up-2', name: 'Brand_Mascot_Bear_Icon.png', size: '142 KB', type: 'image/png', date: '2026-06-18' }
    ];
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('dashboardBlogPosts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'blog-1', title: 'Why Dynamic QR Codes Are Changing Restaurant Table Operations', status: 'Published', views: 2450, author: 'Admin' },
      { id: 'blog-2', title: 'The Master Guide to High-Contrast Print Branding: SVG vs PNG', status: 'Draft', views: 0, author: 'Admin' }
    ];
  });

  // State helpers for forms & interactives
  const [newQrName, setNewQrName] = useState('');
  const [newQrTarget, setNewQrTarget] = useState('');
  const [newQrCategory, setNewQrCategory] = useState('Restaurant');
  const [editingQrId, setEditingQrId] = useState<string | null>(null);
  const [editingQrTarget, setEditingQrTarget] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#7C6EFA');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedRecipe, setAiGeneratedRecipe] = useState<any | null>(null);

  const [bulkInput, setBulkInput] = useState('Table 1, https://ezqr.io/t1\nTable 2, https://ezqr.io/t2\nTable 3, https://ezqr.io/t3');
  const [bulkResult, setBulkResult] = useState<any[] | null>(null);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostStatus, setNewPostStatus] = useState<'Published' | 'Draft'>('Published');

  const [domainSettings, setDomainSettings] = useState({
    customDomain: 'qr.suvash-design.com',
    shortPattern: 's',
    sslActive: true
  });

  // Simulated live counter updates
  const [liveScanCount, setLiveScanCount] = useState(24592);

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('dashboardDynamicQRs', JSON.stringify(dynamicQRs));
  }, [dynamicQRs]);

  useEffect(() => {
    localStorage.setItem('dashboardCategories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('dashboardCustomTemplates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem('dashboardUploadedAssets', JSON.stringify(uploadedAssets));
  }, [uploadedAssets]);

  useEffect(() => {
    localStorage.setItem('dashboardBlogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // Simulate incoming QR scans for live dashboard effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.6) {
        setLiveScanCount(prev => prev + 1);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle Logins
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase().trim() === ADMIN_CREDENTIALS.email && passwordInput === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('dashboardUserRole', userRole);
    } else {
      setLoginError('Invalid Email or Password. Please try again!');
    }
  };

  const handleAutofillAdmin = () => {
    setEmailInput(ADMIN_CREDENTIALS.email);
    setPasswordInput(ADMIN_CREDENTIALS.password);
    setUserRole('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isAdminLoggedIn', 'false');
  };

  // Recharts metric generation
  const generateChartData = () => {
    const data = [];
    let baseScans = 750;
    for (let i = 15; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      baseScans += Math.floor(Math.random() * 90) - 40;
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Scans: baseScans,
        Unique: Math.floor(baseScans * 0.72)
      });
    }
    return data;
  };
  const chartData = generateChartData();

  const devicePieData = [
    { name: 'iOS iPhone', value: 5400, color: '#7C6EFA' },
    { name: 'Android Chrome', value: 4200, color: '#10B981' },
    { name: 'Safari Desktop', value: 950, color: '#C084FC' },
    { name: 'Other OS', value: 320, color: '#F59E0B' },
  ];

  // Dynamic QR handlers
  const handleCreateQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQrName || !newQrTarget) return;

    const slug = newQrName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newQr = {
      id: `qr-${Date.now()}`,
      name: newQrName,
      targetUrl: newQrTarget,
      shortUrl: `https://ezqr.io/s/${slug}`,
      scans: 0,
      date: new Date().toISOString().split('T')[0],
      category: newQrCategory
    };

    setDynamicQRs([newQr, ...dynamicQRs]);
    setNewQrName('');
    setNewQrTarget('');
    
    // Update category counts
    setCategories(prev => prev.map(c => {
      if (c.name.includes(newQrCategory) || newQrCategory.includes(c.name)) {
        return { ...c, count: c.count + 1 };
      }
      return c;
    }));
  };

  const handleDeleteQr = (id: string) => {
    if (confirm('Are you sure you want to delete this Dynamic QR Code? Scanners will experience redirection breakdown.')) {
      setDynamicQRs(dynamicQRs.filter(q => q.id !== id));
    }
  };

  const startEditRedirection = (qr: any) => {
    setEditingQrId(qr.id);
    setEditingQrTarget(qr.targetUrl);
  };

  const saveRedirectionEdit = (id: string) => {
    setDynamicQRs(dynamicQRs.map(q => {
      if (q.id === id) {
        return { ...q, targetUrl: editingQrTarget };
      }
      return q;
    }));
    setEditingQrId(null);
  };

  // Category handlers
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      count: 0,
      color: newCategoryColor
    };
    setCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // AI Generator Live Server trigger
  const handleTriggerAiRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setAiGenerating(true);
    setAiGeneratedRecipe(null);

    try {
      const res = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setAiGeneratedRecipe(data);
      } else {
        const errData = await res.json();
        alert('Gemini Server Error: ' + (errData.error || 'Failed to craft template'));
      }
    } catch (err) {
      console.error(err);
      alert('Network failure connecting to Gemini AI generator endpoint.');
    } finally {
      setAiGenerating(false);
    }
  };

  const loadRecipeIntoTemplates = () => {
    if (!aiGeneratedRecipe) return;
    const newT = {
      id: `recipe-${Date.now()}`,
      name: aiGeneratedRecipe.title || 'AI Generated Theme Pack',
      theme: aiGeneratedRecipe.layoutType || 'dynamic_custom',
      frame: aiGeneratedRecipe.visualOverlay?.borderStyle || 'minimalist_outline',
      bg: aiGeneratedRecipe.gradient?.from || '#0A0A12',
      font: 'Syne',
      elements: aiGeneratedRecipe.textElements?.length || 2
    };
    setCustomTemplates([newT, ...customTemplates]);
    alert('AI Recipe successfully synced to Template Registry! Go to base Templates page to inspect elements.');
    setActiveTab('templates');
  };

  // Bulk Generator handler
  const handleBulkGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkInput.split('\n').filter(l => l.trim() !== '');
    const results = lines.map((line, idx) => {
      const parts = line.split(',');
      const label = parts[0]?.trim() || `Bulk Item ${idx + 1}`;
      const url = parts[1]?.trim() || 'https://ezqr.io';
      return {
        label,
        url,
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=150x150&color=0a0a12`,
        slug: label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
    });
    setBulkResult(results);
  };

  // Blog publishing handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle) return;
    const newPost = {
      id: `blog-${Date.now()}`,
      title: newPostTitle,
      status: newPostStatus,
      views: 0,
      author: userRole === 'admin' ? 'Admin Master' : 'Assigned Editor'
    };
    setBlogPosts([newPost, ...blogPosts]);
    setNewPostTitle('');
  };

  const handleDeletePost = (id: string) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
  };

  // Simulated assets upload
  const handleMockAssetUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAsset = {
        id: `up-${Date.now()}`,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type || 'image/svg+xml',
        date: new Date().toISOString().split('T')[0]
      };
      setUploadedAssets([newAsset, ...uploadedAssets]);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setUploadedAssets(uploadedAssets.filter(a => a.id !== id));
  };

  // Login UI
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#040408] flex items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-96 h-96 bg-[#7C6EFA]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-[#C084FC]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md bg-[#0A0A12] border border-[#1C1C2E] rounded-[24px] p-8 relative z-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="font-syne text-2xl font-extrabold text-white tracking-tight">
              A2ZQR Control Center
            </h1>
            <p className="text-xs text-[#8080A0] mt-1.5 leading-relaxed">
              Login to access the unified template factory, dynamic redirection routing, and SEO indexers.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8080A0] uppercase font-extrabold tracking-wider block mb-1.5">
                Workspace Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4E4E6E]" />
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#06060F] border border-[#1C1C2E] focus:border-[#7C6EFA] text-xs text-white rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all placeholder-[#4E4E6E]"
                  placeholder="admin@a2zqr.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8080A0] uppercase font-extrabold tracking-wider block mb-1.5">
                Dashboard Pin / Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4E4E6E]" />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#06060F] border border-[#1C1C2E] focus:border-[#7C6EFA] text-xs text-white rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all placeholder-[#4E4E6E]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-[#8080A0]">
                <input 
                  type="checkbox" 
                  className="rounded border-[#28283E] bg-[#06060F] text-indigo-500 focus:ring-0 w-3.5 h-3.5"
                  defaultChecked
                />
                <span>Remember console credentials</span>
              </label>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" /> Initialize Session
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Swapper */}
          <div className="mt-8 pt-6 border-t border-[#1C1C2E] text-center">
            <span className="text-[10px] text-[#8080A0] uppercase tracking-wider font-extrabold block mb-2.5">
              Testing credentials (quick demo)
            </span>
            <div className="p-3 bg-[#12121E] border border-[#1C1C2E] rounded-xl flex items-center justify-between">
              <div className="text-left text-[11px]">
                <div className="text-white font-mono"><span className="text-[#8080A0]">ID:</span> admin@a2zqr.com</div>
                <div className="text-white font-mono mt-0.5"><span className="text-[#8080A0]">Pass:</span> admin</div>
              </div>
              <button 
                type="button"
                onClick={handleAutofillAdmin}
                className="px-3 py-1.5 bg-[#7C6EFA]/10 hover:bg-[#7C6EFA]/20 border border-[#7C6EFA]/30 text-xs font-bold text-[#A89EFF] rounded-lg transition-colors"
              >
                Autofill Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loaded Dashboard UI
  return (
    <div className="min-h-screen bg-[#040408] text-white flex flex-col md:flex-row font-['Syne',sans-serif]">
      {/* 1. LEFT SIDEBAR CONSOLE LAYOUT */}
      <aside className="w-full md:w-[280px] bg-[#0A0A12] border-r border-[#1C1C2E] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-[#1C1C2E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] flex items-center justify-center text-white shadow-md">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                A2Z<em className="font-normal not-italic text-[#A89EFF]">QR</em> Panel
              </span>
            </div>
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              v2.1
            </span>
          </div>

          {/* Sidebar Menu Groups */}
          <nav className="p-4 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#28283E]">
            {/* Core Monitoring */}
            <div className="space-y-1">
              <span className="text-[9px] text-[#4E4E6E] uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                Core System
              </span>
              <SidebarLink id="analytics" label="Analytics & Scans" icon={<Activity />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="qrs" label="QR Redirection" icon={<QrCode />} active={activeTab} onClick={setActiveTab} count={dynamicQRs.length} />
            </div>

            {/* Design & Asset Factory */}
            <div className="space-y-1">
              <span className="text-[9px] text-[#4E4E6E] uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                Asset & Design Engine
              </span>
              <SidebarLink id="templates" label="Templates Register" icon={<LayoutGrid />} active={activeTab} onClick={setActiveTab} count={customTemplates.length} />
              <SidebarLink id="posters" label="Poster Blueprint" icon={<FileText />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="stickers" label="Sticker Badges" icon={<Tags />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="frames" label="Decorative Frames" icon={<Square />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="library" label="SVG Asset Library" icon={<Library />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="packs" label="Theme Packs" icon={<Layers />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="ai" label="AI Recipe Generator" icon={<Sparkles />} active={activeTab} onClick={setActiveTab} badge="HOT" />
              <SidebarLink id="mockups" label="Mockups Sandbox" icon={<Eye />} active={activeTab} onClick={setActiveTab} />
            </div>

            {/* Scale operations */}
            <div className="space-y-1">
              <span className="text-[9px] text-[#4E4E6E] uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                System Utilities
              </span>
              <SidebarLink id="bulk" label="Bulk Generator" icon={<Settings2 />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="uploads" label="User Uploads" icon={<UploadCloud />} active={activeTab} onClick={setActiveTab} count={uploadedAssets.length} />
              <SidebarLink id="categories" label="QR Directories" icon={<Tag />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="seo" label="SEO Manager" icon={<Search />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="blog" label="Console Blog" icon={<BookOpen />} active={activeTab} onClick={setActiveTab} count={blogPosts.length} />
            </div>

            {/* Configuration */}
            <div className="space-y-1">
              <span className="text-[9px] text-[#4E4E6E] uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                License & Settings
              </span>
              <SidebarLink id="settings" label="White-Label Domain" icon={<Settings />} active={activeTab} onClick={setActiveTab} />
            </div>
          </nav>
        </div>

        {/* User Info footer */}
        <div className="p-4 border-t border-[#1C1C2E] bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                AD
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Suvash Admin</div>
                <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide">Sync Live</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 bg-[#1C1C2E] hover:bg-red-500/10 text-[#8080A0] hover:text-red-400 rounded-lg transition-colors"
              title="Logout session"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. CORE CENTRAL STAGE LAYOUT */}
      <main className="flex-1 min-h-screen bg-[#040408] flex flex-col justify-between overflow-x-hidden">
        {/* Top bar header */}
        <header className="h-16 border-b border-[#1C1C2E] px-6 md:px-8 flex items-center justify-between bg-[#0A0A12]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] text-white font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase">
              CONSOLE {userRole.toUpperCase()} MODE
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8080A0]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Cluster Active (0.0.0.0:3000)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#12121E] border border-[#1C1C2E] text-xs font-bold text-[#A89EFF] hover:text-white rounded-lg hover:border-[#28283E] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Launch Studio Editor
            </button>
            <div className="w-px h-4 bg-[#1C1C2E]"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8080A0] font-semibold hidden md:inline">Suvash Astrology</span>
              <div className="w-8 h-8 rounded-full bg-[#12121E] border border-[#28283E] flex items-center justify-center text-indigo-400 text-xs font-extrabold">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Component Renderer */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          
          {/* TAB 1: ANALYTICS & SCANS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#7C6EFA]" /> Multi-Category Scan Analytics
                </h2>
                <p className="text-xs text-[#8080A0]">Real-time device tracking, country codes, and unique client visits.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Consolidated Scans" value={liveScanCount.toLocaleString()} trend="+18.4%" trendUp={true} icon={<Activity />} />
                <KpiCard title="Active Campaigns" value={dynamicQRs.length} desc="Real-time dynamic endpoints" icon={<QrCode />} />
                <KpiCard title="Unique Fingerprints" value="16,928" trend="+11.2%" trendUp={true} icon={<User />} />
                <KpiCard title="Infrastructure Ping" value="1.8 ms" desc="Google Cloud Run edge" icon={<Laptop />} />
              </div>

              {/* Chart section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dynamic Scan Velocity</h3>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded">Live Refresh active</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                        <XAxis dataKey="name" stroke={COLORS.textMuted} fontSize={10} tickLine={false} />
                        <YAxis stroke={COLORS.textMuted} fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Scans" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#scansGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Scanner Systems (OS)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={devicePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                          {devicePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Geo Table */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" /> High-Intensity Scanning Regions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#1C1C2E] text-[#8080A0]">
                        <th className="py-3 px-4 font-bold">Region Code</th>
                        <th className="py-3 px-4 font-bold">Country</th>
                        <th className="py-3 px-4 font-bold text-right">Traffic Volume</th>
                        <th className="py-3 px-4 font-bold text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12121E]">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">IN-MH (Mumbai/Pune)</td>
                        <td className="py-3 px-4 text-[#8080A0]">India</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">12,490</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">51%</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">IN-DL (Delhi NCR)</td>
                        <td className="py-3 px-4 text-[#8080A0]">India</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">6,240</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">25%</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">US-CA (San Jose)</td>
                        <td className="py-3 px-4 text-[#8080A0]">United States</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">2,410</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">10%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR REDIRECTION MANAGEMENT */}
          {activeTab === 'qrs' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-indigo-400" /> Active Dynamic QR Redirection
                </h2>
                <p className="text-xs text-[#8080A0]">Modify destination URLs instantly without ever printing new cards or stickers.</p>
              </div>

              {/* Add New Dynamic QR Form */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Initialize New Dynamic Redirect</h3>
                <form onSubmit={handleCreateQr} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8080A0] uppercase font-bold">Campaign Name</label>
                    <input 
                      type="text" 
                      value={newQrName}
                      onChange={(e) => setNewQrName(e.target.value)}
                      placeholder="e.g. Dessert Menu Stand" 
                      className="w-full bg-[#06060F] border border-[#28283E] text-xs px-4 py-3 rounded-xl text-white outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] text-[#8080A0] uppercase font-bold">Scan Redirection Destination</label>
                    <input 
                      type="text" 
                      value={newQrTarget}
                      onChange={(e) => setNewQrTarget(e.target.value)}
                      placeholder="e.g. https://myrestaurant.com/spring-desserts" 
                      className="w-full bg-[#06060F] border border-[#28283E] text-xs px-4 py-3 rounded-xl text-white outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold">Category</label>
                      <select 
                        value={newQrCategory}
                        onChange={(e) => setNewQrCategory(e.target.value)}
                        className="w-full bg-[#06060F] border border-[#28283E] text-xs px-3 py-3 rounded-xl text-white outline-none"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Events">Events</option>
                        <option value="Business">Business</option>
                        <option value="Personal">Personal</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="py-3 px-4 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>

              {/* QR Redirection Code Registry Table */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#1C1C2E] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campaign Target Registry</h3>
                  <span className="text-xs text-[#8080A0] font-mono">{dynamicQRs.length} active redirections configured</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#1C1C2E] text-[#8080A0] bg-[#12121E]/30">
                        <th className="py-3 px-4 font-bold">Campaign Name</th>
                        <th className="py-3 px-4 font-bold">Static Gateway Link</th>
                        <th className="py-3 px-4 font-bold">Live Target Destination</th>
                        <th className="py-3 px-4 font-bold text-center">Scan Volume</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12121E]">
                      {dynamicQRs.map((qr: any) => (
                        <tr key={qr.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-white block">{qr.name}</span>
                            <span className="text-[10px] text-indigo-400 font-mono">{qr.category} • {qr.date}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-400 hover:underline cursor-pointer">
                            {qr.shortUrl}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">
                            {editingQrId === qr.id ? (
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={editingQrTarget}
                                  onChange={(e) => setEditingQrTarget(e.target.value)}
                                  className="bg-black/60 border border-[#28283E] text-xs text-white rounded px-2 py-1 flex-1 outline-none font-mono"
                                />
                                <button 
                                  onClick={() => saveRedirectionEdit(qr.id)}
                                  className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#8080A0] font-mono">{qr.targetUrl}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-white text-[13px]">
                            {qr.scans.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {editingQrId !== qr.id && (
                                <button 
                                  onClick={() => startEditRedirection(qr)}
                                  className="px-2.5 py-1.5 bg-[#1C1C2E] text-white hover:bg-indigo-500/15 rounded text-[10px] font-bold border border-[#28283E] transition-all"
                                >
                                  Update Target
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteQr(qr.id)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES REGISTER */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-indigo-400" /> Core Template Registry
                </h2>
                <p className="text-xs text-[#8080A0]">Manage built-in template structures and custom recipe presets synced by our layout engine.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customTemplates.map((t: any) => (
                  <div key={t.id} className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition-all relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8080A0] font-mono bg-[#12121E] px-2.5 py-1 rounded border border-[#28283E]">
                        {t.theme} Pack Structure
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active on Website"></span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-lg">{t.name}</h3>
                      <p className="text-xs text-[#8080A0]">Background: <span className="font-mono text-white">{t.bg}</span></p>
                      <p className="text-xs text-[#8080A0]">Decorative Frame: <span className="font-mono text-white">{t.frame}</span></p>
                      <p className="text-xs text-[#8080A0]">Layout Typography: <span className="font-mono text-white">{t.font}</span></p>
                    </div>

                    <div className="pt-4 border-t border-[#1C1C2E] flex justify-between items-center text-xs">
                      <span className="text-[#8080A0]">{t.elements} layers mapped</span>
                      <button 
                        onClick={() => {
                          setCustomTemplates(customTemplates.filter(item => item.id !== t.id));
                        }}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty block trigger AI */}
                <div 
                  onClick={() => setActiveTab('ai')}
                  className="bg-[#0A0A12] border border-dashed border-[#28283E] rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#7C6EFA] hover:bg-[#12121E]/10 transition-all group"
                >
                  <Sparkles className="w-8 h-8 text-[#A89EFF] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-white">Create Coordinated AI Layout Recipe</span>
                  <span className="text-[11px] text-[#8080A0] mt-1 leading-normal max-w-[180px]">Draft template parameters automatically via natural prompts.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POSTERS CONFIGURATION */}
          {activeTab === 'posters' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-pink-400" /> Poster Size & Bleed Margins
                </h2>
                <p className="text-xs text-[#8080A0]">Configure high-DPI aspect ratio standards, CMYK color spaces, and print safe bleeds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Print Resolution Standards</h3>
                  <div className="space-y-3">
                    <PosterRatioRow label="A4 International Portrait" size="210 x 297 mm" res="300 DPI (2480 x 3508 px)" active={true} />
                    <PosterRatioRow label="US Letter Portrait" size="8.5 x 11.0 in" res="300 DPI (2550 x 3300 px)" />
                    <PosterRatioRow label="A3 High-Impact Display" size="297 x 420 mm" res="300 DPI (3508 x 4960 px)" />
                  </div>
                </div>

                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Bleed & Safe Boundary Guide</h3>
                  <p className="text-xs text-[#8080A0] leading-relaxed">
                    Most industrial printing presses require a <strong>3mm bleed margin</strong> on all edges to account for paper cutting misalignment.
                  </p>
                  <div className="p-4 bg-[#12121E]/80 border border-[#28283E] rounded-xl space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-bold">Recommended Safety Offsets:</span>
                      <span className="text-emerald-400 font-mono">3mm Active</span>
                    </div>
                    <div className="text-[11px] text-[#8080A0] space-y-1 leading-normal">
                      <div>• Safe Zone (Internal): Always keep your scan QR matrix and header texts inside X=40, Y=40.</div>
                      <div>• Cut Boundary: The actual line where paper gets cut.</div>
                      <div>• Bleed Zone: Outer color overflow to avoid raw white borders.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STICKER BADGES */}
          {activeTab === 'stickers' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Tags className="w-6 h-6 text-amber-400" /> Sticker Cut & Badges Console
                </h2>
                <p className="text-xs text-[#8080A0]">Setup physical contour outlines, customized ribbon headings, and sticker sizes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Interactive Sticker Contour Shapes</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StickerShapeCard name="Die-Cut Outline" desc="Perfect star/oval hugs" icon="⭐" active={true} />
                    <StickerShapeCard name="Circle Badge" desc="Standard 3-inch round" icon="⭕" />
                    <StickerShapeCard name="Square Rounded" desc="Curved radius borders" icon="⬜" />
                  </div>
                </div>

                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Preset Print Sizes</h3>
                  <p className="text-xs text-[#8080A0] leading-relaxed">Choose standard roll sizes for physical print vendors (Stickermule, etc.):</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-[#12121E] border border-[#1C1C2E] rounded-xl flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Small Table Stickers</span>
                      <span className="font-mono text-indigo-400">50mm x 50mm (2")</span>
                    </div>
                    <div className="p-3 bg-[#12121E] border border-[#1C1C2E] rounded-xl flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Standard Delivery Stickers</span>
                      <span className="font-mono text-indigo-400">75mm x 75mm (3")</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DECORATIVE FRAMES */}
          {activeTab === 'frames' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Square className="w-6 h-6 text-purple-400" /> Framing Boundaries Registry
                </h2>
                <p className="text-xs text-[#8080A0]">Configure and review luxury, minimal, and neon vector frame overlays.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FrameOverlayCard title="Luxury Gold boundary" borderStyle="Double 1px outline with corner gems" color="hex #D4AF37" active={true} />
                <FrameOverlayCard title="Retro Neon Electro" borderStyle="Outer 3px glowing shadow stroke" color="hex #FF007F" />
                <FrameOverlayCard title="Minimalist Hairline" borderStyle="Thin 0.5px subtle gray boundaries" color="hex #E5E7EB" />
                <FrameOverlayCard title="Sakura Petal Crest" borderStyle="Organic blossom vector frames" color="hex #FFB7C5" />
              </div>
            </div>
          )}

          {/* TAB 7: SVG ASSET LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Library className="w-6 h-6 text-[#7C6EFA]" /> SVG Asset Library (Control Hub)
                </h2>
                <p className="text-xs text-[#8080A0]">Index and categorize vector icons, background stamps, and geometric accents.</p>
              </div>

              {/* Categorized Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] text-xs font-bold rounded-lg text-white">All SVG Assets</button>
                <button className="px-4 py-2 bg-[#12121E] border border-[#1C1C2E] text-xs font-bold rounded-lg text-[#8080A0] hover:text-white">Hospitality & Cafe Icons</button>
                <button className="px-4 py-2 bg-[#12121E] border border-[#1C1C2E] text-xs font-bold rounded-lg text-[#8080A0] hover:text-white">Ribbons & Banners</button>
                <button className="px-4 py-2 bg-[#12121E] border border-[#1C1C2E] text-xs font-bold rounded-lg text-[#8080A0] hover:text-white">Retro Ornaments</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <SvgThumbnailCard label="Coffee Cup Accent" cat="Cafe" preview="☕" />
                <SvgThumbnailCard label="VIP Ribbon Crest" cat="Badges" preview="🎗️" />
                <SvgThumbnailCard label="Map Pin Location" cat="Navigation" preview="📍" />
                <SvgThumbnailCard label="Restaurant Bell Cloche" cat="Hospitality" preview="🛎️" />
                <SvgThumbnailCard label="Wireless Mesh Network" cat="Tech" preview="📶" />
                <SvgThumbnailCard label="Luxury Star Glitter" cat="Branding" preview="✦" />
              </div>
            </div>
          )}

          {/* TAB 8: THEME PACKS */}
          {activeTab === 'packs' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-400" /> Presets Theme Packs
                </h2>
                <p className="text-xs text-[#8080A0]">Bundled packages comprising tailored backgrounds, specialized fonts, and matched vector frames.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ThemePackBox name="The Cozy Bistro" cat="Coffee & Dine" font="Space Grotesk" color="Amber-gold warmth" bg="#1A1108" icons={['Coffee', 'Spoon']} />
                <ThemePackBox name="Obsidian Luxury" cat="Fine Jewelry & Hotels" font="Playfair Display" color="Obsidian gold" bg="#0B090E" icons={['Diamond', 'Crown']} />
                <ThemePackBox name="Tokyo Retro Cyber" cat="Tech & Creative" font="Fira Code" color="Electric violet" bg="#03000A" icons={['Cpu', 'Zap']} />
              </div>
            </div>
          )}

          {/* TAB 9: AI RECIPE GENERATOR (Connected to Gemini Server API) */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">
                    ✨ Gemini Coordinated Layout Builder
                  </h2>
                  <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">GEMINI ACTIVE</span>
                </div>
                <p className="text-xs text-[#8080A0]">Provide a descriptive branding prompt. Our backend triggers Gemini 3.5 Flash to write custom layout colors, coordinates, and custom SVG paths instantly.</p>
              </div>

              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <form onSubmit={handleTriggerAiRecipe} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Describe Your Coordinated Brand Direction
                    </label>
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-[#06060F] border border-[#28283E] rounded-xl p-4 text-xs text-white outline-none focus:border-[#7C6EFA]"
                      placeholder="e.g. Minimalist boutique hotel in Kyoto. Needs off-white backgrounds, luxurious gold thin border frames, and calligraphy-styled text labels..."
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={aiGenerating}
                    className="py-3.5 px-6 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                  >
                    {aiGenerating ? 'AI Crafting Coordinated Layout...' : 'Generate Layout Parameters Recipe'}
                  </button>
                </form>
              </div>

              {/* Display generated recipe result */}
              {aiGeneratedRecipe && (
                <div className="bg-[#0A0A12] border border-emerald-500/30 rounded-2xl p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-[#1C1C2E] pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wide">Dynamic Layout Recipe Crafted Successfully!</span>
                        <h4 className="text-sm font-extrabold text-white">{aiGeneratedRecipe.title}</h4>
                      </div>
                    </div>
                    <button 
                      onClick={loadRecipeIntoTemplates}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Sync Recipe to Template Registry
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-black/40 rounded-xl space-y-2">
                      <span className="text-[#8080A0] uppercase font-bold text-[10px] block">Coordinated Visual Variables</span>
                      <div>• Category: <span className="text-white font-semibold">{aiGeneratedRecipe.category}</span></div>
                      <div>• Background Pattern: <span className="text-white font-semibold">{aiGeneratedRecipe.bgType}</span></div>
                      <div>• Dots Eye Style: <span className="text-white font-semibold">{aiGeneratedRecipe.qrConfig?.dotsStyle}</span></div>
                      <div>• Coordinated Dots Color: <span className="text-white font-semibold font-mono">{aiGeneratedRecipe.qrConfig?.fgColor}</span></div>
                      <div>• Custom Canvas Overlay: <span className="text-white font-semibold">{aiGeneratedRecipe.layoutType}</span></div>
                    </div>

                    <div className="p-4 bg-[#06060F] rounded-xl overflow-x-auto">
                      <span className="text-[#8080A0] uppercase font-bold text-[10px] block mb-2">Live Raw JSON Recipe</span>
                      <pre className="text-[10px] font-mono text-[#A89EFF] leading-normal select-all">
                        {JSON.stringify(aiGeneratedRecipe, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: MOCKUPS SANDBOX */}
          {activeTab === 'mockups' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Eye className="w-6 h-6 text-emerald-400" /> Mockup Sandbox Preview
                </h2>
                <p className="text-xs text-[#8080A0]">Review your printed templates inside high-class physical environments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-[#12121E] flex items-center justify-center text-4xl border-b border-[#1C1C2E]">
                    ☕🍽️
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Cozy Table Menu Stand</h3>
                    <p className="text-xs text-[#8080A0]">Realistic wooden tabletop stand with warm lights and plant shadow overlay.</p>
                  </div>
                </div>

                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-[#12121E] flex items-center justify-center text-4xl border-b border-[#1C1C2E]">
                    🍷🌹
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Luxury Event Banquet</h3>
                    <p className="text-xs text-[#8080A0]">Sleek glass holder next to golden champagne and silver plate setups.</p>
                  </div>
                </div>

                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-[#12121E] flex items-center justify-center text-4xl border-b border-[#1C1C2E]">
                    🛍️🏢
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Boutique Checkout Desk</h3>
                    <p className="text-xs text-[#8080A0]">Gleaming quartz counter space in front of apparel displays.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: BULK GENERATOR */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-indigo-400" /> Batch Bulk Generator Engine
                </h2>
                <p className="text-xs text-[#8080A0]">Generate hundreds of QR Codes instantly using CSV lists.</p>
              </div>

              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <form onSubmit={handleBulkGenerate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white font-extrabold block">Bulk Raw Input (Format: Label, Destination URL)</label>
                    <textarea 
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      rows={5}
                      className="w-full bg-[#06060F] border border-[#28283E] rounded-xl p-4 text-xs font-mono text-white outline-none focus:border-[#7C6EFA]"
                      placeholder="Table 1, https://ezqr.io/t1..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="py-3 px-6 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs rounded-xl shadow-md uppercase"
                  >
                    Generate Batch Now
                  </button>
                </form>
              </div>

              {bulkResult && (
                <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-[#1C1C2E] pb-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compiled Output Batch ({bulkResult.length} files)</h3>
                    <button 
                      onClick={() => alert('Simulated high-res asset folder zip downloaded!')}
                      className="px-3.5 py-1.5 bg-[#7C6EFA]/10 border border-[#7C6EFA]/30 hover:bg-[#7C6EFA]/20 text-xs text-[#A89EFF] font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ZIP Archive
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {bulkResult.map((r, i) => (
                      <div key={i} className="p-3 bg-[#12121E] border border-[#1C1C2E] rounded-xl text-center space-y-2">
                        <img src={r.qrUrl} className="w-24 h-24 mx-auto rounded" alt={r.label} />
                        <span className="font-extrabold text-[11px] text-white block truncate">{r.label}</span>
                        <span className="text-[9px] text-[#8080A0] block truncate font-mono">{r.url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 12: USER UPLOADS */}
          {activeTab === 'uploads' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-emerald-400" /> Brand Media Uploads
                </h2>
                <p className="text-xs text-[#8080A0]">Manage uploaded high-fidelity vector company logos and background design files.</p>
              </div>

              {/* Mock Upload Box */}
              <div className="bg-[#0A0A12] border border-dashed border-[#28283E] rounded-2xl p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#7C6EFA] hover:bg-[#12121E]/5 transition-all relative">
                <input 
                  type="file" 
                  onChange={handleMockAssetUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-[#A89EFF] mb-3" />
                <span className="font-bold text-sm text-white">Drag & Drop brand assets here</span>
                <span className="text-xs text-[#8080A0] mt-1">Supports transparent SVGs, high-res PNGs, and custom backgrounds.</span>
              </div>

              {/* Assets Registry List */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Catalog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedAssets.map(a => (
                    <div key={a.id} className="p-4 bg-[#12121E] border border-[#1C1C2E] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-lg">📁</div>
                        <div>
                          <span className="font-bold text-xs text-white block">{a.name}</span>
                          <span className="text-[10px] text-[#8080A0]">{a.size} • {a.type}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteAsset(a.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: CATEGORIES / QR DIRECTORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Tag className="w-6 h-6 text-[#7C6EFA]" /> Category Directories Config
                </h2>
                <p className="text-xs text-[#8080A0]">Manage category listings, colors, and global directory grouping codes.</p>
              </div>

              {/* Add New Category */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Register New Catalog Category</h3>
                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8080A0] uppercase font-bold">Category Name</label>
                    <input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Pet Care & Vet" 
                      className="w-full bg-[#06060F] border border-[#28283E] text-xs px-4 py-3 rounded-xl text-white outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8080A0] uppercase font-bold">Theme Color Accents</label>
                    <input 
                      type="color" 
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-full h-11 bg-transparent cursor-pointer rounded border border-[#28283E]"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="py-3.5 px-6 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs uppercase rounded-xl shadow-md"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              {/* Categories Catalog */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="p-5 bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl space-y-3 relative group hover:border-indigo-500/25 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <button 
                        onClick={() => handleDeleteCategory(c.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <span className="text-[11px] text-[#8080A0] font-mono">{c.count} active campaigns</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: SEO MANAGER */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-indigo-400" /> Search Engine Optimization (SEO) Config
                </h2>
                <p className="text-xs text-[#8080A0]">Configure automated sitemaps, robots.txt indexing rules, and meta tags schema.</p>
              </div>

              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Google Indexing Settings</h3>
                <div className="space-y-3 text-xs text-[#8080A0]">
                  <div className="flex justify-between items-center p-3 bg-[#12121E]/80 rounded-xl">
                    <span>Target Indexing Rule</span>
                    <span className="font-mono text-emerald-400 font-bold">INDEX, FOLLOW (Robots active)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#12121E]/80 rounded-xl">
                    <span>XML Dynamic Sitemap</span>
                    <span className="font-mono text-white hover:underline cursor-pointer">/sitemap.xml</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: BLOG PUBLISHING */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-400" /> Console Blog Engine
                </h2>
                <p className="text-xs text-[#8080A0]">Publish helpful articles, dynamic QR use cases, and tips for printed brand templates.</p>
              </div>

              {/* Create new post */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Compose Fresh Tutorial</h3>
                <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] text-[#8080A0] uppercase font-bold">Article Title</label>
                    <input 
                      type="text" 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="e.g. 5 Mistakes to Avoid when Printing Restaurant Menu QR Badges" 
                      className="w-full bg-[#06060F] border border-[#28283E] text-xs px-4 py-3 rounded-xl text-white outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] text-[#8080A0] uppercase font-bold">Status</label>
                      <select 
                        value={newPostStatus}
                        onChange={(e: any) => setNewPostStatus(e.target.value)}
                        className="w-full bg-[#06060F] border border-[#28283E] text-xs px-3 py-3 rounded-xl text-white outline-none"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="py-3.5 px-6 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs uppercase rounded-xl shadow-md"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>

              {/* Published registry list */}
              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Blog Posts</h3>
                <div className="space-y-2">
                  {blogPosts.map(p => (
                    <div key={p.id} className="p-4 bg-[#12121E]/60 border border-[#1C1C2E] rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{p.title}</span>
                        <span className="text-[10px] text-[#8080A0]">By {p.author} • {p.status === 'Published' ? '🟢 Published' : '🟡 Draft'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-white font-bold">{p.views.toLocaleString()} views</span>
                        <button 
                          onClick={() => handleDeletePost(p.id)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 16: WHITE-LABEL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C2E] pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-400" /> White-Label Settings
                </h2>
                <p className="text-xs text-[#8080A0]">Configure your brand's unique custom dynamic short-linking domains.</p>
              </div>

              <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-extrabold block">Custom Short-Link Domain Routing</label>
                  <input 
                    type="text" 
                    value={domainSettings.customDomain}
                    onChange={(e) => setDomainSettings({ ...domainSettings, customDomain: e.target.value })}
                    className="w-full bg-[#06060F] border border-[#28283E] text-xs px-4 py-3 rounded-xl text-white outline-none"
                    placeholder="e.g. qr.mybrand.com"
                  />
                </div>
                <div className="p-4 bg-[#12121E] border border-[#28283E] rounded-xl flex justify-between items-center text-xs text-[#8080A0]">
                  <span>Active SSL Certificates (Let's Encrypt)</span>
                  <span className="text-emerald-400 font-bold">🟢 Active & Verified</span>
                </div>
                <button 
                  onClick={() => alert('Custom Domain Settings updated successfully on DNS lookup maps!')}
                  className="py-3 px-5 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] hover:brightness-110 text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Save White-label Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Console global footer */}
        <footer className="h-14 border-t border-[#1C1C2E] px-8 flex items-center justify-between bg-[#0A0A12] text-xs text-[#4E4E6E] shrink-0">
          <span>© 2026 A2ZQR console · Designed by Suvash Astrologer</span>
          <span>Google AI Studio Host integration active</span>
        </footer>
      </main>
    </div>
  );
}

// Reusable Stat/Kpi Card
function KpiCard({ title, value, trend, trendUp, icon, desc }: any) {
  return (
    <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-5 flex flex-col justify-between hover:border-[#28283E] transition-colors shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#8080A0] font-bold uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-[#12121E] text-[#A89EFF] rounded-lg border border-[#1C1C2E]">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-black text-white font-mono leading-none">{value}</div>
        {trend ? (
          <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend} vs last cycle
          </span>
        ) : (
          <span className="text-[10px] text-[#8080A0] font-medium leading-none block">{desc}</span>
        )}
      </div>
    </div>
  );
}

// Reusable link for sidebar
function SidebarLink({ id, label, icon, active, onClick, count, badge }: any) {
  const isSelected = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
        isSelected 
          ? 'bg-gradient-to-r from-[#7C6EFA]/10 to-[#C084FC]/5 border-indigo-500/30 text-white shadow-sm'
          : 'bg-transparent border-transparent text-[#8080A0] hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`transition-colors ${isSelected ? 'text-[#A89EFF]' : 'text-[#4E4E6E] group-hover:text-white'}`}>
          {icon}
        </span>
        <span className="tracking-tight text-[11.5px]">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/40 border border-[#1C1C2E] text-[#8080A0] font-mono font-bold">
          {count}
        </span>
      )}
      {badge && (
        <span className="text-[8px] px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold font-mono uppercase tracking-widest scale-90">
          {badge}
        </span>
      )}
    </button>
  );
}

// Helper rows/boxes
function PosterRatioRow({ label, size, res, active }: any) {
  return (
    <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${active ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-[#12121E] border-[#1C1C2E] text-[#8080A0]'}`}>
      <div>
        <span className="font-extrabold text-white block">{label}</span>
        <span className="text-[10px] font-mono text-[#8080A0]">{size}</span>
      </div>
      <span className="font-mono font-bold text-[#A89EFF]">{res}</span>
    </div>
  );
}

function StickerShapeCard({ name, desc, icon, active }: any) {
  return (
    <div className={`p-4 rounded-xl border text-center space-y-1.5 transition-all ${active ? 'bg-amber-500/10 border-amber-500/30 text-white' : 'bg-[#12121E] border-[#1C1C2E] text-[#8080A0]'}`}>
      <span className="text-2xl block">{icon}</span>
      <span className="font-bold text-[11px] block text-white leading-none">{name}</span>
      <span className="text-[9px] text-[#8080A0] block leading-tight">{desc}</span>
    </div>
  );
}

function FrameOverlayCard({ title, borderStyle, color, active }: any) {
  return (
    <div className={`p-4 rounded-2xl border space-y-2 transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[#12121E] border-[#1C1C2E]'}`}>
      <div className="flex justify-between items-center">
        <h4 className="font-extrabold text-xs text-white leading-tight">{title}</h4>
        {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
      </div>
      <p className="text-[10px] text-[#8080A0] leading-snug">{borderStyle}</p>
      <span className="text-[9px] font-mono text-[#A89EFF] block font-bold">{color}</span>
    </div>
  );
}

function SvgThumbnailCard({ label, cat, preview }: any) {
  return (
    <div className="p-4 bg-[#0A0A12] border border-[#1C1C2E] rounded-xl text-center space-y-2 hover:border-indigo-500/35 transition-all">
      <div className="text-3xl h-10 flex items-center justify-center">{preview}</div>
      <span className="font-extrabold text-[10.5px] text-white block truncate">{label}</span>
      <span className="text-[8px] text-[#4E4E6E] block uppercase font-mono tracking-wider">{cat}</span>
    </div>
  );
}

function ThemePackBox({ name, cat, font, color, bg, icons }: any) {
  return (
    <div className="p-5 bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl space-y-4 hover:border-indigo-500/25 transition-all">
      <div className="space-y-1">
        <span className="text-[9px] bg-indigo-500/15 border border-indigo-500/20 text-[#A89EFF] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">{cat}</span>
        <h4 className="font-bold text-white text-base mt-2">{name}</h4>
      </div>
      <div className="space-y-1 text-xs text-[#8080A0]">
        <div>Typography pairing: <span className="text-white font-mono">{font}</span></div>
        <div>Matched Palette: <span className="text-white font-mono">{color}</span></div>
        <div>Default Background: <span className="text-white font-mono">{bg}</span></div>
        <div className="flex gap-1 mt-2">
          {icons.map((ico: any) => (
            <span key={ico} className="text-[9px] font-bold bg-[#12121E] text-white border border-[#28283E] px-2 py-0.5 rounded font-mono">#{ico}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

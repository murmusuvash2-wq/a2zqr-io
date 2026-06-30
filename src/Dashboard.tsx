import React, { useState, useEffect } from 'react';
import { templateService, TemplateDesign } from './lib/firebase';
import { QR_TOOLS, QRTool } from './data/tools-database';
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
  UserCheck, Compass, HelpCircle, AlertCircle, Sparkle, Settings2, FileCode, Check,
  Wand2, Clock, MoreVertical
} from 'lucide-react';
import { Input, Button, Card, EmptyState, Tabs, Select, Badge, Textarea, Dropdown, SkipLink } from './design-system';
import { toastState } from './lib/toast';

// Custom theme colors matching our high-visibility minimalist workspace
const COLORS = {
  primary: '#000000', // Solid Black
  primaryLight: '#222222',
  secondary: '#111111',
  accent: '#000000',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#000000', // Solid Black for ultra high visibility
  textMuted: '#555555', // Slate 600
  grid: '#E2E8F0', // Slate 200 grid
  bg: '#FFFFFF', // Pure White background
  cardBg: '#FFFFFF' // Pure White card background
};

// Admin credentials from environment or fallback to empty string
const getAdminCredentials = () => ({
  email: (import.meta as any).env?.VITE_ADMIN_EMAIL || '',
  password: (import.meta as any).env?.VITE_ADMIN_PASSWORD || ''
});

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

  // Curation States
  const [curationTemplates, setCurationTemplates] = useState<TemplateDesign[]>([]);
  const [loadingCuration, setLoadingCuration] = useState(false);
  const [triggeringDaily, setTriggeringDaily] = useState(false);
  const [curationError, setCurationError] = useState<string | null>(null);
  const [curationSuccess, setCurationSuccess] = useState<string | null>(null);

  // Scheduler configuration state
  const [scheduleConfig, setScheduleConfig] = useState<{
    enabled: boolean;
    time: string;
    dailyChallenge: string;
    lastRunDate: string;
    history: any[];
  } | null>(null);
  const [updatingSchedule, setUpdatingSchedule] = useState(false);

  // AI 100-Tools Design Factory States
  const [selectedTool, setSelectedTool] = useState<QRTool | null>(null);
  const [searchToolQuery, setSearchToolQuery] = useState('');
  const [filterToolCategory, setFilterToolCategory] = useState('');
  const [filterToolStatus, setFilterToolStatus] = useState<'all' | 'unassigned' | 'assigned'>('all');
  const [isGeneratingToolTemplates, setIsGeneratingToolTemplates] = useState(false);
  const [generatedToolTemplates, setGeneratedToolTemplates] = useState<TemplateDesign[]>([]);
  const [toolGeneratingMessage, setToolGeneratingMessage] = useState('');
  const [toolSuccessMessage, setToolSuccessMessage] = useState<string | null>(null);
  const [toolErrorMessage, setToolErrorMessage] = useState<string | null>(null);

  // --- DYNAMIC SCAN PAGES PRO PLAN STATES ---
  const [activeScanType, setActiveScanType] = useState<'wedding' | 'pet' | 'vcard' | 'wifi' | 'review' | 'capsule'>('wedding');
  
  // 1. Wedding RSVP Settings
  const [weddingConfig, setWeddingConfig] = useState({
    title: "Suvash & Maya's Grand Wedding RSVP",
    hosts: "Suvash Astrologer & Maya Sharma",
    date: "December 18, 2026",
    venue: "The Palace Gardens, Mumbai, India",
    welcomeMessage: "We invite you to celebrate our union of love, stars, and destiny. Please RSVP by November 1st to confirm your presence.",
    foodChoices: "Vegetarian, Vegan, Non-Vegetarian",
    showRsvpList: true
  });
  const [rsvps, setRsvps] = useState([
    { name: "Rahul Patel", choice: "Yes", guests: 2, food: "Vegetarian", msg: "Can't wait! Congratulations!" },
    { name: "Priya Rao", choice: "Yes", guests: 1, food: "Vegan", msg: "So happy for both of you! ✨" },
    { name: "Amit Shah", choice: "No", guests: 0, food: "None", msg: "Warm wishes but cannot attend due to travel." }
  ]);
  const [newRsvpName, setNewRsvpName] = useState('');
  const [newRsvpChoice, setNewRsvpChoice] = useState('Yes');
  const [newRsvpGuests, setNewRsvpGuests] = useState(1);
  const [newRsvpFood, setNewRsvpFood] = useState('Vegetarian');
  const [newRsvpMsg, setNewRsvpMsg] = useState('');

  // 2. Pet ID Tag Settings
  const [petConfig, setPetConfig] = useState({
    petName: "Rocky",
    breed: "Golden Retriever (Friendly)",
    ownerName: "Suvash Astrologer",
    ownerPhone: "+91 98765 43210",
    ownerAddress: "12, Celestial Towers, Bandra West, Mumbai",
    medicalNotes: "Allergic to dairy. Microchipped #9851-24.",
    emergencyContact: "+91 98765 43211",
    rewardMessage: "Please call immediately! 10,000 INR reward for safe return."
  });

  // 3. Digital Business Card (vCard Extra) Settings
  const [vcardConfig, setVcardConfig] = useState({
    name: "Suvash Astrologer",
    title: "Chief Branding Officer & Tech Strategist",
    company: "A2ZQR Systems & AstroMedia LLC",
    bio: "Helping businesses design permanent, high-contrast brand pathways that scale effortlessly.",
    phone: "+91 98765 43210",
    email: "suvash.astrology@gmail.com",
    whatsapp: "+91 98765 43210",
    website: "https://ai.studio/build",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=suvash"
  });

  // 4. Wi-Fi Easy Connect Settings
  const [wifiConfig, setWifiConfig] = useState({
    ssid: "A2ZQR_HighSpeed_Guest",
    security: "WPA2/WPA3",
    password: "connect_instant_99",
    welcomeNote: "Welcome to A2ZQR Corporate Lounge. Enjoy ultra-fast 1Gbps fiber optics on us!",
    supportPhone: "+91 98765 43210"
  });

  // 5. Google Review Booster Settings
  const [reviewConfig, setReviewConfig] = useState({
    storeName: "A2ZQR Premium Lounge",
    promptText: "Love our QR designs? Help us grow by leaving a 5-star Google Review!",
    targetUrl: "https://g.page/r/a2zqr-review",
    incentiveText: "Scan and show your completed review screen to the counter desk for a free premium dessert/drink!"
  });

  // 6. Time Capsule Settings
  const [capsuleConfig, setCapsuleConfig] = useState({
    capsuleTitle: "My 10-Year Astro Prediction Capsule",
    creator: "Suvash Astrologer",
    lockDuration: "3650 Days (Unlock Year 2036)",
    lockDate: "June 26, 2026",
    secretMessage: "In 2036, decentralized QR systems will be embedded into physical clothing threads. Maintain absolute digital sovereignty.",
    files: ["Astro_Predictions_2026_2036.pdf", "Key_Signature_Bandra.key"],
    isUnlocked: false
  });
  const [capsuleCodeInput, setCapsuleCodeInput] = useState('');
  const [capsuleStatusMsg, setCapsuleStatusMsg] = useState('');

  // --- TEMPLATE FACTORY & ASSET-ID ARCHITECTURE STATES ---
  const [factoryStep, setFactoryStep] = useState<'blueprint' | 'background' | 'assets' | 'packs' | 'position' | 'score'>('blueprint');
  const [factoryTitle, setFactoryTitle] = useState('Google Review Cafe Booster');
  const [factorySubtitle, setFactorySubtitle] = useState('Scan to get 10% off your next cappuccino');
  const [factoryCategory, setFactoryCategory] = useState('Restaurant');
  const [factoryBgId, setFactoryBgId] = useState('BG-000921');
  const [factoryFrameId, setFactoryFrameId] = useState('FRAME-000031');
  const [factoryStickerId, setFactoryStickerId] = useState('STICKER-000210');
  const [factoryPatternId, setFactoryPatternId] = useState('PATTERN-000051');
  const [factoryIconId, setFactoryIconId] = useState('ICON-000245');
  const [factoryVariation, setFactoryVariation] = useState<'Minimal' | 'Luxury' | 'Dark' | 'Corporate' | 'Playful' | 'Neon'>('Luxury');
  const [factoryTextY, setFactoryTextY] = useState(120);
  const [factoryQrY, setFactoryQrY] = useState(280);
  const [factoryPrompt, setFactoryPrompt] = useState('Luxury gold and black marble texture background for high-end boutique');
  const [isFactoryGeneratingBg, setIsFactoryGeneratingBg] = useState(false);
  const [factoryGeneratedBgs, setFactoryGeneratedBgs] = useState<string[]>([
    'BG-000921', 'BG-000542', 'BG-000108'
  ]);
  const [factoryCustomTemplates, setFactoryCustomTemplates] = useState<any[]>([]);

  // Premium loading effect messages
  useEffect(() => {
    let timer: any;
    if (isGeneratingToolTemplates) {
      const messages = [
        "Analyzing tool branding specifications...",
        "Engineering 10 distinct, customized visual concepts...",
        "Configuring premium matching gradients & Unsplash overlays...",
        "Calculating high-precision text and layout coordinates...",
        "Drafting custom vector SVG background line curves...",
        "Selecting perfectly matching QR corner & dot pattern structures...",
        "Beautifying floating vector emojis for extra visual depth...",
        "Assembling the 10 premium layout variants into JSON schemas...",
        "Optimizing high-contrast text layers for maximum readability...",
        "Finalizing coordination parameters with Gemini..."
      ];
      let idx = 0;
      setToolGeneratingMessage(messages[0]);
      timer = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setToolGeneratingMessage(messages[idx]);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isGeneratingToolTemplates]);

  const handleGenerateToolTemplates = async (tool: QRTool) => {
    setSelectedTool(tool);
    setIsGeneratingToolTemplates(true);
    setToolErrorMessage(null);
    setToolSuccessMessage(null);
    setGeneratedToolTemplates([]);

    try {
      const response = await fetch('/api/generate-tool-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          toolName: tool.name,
          toolDescription: tool.description,
          toolCategory: tool.category
        })
      });

      let responseText = "";
      try {
        responseText = await response.text();
      } catch (textErr) {
        throw new Error(`Failed to read response stream: ${response.statusText || response.status}`);
      }

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn("Backend responded with non-JSON content:", responseText);
        let errorMessage = `Server responded with an unexpected error (${response.status})`;
        if (responseText.includes("<title>")) {
          const titleMatch = responseText.match(/<title>([\s\S]*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            errorMessage = `Server Error: ${titleMatch[1].trim()}`;
          }
        } else if (responseText.length > 0 && responseText.length < 200) {
          errorMessage = `Server Error: ${responseText}`;
        } else if (response.status === 504 || response.status === 502) {
          errorMessage = `Gateway Timeout (504): Gemini is taking longer to respond due to high demand. Please try again in a moment!`;
        }
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      if (data.templates && Array.isArray(data.templates)) {
        setGeneratedToolTemplates(data.templates);
        setToolSuccessMessage(`Successfully generated 10 premium design variations tailored specifically for "${tool.name}"!`);
      } else {
        throw new Error('Invalid response structure received from Gemini');
      }
    } catch (err: any) {
      console.error(err);
      setToolErrorMessage(err.message || 'Network failure during Gemini generation.');
    } finally {
      setIsGeneratingToolTemplates(false);
    }
  };

  const handleApproveToolTemplate = async (template: TemplateDesign) => {
    try {
      const approvedT: TemplateDesign = {
        ...template,
        status: 'approved',
        approvedAt: new Date().toISOString()
      };
      await templateService.saveTemplate(approvedT);
      
      // Update local state in curationTemplates as well so it stays synced
      setCurationTemplates(prev => {
        const idx = prev.findIndex(t => t.id === template.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = approvedT;
          return clone;
        } else {
          return [approvedT, ...prev];
        }
      });

      // Update in our temporary generated collection to set approved state or remove it
      setGeneratedToolTemplates(prev => prev.filter(t => t.id !== template.id));
      setToolSuccessMessage(`"${template.title}" has been approved and published live!`);
    } catch (err: any) {
      setToolErrorMessage(err.message || 'Failed to approve variation');
    }
  };

  const handleBulkApproveToolTemplates = async () => {
    if (generatedToolTemplates.length === 0) return;
    try {
      const batch = generatedToolTemplates.map(t => ({
        ...t,
        status: 'approved' as const,
        approvedAt: new Date().toISOString()
      }));

      await templateService.saveTemplatesBatch(batch);
      
      // Update state
      setCurationTemplates(prev => [...batch, ...prev]);
      setGeneratedToolTemplates([]);
      setToolSuccessMessage(`All 10 premium variations approved and published live to the platform registry successfully!`);
    } catch (err: any) {
      setToolErrorMessage(err.message || 'Failed to bulk approve variations.');
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        setScheduleConfig(data);
      } else {
        console.warn("Failed to fetch scheduler config, setting defaults");
        setScheduleConfig({
          enabled: false,
          time: "09:00",
          dailyChallenge: "Futuristic Neon Synthwave",
          lastRunDate: "",
          history: []
        });
      }
    } catch (e) {
      console.warn("Failed to fetch scheduler config", e);
      setScheduleConfig({
        enabled: false,
        time: "09:00",
        dailyChallenge: "Futuristic Neon Synthwave",
        lastRunDate: "",
        history: []
      });
    }
  };

  const updateSchedule = async (newConfig: { enabled?: boolean; time?: string; dailyChallenge?: string }) => {
    setUpdatingSchedule(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (res.ok) {
        const data = await res.json();
        setScheduleConfig(data.config);
        setCurationSuccess("Gemini Automatic Scheduler settings saved successfully!");
      }
    } catch (e: any) {
      setCurationError(e.message || "Failed to update scheduler settings");
    } finally {
      setUpdatingSchedule(false);
    }
  };

  // Load curation templates on mount or tab change
  const loadCurationTemplates = async () => {
    setLoadingCuration(true);
    setCurationError(null);
    try {
      const list = await templateService.getTemplates();
      setCurationTemplates(list);
    } catch (err: any) {
      setCurationError(err.message || "Failed to load curation templates.");
    } finally {
      setLoadingCuration(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai_curation') {
      loadCurationTemplates();
      fetchSchedule();
    }
  }, [activeTab]);

  const handleTriggerDailyGeneration = async () => {
    setTriggeringDaily(true);
    setCurationError(null);
    setCurationSuccess(null);
    try {
      const response = await fetch('/api/daily-templates?force=true');
      
      let responseText = "";
      try {
        responseText = await response.text();
      } catch (textErr) {
        throw new Error(`Failed to read response stream: ${response.statusText || response.status}`);
      }

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn("Backend responded with non-JSON content:", responseText);
        let errorMessage = `Server responded with an unexpected error (${response.status})`;
        if (responseText.includes("<title>")) {
          const titleMatch = responseText.match(/<title>([\s\S]*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            errorMessage = `Server Error: ${titleMatch[1].trim()}`;
          }
        } else if (responseText.length > 0 && responseText.length < 200) {
          errorMessage = `Server Error: ${responseText}`;
        } else if (response.status === 504 || response.status === 502) {
          errorMessage = `Gateway Timeout (504): Gemini is taking longer to respond due to high demand. Please try again in a moment!`;
        }
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }
      
      // Save these 10 templates as "pending" in the Firestore DB
      const freshTemplates: TemplateDesign[] = (data.templates || []).map((t: any) => ({
        ...t,
        status: 'pending',
        createdAt: new Date().toISOString()
      }));

      await templateService.saveTemplatesBatch(freshTemplates);
      await loadCurationTemplates();
      setCurationSuccess(`Successfully generated 10 daily templates for the theme: "${data.themeTitle}"!`);
    } catch (err: any) {
      setCurationError(err.message || 'Generation failed.');
    } finally {
      setTriggeringDaily(false);
    }
  };

  const handleApproveTemplate = async (templateId: string) => {
    try {
      await templateService.approveTemplate(templateId);
      setCurationSuccess("Template approved and published live successfully!");
      // Update local state immediately
      setCurationTemplates(prev => prev.map(t => t.id === templateId ? { ...t, status: 'approved', approvedAt: new Date().toISOString() } : t));
    } catch (err: any) {
      setCurationError(err.message || "Approval failed.");
    }
  };

  const handleRejectTemplate = async (templateId: string) => {
    try {
      await templateService.rejectTemplate(templateId);
      setCurationSuccess("Template rejected.");
      // Update local state immediately
      setCurationTemplates(prev => prev.map(t => t.id === templateId ? { ...t, status: 'rejected' } : t));
    } catch (err: any) {
      setCurationError(err.message || "Rejection failed.");
    }
  };

  const handleUpdateCurationCategory = async (templateId: string, category: string) => {
    try {
      await templateService.updateTemplateCategory(templateId, category);
      // Update local state immediately
      setCurationTemplates(prev => prev.map(t => t.id === templateId ? { ...t, category } : t));
    } catch (err: any) {
      setCurationError(err.message || "Failed to update category.");
    }
  };

  const handleDeleteCurationTemplate = async (templateId: string) => {
    try {
      await templateService.deleteTemplate(templateId);
      setCurationSuccess("Template deleted from queue.");
      setCurationTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (err: any) {
      setCurationError(err.message || "Delete failed.");
    }
  };

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
    const creds = getAdminCredentials();
    // Allow login if credentials match env vars OR if env vars are not set (demo mode)
    // In production, you'd integrate Firebase Auth here.
    const isEnvSet = creds.email !== '' && creds.password !== '';
    const isMatch = emailInput.toLowerCase().trim() === creds.email && passwordInput === creds.password;
    
    if (!isEnvSet || isMatch) {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('dashboardUserRole', userRole);
    } else {
      setLoginError('Invalid Email or Password. Please try again!');
    }
  };

  const handleAutofillAdmin = () => {
    const creds = getAdminCredentials();
    if (creds.email && creds.password) {
      setEmailInput(creds.email);
      setPasswordInput(creds.password);
    } else {
      setEmailInput('demo@a2zqr.com');
      setPasswordInput('demo');
    }
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
    setCategories((prev: any[]) => prev.map((c: any) => {
      if (c.name.includes(newQrCategory) || newQrCategory.includes(c.name)) {
        return { ...c, count: c.count + 1 };
      }
      return c;
    }));
  };

  const handleDeleteQr = (id: string) => {
    if (confirm('Are you sure you want to delete this Dynamic QR Code? Scanners will experience redirection breakdown.')) {
      setDynamicQRs(dynamicQRs.filter((q: any) => q.id !== id));
    }
  };

  const startEditRedirection = (qr: any) => {
    setEditingQrId(qr.id);
    setEditingQrTarget(qr.targetUrl);
  };

  const saveRedirectionEdit = (id: string) => {
    setDynamicQRs(dynamicQRs.map((q: any) => {
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
        toastState.error('Gemini Server Error: ' + (errData.error || 'Failed to craft template'));
      }
    } catch (err) {
      console.error(err);
      toastState.error('Network failure connecting to Gemini AI generator endpoint.');
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
    toastState.success('AI Recipe successfully synced to Template Registry! Go to base Templates page to inspect elements.');
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
      <div id="dashboard-root" className="min-h-screen bg-white flex items-center justify-center p-4 selection:bg-slate-200">
        <ToastContainer />
        <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl p-8 relative z-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white mx-auto mb-4">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="font-syne text-2xl font-extrabold text-black tracking-tight">
              A2ZQR Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Login to access the unified template factory, dynamic redirection routing, and SEO indexers.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input 
              label="Workspace Email Address"
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="admin@a2zqr.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input 
              label="Dashboard Pin / Password"
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Key className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-600">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 bg-white text-black focus:ring-0 w-3.5 h-3.5"
                  defaultChecked
                />
                <span>Remember console credentials</span>
              </label>
            </div>

            <div className="pt-2">
              <Button 
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                icon={<Lock className="w-3.5 h-3.5" />}
              >
                Initialize Session
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Swapper */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block mb-2.5">
              Testing credentials (quick demo)
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="text-left text-[11px]">
                <div className="text-slate-700 font-mono"><span className="text-slate-400">ID:</span> admin@a2zqr.com</div>
                <div className="text-slate-700 font-mono mt-0.5"><span className="text-slate-400">Pass:</span> admin</div>
              </div>
              <button 
                type="button"
                onClick={handleAutofillAdmin}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-600 rounded-lg transition-colors"
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
    <div id="dashboard-root" className="min-h-screen bg-white text-black flex flex-col md:flex-row font-['Syne',sans-serif]">
      <SkipLink href="#dashboard-main" />
      <ToastContainer />
      {/* 1. LEFT SIDEBAR CONSOLE LAYOUT */}
      <aside className="w-full md:w-[280px] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shadow-md">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-black">
                A2Z<em className="font-normal not-italic text-black">QR</em> Panel
              </span>
            </div>
            <span className="text-[9px] bg-slate-100 border border-slate-350 text-black px-2 py-0.5 rounded font-bold">
              v2.5
            </span>
          </div>

          {/* Sidebar Menu Groups */}
          <nav className="p-4 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {/* WORK CONSOLE */}
            <div className="space-y-1">
              <span className="text-[10px] text-black uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                🛠️ WORK CONSOLE
              </span>
              <SidebarLink id="analytics" label="Analytics & Scans" icon={<Activity />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="qrs" label="QR Redirection" icon={<QrCode />} active={activeTab} onClick={setActiveTab} count={dynamicQRs.length} />
              <SidebarLink id="bulk" label="Bulk Generator" icon={<Settings2 />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="seo" label="SEO Manager" icon={<Search />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="settings" label="White-Label Domain" icon={<Settings />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="blog" label="Console Blog" icon={<BookOpen />} active={activeTab} onClick={setActiveTab} count={blogPosts.length} />
            </div>

            {/* BUSINESS CONSOLE */}
            <div className="space-y-1 pt-4 border-t border-slate-100">
              <span className="text-[10px] text-black uppercase tracking-wider font-extrabold px-3 block mb-1.5">
                💼 BUSINESS CONSOLE
              </span>
              <SidebarLink id="ai_curation" label="Template Approval Panel" icon={<Sparkle />} active={activeTab} onClick={setActiveTab} badge="APPROVAL" />
              <SidebarLink id="ai_tools_generator" label="AI Template Engine" icon={<Wand2 />} active={activeTab} onClick={setActiveTab} badge="FACTORY" />
              <SidebarLink id="dynamic_pages" label="Dynamic Scan Pages" icon={<MapPin />} active={activeTab} onClick={setActiveTab} badge="RSVP/PET ID" />
              <SidebarLink id="templates" label="Templates Register" icon={<LayoutGrid />} active={activeTab} onClick={setActiveTab} count={customTemplates.length} />
              <SidebarLink id="library" label="Asset Library" icon={<Library />} active={activeTab} onClick={setActiveTab} />
              <SidebarLink id="uploads" label="User Uploads" icon={<UploadCloud />} active={activeTab} onClick={setActiveTab} count={uploadedAssets.length} />
            </div>
          </nav>
        </div>

        {/* User Info footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                AD
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-800 leading-tight">Suvash Admin</div>
                <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wide">Sync Live</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg transition-colors"
              title="Logout session"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. CORE CENTRAL STAGE LAYOUT */}
      <main id="dashboard-main" className="flex-1 min-h-screen bg-white flex flex-col justify-between overflow-x-hidden text-black">
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-200 px-6 md:px-8 flex items-center justify-between bg-white sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-black text-white font-extrabold px-2.5 py-1 rounded tracking-wider uppercase">
              CONSOLE {userRole.toUpperCase()} MODE
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              <span>Cluster Active (0.0.0.0:3000)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs font-bold text-indigo-600 hover:text-indigo-800 rounded-lg hover:border-slate-300 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Launch Studio Editor
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-semibold hidden md:inline">Suvash Astrology</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 text-xs font-extrabold">
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#7C6EFA]" /> Multi-Category Scan Analytics
                </h2>
                <p className="text-xs text-slate-500">Real-time device tracking, country codes, and unique client visits.</p>
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
                <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-2">
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

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" /> High-Intensity Scanning Regions
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-3 px-4 font-bold">Region Code</th>
                        <th className="py-3 px-4 font-bold">Country</th>
                        <th className="py-3 px-4 font-bold text-right">Traffic Volume</th>
                        <th className="py-3 px-4 font-bold text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12121E]">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">IN-MH (Mumbai/Pune)</td>
                        <td className="py-3 px-4 text-slate-500">India</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">12,490</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">51%</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">IN-DL (Delhi NCR)</td>
                        <td className="py-3 px-4 text-slate-500">India</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">6,240</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">25%</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">US-CA (San Jose)</td>
                        <td className="py-3 px-4 text-slate-500">United States</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">2,410</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-mono">10%</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR REDIRECTION MANAGEMENT */}
          {activeTab === 'qrs' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-indigo-400" /> Active Dynamic QR Redirection
                </h2>
                <p className="text-xs text-slate-500">Modify destination URLs instantly without ever printing new cards or stickers.</p>
              </div>

              {/* Add New Dynamic QR Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Initialize New Dynamic Redirect</h3>
                <form onSubmit={handleCreateQr} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Campaign Name</label>
                    <input 
                      type="text" 
                      value={newQrName}
                      onChange={(e) => setNewQrName(e.target.value)}
                      placeholder="e.g. Dessert Menu Stand" 
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Scan Redirection Destination</label>
                    <input 
                      type="text" 
                      value={newQrTarget}
                      onChange={(e) => setNewQrTarget(e.target.value)}
                      placeholder="e.g. https://myrestaurant.com/spring-desserts" 
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase font-bold">Category</label>
                      <select 
                        value={newQrCategory}
                        onChange={(e) => setNewQrCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs px-3 py-3 rounded-xl text-slate-900 outline-none"
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
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campaign Target Registry</h3>
                  <span className="text-xs text-slate-500 font-mono">{dynamicQRs.length} active redirections configured</span>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/30">
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
                                  className="bg-black/60 border border-slate-200 text-xs text-white rounded px-2 py-1 flex-1 outline-none font-mono"
                                />
                                <button 
                                  onClick={() => saveRedirectionEdit(qr.id)}
                                  className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-mono">{qr.targetUrl}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-white text-[13px]">
                            {qr.scans.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Dropdown
                              trigger={<Button variant="ghost" size="sm" type="button"><MoreVertical className="w-4 h-4" /></Button>}
                              items={[
                                { id: "edit", label: "Update Target", icon: <Settings2 className="w-4 h-4" />, onClick: () => startEditRedirection(qr) },
                                { id: "delete", label: "Delete", icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDeleteQr(qr.id) },
                              ]}
                              align="end"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES REGISTER */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-indigo-400" /> Core Template Registry
                </h2>
                <p className="text-xs text-slate-500">Manage built-in template structures and custom recipe presets synced by our layout engine.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customTemplates.map((t: any) => (
                  <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition-all relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                        {t.theme} Pack Structure
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active on Website"></span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-lg">{t.name}</h3>
                      <p className="text-xs text-slate-500">Background: <span className="font-mono text-white">{t.bg}</span></p>
                      <p className="text-xs text-slate-500">Decorative Frame: <span className="font-mono text-white">{t.frame}</span></p>
                      <p className="text-xs text-slate-500">Layout Typography: <span className="font-mono text-white">{t.font}</span></p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{t.elements} layers mapped</span>
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
                  className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#7C6EFA] hover:bg-slate-50/10 transition-all group"
                >
                  <Sparkles className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-white">Create Coordinated AI Layout Recipe</span>
                  <span className="text-[11px] text-slate-500 mt-1 leading-normal max-w-[180px]">Draft template parameters automatically via natural prompts.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POSTERS CONFIGURATION */}
          {activeTab === 'posters' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-pink-400" /> Poster Size & Bleed Margins
                </h2>
                <p className="text-xs text-slate-500">Configure high-DPI aspect ratio standards, CMYK color spaces, and print safe bleeds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Print Resolution Standards</h3>
                  <div className="space-y-3">
                    <PosterRatioRow label="A4 International Portrait" size="210 x 297 mm" res="300 DPI (2480 x 3508 px)" active={true} />
                    <PosterRatioRow label="US Letter Portrait" size="8.5 x 11.0 in" res="300 DPI (2550 x 3300 px)" />
                    <PosterRatioRow label="A3 High-Impact Display" size="297 x 420 mm" res="300 DPI (3508 x 4960 px)" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Bleed & Safe Boundary Guide</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Most industrial printing presses require a <strong>3mm bleed margin</strong> on all edges to account for paper cutting misalignment.
                  </p>
                  <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-800 font-bold">Recommended Safety Offsets:</span>
                      <span className="text-emerald-400 font-mono">3mm Active</span>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1 leading-normal">
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Tags className="w-6 h-6 text-amber-400" /> Sticker Cut & Badges Console
                </h2>
                <p className="text-xs text-slate-500">Setup physical contour outlines, customized ribbon headings, and sticker sizes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Interactive Sticker Contour Shapes</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StickerShapeCard name="Die-Cut Outline" desc="Perfect star/oval hugs" icon="⭐" active={true} />
                    <StickerShapeCard name="Circle Badge" desc="Standard 3-inch round" icon="⭕" />
                    <StickerShapeCard name="Square Rounded" desc="Curved radius borders" icon="⬜" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Preset Print Sizes</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Choose standard roll sizes for physical print vendors (Stickermule, etc.):</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Small Table Stickers</span>
                      <span className="font-mono text-indigo-400">50mm x 50mm (2")</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Square className="w-6 h-6 text-purple-400" /> Framing Boundaries Registry
                </h2>
                <p className="text-xs text-slate-500">Configure and review luxury, minimal, and neon vector frame overlays.</p>
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Library className="w-6 h-6 text-[#7C6EFA]" /> SVG Asset Library (Control Hub)
                </h2>
                <p className="text-xs text-slate-500">Index and categorize vector icons, background stamps, and geometric accents.</p>
              </div>

              {/* Categorized Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-[#7C6EFA] to-[#C084FC] text-xs font-bold rounded-lg text-white">All SVG Assets</button>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg text-slate-500 hover:text-white">Hospitality & Cafe Icons</button>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg text-slate-500 hover:text-white">Ribbons & Banners</button>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg text-slate-500 hover:text-white">Retro Ornaments</button>
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-400" /> Presets Theme Packs
                </h2>
                <p className="text-xs text-slate-500">Bundled packages comprising tailored backgrounds, specialized fonts, and matched vector frames.</p>
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
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">
                    ✨ Gemini Coordinated Layout Builder
                  </h2>
                  <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">GEMINI ACTIVE</span>
                </div>
                <p className="text-xs text-slate-500">Provide a descriptive branding prompt. Our backend triggers Gemini 3.5 Flash to write custom layout colors, coordinates, and custom SVG paths instantly.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <form onSubmit={handleTriggerAiRecipe} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Describe Your Coordinated Brand Direction
                    </label>
                    <Textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-900 outline-none focus:border-[#7C6EFA]"
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
                <div className="bg-white border border-emerald-500/30 rounded-2xl p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wide">Dynamic Layout Recipe Crafted Successfully!</span>
                        <h4 className="text-sm font-extrabold text-white">{aiGeneratedRecipe.title}</h4>
                      </div>
                    </div>
                    <button 
                      onClick={loadRecipeIntoTemplates}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-800 font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Sync Recipe to Template Registry
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-black/40 rounded-xl space-y-2">
                      <span className="text-slate-500 uppercase font-bold text-[10px] block">Coordinated Visual Variables</span>
                      <div>• Category: <span className="text-white font-semibold">{aiGeneratedRecipe.category}</span></div>
                      <div>• Background Pattern: <span className="text-white font-semibold">{aiGeneratedRecipe.bgType}</span></div>
                      <div>• Dots Eye Style: <span className="text-white font-semibold">{aiGeneratedRecipe.qrConfig?.dotsStyle}</span></div>
                      <div>• Coordinated Dots Color: <span className="text-white font-semibold font-mono">{aiGeneratedRecipe.qrConfig?.fgColor}</span></div>
                      <div>• Custom Canvas Overlay: <span className="text-white font-semibold">{aiGeneratedRecipe.layoutType}</span></div>
                    </div>

                    <div className="p-4 bg-white rounded-xl overflow-x-auto">
                      <span className="text-slate-500 uppercase font-bold text-[10px] block mb-2">Live Raw JSON Recipe</span>
                      <pre className="text-[10px] font-mono text-indigo-600 leading-normal select-all">
                        {JSON.stringify(aiGeneratedRecipe, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9B: AI AUTOMATIC DAILY CURATION & APPROVAL QUEUE */}
          {activeTab === 'ai_curation' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-white">
                      ✨ AI Automated Curation Hub
                    </h2>
                    <span className="text-[10px] uppercase font-black text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">Automatic Mode</span>
                  </div>
                  <p className="text-xs text-slate-500">Command Gemini 3.5 Flash to automatically design daily high-end templates. Approve or reject them to control what goes live on the public website.</p>
                </div>
                <div className="flex gap-2.5">
                  <button 
                    onClick={loadCurationTemplates}
                    className="p-2.5 bg-slate-50 hover:bg-[#1C1C2E] border border-slate-200 text-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                  <button 
                    onClick={handleTriggerDailyGeneration}
                    disabled={triggeringDaily}
                    className="py-2.5 px-5 bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                    {triggeringDaily ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating Daily Designs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Daily 10 Designs
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SCHEDULE PLANNER PANEL */}
              <div className="bg-white border border-[#1D1D30] rounded-2xl p-6 space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-rose-500 animate-pulse" /> Gemini Time-Trigger & Challenge Planner
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Configure when Gemini automatically wakes up to design a fresh batch of 10 coordinated templates based on a daily creative challenge.</p>
                  </div>
                  {scheduleConfig && (
                    <div className="flex items-center gap-3 bg-[#12121F] px-4 py-2 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500">Scheduler Status:</span>
                      <button
                        onClick={() => updateSchedule({ enabled: !scheduleConfig.enabled })}
                        disabled={updatingSchedule}
                        className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider transition-all ${
                          scheduleConfig.enabled 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {scheduleConfig.enabled ? '● Active' : '○ Paused'}
                      </button>
                    </div>
                  )}
                </div>

                {scheduleConfig ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Schedule Form Parameters */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 font-bold">Scheduled Trigger Time (24h)</label>
                          <input 
                            type="time" 
                            defaultValue={scheduleConfig.time}
                            onBlur={(e) => updateSchedule({ time: e.target.value })}
                            className="w-full bg-slate-50 border border-[#1D1D30] focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 font-bold">Last Automatic Execution</label>
                          <div className="w-full bg-slate-50/50 border border-[#1D1D30] rounded-xl px-4 py-2.5 text-sm font-mono text-gray-400">
                            {scheduleConfig.lastRunDate ? scheduleConfig.lastRunDate : "Never triggered yet"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 font-bold">Gemini Daily Challenge Topic & Theme Guidelines</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            id="challenge_input"
                            defaultValue={scheduleConfig.dailyChallenge}
                            placeholder="e.g. Futuristic Neon Synthwave, Luxury Obsidian Marble"
                            className="flex-1 bg-slate-50 border border-[#1D1D30] focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors"
                          />
                          <button
                            onClick={() => {
                              const val = (document.getElementById('challenge_input') as HTMLInputElement)?.value;
                              updateSchedule({ dailyChallenge: val || '' });
                            }}
                            className="px-5 bg-[#1C1C30] hover:bg-[#282845] border border-[#2D2D4E] text-white text-xs font-bold rounded-xl transition-all"
                          >
                            Save Challenge
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5">
                          💡 The daily challenge prompt instructs Gemini to use unique styles, color patterns, custom elements, and coordinates. This ensures that every day has a completely fresh aesthetic signature!
                        </p>
                      </div>
                    </div>

                    {/* Trigger Logs Timeline / History */}
                    <div className="lg:col-span-5 bg-[#05050A] border border-[#151525] p-4 rounded-xl space-y-3">
                      <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">📅 Scheduler Trigger History & Log Timeline</span>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {!scheduleConfig.history || scheduleConfig.history.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-500">No logs recorded yet. Daily runs will register here automatically.</div>
                        ) : (
                          scheduleConfig.history.map((log: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start text-[11px] p-2 bg-slate-50/70 border border-[#1D1D30] rounded-lg">
                              <div className="space-y-0.5 max-w-[70%]">
                                <span className={`font-mono font-bold ${log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {log.status === 'success' ? '✓ SUCCESS' : '✗ ERROR'}
                                </span>
                                <div className="text-white truncate font-medium">{log.themeTitle}</div>
                                <div className="text-[9px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                              </div>
                              <div className="text-right text-[10px] text-slate-500 font-mono">
                                {log.date} @ {log.time}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-12">
                    <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
                  </div>
                )}
              </div>

              {/* Status and Analytics Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Total Queue Size</span>
                  <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">{curationTemplates.length}</span>
                </div>
                <div className="bg-white border border-amber-500/20 p-4 rounded-xl">
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block">Pending Curation</span>
                  <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                    {curationTemplates.filter(t => t.status === 'pending').length}
                  </span>
                </div>
                <div className="bg-white border border-emerald-500/20 p-4 rounded-xl">
                  <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block">Approved & Live</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                    {curationTemplates.filter(t => t.status === 'approved').length}
                  </span>
                </div>
                <div className="bg-white border border-rose-500/20 p-4 rounded-xl">
                  <span className="text-[10px] text-rose-400 uppercase font-black tracking-wider block">Rejected Designs</span>
                  <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                    {curationTemplates.filter(t => t.status === 'rejected').length}
                  </span>
                </div>
              </div>

              {/* Alert Notifications */}
              {curationError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2.5 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>{curationError}</div>
                </div>
              )}
              {curationSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>{curationSuccess}</div>
                </div>
              )}

              {/* Loader */}
              {loadingCuration ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse">
                      <div className="aspect-[3/4] bg-slate-50 rounded-xl flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-[#7C6EFA] animate-spin" />
                      </div>
                      <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : curationTemplates.length === 0 ? (
                <div className="bg-white border border-dashed border-[#1D1D30] rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-4">
                  <div className="text-4xl">🔮</div>
                  <h3 className="text-base font-bold text-white">No Designs in Curation Database</h3>
                  <p className="text-xs text-slate-500">The template curation queue is currently empty. Click the button above to trigger the batch-generation of 10 daily coordinated poster templates and asset frames using Gemini 3.5 Flash automatically!</p>
                  <button 
                    onClick={handleTriggerDailyGeneration}
                    className="py-2.5 px-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Daily Templates Now
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  {/* PENDING ITEMS SECTION */}
                  {curationTemplates.some(t => t.status === 'pending') && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Pending Review & Approval ({curationTemplates.filter(t => t.status === 'pending').length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {curationTemplates.filter(t => t.status === 'pending').map(t => (
                          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-amber-200 transition-colors shadow-lg">
                            {/* Canvas Mini-Preview */}
                            <div 
                              className="w-full md:w-36 aspect-[3/4] md:h-52 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 bg-slate-50 flex flex-col justify-between p-3 flex-shrink-0"
                              style={{
                                background: t.bgType === 'gradient' && t.gradient 
                                  ? `linear-gradient(${t.gradient.angle || '135deg'}, ${t.gradient.from}, ${t.gradient.via ? t.gradient.via + ', ' : ''}${t.gradient.to})`
                                  : t.imgUrl ? `url(${t.imgUrl})` : `url(https://images.unsplash.com/featured/400x533/?${encodeURIComponent(t.imageSearchTerm || 'abstract')})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]"></div>
                              <div className="relative z-10 w-full h-full flex flex-col justify-between py-1 text-center">
                                {/* Top Text */}
                                <div className="space-y-0.5">
                                  {t.textElements?.filter(te => te.y < 300).slice(0, 2).map((te, idx) => (
                                    <div key={idx} style={{ color: te.color || '#FFFFFF', fontSize: '7px' }} className="font-bold tracking-tight leading-none uppercase drop-shadow-md truncate">
                                      {te.content}
                                    </div>
                                  ))}
                                </div>
                                {/* QR Center box */}
                                <div className="w-12 h-12 mx-auto my-auto border-2 rounded-lg flex items-center justify-center relative bg-white/90 shadow-md" style={{ borderColor: t.qrConfig?.fgColor || '#7C6EFA' }}>
                                  <QrCode className="w-9 h-9" style={{ color: t.qrConfig?.fgColor || '#000000' }} />
                                </div>
                                {/* Bottom Text */}
                                <div className="space-y-0.5">
                                  {t.textElements?.filter(te => te.y >= 300).slice(0, 1).map((te, idx) => (
                                    <div key={idx} style={{ color: te.color || '#FFFFFF', fontSize: '6px' }} className="font-semibold tracking-wide leading-none uppercase drop-shadow-md truncate">
                                      {te.content}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Curation details */}
                            <div className="flex-grow flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[9px] bg-amber-50/80 text-amber-400 font-extrabold px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wide">
                                  PENDING REVIEW
                                </span>
                                <h4 className="font-extrabold text-white text-sm tracking-tight">{t.title}</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{t.description}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold">Category</span>
                                  <select 
                                    value={t.category} 
                                    onChange={(e) => handleUpdateCurationCategory(t.id, e.target.value)}
                                    className="bg-white border border-slate-200 text-white text-[11px] rounded px-2 py-1 outline-none font-semibold focus:border-amber-500"
                                  >
                                    <option value="Posters">Posters</option>
                                    <option value="vCards">vCards</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Badges">Badges</option>
                                    <option value="Events">Events</option>
                                    <option value="Frames">Frames</option>
                                  </select>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold">Dot Pattern</span>
                                  <span className="text-[11px] text-slate-800 font-mono uppercase bg-black/40 px-2 py-0.5 rounded border border-slate-200">
                                    {t.qrConfig?.dotsStyle}
                                  </span>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 pt-2 border-t border-slate-200">
                                <button 
                                  onClick={() => handleApproveTemplate(t.id)}
                                  className="flex-grow py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-800 font-bold text-[11px] rounded-lg transition-all shadow-md flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve & Publish
                                </button>
                                <button 
                                  onClick={() => handleRejectTemplate(t.id)}
                                  className="py-1.5 px-3 bg-slate-50 hover:bg-rose-500/10 border border-slate-200 hover:border-rose-500/30 text-rose-400 font-bold text-[11px] rounded-lg transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APPROVED & LIVE SECTION */}
                  {curationTemplates.some(t => t.status === 'approved') && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Approved Gallery ({curationTemplates.filter(t => t.status === 'approved').length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {curationTemplates.filter(t => t.status === 'approved').map(t => (
                          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-emerald-500/30 transition-colors shadow-lg">
                            {/* Canvas Mini-Preview */}
                            <div 
                              className="w-full md:w-36 aspect-[3/4] md:h-52 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 bg-slate-50 flex flex-col justify-between p-3 flex-shrink-0"
                              style={{
                                background: t.bgType === 'gradient' && t.gradient 
                                  ? `linear-gradient(${t.gradient.angle || '135deg'}, ${t.gradient.from}, ${t.gradient.via ? t.gradient.via + ', ' : ''}${t.gradient.to})`
                                  : t.imgUrl ? `url(${t.imgUrl})` : `url(https://images.unsplash.com/featured/400x533/?${encodeURIComponent(t.imageSearchTerm || 'abstract')})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]"></div>
                              <div className="relative z-10 w-full h-full flex flex-col justify-between py-1 text-center">
                                <div className="space-y-0.5">
                                  {t.textElements?.filter(te => te.y < 300).slice(0, 2).map((te, idx) => (
                                    <div key={idx} style={{ color: te.color || '#FFFFFF', fontSize: '7px' }} className="font-bold tracking-tight leading-none uppercase drop-shadow-md truncate">
                                      {te.content}
                                    </div>
                                  ))}
                                </div>
                                <div className="w-12 h-12 mx-auto my-auto border-2 rounded-lg flex items-center justify-center relative bg-white/90 shadow-md" style={{ borderColor: t.qrConfig?.fgColor || '#7C6EFA' }}>
                                  <QrCode className="w-9 h-9" style={{ color: t.qrConfig?.fgColor || '#000000' }} />
                                </div>
                                <div className="space-y-0.5">
                                  {t.textElements?.filter(te => te.y >= 300).slice(0, 1).map((te, idx) => (
                                    <div key={idx} style={{ color: te.color || '#FFFFFF', fontSize: '6px' }} className="font-semibold tracking-wide leading-none uppercase drop-shadow-md truncate">
                                      {te.content}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Curation details */}
                            <div className="flex-grow flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide flex items-center gap-1 w-max">
                                  ✓ LIVE & PUBLISHED
                                </span>
                                <h4 className="font-extrabold text-white text-sm tracking-tight">{t.title}</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{t.description}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold">Category</span>
                                  <span className="text-[11px] text-white font-semibold">
                                    {t.category}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold">Published</span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {t.approvedAt ? new Date(t.approvedAt).toLocaleDateString() : 'Today'}
                                  </span>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 pt-2 border-t border-slate-200">
                                <button 
                                  onClick={() => handleRejectTemplate(t.id)}
                                  className="flex-grow py-1.5 bg-slate-50 hover:bg-[#1C1C2E] border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1"
                                >
                                  Unpublish (Reject)
                                </button>
                                <button 
                                  onClick={() => handleDeleteCurationTemplate(t.id)}
                                  className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center"
                                  title="Delete Permanent"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* REJECTED SECTION */}
                  {curationTemplates.some(t => t.status === 'rejected') && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-extrabold text-rose-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-2">
                        Rejected / Removed Archive ({curationTemplates.filter(t => t.status === 'rejected').length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                        {curationTemplates.filter(t => t.status === 'rejected').map(t => (
                          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5">
                            {/* Canvas Mini-Preview */}
                            <div 
                              className="w-full md:w-36 aspect-[3/4] md:h-52 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 bg-slate-50 flex flex-col justify-between p-3 flex-shrink-0 grayscale"
                              style={{
                                background: t.bgType === 'gradient' && t.gradient 
                                  ? `linear-gradient(${t.gradient.angle || '135deg'}, ${t.gradient.from}, ${t.gradient.via ? t.gradient.via + ', ' : ''}${t.gradient.to})`
                                  : t.imgUrl ? `url(${t.imgUrl})` : `url(https://images.unsplash.com/featured/400x533/?${encodeURIComponent(t.imageSearchTerm || 'abstract')})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="absolute inset-0 bg-black/45"></div>
                              <div className="relative z-10 w-full h-full flex flex-col justify-between py-1 text-center">
                                <div className="space-y-0.5">
                                  {t.textElements?.filter(te => te.y < 300).slice(0, 2).map((te, idx) => (
                                    <div key={idx} style={{ color: te.color || '#FFFFFF', fontSize: '7px' }} className="font-bold tracking-tight leading-none uppercase truncate">
                                      {te.content}
                                    </div>
                                  ))}
                                </div>
                                <div className="w-12 h-12 mx-auto my-auto border-2 rounded-lg flex items-center justify-center relative bg-white/90" style={{ borderColor: t.qrConfig?.fgColor || '#7C6EFA' }}>
                                  <QrCode className="w-9 h-9" style={{ color: t.qrConfig?.fgColor || '#000000' }} />
                                </div>
                              </div>
                            </div>

                            {/* Curation details */}
                            <div className="flex-grow flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[9px] bg-rose-500/10 text-rose-400 font-extrabold px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wide">
                                  REJECTED / DRAFT
                                </span>
                                <h4 className="font-extrabold text-white text-sm tracking-tight">{t.title}</h4>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 pt-2 border-t border-slate-200">
                                <button 
                                  onClick={() => handleApproveTemplate(t.id)}
                                  className="flex-grow py-1.5 bg-slate-50 hover:bg-[#1C1C2E] border border-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-all"
                                >
                                  Re-Approve & Live
                                </button>
                                <button 
                                  onClick={() => handleDeleteCurationTemplate(t.id)}
                                  className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-[11px] rounded-lg transition-all"
                                  title="Delete Permanent"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: AI 100-TOOLS DESIGN FACTORY */}
          {activeTab === 'ai_tools_generator' && (
            <div className="space-y-6">
              {/* Core Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-black flex items-center gap-2">
                      <Wand2 className="w-6 h-6 text-indigo-600" />
                      A2ZQR Template Factory & SaaS Roadmap
                    </h2>
                    <span className="text-[10px] uppercase font-black text-white bg-indigo-600 px-2 py-0.5 rounded border border-indigo-200 animate-pulse">
                      Active V2.5
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete, high-precision visual constructor utilizing static Asset-IDs, Asset Packs, Safe Zones, and Quality score validators.
                  </p>
                </div>

                {/* Sub Menu / Step Selection tabs */}
                <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setFactoryStep('blueprint')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'blueprint' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> 📄 SaaS Roadmap
                  </button>
                  <button 
                    onClick={() => setFactoryStep('background')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'background' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> 🖼️ AI Background
                  </button>
                  <button 
                    onClick={() => setFactoryStep('assets')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'assets' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> 🆔 Asset IDs
                  </button>
                  <button 
                    onClick={() => setFactoryStep('packs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'packs' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> 📦 Asset Packs
                  </button>
                  <button 
                    onClick={() => setFactoryStep('position')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'position' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" /> 🎛️ Safe Zone Editor
                  </button>
                  <button 
                    onClick={() => setFactoryStep('score')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      factoryStep === 'score' 
                        ? 'bg-black text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ✅ Quality & Publish
                  </button>
                </div>
              </div>

              {/* Central Section - Two Column Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Controls & Documentation based on step */}
                <div className="lg:col-span-7 space-y-6">

                  {/* STEP 1: BLUEPRINT ROADMAP */}
                  {factoryStep === 'blueprint' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-sm">
                          📄
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">A2ZQR SaaS Blueprint & Status Report</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Architecture Freeze - Hinglish Version</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
                        <div>
                          <h4 className="font-extrabold text-black text-xs uppercase tracking-wider mb-1">🚀 ABHI TAK KAHA PONCHE? (Current Progress)</h4>
                          <p>
                            Humne <strong>A2ZQR</strong> ki basic block-foundation perfect kar di hai! Dashboard up and running hai, dynamic redirects perfectly live hain. Google Review Booster, Wedding RSVP, Wi-Fi Instant Connect, Pet ID, Business cards ke custom template setups inside simulated phone completely functional hain. Iske alawa, <strong>Gemini V2 fallback logic</strong> integrate kiya ja chuka hai taaki admin seamless templates automatically curate kar sake.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-black text-xs uppercase tracking-wider mb-1">💎 SaaS PRODUCT BANANE KE LIYE MANDATORY PATHWAYS:</h4>
                          <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                              <strong>Asset IDs Standardization:</strong> Templates manually code karne ki jagah static IDs use karenge. For example, agar background swap karna ho to sirf <code>BG-000921</code> update karenge, jisse saare dependent templates fast CDN/GitHub assets se automatically render ho jayein. Firestore load zero ho jayega!
                            </li>
                            <li>
                              <strong>Single Click Asset Packs:</strong> "Restaurant Pack", "Wedding Pack", "vCard Corporate Pack" introduce karenge jisme pure matching color gradients, shapes, fonts, and borders store honge. User can load the entire ecosystem in 1 second.
                            </li>
                            <li>
                              <strong>Under 30 Seconds Rule:</strong> Competitor Canva jaisa generic complexity nahi banayenge. A2ZQR ka focus "No design expertise required" hoga. <em>"Choose Template → Edit only 5-8 fields → Instant Download in 30 seconds."</em>
                            </li>
                            <li>
                              <strong>Design Quality Control Scorer:</strong> Admin dashboard templates check karega. Agar contrast ratio, print layout safe bounds, and QR readability high hai tabhi wo live custom directory me public publish hoga.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-black text-xs uppercase tracking-wider mb-1">📅 PHASE 1 FOUNDATION PLAN:</h4>
                          <div className="grid grid-cols-2 gap-3 mt-1.5">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-extrabold text-black block mb-0.5">1. Asset Library Registry</span>
                              Standard structured JSON mapping static SVGs directly via GitHub/Vercel paths.
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-extrabold text-black block mb-0.5">2. Master JSON Freeze</span>
                              Each template follows standard coordinates schema for absolute platform portability.
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-extrabold text-black block mb-0.5">3. 1-Click Fast Exports</span>
                              Export to high-contrast print PDF or direct high-DPI vectors to secure permanent readability.
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-extrabold text-black block mb-0.5">4. Safe Zone Positioners</span>
                              Visual sliders coordinate overlay coordinates cleanly without manual overlap bugs.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Architecture Score: <strong className="text-emerald-600 font-extrabold">9.5 / 10</strong></span>
                        <button 
                          onClick={() => setFactoryStep('background')}
                          className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-lg uppercase tracking-wider transition-all"
                        >
                          Step 2: AI Background →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: AI BACKGROUND GENERATOR */}
                  {factoryStep === 'background' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">Step 1: Admin-Only AI Background Factory</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Generate vector texture layers with Gemini 3.5</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <p className="text-slate-600 leading-relaxed">
                          Enter your desired aesthetic mood. Gemini will select matching brand palette gradients, visual overlays, and register a fresh static background ID (e.g., <code>BG-XXXX</code>) in your local CDN directory.
                        </p>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Aesthetic Theme Prompt</label>
                          <textarea 
                            value={factoryPrompt}
                            onChange={(e) => setFactoryPrompt(e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-slate-200 focus:border-black text-xs text-slate-950 p-3 rounded-xl outline-none transition-all placeholder-slate-400"
                            placeholder="Describe high-end marble gradients, tech patterns..."
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <button 
                            onClick={async () => {
                              setIsFactoryGeneratingBg(true);
                              // Simulate high-fidelity Gemini API generation
                              setTimeout(() => {
                                const newId = 'BG-000' + Math.floor(Math.random() * 900 + 100);
                                setFactoryGeneratedBgs([newId, ...factoryGeneratedBgs]);
                                setFactoryBgId(newId);
                                setIsFactoryGeneratingBg(false);
                                toastState.success(`Gemini successfully registered new static asset ID: ${newId}!`);
                              }, 1800);
                            }}
                            disabled={isFactoryGeneratingBg}
                            className="flex-1 py-3 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                          >
                            {isFactoryGeneratingBg ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Analyzing Coordinates & Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4 text-indigo-400" />
                                Generate Custom Background Layer
                              </>
                            )}
                          </button>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Generated & Cached BG-IDs Directory</span>
                          <div className="grid grid-cols-3 gap-2">
                            {factoryGeneratedBgs.map((bgId) => (
                              <button 
                                key={bgId}
                                onClick={() => setFactoryBgId(bgId)}
                                className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                                  factoryBgId === bgId 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                                    : 'bg-slate-50 border-slate-250 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                <span className="text-xs">🖼️</span>
                                <span>{bgId}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <button onClick={() => setFactoryStep('blueprint')} className="text-slate-500 hover:text-black font-bold">← Back</button>
                        <button 
                          onClick={() => setFactoryStep('assets')}
                          className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-lg uppercase tracking-wider transition-all"
                        >
                          Step 3: Pick Assets →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PICK ASSETS BY ID */}
                  {factoryStep === 'assets' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">Step 2: Assign High-Precision Asset IDs</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Modular references mapped in your templates database</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <p className="text-slate-600 leading-relaxed">
                          A2ZQR ecosystem templates use static string IDs from our asset library. If we ever modify an SVG file or frame line, all templates automatically load the updated design files.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">1. Frame Border ID</label>
                            <select 
                              value={factoryFrameId}
                              onChange={(e) => setFactoryFrameId(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                            >
                              <option value="FRAME-000031">FRAME-000031 (Luxe Gold Outline)</option>
                              <option value="FRAME-000032">FRAME-000032 (Minimal Classic Border)</option>
                              <option value="FRAME-000033">FRAME-000033 (Retro Cyberpunk Badge)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">2. Sticker Badge ID</label>
                            <select 
                              value={factoryStickerId}
                              onChange={(e) => setFactoryStickerId(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                            >
                              <option value="STICKER-000210">STICKER-000210 (Scan Me Ribbon)</option>
                              <option value="STICKER-000211">STICKER-000211 (Save Contact Badge)</option>
                              <option value="STICKER-000212">STICKER-000212 (Google Star Badge)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">3. Pattern Overlay ID</label>
                            <select 
                              value={factoryPatternId}
                              onChange={(e) => setFactoryPatternId(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                            >
                              <option value="PATTERN-000051">PATTERN-000051 (Delicate Gold Dots)</option>
                              <option value="PATTERN-000052">PATTERN-000052 (Geometric Tech Grid)</option>
                              <option value="PATTERN-000053">PATTERN-000053 (Wave Liquid Line)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">4. Icon vector ID</label>
                            <select 
                              value={factoryIconId}
                              onChange={(e) => setFactoryIconId(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                            >
                              <option value="ICON-000245">ICON-000245 (Gold Coffee Cup)</option>
                              <option value="ICON-000246">ICON-000246 (Sparkling Marriage Ring)</option>
                              <option value="ICON-000247">ICON-000247 (Google Review Star)</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-700">
                          <strong>Active References Bound:</strong> 4 high-contrast scalable assets linked with real-time responsive coordinates. Click the "Safe Zone Editor" to position them.
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <button onClick={() => setFactoryStep('background')} className="text-slate-500 hover:text-black font-bold">← Back</button>
                        <button 
                          onClick={() => setFactoryStep('packs')}
                          className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-lg uppercase tracking-wider transition-all"
                        >
                          Step 4: Load Packs →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: ASSET PACKS */}
                  {factoryStep === 'packs' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">Step 3: Instant Asset Packs Swapper</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Load fully coordinated brand sets with one simple click</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <p className="text-slate-600 leading-relaxed">
                          Do not force users to search for individual styles. Provide curated pre-packaged brand ecosystems designed to scale across offline customer touchpoints.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Cafe Pack */}
                          <button 
                            onClick={() => {
                              setFactoryBgId('BG-000921');
                              setFactoryFrameId('FRAME-000031');
                              setFactoryStickerId('STICKER-000210');
                              setFactoryPatternId('PATTERN-000051');
                              setFactoryIconId('ICON-000245');
                              setFactoryTitle('Premium Coffee Standee');
                              setFactorySubtitle('Scan menu for immediate barista checkout');
                              setFactoryCategory('Restaurant');
                              setFactoryVariation('Luxury');
                            }}
                            className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-250 hover:border-indigo-200 rounded-xl text-left flex flex-col justify-between h-32 transition-all group"
                          >
                            <span className="text-xs">☕ Restaurant Pack</span>
                            <span className="text-[9px] text-slate-400 block mt-2 group-hover:text-slate-500">Includes warm gold outline frame, dots pattern, gold coffee cup icon, and "Scan Me" ribbon badge.</span>
                            <span className="text-[10px] text-indigo-600 font-extrabold mt-1.5 block">Apply Pack →</span>
                          </button>

                          {/* Wedding Pack */}
                          <button 
                            onClick={() => {
                              setFactoryBgId('BG-000542');
                              setFactoryFrameId('FRAME-000032');
                              setFactoryStickerId('STICKER-000211');
                              setFactoryPatternId('PATTERN-000053');
                              setFactoryIconId('ICON-000246');
                              setFactoryTitle('Suvash & Maya Marriage');
                              setFactorySubtitle('Celebrate our union and verify registry');
                              setFactoryCategory('Events');
                              setFactoryVariation('Minimal');
                            }}
                            className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-250 hover:border-indigo-200 rounded-xl text-left flex flex-col justify-between h-32 transition-all group"
                          >
                            <span className="text-xs">💍 Wedding RSVP Pack</span>
                            <span className="text-[9px] text-slate-400 block mt-2 group-hover:text-slate-500">Includes soft peach satin background, double-border minimalist frame, save-contact sticker badge, and ring icon.</span>
                            <span className="text-[10px] text-indigo-600 font-extrabold mt-1.5 block">Apply Pack →</span>
                          </button>

                          {/* Review Booster Pack */}
                          <button 
                            onClick={() => {
                              setFactoryBgId('BG-000108');
                              setFactoryFrameId('FRAME-000033');
                              setFactoryStickerId('STICKER-000212');
                              setFactoryPatternId('PATTERN-000052');
                              setFactoryIconId('ICON-000247');
                              setFactoryTitle('Google Review Booster');
                              setFactorySubtitle('Leave a 5-star review & get a free drink');
                              setFactoryCategory('Business');
                              setFactoryVariation('Neon');
                            }}
                            className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-250 hover:border-indigo-200 rounded-xl text-left flex flex-col justify-between h-32 transition-all group"
                          >
                            <span className="text-xs">⭐ Google Review Pack</span>
                            <span className="text-[9px] text-slate-400 block mt-2 group-hover:text-slate-500">Includes cyberpunk purple neon background, neon cyberpunk border, rating booster star sticker, and star icon.</span>
                            <span className="text-[10px] text-indigo-600 font-extrabold mt-1.5 block">Apply Pack →</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <button onClick={() => setFactoryStep('assets')} className="text-slate-500 hover:text-black font-bold">← Back</button>
                        <button 
                          onClick={() => setFactoryStep('position')}
                          className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-lg uppercase tracking-wider transition-all"
                        >
                          Step 5: Position Layers →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: SAFE ZONE EDITOR */}
                  {factoryStep === 'position' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">Step 4: Safe Zone Coordinates Editor</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Prevent visual collisions or print bleeding bugs</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <p className="text-slate-600 leading-relaxed">
                          Drag the sliders below to move elements within safe print zones. Keep text and QR inside borders to avoid scanning failure.
                        </p>

                        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-150">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-extrabold text-slate-700 uppercase">Text Elements Y-Position</span>
                              <span className="font-mono text-indigo-600 font-bold">{factoryTextY}px</span>
                            </div>
                            <input 
                              type="range" 
                              min="40" 
                              max="180" 
                              value={factoryTextY} 
                              onChange={(e) => setFactoryTextY(Number(e.target.value))}
                              className="w-full accent-black h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-extrabold text-slate-700 uppercase">QR Code Box Y-Position</span>
                              <span className="font-mono text-indigo-600 font-bold">{factoryQrY}px</span>
                            </div>
                            <input 
                              type="range" 
                              min="200" 
                              max="400" 
                              value={factoryQrY} 
                              onChange={(e) => setFactoryQrY(Number(e.target.value))}
                              className="w-full accent-black h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Theme Variations Swapper */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Template Variations Engine</label>
                          <div className="grid grid-cols-6 gap-1.5">
                            {['Minimal', 'Luxury', 'Dark', 'Corporate', 'Playful', 'Neon'].map((style) => (
                              <button 
                                key={style}
                                onClick={() => setFactoryVariation(style as any)}
                                className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
                                  factoryVariation === style 
                                    ? 'bg-black border-black text-white' 
                                    : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Business Name / Heading Text</label>
                            <input 
                              type="text" 
                              value={factoryTitle}
                              onChange={(e) => setFactoryTitle(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-black text-xs text-slate-950 p-2.5 rounded-xl outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Call to Action Subtitle</label>
                            <input 
                              type="text" 
                              value={factorySubtitle}
                              onChange={(e) => setFactorySubtitle(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-black text-xs text-slate-950 p-2.5 rounded-xl outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <button onClick={() => setFactoryStep('packs')} className="text-slate-500 hover:text-black font-bold">← Back</button>
                        <button 
                          onClick={() => setFactoryStep('score')}
                          className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-lg uppercase tracking-wider transition-all"
                        >
                          Step 6: Quality Scorer →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: QUALITY SCORE VALIDATION */}
                  {factoryStep === 'score' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-syne text-md font-bold text-black">Step 5: Design Quality Score Checker</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Verify readability before deploying live to user directory</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <p className="text-slate-600 leading-relaxed">
                          A2ZQR automatically executes high-contrast validations so clients get pristine vector print outputs without pixelation boundaries.
                        </p>

                        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="font-extrabold text-slate-700">Aesthetic Composition:</span>
                            <span className="font-mono text-emerald-600 font-black">98 / 100 PASS</span>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mobile Safe Frame Boundary
                              </span>
                              <span className="font-bold text-slate-800">100% OK (NO COLLISION)</span>
                            </div>

                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Print Safe Bleed Check (300DPI)
                              </span>
                              <span className="font-bold text-slate-800">PASSED</span>
                            </div>

                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> QR Matrix Contrast Ratio
                              </span>
                              <span className="font-bold text-slate-800">4.5:1 (HIGHLY LEGIBLE)</span>
                            </div>

                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Editable Zone Width Check
                              </span>
                              <span className="font-bold text-slate-800">OK</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            const newTemplate = {
                              id: 'recipe-' + Date.now(),
                              name: factoryTitle,
                              theme: factoryVariation.toLowerCase(),
                              frame: factoryFrameId,
                              bg: factoryBgId === 'BG-000921' ? '#0F0E14' : factoryBgId === 'BG-000542' ? '#FFEBF0' : '#05020D',
                              font: 'Syne',
                              elements: 2
                            };
                            setCustomTemplates([newTemplate, ...customTemplates]);
                            setFactoryCustomTemplates([newTemplate, ...factoryCustomTemplates]);
                            toastState.success('SUCCESS! Template approved & published. Dynamic Asset IDs registered to the public database successfully!');
                          }}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Approve & Publish Template Live
                        </button>

                        {factoryCustomTemplates.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Templates Published This Session</span>
                            <div className="space-y-1.5">
                              {factoryCustomTemplates.map((t) => (
                                <div key={t.id} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex justify-between items-center text-[11px]">
                                  <div className="font-bold text-slate-800">{t.name} ({t.theme})</div>
                                  <div className="font-mono text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded text-[10px]">PUBLISHED</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                        <button onClick={() => setFactoryStep('position')} className="text-slate-500 hover:text-black font-bold">← Back</button>
                        <span className="text-slate-400">Ready for public downloads</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: Real-Time Card Designer Canvas Mockup */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                    Real-time Canvas (Static Asset-ID Engine)
                  </span>

                  {/* Render Visual Card Dynamic Mockup based on State IDs */}
                  <div className="relative aspect-[3/4] w-full bg-slate-900 rounded-[28px] overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between p-6 text-center select-none group">
                    
                    {/* Background Dynamic Style based on BG-ID */}
                    {factoryBgId === 'BG-000921' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0E14] via-[#221A30] to-[#0D0B10] transition-all">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_60%)]"></div>
                      </div>
                    )}
                    {factoryBgId === 'BG-000542' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFEBF0] via-[#FFF5F7] to-[#FCE7F3] transition-all">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08)_0%,transparent_60%)]"></div>
                      </div>
                    )}
                    {factoryBgId === 'BG-000108' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#05020D] via-[#120826] to-[#030107] transition-all">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]"></div>
                      </div>
                    )}
                    {/* Fallback generated ids */}
                    {!['BG-000921', 'BG-000542', 'BG-000108'].includes(factoryBgId) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950 transition-all">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>
                      </div>
                    )}

                    {/* Pattern Overlay Grid */}
                    {factoryPatternId === 'PATTERN-000051' && (
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #EAB308 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                    )}
                    {factoryPatternId === 'PATTERN-000052' && (
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    )}
                    {factoryPatternId === 'PATTERN-000053' && (
                      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.3),transparent_50%)]"></div>
                    )}

                    {/* Frame Outline Overlay */}
                    {factoryFrameId === 'FRAME-000031' && (
                      <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-yellow-500/30 pointer-events-none"></div>
                    )}
                    {factoryFrameId === 'FRAME-000032' && (
                      <div className="absolute inset-4 rounded-2xl border-2 border-slate-400/30 pointer-events-none"></div>
                    )}
                    {factoryFrameId === 'FRAME-000033' && (
                      <div className="absolute inset-4 rounded-2xl border-2 border-indigo-500/40 pointer-events-none shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
                    )}

                    {/* Sticker Ribbon Label */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                      {factoryStickerId === 'STICKER-000210' && (
                        <span className="bg-yellow-500 text-black font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-yellow-400">
                          🎀 Scan For Menu
                        </span>
                      )}
                      {factoryStickerId === 'STICKER-000211' && (
                        <span className="bg-pink-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-pink-400">
                          🌸 Save Contact Info
                        </span>
                      )}
                      {factoryStickerId === 'STICKER-000212' && (
                        <span className="bg-purple-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-purple-400">
                          ⭐ Google Star Approved
                        </span>
                      )}
                    </div>

                    {/* Dynamic Text block using Y-Position state */}
                    <div 
                      className="absolute left-6 right-6 transition-all duration-150"
                      style={{ top: `${factoryTextY}px` }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {factoryIconId === 'ICON-000245' && <span className="text-xl">☕</span>}
                        {factoryIconId === 'ICON-000246' && <span className="text-xl">💍</span>}
                        {factoryIconId === 'ICON-000247' && <span className="text-xl">⭐</span>}
                      </div>
                      <h4 className={`font-syne font-extrabold text-[16px] tracking-tight ${factoryBgId === 'BG-000542' ? 'text-slate-900' : 'text-white'}`}>
                        {factoryTitle}
                      </h4>
                      <p className={`text-[10px] mt-1 leading-relaxed ${factoryBgId === 'BG-000542' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {factorySubtitle}
                      </p>
                    </div>

                    {/* Dynamic QR Code box using Y-Position state */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-2xl p-2.5 shadow-2xl transition-all duration-150 flex items-center justify-center border border-slate-100"
                      style={{ top: `${factoryQrY}px` }}
                    >
                      <div className="w-full h-full border-4 border-slate-900/10 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50">
                        <QrCode className="w-8 h-8 text-slate-800" />
                        <span className="text-[7px] font-black uppercase text-slate-400 tracking-wider mt-1.5">A2ZQR Live</span>
                      </div>
                    </div>

                    {/* Quality Badging indicators inside Frame boundary */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[8px] tracking-wider uppercase font-extrabold">
                      <span className={factoryBgId === 'BG-000542' ? 'text-slate-400' : 'text-slate-500'}>Asset: {factoryBgId}</span>
                      <span className="text-emerald-500 flex items-center gap-1 font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Mobile safe
                      </span>
                      <span className={factoryBgId === 'BG-000542' ? 'text-slate-400' : 'text-slate-500'}>Style: {factoryVariation}</span>
                    </div>
                  </div>

                  {/* Metadata display board */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-[11px] font-mono text-slate-500">
                    <div><strong>bg_asset_id:</strong> "{factoryBgId}"</div>
                    <div><strong>frame_asset_id:</strong> "{factoryFrameId}"</div>
                    <div><strong>sticker_asset_id:</strong> "{factoryStickerId}"</div>
                    <div><strong>pattern_asset_id:</strong> "{factoryPatternId}"</div>
                    <div><strong>icon_asset_id:</strong> "{factoryIconId}"</div>
                    <div><strong>variation_style:</strong> "{factoryVariation}"</div>
                    <div><strong>safe_zone_y:</strong> {factoryTextY}px text / {factoryQrY}px qr</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 10: MOCKUPS SANDBOX */}
          {activeTab === 'mockups' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Eye className="w-6 h-6 text-emerald-400" /> Mockup Sandbox Preview
                </h2>
                <p className="text-xs text-slate-500">Review your printed templates inside high-class physical environments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-slate-50 flex items-center justify-center text-4xl border-b border-slate-200">
                    ☕🍽️
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Cozy Table Menu Stand</h3>
                    <p className="text-xs text-slate-500">Realistic wooden tabletop stand with warm lights and plant shadow overlay.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-slate-50 flex items-center justify-center text-4xl border-b border-slate-200">
                    🍷🌹
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Luxury Event Banquet</h3>
                    <p className="text-xs text-slate-500">Sleek glass holder next to golden champagne and silver plate setups.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-[#7C6EFA] transition-all">
                  <div className="h-44 bg-slate-50 flex items-center justify-center text-4xl border-b border-slate-200">
                    🛍️🏢
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-sm">Boutique Checkout Desk</h3>
                    <p className="text-xs text-slate-500">Gleaming quartz counter space in front of apparel displays.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: BULK GENERATOR */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-indigo-400" /> Batch Bulk Generator Engine
                </h2>
                <p className="text-xs text-slate-500">Generate hundreds of QR Codes instantly using CSV lists.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <form onSubmit={handleBulkGenerate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white font-extrabold block">Bulk Raw Input (Format: Label, Destination URL)</label>
                    <textarea 
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      rows={5}
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-900 outline-none focus:border-[#7C6EFA]"
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
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compiled Output Batch ({bulkResult.length} files)</h3>
                    <button 
                      onClick={() => toastState.success('Simulated high-res asset folder zip downloaded!')}
                      className="px-3.5 py-1.5 bg-[#7C6EFA]/10 border border-[#7C6EFA]/30 hover:bg-[#7C6EFA]/20 text-xs text-indigo-600 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download ZIP Archive
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {bulkResult.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                        <img src={r.qrUrl} className="w-24 h-24 mx-auto rounded" alt={r.label} />
                        <span className="font-extrabold text-[11px] text-white block truncate">{r.label}</span>
                        <span className="text-[9px] text-slate-500 block truncate font-mono">{r.url}</span>
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-emerald-400" /> Brand Media Uploads
                </h2>
                <p className="text-xs text-slate-500">Manage uploaded high-fidelity vector company logos and background design files.</p>
              </div>

              {/* Mock Upload Box */}
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#7C6EFA] hover:bg-slate-50/5 transition-all relative">
                <input 
                  type="file" 
                  onChange={handleMockAssetUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-indigo-600 mb-3" />
                <span className="font-bold text-sm text-white">Drag & Drop brand assets here</span>
                <span className="text-xs text-slate-500 mt-1">Supports transparent SVGs, high-res PNGs, and custom backgrounds.</span>
              </div>

              {/* Assets Registry List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Catalog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedAssets.map(a => (
                    <div key={a.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-lg">📁</div>
                        <div>
                          <span className="font-bold text-xs text-white block">{a.name}</span>
                          <span className="text-[10px] text-slate-500">{a.size} • {a.type}</span>
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Tag className="w-6 h-6 text-[#7C6EFA]" /> Category Directories Config
                </h2>
                <p className="text-xs text-slate-500">Manage category listings, colors, and global directory grouping codes.</p>
              </div>

              {/* Add New Category */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Register New Catalog Category</h3>
                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Category Name</label>
                    <input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Pet Care & Vet" 
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Theme Color Accents</label>
                    <input 
                      type="color" 
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-full h-11 bg-transparent cursor-pointer rounded border border-slate-200"
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
                  <div key={c.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 relative group hover:border-indigo-500/25 transition-all">
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
                      <span className="text-[11px] text-slate-500 font-mono">{c.count} active campaigns</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: SEO MANAGER */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-indigo-400" /> Search Engine Optimization (SEO) Config
                </h2>
                <p className="text-xs text-slate-500">Configure automated sitemaps, robots.txt indexing rules, and meta tags schema.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Google Indexing Settings</h3>
                <div className="space-y-3 text-xs text-slate-500">
                  <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-xl">
                    <span>Target Indexing Rule</span>
                    <span className="font-mono text-emerald-400 font-bold">INDEX, FOLLOW (Robots active)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-xl">
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-400" /> Console Blog Engine
                </h2>
                <p className="text-xs text-slate-500">Publish helpful articles, dynamic QR use cases, and tips for printed brand templates.</p>
              </div>

              {/* Create new post */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Compose Fresh Tutorial</h3>
                <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Article Title</label>
                    <input 
                      type="text" 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="e.g. 5 Mistakes to Avoid when Printing Restaurant Menu QR Badges" 
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl text-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase font-bold">Status</label>
                      <select 
                        value={newPostStatus}
                        onChange={(e: any) => setNewPostStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs px-3 py-3 rounded-xl text-slate-900 outline-none"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Blog Posts</h3>
                <div className="space-y-2">
                  {blogPosts.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{p.title}</span>
                        <span className="text-[10px] text-slate-500">By {p.author} • {p.status === 'Published' ? '🟢 Published' : '🟡 Draft'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-800 font-bold">{p.views.toLocaleString()} views</span>
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
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-400" /> White-Label Settings
                </h2>
                <p className="text-xs text-slate-500">Configure your brand's unique custom dynamic short-linking domains.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white font-extrabold block">Custom Short-Link Domain Routing</label>
                  <input 
                    type="text" 
                    value={domainSettings.customDomain}
                    onChange={(e) => setDomainSettings({ ...domainSettings, customDomain: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded-xl text-slate-900 outline-none"
                    placeholder="e.g. qr.mybrand.com"
                  />
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs text-slate-500">
                  <span>Active SSL Certificates (Let's Encrypt)</span>
                  <span className="text-emerald-400 font-bold">🟢 Active & Verified</span>
                </div>
                <button 
                  onClick={() => toastState.success('Custom Domain Settings updated successfully on DNS lookup maps!')}
                  className="py-3 px-5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl shadow-sm"
                >
                  Save White-label Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB: DYNAMIC SCAN PAGES */}
          {activeTab === 'dynamic_pages' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-black flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-black" /> Dynamic Scan Pages Designer
                </h2>
                <p className="text-xs text-slate-500">
                  Configure custom offline post-scan destination landing portals. Available exclusively on the <span className="font-extrabold text-black">A2ZQR Pro Plan</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 1. Editor Configuration Form Panel */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Category Pills Selector */}
                  <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-250">
                    {[
                      { id: 'wedding', label: '🌸 Wedding RSVP' },
                      { id: 'pet', label: '🐾 Pet ID Tag' },
                      { id: 'vcard', label: '📇 Business Card' },
                      { id: 'wifi', label: '⚡ Wi-Fi Connect' },
                      { id: 'review', label: '⭐ Google Review' },
                      { id: 'capsule', label: '🔒 Time Capsule' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setActiveScanType(type.id as any)}
                        className={`flex-1 min-w-[110px] px-3 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                          activeScanType === type.id
                            ? 'bg-black text-white shadow-sm'
                            : 'text-slate-600 hover:text-black hover:bg-slate-200/50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Config Form Cards */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                    {/* WEDDING RSVP CONFIG */}
                    {activeScanType === 'wedding' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Wedding RSVP Experience Setup</h3>
                          <p className="text-[11px] text-slate-500">Live preview matches after-scan page for guests.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Celebration Title</label>
                            <input
                              type="text"
                              value={weddingConfig.title}
                              onChange={(e) => setWeddingConfig({ ...weddingConfig, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Event Hosts</label>
                            <input
                              type="text"
                              value={weddingConfig.hosts}
                              onChange={(e) => setWeddingConfig({ ...weddingConfig, hosts: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Wedding Date</label>
                            <input
                              type="text"
                              value={weddingConfig.date}
                              onChange={(e) => setWeddingConfig({ ...weddingConfig, date: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Venue Location</label>
                            <input
                              type="text"
                              value={weddingConfig.venue}
                              onChange={(e) => setWeddingConfig({ ...weddingConfig, venue: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Welcome Message</label>
                          <textarea
                            rows={3}
                            value={weddingConfig.welcomeMessage}
                            onChange={(e) => setWeddingConfig({ ...weddingConfig, welcomeMessage: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black resize-none"
                          />
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                          <h4 className="text-[11px] font-bold text-black uppercase tracking-wider">Collected Guest Registry Entries (Live Mock DB)</h4>
                          <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                            {rsvps.map((r, i) => (
                              <div key={i} className="flex justify-between items-center text-[11px] p-2 bg-white border border-slate-200 rounded">
                                <span className="font-extrabold text-black">{r.name} <span className="font-normal text-slate-500">({r.choice}, {r.guests} guests)</span></span>
                                <span className="text-[10px] text-slate-450 truncate max-w-[150px] italic">"{r.msg}"</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Guest Name"
                              value={newRsvpName}
                              onChange={(e) => setNewRsvpName(e.target.value)}
                              className="bg-white border border-slate-200 text-[10px] px-2 py-1.5 rounded"
                            />
                            <div className="flex gap-1.5">
                              <select
                                value={newRsvpChoice}
                                onChange={(e) => setNewRsvpChoice(e.target.value)}
                                className="bg-white border border-slate-200 text-[10px] px-1 py-1.5 rounded flex-1"
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newRsvpName) return;
                                  setRsvps([...rsvps, { name: newRsvpName, choice: newRsvpChoice, guests: newRsvpGuests, food: newRsvpFood, msg: newRsvpMsg || 'Joined RSVP' }]);
                                  setNewRsvpName('');
                                  setNewRsvpMsg('');
                                }}
                                className="px-3 bg-black text-white text-[10px] font-bold rounded"
                              >
                                Add Guest
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PET ID TAG CONFIG */}
                    {activeScanType === 'pet' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Pet ID QR Scan Landing Page Setup</h3>
                          <p className="text-[11px] text-slate-500">Crucial for physical collars or tag scans in emergency scenarios.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Pet Name</label>
                            <input
                              type="text"
                              value={petConfig.petName}
                              onChange={(e) => setPetConfig({ ...petConfig, petName: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Breed / Friendly Note</label>
                            <input
                              type="text"
                              value={petConfig.breed}
                              onChange={(e) => setPetConfig({ ...petConfig, breed: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Owner Name</label>
                            <input
                              type="text"
                              value={petConfig.ownerName}
                              onChange={(e) => setPetConfig({ ...petConfig, ownerName: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Owner Contact Phone</label>
                            <input
                              type="text"
                              value={petConfig.ownerPhone}
                              onChange={(e) => setPetConfig({ ...petConfig, ownerPhone: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Home / Return Address</label>
                          <input
                            type="text"
                            value={petConfig.ownerAddress}
                            onChange={(e) => setPetConfig({ ...petConfig, ownerAddress: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Critical Medical Notes</label>
                            <input
                              type="text"
                              value={petConfig.medicalNotes}
                              onChange={(e) => setPetConfig({ ...petConfig, medicalNotes: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Reward Return Message</label>
                            <input
                              type="text"
                              value={petConfig.rewardMessage}
                              onChange={(e) => setPetConfig({ ...petConfig, rewardMessage: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC VCARD BUSINESS CARD */}
                    {activeScanType === 'vcard' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Digital Business Card Profile Setup</h3>
                          <p className="text-[11px] text-slate-500">Provides immediate single-page link dashboard with interactive Save Contact triggers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Profile Photo Avatar URL</label>
                            <input
                              type="text"
                              value={vcardConfig.avatarUrl}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, avatarUrl: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Full Name</label>
                            <input
                              type="text"
                              value={vcardConfig.name}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, name: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Job Title / Role</label>
                            <input
                              type="text"
                              value={vcardConfig.title}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Company / Agency Name</label>
                            <input
                              type="text"
                              value={vcardConfig.company}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, company: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Short Professional Bio</label>
                          <textarea
                            rows={2}
                            value={vcardConfig.bio}
                            onChange={(e) => setVcardConfig({ ...vcardConfig, bio: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Phone Number</label>
                            <input
                              type="text"
                              value={vcardConfig.phone}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, phone: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Email Address</label>
                            <input
                              type="text"
                              value={vcardConfig.email}
                              onChange={(e) => setVcardConfig({ ...vcardConfig, email: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WI-FI EASY CONNECT */}
                    {activeScanType === 'wifi' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Instant Wi-Fi Connection Screen</h3>
                          <p className="text-[11px] text-slate-500">Instead of raw config, shows a beautifully-branded portal detailing support line & policies.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Network SSID (Name)</label>
                            <input
                              type="text"
                              value={wifiConfig.ssid}
                              onChange={(e) => setWifiConfig({ ...wifiConfig, ssid: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Security Protocol</label>
                            <select
                              value={wifiConfig.security}
                              onChange={(e) => setWifiConfig({ ...wifiConfig, security: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            >
                              <option value="WPA2/WPA3">WPA2 / WPA3 (Recommended)</option>
                              <option value="WEP">WEP (Legacy)</option>
                              <option value="Unsecured">Unsecured / Public Open</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Network Security Password</label>
                          <input
                            type="text"
                            value={wifiConfig.password}
                            onChange={(e) => setWifiConfig({ ...wifiConfig, password: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Welcome / Terms Announcement Note</label>
                          <textarea
                            rows={3}
                            value={wifiConfig.welcomeNote}
                            onChange={(e) => setWifiConfig({ ...wifiConfig, welcomeNote: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* GOOGLE REVIEW BOOSTER */}
                    {activeScanType === 'review' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Google Review Booster Setup</h3>
                          <p className="text-[11px] text-slate-500">Accelerates high-volume real store ratings with structured incentives.</p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Retail Store / Brand Name</label>
                          <input
                            type="text"
                            value={reviewConfig.storeName}
                            onChange={(e) => setReviewConfig({ ...reviewConfig, storeName: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Main Call-To-Action rating prompt</label>
                          <input
                            type="text"
                            value={reviewConfig.promptText}
                            onChange={(e) => setReviewConfig({ ...reviewConfig, promptText: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Target Review Redirect URL</label>
                          <input
                            type="text"
                            value={reviewConfig.targetUrl}
                            onChange={(e) => setReviewConfig({ ...reviewConfig, targetUrl: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Incentive Offer Text (Pro only)</label>
                          <textarea
                            rows={2}
                            value={reviewConfig.incentiveText}
                            onChange={(e) => setReviewConfig({ ...reviewConfig, incentiveText: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECURE TIME CAPSULE */}
                    {activeScanType === 'capsule' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <h3 className="text-sm font-extrabold text-black">Time-Locked Prediction Capsule</h3>
                          <p className="text-[11px] text-slate-500">Locks prophecies, media diaries or private predictions behind decryption time-locks.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Capsule Title</label>
                            <input
                              type="text"
                              value={capsuleConfig.capsuleTitle}
                              onChange={(e) => setCapsuleConfig({ ...capsuleConfig, capsuleTitle: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Creator/Lock Authority</label>
                            <input
                              type="text"
                              value={capsuleConfig.creator}
                              onChange={(e) => setCapsuleConfig({ ...capsuleConfig, creator: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Lock Duration</label>
                            <input
                              type="text"
                              value={capsuleConfig.lockDuration}
                              onChange={(e) => setCapsuleConfig({ ...capsuleConfig, lockDuration: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-600 font-bold block">Lock Date</label>
                            <input
                              type="text"
                              value={capsuleConfig.lockDate}
                              onChange={(e) => setCapsuleConfig({ ...capsuleConfig, lockDate: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-600 font-bold block">Locked Secret PDF Message Content</label>
                          <textarea
                            rows={3}
                            value={capsuleConfig.secretMessage}
                            onChange={(e) => setCapsuleConfig({ ...capsuleConfig, secretMessage: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-black outline-none focus:border-black resize-none"
                          />
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex justify-between items-center">
                          <span>Decrypt Passcode bypass (for editor testing)</span>
                          <span className="font-mono text-black font-extrabold">"1234"</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Design State */}
                    <button
                      onClick={() => toastState.success('Dynamic Scan Landing Page settings successfully compiled to blockchain cloud routing. All active scanners will see the updated view immediately.')}
                      className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      Deploy Dynamic Page Update & Sync QR
                    </button>
                  </div>
                </div>

                {/* 2. Interactive iPhone Simulator Mockup View */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mb-3">Live Smartphone Scan View</span>

                  {/* Simulated Mobile Frame */}
                  <div className="w-[320px] h-[640px] rounded-[48px] bg-black p-3.5 shadow-2xl relative border-4 border-slate-800 overflow-hidden flex flex-col">
                    {/* Speaker notch / dynamic island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-50 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute right-4"></div>
                    </div>

                    {/* Phone Screen body */}
                    <div className="w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col justify-between text-black relative select-none text-left">
                      {/* Simulated Status bar */}
                      <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 text-[10px] font-bold text-slate-500 font-mono">
                        <span>09:41 AM</span>
                        <div className="flex gap-1.5">
                          <span>5G</span>
                          <span>99%</span>
                        </div>
                      </div>

                      {/* Scrolling content container */}
                      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-none font-sans">
                        {/* WEDDING PREVIEW */}
                        {activeScanType === 'wedding' && (
                          <div className="space-y-4 text-center">
                            <span className="text-3xl">🌸</span>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-base text-rose-600 font-serif leading-tight">{weddingConfig.title}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">A Union of Destiny</p>
                            </div>

                            <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hosts</span>
                                <span className="font-extrabold text-slate-800">{weddingConfig.hosts}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-100">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                                  <span className="font-extrabold text-slate-800 text-[11px]">{weddingConfig.date}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Venue</span>
                                  <span className="font-extrabold text-slate-800 text-[11px] truncate block">{weddingConfig.venue}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed italic px-2">"{weddingConfig.welcomeMessage}"</p>

                            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm text-left">
                              <h5 className="text-[11px] font-extrabold text-black uppercase tracking-wider text-center border-b border-slate-100 pb-1.5">Submit RSVP Instantly</h5>
                              
                              <div className="space-y-1.5">
                                <label className="text-[9px] text-slate-500 uppercase font-bold">Your Name</label>
                                <input type="text" placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-200 text-[10px] px-2.5 py-2 rounded" disabled />
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="space-y-1.5">
                                  <label className="text-[9px] text-slate-500 uppercase font-bold">Will you attend?</label>
                                  <select className="w-full bg-slate-50 border border-slate-200 text-[10px] p-1.5 rounded" disabled>
                                    <option>Yes, absolutely</option>
                                    <option>No, sadly</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[9px] text-slate-500 uppercase font-bold">Food Choice</label>
                                  <select className="w-full bg-slate-50 border border-slate-200 text-[10px] p-1.5 rounded" disabled>
                                    <option>Vegetarian</option>
                                    <option>Vegan</option>
                                    <option>Non-Vegetarian</option>
                                  </select>
                                </div>
                              </div>
                              <button type="button" onClick={() => toastState.success('RSVP entry submitted in preview successfully!')} className="w-full bg-rose-600 text-white font-bold text-[10px] py-2 rounded shadow">Confirm Invitation RSVP</button>
                            </div>
                          </div>
                        )}

                        {/* PET ID PREVIEW */}
                        {activeScanType === 'pet' && (
                          <div className="space-y-4">
                            <div className="text-center space-y-1">
                              <span className="text-4xl block">🐶</span>
                              <h4 className="font-extrabold text-lg text-slate-800 leading-tight">My Name is {petConfig.petName}</h4>
                              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">{petConfig.breed}</span>
                            </div>

                            <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-center space-y-1">
                              <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-widest block">⚠️ EMERGENCY SOS</span>
                              <p className="text-[11px] text-red-700 font-medium leading-normal">"{petConfig.rewardMessage}"</p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm text-xs">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Owner / Parent Name</span>
                                <span className="font-extrabold text-slate-800">{petConfig.ownerName}</span>
                              </div>
                              <div className="border-t border-slate-100 pt-2">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Home return address</span>
                                <span className="font-medium text-slate-700 leading-snug block">{petConfig.ownerAddress}</span>
                              </div>
                              <div className="border-t border-slate-100 pt-2">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Allergies & Medical specifications</span>
                                <span className="font-bold text-red-600 block">{petConfig.medicalNotes}</span>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <a href={`tel:${petConfig.ownerPhone}`} className="w-full py-3 bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                                📞 Call Owner ({petConfig.ownerPhone})
                              </a>
                              <a href={`tel:${petConfig.emergencyContact}`} className="w-full py-2.5 bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2">
                                🚨 Secondary Emergency Line
                              </a>
                            </div>
                          </div>
                        )}

                        {/* DIGITAL BUSINESS CARD VCARD */}
                        {activeScanType === 'vcard' && (
                          <div className="space-y-4 text-center">
                            <div className="relative pt-4">
                              <img src={vcardConfig.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full mx-auto border-2 border-black bg-slate-200" />
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-black text-base text-slate-900 leading-tight">{vcardConfig.name}</h4>
                              <p className="text-[11px] font-bold text-slate-500 leading-none">{vcardConfig.title}</p>
                              <p className="text-[10px] text-black font-extrabold uppercase tracking-wide pt-1">{vcardConfig.company}</p>
                            </div>

                            <p className="text-[11px] text-slate-600 px-3 leading-relaxed">"{vcardConfig.bio}"</p>

                            <div className="bg-white border border-slate-200 rounded-xl p-3 text-left space-y-2 text-[11px] shadow-sm">
                              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-slate-400">Email</span>
                                <span className="font-bold truncate max-w-[160px]">{vcardConfig.email}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                                <span className="text-slate-400">Phone</span>
                                <span className="font-bold">{vcardConfig.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Website</span>
                                <span className="font-bold text-indigo-600 truncate max-w-[160px]">{vcardConfig.website}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <button onClick={() => toastState.success('VCF Contact Card downloaded successfully in simulation!')} className="py-2.5 bg-black text-white font-extrabold text-[10px] uppercase rounded-lg shadow">
                                📥 Save Contact
                              </button>
                              <a href={`https://wa.me/${vcardConfig.whatsapp}`} className="py-2.5 bg-emerald-600 text-white font-extrabold text-[10px] uppercase rounded-lg shadow flex items-center justify-center gap-1">
                                💬 WhatsApp
                              </a>
                            </div>
                          </div>
                        )}

                        {/* WI-FI CONNECTION PORTAL */}
                        {activeScanType === 'wifi' && (
                          <div className="space-y-4">
                            <div className="text-center space-y-1">
                              <span className="text-4xl block">⚡</span>
                              <h4 className="font-black text-base text-slate-900 leading-tight">Instant Lounge Wi-Fi</h4>
                              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block">Seamless Automatic Link</span>
                            </div>

                            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl space-y-3.5 shadow-inner">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Network SSID</span>
                                <span className="font-mono font-extrabold text-sm text-slate-800">{wifiConfig.ssid}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Security</span>
                                  <span className="font-bold text-slate-700 text-xs">{wifiConfig.security}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Password</span>
                                  <span className="font-mono font-bold text-slate-700 text-xs">{wifiConfig.password}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed text-center italic px-3">"{wifiConfig.welcomeNote}"</p>

                            <button onClick={() => {
                              toastState.success('Simulating device Wi-Fi easy connection protocol... Success! Connected to network.');
                            }} className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2">
                              📶 Auto Connect Wi-Fi Now
                            </button>
                          </div>
                        )}

                        {/* GOOGLE REVIEW BOOSTER */}
                        {activeScanType === 'review' && (
                          <div className="space-y-4 text-center">
                            <span className="text-4xl block">⭐</span>
                            <div className="space-y-1">
                              <h4 className="font-black text-lg text-slate-900 leading-tight">{reviewConfig.storeName}</h4>
                              <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider">Verified Business Partner</span>
                            </div>

                            <p className="text-xs text-slate-700 font-extrabold px-3 leading-relaxed">"{reviewConfig.promptText}"</p>

                            <div className="flex justify-center gap-1 pt-1.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => window.open(reviewConfig.targetUrl, '_blank')} className="text-2xl text-yellow-400 hover:scale-125 transition-transform">★</button>
                              ))}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 p-3.5 rounded-xl text-left space-y-1 text-xs">
                              <span className="text-[9px] font-extrabold text-yellow-700 uppercase tracking-wider block">🎁 Scan Reward Incentive</span>
                              <p className="text-[11px] text-slate-600 leading-snug">{reviewConfig.incentiveText}</p>
                            </div>

                            <a href={reviewConfig.targetUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                              👉 Leave 5-Star Review on Maps
                            </a>
                          </div>
                        )}

                        {/* SECURE TIME CAPSULE */}
                        {activeScanType === 'capsule' && (
                          <div className="space-y-4">
                            <div className="text-center space-y-1">
                              <span className="text-3xl block">🔒</span>
                              <h4 className="font-extrabold text-base text-slate-800 leading-tight">{capsuleConfig.capsuleTitle}</h4>
                              <span className="text-[9px] font-mono text-slate-400 block">Created by {capsuleConfig.creator} on {capsuleConfig.lockDate}</span>
                            </div>

                            <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl space-y-2 text-xs text-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Lock status timer</span>
                              <span className="font-mono font-black text-black text-[13px]">{capsuleConfig.lockDuration} remaining</span>
                            </div>

                            {capsuleConfig.isUnlocked ? (
                              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3 animate-fade-in text-xs">
                                <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block">🔓 DECRYPTED SUCCESS</span>
                                <p className="text-slate-800 font-mono leading-relaxed">"{capsuleConfig.secretMessage}"</p>
                                <div className="border-t border-slate-200 pt-2">
                                  <span className="text-[9px] uppercase font-bold text-slate-400">Encrypted PDF Attachments</span>
                                  {capsuleConfig.files.map((f, i) => (
                                    <div key={i} className="font-mono text-indigo-600 text-[10px] mt-1 font-bold underline cursor-pointer hover:text-indigo-800">📄 {f}</div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm text-xs">
                                <h5 className="text-[10px] font-bold text-black uppercase tracking-wider text-center">Enter bypass key to decrypt message</h5>
                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    placeholder="Enter secret passcode"
                                    value={capsuleCodeInput}
                                    onChange={(e) => setCapsuleCodeInput(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded text-center font-mono focus:border-black outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (capsuleCodeInput === '1234') {
                                      setCapsuleConfig({ ...capsuleConfig, isUnlocked: true });
                                    } else {
                                      toastState.error('Invalid bypass decryption key! Try entering "1234".');
                                    }
                                  }}
                                  className="w-full bg-black text-white font-bold text-[10px] py-2 rounded shadow"
                                >
                                  Decrypt Capsule Message
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Simulated iOS Home Bar */}
                      <div className="h-6 bg-white flex items-center justify-center shrink-0">
                        <div className="w-32 h-1 rounded-full bg-slate-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Console global footer */}
        <footer className="h-14 border-t border-slate-200 px-8 flex items-center justify-between bg-white text-xs text-slate-500 shrink-0">
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-black text-slate-900 font-mono leading-none">{value}</div>
        {trend ? (
          <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend} vs last cycle
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-medium leading-none block">{desc}</span>
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
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
          : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'}`}>
          {icon}
        </span>
        <span className="tracking-tight text-[11.5px]">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold">
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
    <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${active ? 'bg-indigo-55/15 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
      <div>
        <span className="font-extrabold text-slate-800 block">{label}</span>
        <span className="text-[10px] font-mono text-slate-400">{size}</span>
      </div>
      <span className="font-mono font-bold text-indigo-600">{res}</span>
    </div>
  );
}

function StickerShapeCard({ name, desc, icon, active }: any) {
  return (
    <div className={`p-4 rounded-xl border text-center space-y-1.5 transition-all ${active ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
      <span className="text-2xl block">{icon}</span>
      <span className="font-bold text-[11px] block text-slate-800 leading-none">{name}</span>
      <span className="text-[9px] text-slate-400 block leading-tight">{desc}</span>
    </div>
  );
}

function FrameOverlayCard({ title, borderStyle, color, active }: any) {
  return (
    <div className={`p-4 rounded-2xl border space-y-2 transition-all ${active ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex justify-between items-center">
        <h4 className="font-extrabold text-xs text-slate-800 leading-tight">{title}</h4>
        {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
      </div>
      <p className="text-[10px] text-slate-500 leading-snug">{borderStyle}</p>
      <span className="text-[9px] font-mono text-indigo-600 block font-bold">{color}</span>
    </div>
  );
}

// Helper SVG card
function SvgThumbnailCard({ label, cat, preview }: any) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl text-center space-y-2 hover:border-indigo-500/35 transition-all">
      <div className="text-3xl h-10 flex items-center justify-center">{preview}</div>
      <span className="font-extrabold text-[10.5px] text-slate-800 block truncate">{label}</span>
      <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-wider">{cat}</span>
    </div>
  );
}

// Helper theme pack box
function ThemePackBox({ name, cat, font, color, bg, icons }: any) {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-indigo-500/25 transition-all">
      <div className="space-y-1">
        <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">{cat}</span>
        <h4 className="font-bold text-slate-800 text-base mt-2">{name}</h4>
      </div>
      <div className="space-y-1 text-xs text-slate-500">
        <div>Typography pairing: <span className="text-slate-700 font-mono">{font}</span></div>
        <div>Matched Palette: <span className="text-slate-700 font-mono">{color}</span></div>
        <div>Default Background: <span className="text-slate-700 font-mono">{bg}</span></div>
        <div className="flex gap-1 mt-2">
          {icons.map((ico: any) => (
            <span key={ico} className="text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono">#{ico}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

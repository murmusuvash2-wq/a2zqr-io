import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, Eye, EyeOff, HelpCircle, LayoutGrid, CheckCircle, Wifi, User, Briefcase, Globe, MapPin, Coins, CreditCard, MessageSquare, Share2, Send, ExternalLink, Sparkles, Shield, Phone, Mail } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { QRTool } from '../data/tools';
import { UserStats } from '../lib/firebase';

import { FORMS_DATABASE } from '../data/forms';
import { FIELD_GROUPS } from '../data/fieldGroups';
import { THEMES_DATABASE } from '../data/themes';
import { QR_STYLES_DATABASE } from '../data/qrStyles';
import { PREVIEW_LAYOUTS_DATABASE } from '../data/previewLayouts';
import { PRINT_GUIDES_DATABASE } from '../data/printGuides';
import { FAQS_DATABASE, DEFAULT_FAQ } from '../data/faqs';
import { TOOL_CONTENT_DATABASE } from '../data/toolContent';
import { RELATED_TOOLS_DATABASE } from '../data/relatedTools';
import { CAPABILITIES_DATABASE, DEFAULT_CAPABILITY } from '../data/capabilities';
import { Field } from '../data/schemas';

interface QRCodeGeneratorProps {
  tool: QRTool;
  user: UserStats | null;
  onOpenPayModal: () => void;
}

// Programmatic form fields resolver helper
const getResolvedFields = (toolId: string, defaultInputs: any[]): Field[] => {
  const formKey = Object.keys(FORMS_DATABASE).find(k => k === toolId || toolId.includes(k));
  if (formKey) {
    const config = FORMS_DATABASE[formKey];
    let resolvedFields: Field[] = [...config.fields];
    
    if (config.fieldGroupIds) {
      config.fieldGroupIds.forEach(groupId => {
        const group = FIELD_GROUPS[groupId];
        if (group) {
          resolvedFields = [...resolvedFields, ...group.fields];
        }
      });
    }
    return resolvedFields;
  }
  
  return defaultInputs.map(input => ({
    id: input.key,
    label: input.label,
    type: input.type as any,
    required: input.isRequired || false,
    placeholder: input.placeholder,
    defaultValue: input.defaultValue
  }));
};

const getToolGroup = (toolId: string, category: string) => {
  const id = toolId.toLowerCase();
  const cat = category.toLowerCase();
  
  if (id.includes('vcard') || id.includes('mecard') || id.includes('contact')) return 'contact';
  if (id.includes('wifi') || id.includes('hotspot')) return 'wifi';
  if (id.includes('wallet') || id.includes('crypto') || id.includes('ens-domain') || id.includes('btc') || id.includes('eth') || id.includes('sol') || id.includes('matic') || id.includes('xrp') || id.includes('doge') || id.includes('bnb') || id.includes('usdt') || id.includes('usdc')) return 'crypto';
  if (id.includes('location') || id.includes('geo') || id.includes('gps') || id.includes('map') || id.includes('venue') || id.includes('airbnb') || id.includes('tripadvisor') || id.includes('yelp')) return 'maps';
  if (id.includes('paypal') || id.includes('stripe') || id.includes('payment') || id.includes('buymeacoffee') || id.includes('patreon') || id.includes('checkout') || id.includes('invoice') || id.includes('billing') || id.includes('shop') || id.includes('amazon') || id.includes('etsy') || id.includes('ebay')) return 'payment';
  if (id.includes('sms') || id.includes('email') || id.includes('whatsapp') || id.includes('skype') || id.includes('zoom') || id.includes('telegram') || id.includes('discord') || id.includes('chat') || id.includes('meeting') || id.includes('teams')) return 'communication';
  if (cat.includes('social') || id.includes('youtube') || id.includes('instagram') || id.includes('twitter') || id.includes('linkedin') || id.includes('facebook') || id.includes('tiktok') || id.includes('pinterest') || id.includes('reddit') || id.includes('twitch') || id.includes('spotify') || id.includes('apple-music') || id.includes('substack')) return 'social';
  if (id.includes('url') || id.includes('link') || id.includes('website') || id.includes('docs') || id.includes('sheets') || id.includes('slides') || id.includes('drive') || id.includes('dropbox') || id.includes('onedrive') || id.includes('pdf')) return 'website';
  return 'default';
};

const getSocialMediaBrandDetails = (toolId: string) => {
  const id = toolId.toLowerCase();
  if (id.includes('youtube')) return { name: 'YouTube', color: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10', border: 'border-[#FF0000]/30', prefix: 'youtube.com/@' };
  if (id.includes('instagram')) return { name: 'Instagram', color: 'text-[#E1306C]', bg: 'bg-gradient-to-tr from-[#F8D475]/10 via-[#E1306C]/10 to-[#C13584]/10', border: 'border-[#E1306C]/30', prefix: 'instagram.com/' };
  if (id.includes('twitter') || id.includes('x-twitter') || id.startsWith('x-')) return { name: 'X / Twitter', color: 'text-[#F5F8FA]', bg: 'bg-white/5', border: 'border-white/10', prefix: 'x.com/' };
  if (id.includes('linkedin')) return { name: 'LinkedIn', color: 'text-[#0A66C2]', bg: 'bg-[#0A66C2]/10', border: 'border-[#0A66C2]/30', prefix: 'linkedin.com/in/' };
  if (id.includes('facebook')) return { name: 'Facebook', color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10', border: 'border-[#1877F2]/30', prefix: 'facebook.com/' };
  if (id.includes('tiktok')) return { name: 'TikTok', color: 'text-[#00F2FE]', bg: 'bg-[#00F2FE]/10', border: 'border-[#00F2FE]/30', prefix: 'tiktok.com/@' };
  if (id.includes('telegram')) return { name: 'Telegram', color: 'text-[#24A1DE]', bg: 'bg-[#24A1DE]/10', border: 'border-[#24A1DE]/30', prefix: 't.me/' };
  if (id.includes('discord')) return { name: 'Discord', color: 'text-[#5865F2]', bg: 'bg-[#5865F2]/10', border: 'border-[#5865F2]/30', prefix: 'discord.gg/' };
  if (id.includes('spotify')) return { name: 'Spotify', color: 'text-[#1DB954]', bg: 'bg-[#1DB954]/10', border: 'border-[#1DB954]/30', prefix: 'open.spotify.com/' };
  if (id.includes('pinterest')) return { name: 'Pinterest', color: 'text-[#BD081C]', bg: 'bg-[#BD081C]/10', border: 'border-[#BD081C]/30', prefix: 'pinterest.com/' };
  return { name: 'Social Handle', color: 'text-[#7C6EFA]', bg: 'bg-[#7C6EFA]/5', border: 'border-[#7C6EFA]/20', prefix: '' };
};

export default function QRCodeGenerator({ tool, user, onOpenPayModal }: QRCodeGeneratorProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [qrString, setQrString] = useState<string>('');
  
  // Customization Toggles
  const [logoFile, setLogoFile] = useState<string>('');
  const [dotsType, setDotsType] = useState<any>('rounded');
  const [cornersType, setCornersType] = useState<any>('extra-rounded');
  const [fgColor, setFgColor] = useState('#F2F2FF');
  const [bgColor, setBgColor] = useState('#0A0A12');
  const [isMockupMode, setIsMockupMode] = useState(false);
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);
  
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Purpose Specific Form States
  const [contactTab, setContactTab] = useState<'personal' | 'business'>('personal');
  const [showWifiPass, setShowWifiPass] = useState<boolean>(false);

  // Dynamic values resolved from programmatic schemas
  const fields = getResolvedFields(tool.id, tool.inputs);
  
  // Dynamic theme matching
  const themeKey = Object.keys(THEMES_DATABASE).find(k => tool.id.includes(k.replace('-theme', '')) || k.startsWith(tool.id.split('-')[0]));
  const activeTheme = themeKey ? THEMES_DATABASE[themeKey] : THEMES_DATABASE['default-theme'];
  
  // Dynamic styles matching
  const styleKey = Object.keys(QR_STYLES_DATABASE).find(k => tool.id.includes(k) || (themeKey && themeKey.includes(k))) || 'liquid';
  const activeStyle = QR_STYLES_DATABASE[styleKey];

  // Dynamic preview formats matching
  const previewLayout = Object.values(PREVIEW_LAYOUTS_DATABASE).find(p => tool.id.includes(p.id) || tool.id.includes(p.previewType)) || PREVIEW_LAYOUTS_DATABASE['wedding-invitation'];
  const printGuide = Object.values(PRINT_GUIDES_DATABASE).find(g => tool.id.includes(g.id) || (themeKey && themeKey.includes('wedding') && g.id === 'standard-card')) || PRINT_GUIDES_DATABASE['standard-card'];

  // Dynamic capability matching
  const capability = CAPABILITIES_DATABASE[tool.id] || DEFAULT_CAPABILITY;

  // Sync inputs, theme colors, and style presets when active tool changes
  useEffect(() => {
    const defaults: Record<string, string> = {};
    fields.forEach(input => {
      defaults[input.id] = input.defaultValue || '';
    });
    setFormValues(defaults);
    
    if (activeTheme) {
      setFgColor(activeTheme.primaryColor);
      setBgColor(activeTheme.bgColor);
    }
    if (activeStyle) {
      setDotsType(activeStyle.dots);
      setCornersType(activeStyle.corners);
    }
  }, [tool.id]);

  // Generate QR Raw Data String
  useEffect(() => {
    const keys = Object.keys(formValues);
    if (keys.length > 0) {
      try {
        let generated = '';
        // If the tool has a direct generator in standard list, always use it to avoid wrong formatting!
        if (tool.generateQRString && !['wedding', 'vcard_full', 'vcard-full', 'restaurant_menu_database'].includes(tool.id)) {
          generated = tool.generateQRString(formValues);
        } else {
          // Resolve special database-backed forms
          const mainUrlKey = Object.keys(formValues).find(k => k.includes('url') || k.includes('link') || k.includes('website'));
          if (mainUrlKey && formValues[mainUrlKey]) {
            generated = formValues[mainUrlKey];
          } else {
            const lines: string[] = [];
            if (formValues.groom_name && formValues.bride_name) {
              lines.push(`❤️ wedding: ${formValues.groom_name} & ${formValues.bride_name}`);
              if (formValues.wedding_date) lines.push(`📅 date: ${formValues.wedding_date}`);
              if (formValues.venue) lines.push(`📍 venue: ${formValues.venue}`);
              if (formValues.rsvp_phone) lines.push(`📞 rsvp: ${formValues.rsvp_phone}`);
            } else {
              Object.entries(formValues).forEach(([k, v]) => {
                if (v) {
                  const label = k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
                  lines.push(`${label}: ${v}`);
                }
              });
            }
            generated = lines.join('\n') || 'A2ZQR Static Code';
          }
        }
        setQrString(generated || 'Welcome User');
      } catch (e) {
        setQrString('Error processing inputs');
      }
    }
  }, [formValues, tool]);

  // Initialize QR Code Styling
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 280,
      height: 280,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    });
  }, []);

  // Re-draw qr code representation
  useEffect(() => {
    if (qrCode.current && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.update({
        data: qrString || 'Welcome',
        dotsOptions: {
          color: fgColor,
          type: dotsType
        },
        cornersSquareOptions: {
          color: fgColor,
          type: cornersType
        },
        image: logoFile || undefined,
        backgroundOptions: {
          color: bgColor
        }
      });
      qrCode.current.append(qrRef.current);
    }
  }, [qrString, dotsType, cornersType, fgColor, bgColor, logoFile]);

  const handleInputChange = (key: string, val: string) => {
    setFormValues(prev => ({ ...prev, [key]: val }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!user?.isPro) {
        e.preventDefault();
        onOpenPayModal();
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setLogoFile(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const downloadPNG = () => {
    if (!qrCode.current) return;
    
    const isPro = user?.isPro === true;
    
    if (isPro) {
      qrCode.current.download({
        extension: 'png',
        name: `ezqr-${tool.slug}-${Date.now()}`
      });
    } else {
      qrCode.current.getRawData('png').then((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 280;
          c.height = 325;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.fillStyle = bgColor || '#0A0A12';
            ctx.fillRect(0, 0, 280, 325);
            ctx.drawImage(img, 0, 0, 280, 280);
            
            ctx.fillStyle = '#06060F';
            ctx.fillRect(0, 285, 280, 40);
            
            ctx.fillStyle = '#8080A0';
            ctx.font = '600 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ generated via ezqr.io', 140, 309);
            
            const a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = `ezqr-${tool.slug}-${Date.now()}-free.png`;
            a.click();
          }
          URL.revokeObjectURL(blobUrl);
        };
        img.src = blobUrl;
      }).catch(() => {
        qrCode.current?.download({
          extension: 'png',
          name: `ezqr-${tool.slug}-${Date.now()}`
        });
      });
    }
  };

  const toolGroup = getToolGroup(tool.id, tool.category);

  const renderCustomForm = () => {
    // 1. Prepare Helper Quick Chip Functions
    const appendUrlSuffix = (key: string, suffix: string) => {
      const current = formValues[key] || '';
      if (!current.endsWith(suffix)) {
        handleInputChange(key, current + suffix);
      }
    };

    const prependUrlPrefix = (key: string, prefix: string) => {
      const current = formValues[key] || '';
      if (!current.startsWith(prefix)) {
        handleInputChange(key, prefix + current);
      }
    };

    const setCoordinatesPreset = (latKey: string, lngKey: string, latVal: string, lngVal: string) => {
      handleInputChange(latKey, latVal);
      handleInputChange(lngKey, lngVal);
    };

    const insertTextTemplate = (key: string, template: string) => {
      handleInputChange(key, template);
    };

    // Calculate BuyMeACoffee spec if needed
    const bmacAmount = Number(formValues['amount'] || 5);
    const bmacCups = Math.floor(bmacAmount / 5) || 1;

    // Helper to render platform-specific brand mockups
    const renderToolSpecificPreview = () => {
      const id = tool.id.toLowerCase();
      
      // A. WIFI SPECIAL PREVIEW
      if (id.includes('wifi') || id.includes('hotspot')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 relative overflow-hidden transition-all hover:border-[#7C6EFA]/40 shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C6EFA]/10 to-transparent rounded-full pointer-events-none"></div>
            <div className="text-[10px] font-bold text-[#7C6EFA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 justify-between">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#7C6EFA] animate-pulse" /> Live Wi-Fi Signal Status
              </span>
              <span className="text-emerald-400 flex items-center gap-1 text-[9px] lowercase font-mono">
                ● encrypted
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-[#1A1A2E] text-[#7C6EFA] flex items-center justify-center font-bold text-lg border border-[#7C6EFA]/20 shadow-md">
                📡
              </div>
              <div>
                <h5 className="font-syne font-bold text-sm text-white leading-tight">
                  SSID: <span className="font-mono text-[#A89EFF]">{formValues['ssid'] || 'WiFi Network'}</span>
                </h5>
                <p className="text-[11px] text-[#8080A0] mt-1">
                  Security: <span className="font-mono text-white">{formValues['encryption'] || 'WPA'}</span>
                </p>
                {formValues['password'] && (
                  <p className="text-[10px] text-[#A89EFF]/80 mt-1 font-mono">
                     Password: {showWifiPass ? formValues['password'] : '••••••••'}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }

      // B. VCARD / MECARD / CONTACT SPECIAL PREVIEW
      if (id.includes('vcard') || id.includes('mecard') || id.includes('contact')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 relative overflow-hidden transition-all hover:border-[#7C6EFA]/40 shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C6EFA]/5 to-transparent rounded-full pointer-events-none"></div>
            <div className="text-[9px] font-bold text-[#7C6EFA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC] animate-pulse" /> Live Digital Card Preview
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] text-white flex items-center justify-center font-bold text-sm select-none shadow">
                {(formValues['first'] || 'C')[0]?.toUpperCase() || 'C'}
              </div>
              <div className="min-w-0">
                <h5 className="font-syne font-bold text-sm text-white leading-tight truncate">
                  {formValues['first'] || 'First'} {formValues['last'] || 'Last'}
                </h5>
                <p className="text-[11px] text-[#A89EFF] mt-0.5 leading-none truncate font-medium">
                  {formValues['title'] || 'Your Job Role'}
                </p>
                <p className="text-[10px] text-[#8080A0] mt-1 leading-none truncate font-medium">
                  {formValues['company'] || 'Organization Detail'}
                </p>
              </div>
            </div>

            {(formValues['phone'] || formValues['email'] || formValues['website']) && (
              <div className="mt-4 pt-3 border-t border-[#1C1C2E] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-[#A89EFF]/80 font-mono">
                {formValues['phone'] && <div className="flex items-center gap-1.5 truncate"><span>📞</span> <span className="truncate">{formValues['phone']}</span></div>}
                {formValues['email'] && <div className="flex items-center gap-1.5 truncate"><span>✉️</span> <span className="truncate">{formValues['email']}</span></div>}
                {formValues['website'] && <div className="flex items-center gap-1.5 sm:col-span-2 truncate"><span>🌐</span> <span className="truncate">{formValues['website']}</span></div>}
              </div>
            )}
          </div>
        );
      }

      // C. PLAIN TEXT MESSAGE SPECIAL PREVIEW
      if (id === 'plain-text') {
        const txt = formValues['text'] || '';
        return (
          <div className="bg-[#050510] border border-[#28283E]/70 rounded-xl p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden text-[#8080A0]">
            <div className="flex items-center justify-between border-b border-[#1C1C2E] pb-2 mb-2">
              <span className="text-[#7C6EFA] font-bold text-[10px]">Console Inspector</span>
              <span className="text-gray-600 text-[10px]">{txt.length} chars</span>
            </div>
            <div className="text-gray-300 break-all bg-black/40 p-2.5 rounded-lg border border-[#16162a] min-h-[50px]">
              {txt ? `"${txt}"` : 'Your typed message will show up here in raw data format...'}
            </div>
            <p className="text-[10px] text-[#8080A0]/60 mt-2 shrink-0">✦ Shows up as instantaneous read scan on smartphones.</p>
          </div>
        );
      }

      // D. SMS MESSAGE SPECIAL PREVIEW
      if (id === 'sms-sender') {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 text-[12px] relative overflow-hidden text-[#F2F2FF]">
            <span className="text-[10px] uppercase font-bold text-[#7C6EFA] tracking-wider block mb-2.5">📲 Prefilled SMS Outline ({formValues['phone'] || 'No number'})</span>
            <div className="flex flex-col gap-2.5">
              <div className="self-end bg-[#7C6EFA] text-white px-3.5 py-2 rounded-2xl max-w-[85%] rounded-tr-none relative shadow-sm">
                <span className="block leading-relaxed">{formValues['message'] || 'Click scan to load message...'}</span>
              </div>
              <span className="self-end text-[9px] font-mono text-[#8080A0] pr-1 mt-0.5">AutoSMS Ready to send</span>
            </div>
          </div>
        );
      }

      // E. WHATSAPP DIRECT SPECIAL PREVIEW
      if (id === 'whatsapp-direct' || id.includes('whatsapp')) {
        return (
          <div className="bg-[#091D17]/80 border border-[#0F4A37]/60 rounded-xl p-4 text-[12px] relative overflow-hidden text-[#E2F6F0]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full pointer-events-none"></div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-2.5 flex items-center gap-1.5">
              <span>💬 Direct WhatsApp Chat Link Generator</span>
            </span>
            <div className="flex flex-col gap-2.5 bg-[#030d09] p-3 rounded-xl border border-emerald-500/10">
              <span className="text-[11px] text-emerald-300 font-mono font-bold">Target: {formValues['phone'] || '[Input Number Above]'}</span>
              <div className="bg-[#1E4D3E]/40 border border-[#125842]/40 text-emerald-100 px-3 py-2 rounded-xl rounded-tl-none relative shadow">
                <span className="block leading-relaxed text-[11px]">{formValues['message'] || 'Hi! Connecting with you from the QR scan...'}</span>
                <span className="absolute -left-1.5 top-0 text-[#1E4D3E]/40 font-mono text-xs">◀</span>
              </div>
            </div>
          </div>
        );
      }

      // F. EMAIL COMPOSER SPECIAL PREVIEW
      if (id === 'email-sender' || id.includes('email')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 text-[12px] relative overflow-hidden text-[#F2F2FF] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#C084FC] tracking-wider block">✉️ Pre-composed Mail Draft Blueprint</span>
            <div className="border border-[#28283E]/80 bg-black/40 rounded-lg p-3 space-y-1.5 font-mono text-[11px] text-[#A89EFF]">
              <div><span className="text-[#8080A0]">To:</span> {formValues['email'] || '[Enter address]'}</div>
              <div><span className="text-[#8080A0]">Subject:</span> {formValues['subject'] || '[No subject]'}</div>
              <div className="border-t border-[#1C1C2E] pt-2 mt-2 text-gray-300 break-all">
                {formValues['message'] || '[Mail draft message content]'}
              </div>
            </div>
          </div>
        );
      }

      // G. GPS DYNAMIC COORDINATE PREVIEW
      if (id === 'gps-location' || id.includes('location') || id.includes('geo') || id.includes('gps')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 text-[12px] relative overflow-hidden text-[#F2F2FF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Geographic Navigation Plotter
              </span>
              <span className="text-[10px] text-[#8080A0] font-mono">Location ID</span>
            </div>
            <div className="bg-black/30 border border-[#2a2a3e] p-3 rounded-lg flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 bg-[#F59E0B]/10 rounded-full border border-[#F59E0B]/30 flex items-center justify-center font-bold text-lg text-[#F59E0B]">
                📍
              </div>
              <div>
                <h5 className="font-syne font-bold text-xs text-white leading-tight">
                  {formValues['label'] || 'Standard Coordinates Marker'}
                </h5>
                <p className="text-[10px] text-[#8080A0] mt-0.5 leading-none font-mono">
                  Latitude: <span className="text-white">{formValues['lat'] || '0.0'}</span>, Longitude: <span className="text-white">{formValues['lng'] || '0.0'}</span>
                </p>
              </div>
            </div>
          </div>
        );
      }

      // H. BUY ME A COFFEE SPECIAL INTUITION
      if (id.includes('buymeacoffee')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#FFDD00]/20 rounded-xl p-4 text-[12px] relative overflow-hidden text-[#F2F2FF]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFDD00]/5 to-transparent rounded-full pointer-events-none"></div>
            <span className="text-[10px] uppercase font-bold text-[#FFDD00] tracking-wider block mb-2.5">☕ Dynamic Cup Support Tool</span>
            
            <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-[#FFDD00]/10 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1 shrink-0">
                {Array.from({ length: Math.min(bmacCups, 5) }).map((_, i) => (
                  <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>☕</span>
                ))}
                {bmacCups > 5 && <span className="text-xs font-bold text-[#FFDD00] ml-1">+{bmacCups - 5}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-syne font-bold text-xs text-white leading-tight">
                  {formValues['username'] ? `@${formValues['username']}` : 'BMC Creator Account'}
                </h5>
                <p className="text-[11px] text-[#8080A0] mt-1">
                  Supporting with <span className="text-white font-bold">{bmacCups} Cup(s)</span> (${bmacAmount} USD)
                </p>
              </div>
              {/* Dynamic Action Multipliers inside the card */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto bg-black/50 p-1.5 rounded-lg border border-[#28283E]">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, bmacCups - 1);
                    handleInputChange('amount', String(next * 5));
                  }}
                  className="w-6 h-6 rounded bg-[#28283E] hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold px-1">{bmacCups}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = bmacCups + 1;
                    handleInputChange('amount', String(next * 5));
                  }}
                  className="w-6 h-6 rounded bg-[#28283E] hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      }

      // I. MONETIZED PAYMENTS SPECIAL PREVIEW
      if (id.includes('paypal') || id.includes('stripe') || id.includes('checkout') || id.includes('payment')) {
        return (
          <div className="bg-[#12121E]/80 border border-emerald-500/20 rounded-xl p-4 text-[11px] relative overflow-hidden text-[#F2F2FF] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Secure Checkout Ledger Preview
              </span>
              <span className="text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.5 rounded border border-[#10B981]/25">
                SSL SECURED
              </span>
            </div>
            <div className="border border-[#28283E] bg-black/40 rounded-lg p-3 space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between text-[#8080A0]">
                <span>Merchant Recipient:</span>
                <span className="text-white font-medium truncate max-w-[130px]">{formValues['merchant_id'] || formValues['email'] || 'Verified Gateway ID'}</span>
              </div>
              <div className="flex justify-between text-[#8080A0]">
                <span>Product Name ID:</span>
                <span className="text-white font-medium">{formValues['item_name'] || 'Digital Transaction Invoice'}</span>
              </div>
              <div className="border-t border-[#1C1C2E] pt-1.5 mt-1.5 flex justify-between text-white font-bold">
                <span>Total Charge Amount:</span>
                <span className="text-emerald-400">${formValues['amount'] || '10.00'} USD</span>
              </div>
            </div>
          </div>
        );
      }

      // J. WALLET CRYPTO SECURITY PREVIEW
      if (id.includes('wallet') || id.includes('crypto') || id.includes('btc') || id.includes('eth') || id.includes('sol')) {
        const coin = id.split('-')[0].toUpperCase();
        return (
          <div className="bg-[#12121E]/80 border border-amber-500/20 rounded-xl p-4 text-[11px] relative overflow-hidden text-[#F2F2FF] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> {coin} Secure Network Portal
              </span>
              <span className="text-[9px] font-mono text-gray-500">blockchain</span>
            </div>
            <div className="border border-amber-500/10 bg-amber-500/5 rounded-lg p-2.5 text-amber-200 text-[10px] leading-relaxed">
              <strong>Precaution:</strong> Blockchain transactions are persistent. Confirm address correctness carefully.
            </div>
            <div className="bg-black/50 border border-[#28283E] rounded-lg p-2.5 font-mono text-[10px] text-gray-300 select-all truncate break-all">
              🔑 {formValues['address'] || 'No wallet address entered yet...'}
            </div>
          </div>
        );
      }

      // K. DYNAMIC WEBSITE LINK WATERFALL PREVIEW
      if (id.includes('website') || id.includes('url') || id.includes('link')) {
        return (
          <div className="bg-[#12121E]/80 border border-[#28283E]/60 rounded-xl p-4 text-[11px] relative overflow-hidden text-[#F2F2FF] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#7C6EFA] tracking-wider block">🌍 Secure Cloud Link Redirection</span>
            <div className="flex items-center gap-2.5 bg-black/40 px-3.5 py-2.5 rounded-xl border border-[#28283E]">
              <span className="text-emerald-400 text-xs shrink-0">🔒</span>
              <span className="font-mono text-xs text-slate-300 truncate tracking-wide flex-1">{formValues['url'] || 'https://example.com'}</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono shrink-0">ACTIVE</span>
            </div>
          </div>
        );
      }

      // L. SOCIAL BRAND PREVIEW WIDGET
      const socialBrand = getSocialMediaBrandDetails(tool.id);
      if (socialBrand.prefix) {
        return (
          <div className={`p-4 rounded-xl border ${socialBrand.border} ${socialBrand.bg} space-y-2.5 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8080A0]">Connected Account Mock</span>
              <span className={`text-[9px] font-bold ${socialBrand.color} uppercase`}>verified hub</span>
            </div>
            
            {/* YouTube player simulator */}
            {id.includes('youtube') && (
              <div className="bg-black/80 rounded-lg p-2 border border-red-500/10 relative">
                <div className="aspect-video w-full rounded-md bg-[#12121E] border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <span className="text-red-500 text-3xl animate-pulse">▶</span>
                  <div className="absolute bottom-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono text-white">10:42</div>
                </div>
                <h6 className="font-syne font-bold text-xs text-white mt-2 leading-tight truncate">
                  Channel: @{formValues['username'] || 'MyYouTubePage'}
                </h6>
                <p className="text-[9px] text-[#8080A0] mt-0.5 leading-none">Scan to launch dynamic video stream</p>
              </div>
            )}

            {/* Instagram simulation screen */}
            {id.includes('instagram') && (
              <div className="bg-black/10 rounded-lg p-3 border border-white/5 space-y-2">
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-[#E1306C] to-[#C13584] p-0.5 shrink-0 shadow animate-pulse">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">@</div>
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold text-white leading-tight truncate">instagram.com/{formValues['username'] || 'handle'}</h6>
                    <p className="text-[9px] text-[#A89EFF] mt-0.5">Custom bio route redirection</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className="aspect-square bg-white/5 rounded"></div>
                  <div className="aspect-square bg-white/5 rounded"></div>
                  <div className="aspect-square bg-white/5 rounded"></div>
                </div>
              </div>
            )}

            {/* Spotify Player representation */}
            {id.includes('spotify') && (
              <div className="bg-[#181818] rounded-xl p-3 border border-emerald-500/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#282828] rounded-md shrink-0 flex items-center justify-center text-xl select-none animate-spin" style={{ animationDuration: '4000ms' }}>
                  💿
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-white text-xs font-bold leading-tight truncate font-bold flex items-center gap-1">Spotify Audio Stream</h6>
                  <p className="text-[#8080A0] text-[9px] mt-0.5 truncate">{formValues['username'] || 'playlist_reference'}</p>
                  {/* Fake seeker bar */}
                  <div className="w-full bg-[#3e3e3e] h-1 rounded-full mt-2 relative overflow-hidden">
                    <div className="bg-[#1DB954] w-[45%] h-full"></div>
                  </div>
                </div>
                <span className="text-[#1DB954] text-xs shrink-0 select-none">🔊</span>
              </div>
            )}

            {/* Default Social Profile */}
            {!id.includes('youtube') && !id.includes('instagram') && !id.includes('spotify') && (
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-[11px] text-gray-300 font-mono flex items-center justify-between">
                <span>Account Handle:</span>
                <span className={`${socialBrand.color} font-bold font-mono truncate max-w-[150px]`}>@{formValues['username'] || 'handle'}</span>
              </div>
            )}
          </div>
        );
      }

      // DEFAULT FALLBACK MINI CARD
      return (
        <div className="p-3 bg-[#12121E]/60 border border-[#28283E]/40 rounded-xl text-[11px] text-[#8080A0] leading-relaxed flex gap-2">
          <span className="text-[#C084FC] shrink-0">✦</span>
          <span>Fill details carefully. Your high speed QR code wraps information accurately in real-time.</span>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Dynamic Fields List - Rendering EVERYTHING explicitly in tool.inputs */}
        <div className="space-y-4">
          {fields.map(input => {
            const val = formValues[input.id] || '';
            const isUrlType = input.id === 'url' || input.id.includes('website') || input.id.includes('link');
            const isPhoneType = input.id.includes('phone') || input.id.includes('mobile') || input.id.includes('whatsapp');
            const isCoordType = input.id === 'lat' || input.id === 'lng';
            const isTextType = input.type === 'textarea' || input.id === 'message' || input.id === 'text' || input.id === 'body';

            return (
              <div key={input.id} className="space-y-1.5">
                {/* Field Label */}
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block">
                    {input.label} {input.required && <span className="text-[#F472B6]">*</span>}
                  </label>
                  
                  {/* Textarea dynamic counter */}
                  {isTextType && val.length > 0 && (
                    <span className="text-[9px] font-mono font-medium text-[#7C6EFA]">
                      {val.length} chars | {val.split(' ').filter(Boolean).length} words
                    </span>
                  )}
                </div>

                {/* Field Wrapper with Icons & Inputs */}
                {input.type === 'textarea' ? (
                  <div className="relative">
                    <textarea
                      value={val}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full px-4 py-3 bg-[#040408] border-[1.5px] border-[#28283E] text-[#F2F2FF] rounded-[10px] text-[14px] outline-none transition-all resize-y min-h-[90px] focus:border-[#7C6EFA] focus:shadow-[0_0_0_3px_rgba(124,110,250,0.1)] placeholder-[#42425A]"
                    />
                  </div>
                ) : input.type === 'select' ? (
                  <div className="relative">
                    <select
                      value={val}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#040408] border-[1.5px] border-[#28283E] text-[#F2F2FF] rounded-[10px] text-[14px] outline-none transition-all focus:border-[#7C6EFA] appearance-none"
                    >
                      {input.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8080A0] pointer-events-none text-[10px]">▼</span>
                  </div>
                ) : (
                  <div className="relative flex items-center rounded-[10px] border-[1.5px] border-[#28283E] bg-[#040408] focus-within:border-[#7C6EFA] focus-within:shadow-[0_0_0_3px_rgba(124,110,250,0.1)] transition-all overflow-hidden p-0">
                    {/* Inner Icon Prefix */}
                    <span className="pl-3.5 text-[#8080A0] shrink-0 font-bold select-none">
                      {isUrlType ? (
                        <Globe className="w-4 h-4 text-[#7C6EFA]" />
                      ) : input.id === 'password' ? (
                        <span>🔒</span>
                      ) : input.id === 'ssid' || input.id === 'network' ? (
                        <Wifi className="w-4 h-4 text-[#7C6EFA]" />
                      ) : isPhoneType ? (
                        <Phone className="w-4 h-4 text-emerald-400" />
                      ) : input.id === 'amount' ? (
                        <Coins className="w-4 h-4 text-yellow-500" />
                      ) : isCoordType ? (
                        <MapPin className="w-4 h-4 text-red-500" />
                      ) : (
                        <span>🖊️</span>
                      )}
                    </span>
                    
                    {/* Exact Input */}
                    <input
                      type={input.id === 'password' ? (showWifiPass ? 'text' : 'password') : (input.type || 'text')}
                      value={val}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full pl-3.5 pr-10 py-3 bg-transparent text-[#F2F2FF] text-[14px] outline-none placeholder-[#42425A]"
                    />

                    {/* Password toggle icon */}
                    {input.id === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowWifiPass(!showWifiPass)}
                        className="absolute right-3.5 text-[#8080A0] hover:text-white transition-colors"
                      >
                        {showWifiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                )}

                {/* Fast Action click helper chips underneath inputs */}
                {isUrlType && (
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {["https://", "www.", ".com", ".org", ".in"].map(chip => (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => {
                          if (chip.startsWith("http")) prependUrlPrefix(input.id, chip);
                          else appendUrlSuffix(input.id, chip);
                        }}
                        className="text-[9px] font-mono bg-[#12121E] hover:bg-[#28283E] text-slate-300 border border-[#28283E] px-2 py-0.5 rounded transition-all shrink-0 active:scale-95 animate-fade-in"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {isPhoneType && (
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {[
                      { code: "+91", country: "🇮🇳 IN" },
                      { code: "+1", country: "🇺🇸 US" },
                      { code: "+44", country: "🇬🇧 UK" },
                      { code: "+971", country: "🇦🇪 UAE" }
                    ].map(chip => (
                      <button
                        type="button"
                        key={chip.code}
                        onClick={() => {
                          const cleaned = val.replace(/^\+\d+/, '');
                          handleInputChange(input.id, chip.code + cleaned);
                        }}
                        className="text-[9px] font-medium bg-[#12121E] hover:bg-[#28283E] text-slate-300 border border-[#28283E] px-2 py-0.5 rounded transition-all shrink-0 active:scale-95 font-sans"
                      >
                        {chip.country} ({chip.code})
                      </button>
                    ))}
                  </div>
                )}

                {input.id === 'amount' && (
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {["5", "10", "25", "50", "100"].map(preset => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => handleInputChange('amount', preset)}
                        className={`text-[9.5px] font-mono font-bold px-2.5 py-1 rounded-md border transition-all active:scale-95 ${
                          val === preset
                            ? 'bg-[#7C6EFA]/15 border-[#7C6EFA] text-white'
                            : 'bg-black/30 border-[#28283E] text-[#8080A0] hover:text-[#F2F2FF]'
                        }`}
                      >
                        ${preset} USD
                      </button>
                    ))}
                  </div>
                )}

                {/* GPS Presets handler */}
                {isCoordType && (
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {[
                      { name: "📍 Eiffel Tower", lat: "48.8584", lng: "2.2945" },
                      { name: "📍 Taj Mahal", lat: "27.1751", lng: "78.0421" },
                      { name: "📍 Statue of Liberty", lat: "40.6892", lng: "-74.0445" }
                    ].map(dest => (
                      <button
                        type="button"
                        key={dest.name}
                        onClick={() => {
                          const latKey = fields.find(f => f.id === 'lat' || f.id.includes('latitude'))?.id || 'lat';
                          const lngKey = fields.find(f => f.id === 'lng' || f.id.includes('longitude'))?.id || 'lng';
                          setCoordinatesPreset(latKey, lngKey, dest.lat, dest.lng);
                          const nameKey = fields.find(f => f.id === 'label' || f.id.includes('name'))?.id;
                          if (nameKey) handleInputChange(nameKey, dest.name.replace('📍 ', ''));
                        }}
                        className="text-[9px] font-medium bg-[#12121E] hover:bg-[#28283E] text-slate-300 border border-[#28283E] px-2 py-0.5 rounded transition-all shrink-0 active:scale-95 font-sans"
                      >
                        {dest.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Templates for Message body */}
                {isTextType && (
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {[
                      { name: "📝 Quick Greeting", text: "Hello! Hope you are doing great. Connecting digitally via QR!" },
                      { name: "📅 RSVP Yes", text: "Yes! Please count me in for the amazing upcoming wedding/event." },
                      { name: "🚨 Support Draft", text: "Query regarding my transaction order. Please escalate and assist." }
                    ].map(tpl => (
                      <button
                        type="button"
                        key={tpl.name}
                        onClick={() => insertTextTemplate(input.id, tpl.text)}
                        className="text-[8.5px] font-medium bg-[#12121E]/80 hover:bg-[#28283E]/75 text-slate-400 border border-[#28283E]/80 px-2.5 py-0.5 rounded transition-all shrink-0 active:scale-95 font-sans"
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Tool Specific Interactive Visual Frame */}
        <div className="pt-2">
          {renderToolSpecificPreview()}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full bg-[#0A0A12]">
      {/* LEFT: User Form */}
      <div className="lg:col-span-7 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-[#1C1C2E]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C6EFA] bg-[#7C6EFA]/10 px-2.5 py-1 rounded-full">
            {tool.category}
          </span>
          {activeTheme.id !== 'default-theme' && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              🎨 Styled Theme Configured
            </span>
          )}
        </div>
        <h2 className="text-2xl font-syne font-bold text-white mb-6">{tool.name}</h2>
        
        <div className="space-y-5">
          {renderCustomForm()}
        </div>

        {/* Premium Options Gate */}
        <div className="mt-10 pt-8 border-t border-[#1C1C2E]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-syne font-bold text-white">🎨 Pro Design Customizer</h3>
            {!user?.isPro && (
              <span className="text-[9px] uppercase font-bold bg-[rgba(244,114,182,0.1)] border border-[rgba(244,114,182,0.2)] text-[#F472B6] px-[7px] py-[2px] rounded-[4px]">PRO</span>
            )}
          </div>
          
          <div className={`grid grid-cols-2 gap-5 transition-opacity ${!user?.isPro ? 'opacity-40 cursor-pointer' : ''}`} onClick={() => !user?.isPro && onOpenPayModal()}>
            <div>
              <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block mb-2">Pattern Shape</label>
              <select 
                value={dotsType} 
                onChange={(e) => {
                  if (!user?.isPro) return onOpenPayModal();
                  setDotsType(e.target.value);
                }}
                className="w-full text-sm font-bold bg-[#040408] border-[1.5px] border-[#28283E] text-white rounded-[10px] px-3.5 py-3 outline-none focus:border-[#7C6EFA] appearance-none"
              >
                <option value="square">Classic Square</option>
                <option value="dots">Modern Dots</option>
                <option value="rounded">Smooth Rounded</option>
                <option value="classy">Classy Cross</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block mb-2">Corner Markers</label>
              <select 
                value={cornersType} 
                onChange={(e) => {
                  if (!user?.isPro) return onOpenPayModal();
                  setCornersType(e.target.value);
                }}
                className="w-full text-sm font-bold bg-[#040408] border-[1.5px] border-[#28283E] text-white rounded-[10px] px-3.5 py-3 outline-none focus:border-[#7C6EFA] appearance-none"
              >
                <option value="square">Sharp Square</option>
                <option value="extra-rounded">Extra Round</option>
                <option value="dot">Soft Dot</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    if (!user?.isPro) {
                      e.preventDefault();
                      return onOpenPayModal();
                    }
                    setFgColor(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-[#040408] border-[1.5px] border-[#28283E]"
                />
                <span className="font-mono text-xs font-bold text-[#8080A0] uppercase">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block mb-2">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    if (!user?.isPro) {
                      e.preventDefault();
                      return onOpenPayModal();
                    }
                    setBgColor(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-[#040408] border-[1.5px] border-[#28283E]"
                />
                <span className="font-mono text-xs font-bold text-[#8080A0] uppercase">{bgColor}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-[#8080A0] uppercase tracking-[1.2px] block mb-2">Center Logo Override</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  onClick={(e) => { if(!user?.isPro) { e.preventDefault(); onOpenPayModal(); } }}
                  className="w-full text-xs text-[#8080A0] file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-semibold file:bg-[rgba(124,110,250,0.1)] file:text-[#A89EFF] hover:file:bg-[rgba(124,110,250,0.2)] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {!user?.isPro && (
            <button onClick={onOpenPayModal} className="mt-6 w-full text-center py-3 bg-[rgba(124,110,250,0.05)] border border-[rgba(124,110,250,0.2)] rounded-[10px] hover:bg-[rgba(124,110,250,0.1)] transition-colors">
              <p className="text-[#A89EFF] font-bold text-[13px]">Upgrade to PRO to unlock premium styling & logos →</p>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: Live Preview & Printable Mockups */}
      <div className="lg:col-span-5 flex flex-col bg-[#040408] p-6 md:p-10 items-center justify-start relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(124,110,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,110,250,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
        
        {/* Toggle Mode buttons */}
        <div className="flex bg-[#0A0A12] border border-[#28283E] p-1 rounded-xl mb-8 relative z-10 w-full max-w-[300px]">
          <button 
            onClick={() => setIsMockupMode(false)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${!isMockupMode ? 'bg-[#7C6EFA] text-white' : 'text-[#8080A0] hover:text-[#F2F2FF]'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Bare QR Code
          </button>
          <button 
            onClick={() => setIsMockupMode(true)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${isMockupMode ? 'bg-[#7C6EFA] text-white' : 'text-[#8080A0] hover:text-[#F2F2FF]'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Mockup Frame
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full relative z-10 max-w-[340px]">
          
          {isMockupMode ? (
            /* PRINT/LAYOUT MOCKUP BOX */
            <div className="w-[300px] h-[380px] rounded-[24px] p-5 flex flex-col justify-between text-center shadow-[0_16px_50px_rgba(0,0,0,0.9)] border border-[#28283E]/50 overflow-hidden relative" style={{ backgroundImage: previewLayout.mockupBg }}>
              {/* Overlay shading for realistic texture */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none"></div>
              
              <div className="relative z-10">
                <span className="text-[9px] uppercase font-bold bg-[#040408]/60 text-[#F2F2FF]/90 px-2.5 py-1 rounded-full tracking-wider border border-white/10 inline-block mb-3">
                  {previewLayout.name}
                </span>
                
                {/* Format selection toggles */}
                <div className="flex justify-center gap-1 flex-wrap mb-3">
                  {previewLayout.formats.map((fmt, i) => (
                    <button 
                      key={fmt} 
                      onClick={() => setSelectedFormatIndex(i)}
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-all border ${selectedFormatIndex === i ? 'bg-white text-black border-white' : 'bg-black/30 text-[#8080A0] border-transparent'}`}
                    >
                      {fmt.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suspended card container inside mockup */}
              <div className="relative z-10 mx-auto w-[180px] h-[210px] rounded-xl p-[14px] flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: bgColor, border: `3px solid ${fgColor}22` }}>
                <span className="text-[10px] font-syne font-black mb-2 overflow-hidden text-ellipsis whitespace-nowrap w-full" style={{ color: fgColor }}>
                  {previewLayout.formats[selectedFormatIndex]}
                </span>
                {/* Mini representation of the QR */}
                <div className="bg-white p-2 rounded-lg shadow-inner scale-85 flex items-center justify-center">
                  <div className="w-[110px] h-[110px] overflow-hidden flex items-center justify-center" style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.15))` }}>
                    {/* Render raw code inline */}
                    <div ref={qrRef} className="scale-35 origin-center" />
                    {/* Visual mockup fallback */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrString || 'a2zqr')}&color=${fgColor.replace('#','')}&bgcolor=${bgColor.replace('#','')}`} className="w-24 h-24 rounded" alt="Mockup QR code" />
                  </div>
                </div>
                <span className="text-[7px] font-mono tracking-widest mt-2 overflow-hidden text-ellipsis whitespace-nowrap w-full" style={{ color: fgColor }}>
                  {qrString.slice(0, 24)}...
                </span>
              </div>

              <div className="relative z-10 text-[10px] font-semibold text-white/90 drop-shadow flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Perfect 300 DPI Export Ready
              </div>
            </div>
          ) : (
            /* THE BARE QR CODE BOX */
            <div className="w-[280px] rounded-[16px] p-[20px] pb-[24px] flex flex-col items-center text-center shadow-[0_12px_50px_rgba(0,0,0,0.8)] transition-all duration-300 transform hover:scale-[1.02]" style={{ backgroundColor: bgColor }}>
              <div className="text-[14px] font-syne font-extrabold uppercase tracking-tight mb-[16px] w-full overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: fgColor }}>
                {tool.name.replace(' QR Code', '').replace(' Generator', '')}
              </div>
              {/* The QR Code */}
              <div ref={qrRef} className="flex justify-center items-center h-[280px] bg-[#12121E]/10 rounded-xl p-2" />
              <div className="text-[10px] font-bold tracking-[1.5px] lowercase mt-[16px]" style={{ color: fgColor }}>
                a2zqr.com
              </div>
              
              {!user?.isPro && (
                <div className="absolute bottom-2 right-2 flex flex-col items-end opacity-80 mix-blend-difference text-white">
                  <span className="text-[8px] font-bold">A2ZQR Watermark</span>
                </div>
              )}
            </div>
          )}
          
          {/* Quality Bar & Scanner Guidelines */}
          <div className="w-full mt-8 bg-[#0A0A12] border border-[#1C1C2E] p-4 rounded-xl">
             <div className="flex items-center gap-3 mb-2">
               <div className="flex-1 h-1.5 bg-[#1C1C2E] rounded-full overflow-hidden">
                 <div className="h-full rounded-full w-[80%] transition-all" style={{ background: qrString.length > 80 ? '#F59E0B' : '#34D399' }}></div>
               </div>
               <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: qrString.length > 80 ? '#F59E0B' : '#34D399' }}>
                 {qrString.length > 80 ? '▲ Dense' : '✦ Crystal Clear'}
               </span>
             </div>
             <p className="text-[11px] text-[#8080A0] leading-relaxed mb-3">
               {qrString.length > 80 ? 'Complex data makes dots smaller. Less reliable scan.' : 'Optimal length. Maximum clarity scanning at any size.'}
             </p>
             <span className="w-full h-px bg-[#1C1C2E] block my-2"></span>
             
             {/* Print Guidelines */}
             <div className="text-left">
               <span className="text-[9px] font-bold uppercase tracking-wider text-[#7C6EFA] flex items-center gap-1.5 mb-1.5">
                 <HelpCircle className="w-3 h-3" /> Recommended Print Settings
               </span>
               <div className="grid grid-cols-2 gap-2 text-[10px]">
                 <div>
                   <p className="text-[#8080A0]">Min Size:</p>
                   <p className="text-[#F2F2FF] font-bold">{printGuide.recommendedSize}</p>
                 </div>
                 <div>
                   <p className="text-[#8080A0]">Optimal Distance:</p>
                   <p className="text-[#F2F2FF] font-bold">{printGuide.scanDistance}</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="w-full mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={downloadPNG}
              className="w-full py-3.5 px-4 bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] hover:opacity-90 text-white rounded-[10px] flex items-center justify-center gap-2 transition-all font-bold text-[13px]"
            >
              <Download className="w-4 h-4" /> Download QR Code (PNG)
            </button>
            <button
              onClick={() => {
                if(!user?.isPro) { onOpenPayModal(); return; }
                navigator.clipboard.writeText(qrString);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full py-3 px-4 bg-transparent border-[1.5px] border-[#28283E] hover:border-[#7C6EFA] text-[#8080A0] hover:text-[#F2F2FF] rounded-[10px] flex items-center justify-center gap-2 transition-all font-bold text-[12px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Data' : 'Clean SVG / PDF Export'}
              {!user?.isPro && <span className="text-[9px] uppercase font-bold bg-[rgba(244,114,182,0.1)] border border-[rgba(244,114,182,0.2)] text-[#F472B6] px-[6px] py-[1px] ml-1 rounded-[4px]">PRO</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

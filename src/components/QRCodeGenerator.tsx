import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { QRTool } from '../data/tools';
import { UserStats } from '../lib/firebase';

interface QRCodeGeneratorProps {
  tool: QRTool;
  user: UserStats | null;
  onOpenPayModal: () => void;
}

export default function QRCodeGenerator({ tool, user, onOpenPayModal }: QRCodeGeneratorProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [qrString, setQrString] = useState<string>('');
  
  // Customization
  const [logoFile, setLogoFile] = useState<string>('');
  const [dotsType, setDotsType] = useState<any>('rounded');
  const [cornersType, setCornersType] = useState<any>('extra-rounded');
  const [fgColor, setFgColor] = useState('#F2F2FF');
  const [bgColor, setBgColor] = useState('#0A0A12');
  
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Sync inputs
  useEffect(() => {
    const defaults: Record<string, string> = {};
    tool.inputs.forEach(input => {
      defaults[input.key] = input.defaultValue || '';
    });
    setFormValues(defaults);
  }, [tool]);

  // Generate String
  useEffect(() => {
    const keys = Object.keys(formValues);
    if (keys.length > 0) {
      try {
        const generated = tool.generateQRString(formValues);
        setQrString(generated || 'Welcome User');
      } catch (e) {
        setQrString('Error processing inputs');
      }
    }
  }, [formValues, tool]);

  // Initialize QR Code Styling instance
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

  // Update QR Code visual when options change
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
      // Free users can't add custom logos
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
    qrCode.current?.download({
      extension: 'png',
      name: `qr-code-${Date.now()}`
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full bg-[#0A0A12]">
      {/* LEFT: User Form */}
      <div className="lg:col-span-7 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-[#1C1C2E]">
        <h2 className="text-2xl font-syne font-bold text-white mb-6">{tool.name}</h2>
        <div className="space-y-5">
          {tool.inputs.map((input) => (
            <div key={input.key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block">
                {input.label} {input.isRequired && <span className="text-rose-500">*</span>}
              </label>
              {input.type === 'textarea' ? (
                <textarea
                  value={formValues[input.key] || ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full px-3.5 py-3 bg-[#040408] border-[1.5px] border-[#28283E] text-[#F2F2FF] rounded-[10px] text-[14px] outline-none transition-all resize-y min-h-[100px] focus:border-[#7C6EFA] focus:shadow-[0_0_0_3px_rgba(124,110,250,0.1)] placeholder-[#42425A]"
                />
              ) : (
                <input
                  type={input.type || 'text'}
                  value={formValues[input.key] || ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full px-3.5 py-3 bg-[#040408] border-[1.5px] border-[#28283E] text-[#F2F2FF] rounded-[10px] text-[14px] outline-none transition-all focus:border-[#7C6EFA] focus:shadow-[0_0_0_3px_rgba(124,110,250,0.1)] placeholder-[#42425A]"
                />
              )}
            </div>
          ))}
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
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block mb-2">Pattern Shape</label>
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
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block mb-2">Corner Markers</label>
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
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block mb-2">Primary Color</label>
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
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block mb-2">Background Color</label>
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
              <label className="text-[10px] font-bold text-[#42425A] uppercase tracking-[1.2px] block mb-2">Center Logo Override</label>
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

      {/* RIGHT: Live Preview & Download */}
      <div className="lg:col-span-5 flex flex-col bg-[#040408] p-6 md:p-10 items-center justify-center relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(124,110,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,110,250,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
        
        <div className="flex flex-col items-center justify-center w-full relative z-10 max-w-[340px]">
          
          <div className="w-[260px] rounded-[16px] p-[20px] pb-[24px] flex flex-col items-center text-center shadow-[0_12px_50px_rgba(0,0,0,0.8)] transition-all duration-300 transform hover:scale-[1.02]" style={{ backgroundColor: bgColor }}>
            <div className="text-[14px] font-syne font-extrabold uppercase tracking-tight mb-[16px] w-full overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: fgColor }}>
              A2Z GENERATOR
            </div>
            {/* The QR Code */}
            <div ref={qrRef} className="flex justify-center items-center h-[280px]" />
            <div className="text-[10px] font-bold tracking-[1.5px] lowercase mt-[16px]" style={{ color: '#7C6EFA' }}>
              a2zqr.com
            </div>
            
            {!user?.isPro && (
              <div className="absolute bottom-2 right-2 flex flex-col items-end opacity-80 mix-blend-difference text-white">
                <span className="text-[8px] font-bold">A2ZQR Watermark</span>
              </div>
            )}
          </div>
          
          {/* Quality Bar */}
          <div className="w-full mt-8 bg-[#0A0A12] border border-[#1C1C2E] p-4 rounded-xl">
             <div className="flex items-center gap-3 mb-2">
               <div className="flex-1 h-1.5 bg-[#1C1C2E] rounded-full overflow-hidden">
                 <div className="h-full rounded-full w-[80%] transition-all" style={{ background: qrString.length > 80 ? '#F59E0B' : '#34D399' }}></div>
               </div>
               <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: qrString.length > 80 ? '#F59E0B' : '#34D399' }}>
                 {qrString.length > 80 ? '▲ Dense' : '✦ Crystal Clear'}
               </span>
             </div>
             <p className="text-[11px] text-[#42425A] leading-relaxed">
               {qrString.length > 80 ? 'Complex data makes dots smaller. Less reliable scan.' : 'Optimal length. Maximum clarity scanning at any size.'}
             </p>
          </div>

          <div className="w-full mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={downloadPNG}
              className="w-full py-3.5 px-4 bg-gradient-to-br from-[#7C6EFA] to-[#C084FC] hover:opacity-90 text-white rounded-[10px] flex items-center justify-center gap-2 transition-all font-bold text-[13px]"
            >
              <Download className="w-4 h-4" /> Download Poster PNG
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

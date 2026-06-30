import React, { useEffect, useRef } from 'react';
import { cn } from './lib/utils';
import { 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  Image,
  FileText
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

// --- UI PRIMITIVES ---

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';
    
    const variants = {
      primary: 'bg-[var(--ez-text-primary)] text-[var(--ez-bg-primary)] hover:opacity-90',
      secondary: 'bg-[var(--ez-bg-elevated)] text-[var(--ez-text-primary)] border border-[var(--ez-border-default)] hover:bg-[var(--ez-bg-highlight)]',
      ghost: 'bg-transparent text-[var(--ez-text-muted)] hover:bg-[var(--ez-bg-elevated)]',
      danger: 'bg-[var(--ez-error)] text-white hover:opacity-90',
      gradient: 'bg-ez-gradient text-white hover:opacity-90 shadow-[var(--ez-shadow-glow)]'
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs',
      md: 'h-11 px-6 text-sm',
      lg: 'h-14 px-8 text-base'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'bg-[var(--ez-bg-surface)] rounded-2xl border';
    
    const variants = {
      default: 'border-[var(--ez-border-default)] shadow-[var(--ez-shadow-sm)]',
      elevated: 'border-[var(--ez-border-strong)] shadow-[var(--ez-shadow-md)] bg-[var(--ez-bg-elevated)]',
      interactive: 'border-[var(--ez-border-default)] shadow-[var(--ez-shadow-sm)] hover:shadow-[var(--ez-shadow-md)] hover:border-[var(--ez-border-focus)] transition-all cursor-pointer'
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const isInteractive = variant === 'interactive' || props.onClick;
    const Component = isInteractive ? 'button' : 'div';
    
    return (
      <Component
        ref={ref as any}
        className={cn(baseStyles, variants[variant], paddings[padding], isInteractive && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ez-border-focus)] focus-visible:ring-offset-2 text-left w-full", className)}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);
Card.displayName = 'Card';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
    
    const variants = {
      default: 'bg-slate-100 text-slate-800',
      success: 'bg-emerald-100 text-emerald-800',
      warning: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };

    return (
      <span ref={ref} className={cn(baseStyles, variants[variant], className)} {...props}>
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightElement, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="text-[10px] uppercase font-mono font-bold text-[var(--ez-text-muted)] tracking-[1.2px] block">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ez-text-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "w-full bg-[var(--ez-bg-surface)] border border-[var(--ez-border-default)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ez-border-focus)] focus:border-[var(--ez-border-focus)] transition-all text-[var(--ez-text-primary)]",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              error && "border-[var(--ez-error)] focus:border-[var(--ez-error)] focus:ring-[var(--ez-error)]/20",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--ez-error)]">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-[var(--ez-text-muted)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={selectId} className="text-[10px] uppercase font-mono font-bold text-[var(--ez-text-muted)] tracking-[1.2px] block">{label}</label>}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              "w-full bg-[var(--ez-bg-surface)] border border-[var(--ez-border-default)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ez-border-focus)] focus:border-[var(--ez-border-focus)] transition-all appearance-none text-[var(--ez-text-primary)]",
              error && "border-[var(--ez-error)]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ez-text-muted)] pointer-events-none text-[10px]">▼</span>
        </div>
        {error && <p className="text-xs text-[var(--ez-error)]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export const Spinner = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <Loader2 className={cn("animate-spin text-slate-400", sizes[size], className)} />;
};

export const EmptyState = ({ icon, title, description, action }: any) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 mb-6 max-w-md">{description}</p>
    {action}
  </div>
);

export const Modal = ({ isOpen, onClose, title, size = 'md', showClose = true, fullScreenOnMobile = true, children }: any) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  
  return (
    <div className={cn("fixed inset-0 z-[var(--ez-z-modal,100)] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm", !reducedMotion && "animate-in fade-in duration-200")}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={cn("bg-white w-full shadow-xl overflow-hidden flex flex-col", sizes[size as keyof typeof sizes], fullScreenOnMobile !== false ? "md:max-h-[90vh] max-h-screen md:rounded-2xl rounded-none md:m-0 fixed inset-0 md:inset-auto" : "max-h-[90vh] rounded-2xl", !reducedMotion && "zoom-in-95")}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h2>
          {showClose && (
            <button onClick={onClose} aria-label="Close modal" className="p-2.5 rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange, variant = 'underline' }: any) => {
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIdx = tabs.findIndex((t: any) => t.id === activeTab);
    let nextIdx = currentIdx;
    
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIdx = (currentIdx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = tabs.length - 1;
    }
    
    if (nextIdx !== currentIdx) {
      onChange(tabs[nextIdx].id);
      const buttons = tabsRef.current?.querySelectorAll('[role="tab"]');
      (buttons?.[nextIdx] as HTMLElement)?.focus();
    }
  };

  if (variant === 'pills') {
    return (
      <div ref={tabsRef} role="tablist" onKeyDown={handleKeyDown} className="flex gap-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab: any, idx: number) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ez-border-focus)] focus-visible:ring-offset-2",
              activeTab === tab.id 
                ? "bg-slate-900 text-white" 
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={tabsRef} role="tablist" onKeyDown={handleKeyDown} className="flex gap-6 border-b border-slate-200">
      {tabs.map((tab: any, idx: number) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          className={cn(
            "pb-3 min-h-[44px] text-sm font-bold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ez-border-focus)] focus-visible:ring-offset-2",
            activeTab === tab.id 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// --- LAYOUT ---
export const Navigation = ({ brandName, onGetStarted }: any) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
          {brandName.substring(0, 3).toUpperCase()}
        </div>
        {brandName}
      </div>
      <Button variant="primary" size="sm" onClick={onGetStarted}>
        Get Started
      </Button>
    </div>
  </nav>
);

export const Footer = ({ brandName = "EzQR", tagline = "Bridge the physical and digital, instantly." }: any) => (
  <footer className="py-12 bg-slate-50 border-t border-slate-200 mt-20 text-center">
    <h3 className="font-bold text-xl text-slate-900 mb-2">{brandName}</h3>
    <p className="text-slate-500 text-sm">{tagline}</p>
  </footer>
);

export const Sidebar = ({ 
  items, 
  activeItem, 
  onItemClick, 
  isOpen, 
  onClose, 
  title 
}: {
  items: { id: string; label: string; icon?: React.ReactNode; badge?: string | number }[];
  activeItem: string;
  onItemClick: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}) => {
  // Mobile overlay
  if (!isOpen) return null;
  
  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar panel */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 z-50",
        "bg-[var(--ez-bg-primary)] border-r border-[var(--ez-border-default)]",
        "flex flex-col",
        "transform transition-transform duration-300",
        // Mobile: slide from left
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-[var(--ez-border-default)]">
            <h2 className="font-bold text-[var(--ez-text-primary)]">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--ez-text-dim)] hover:text-[var(--ez-text-primary)] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                "min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ez-border-focus)]",
                activeItem === item.id
                  ? "bg-[var(--ez-bg-elevated)] text-[var(--ez-text-primary)] border border-[var(--ez-border-focus)]"
                  : "text-[var(--ez-text-muted)] hover:text-[var(--ez-text-primary)] hover:bg-[var(--ez-bg-highlight)]"
              )}
              aria-current={activeItem === item.id ? 'page' : undefined}
            >
              {item.icon && <span className="w-5 h-5 shrink-0">{item.icon}</span>}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--ez-accent-primary)]/10 text-[var(--ez-accent-primary)]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

// --- DOMAIN ---
export const ToolCard = ({ tool, isActive, onClick }: any) => (
  <Card 
    variant="interactive" 
    padding="sm" 
    className={cn(isActive && "border-blue-500 ring-1 ring-blue-500")}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-lg", isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
        {tool.icon && <tool.icon className="w-5 h-5" />}
      </div>
      <span className="font-semibold text-sm text-slate-900">{tool.name}</span>
    </div>
  </Card>
);

export const TemplateCard = ({ template, isSelected, onSelect }: any) => (
  <Card variant="interactive" padding="none" className={cn("overflow-hidden group", isSelected && "ring-2 ring-blue-500")} onClick={onSelect}>
    <div className="aspect-[3/4] relative bg-slate-100">
       <img src={template.thumbnail || template.previewUrl || "https://placehold.co/400x600/f8fafc/94a3b8?text=Template"} alt={template.title} className="w-full h-full object-cover" />
       {template.premium && (
         <div className="absolute top-2 right-2">
           <Badge variant="premium">PRO</Badge>
         </div>
       )}
    </div>
    <div className="p-3">
      <p className="text-sm font-bold text-slate-900 truncate">{template.title}</p>
    </div>
  </Card>
);

export const QRPreview = ({ 
  qrString, 
  fgColor = '#000000', 
  bgColor = '#FFFFFF', 
  label, 
  size = 200,
  showPrintGuide = false,
  dotsType = 'square',
  cornersType = 'square',
  logo,
  errorLevel = 'H'
}: {
  qrString: string;
  fgColor?: string;
  bgColor?: string;
  label?: string;
  size?: number;
  showPrintGuide?: boolean;
  dotsType?: 'square' | 'dots' | 'rounded' | 'classy';
  cornersType?: 'square' | 'extra-rounded' | 'dot';
  logo?: string;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !qrString) return;
    
    // Clean previous instance
    containerRef.current.innerHTML = '';
    
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: qrString,
      dotsOptions: { color: fgColor, type: dotsType },
      cornersSquareOptions: { color: fgColor, type: cornersType },
      backgroundOptions: { color: bgColor },
      image: logo || undefined,
      qrOptions: { errorCorrectionLevel: errorLevel },
    });
    
    qr.append(containerRef.current);
    qrInstance.current = qr;
    
    return () => { if (containerRef.current) containerRef.current.innerHTML = ''; };
  }, [qrString, fgColor, bgColor, size, dotsType, cornersType, logo, errorLevel]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        ref={containerRef}
        className="rounded-2xl p-4 bg-white shadow-[var(--ez-shadow-md)]"
        style={{ width: size + 32, height: size + 32 }}
      />
      {label && (
        <span className="text-xs font-bold text-[var(--ez-text-muted)]">{label}</span>
      )}
      {showPrintGuide && (
        <div className="text-[10px] text-[var(--ez-text-dim)] bg-[var(--ez-bg-surface)] px-3 py-2 rounded-lg border border-[var(--ez-border-default)]">
          Min print size: 1.2" × 1.2" (3×3 cm)
        </div>
      )}
    </div>
  );
};
export const DownloadButtons = ({
  onDownloadPNG,
  onExportSVG,
  onExportPDF,
  onExportEPS,
  qrString,
  isPro,
  onOpenPayModal,
  isLoading
}: {
  onDownloadPNG?: () => void;
  onExportSVG?: () => void;
  onExportPDF?: () => void;
  onExportEPS?: () => void;
  qrString?: string;
  isPro?: boolean;
  onOpenPayModal?: () => void;
  isLoading?: boolean;
}) => {
  const downloadOptions = [
    {
      key: 'png',
      label: 'PNG',
      desc: isPro ? 'High-res 300dpi' : 'With watermark',
      icon: <Image className="w-4 h-4" />,
      pro: false,
      action: onDownloadPNG,
    },
    {
      key: 'svg',
      label: 'SVG',
      desc: 'Vector — scale to any size',
      icon: <FileText className="w-4 h-4" />,
      pro: true,
      action: onExportSVG,
    },
    {
      key: 'pdf',
      label: 'PDF',
      desc: 'Print-ready A4 with crop marks',
      icon: <FileText className="w-4 h-4" />,
      pro: true,
      action: onExportPDF,
    },
    {
      key: 'eps',
      label: 'EPS',
      desc: 'Professional print industry standard',
      icon: <FileText className="w-4 h-4" />,
      pro: true,
      action: onExportEPS,
    },
  ];

  const handleClick = (opt: typeof downloadOptions[0]) => {
    if (opt.pro && !isPro) {
      onOpenPayModal?.();
      return;
    }
    opt.action?.();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ez-text-muted)]">
        Download
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {downloadOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => handleClick(opt)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
              "min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ez-border-focus)]",
              opt.pro && !isPro
                ? "border-[var(--ez-border-default)] bg-[var(--ez-bg-surface)] opacity-60 hover:opacity-100"
                : "border-[var(--ez-border-strong)] bg-[var(--ez-bg-elevated)] hover:border-[var(--ez-border-focus)]"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              opt.pro && !isPro ? "bg-[var(--ez-bg-highlight)]" : "bg-[var(--ez-accent-primary)]/10"
            )}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--ez-text-primary)]">{opt.label}</div>
              <div className="text-[10px] text-[var(--ez-text-dim)]">{opt.desc}</div>
            </div>
            {opt.pro && !isPro && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--ez-accent-primary)]/10 text-[var(--ez-accent-primary)]">
                PRO
              </span>
            )}
          </button>
        ))}
      </div>
      {!isPro && (
        <button
          onClick={onOpenPayModal}
          className="w-full text-center text-[11px] font-bold text-[var(--ez-accent-primary)] hover:underline"
        >
          Upgrade to Pro for SVG, PDF, EPS & high-res
        </button>
      )}
    </div>
  );
};

export * from './components/ui';
export * from './components/layout';

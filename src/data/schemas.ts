export interface Field {
  id: string;
  label: string;
  type: 'text' | 'password' | 'textarea' | 'select' | 'number' | 'email' | 'tel' | 'url';
  required: boolean;
  maxLength?: number;
  placeholder: string;
  validation?: string; // e.g. "url", "wifi_ssid", "phone", "crypto_address", "email"
  options?: string[]; // for select dropdowns
  defaultValue?: string;
}

export interface FieldGroup {
  id: string; // e.g. "contact_basic"
  name: string; // e.g. "Contact Basic Details"
  fields: Field[];
}

export interface FormConfig {
  id: string; // e.g. "wifi_form", "wedding_rsvp_form"
  title: string;
  fields: Field[];
  fieldGroupIds?: string[]; // references field groups for modular building
}

export interface ThemeConfig {
  id: string; // e.g. "rose-wedding", "emerald-lux"
  name: string;
  primaryColor: string; // Hex code
  bgColor: string;      // Hex code
  secondaryColor?: string;
  textColor?: string;
}

export interface QRStyleConfig {
  id: string; // e.g. "liquid", "sharp-classic", "soft-orbit"
  dots: 'square' | 'dots' | 'rounded' | 'classy';
  corners: 'square' | 'extra-rounded' | 'dot';
  cornersSquareColor?: string;
  dotsColor?: string;
}

export interface PreviewLayoutConfig {
  id: string; // e.g. "wedding-layout", "menu-stand-layout"
  name: string;
  previewType: 'invitation' | 'menu-stand' | 'business-card' | 'property-flyer' | 'poster' | 'wifi-card';
  formats: string[]; // e.g. ["Digital Invitation Card", "Welcome Board Signage"]
  mockupBg?: string; // Hex or gradient for background visualization
}

export interface PrintGuideConfig {
  id: string; // e.g. "standard-print"
  recommendedSize: string; // e.g. "1.5" x 1.5" or "4" x 6""
  scanDistance: string; // e.g. "15-30 cm" or "1-2 meters"
  placementTips: string[];
}

export interface ToolContentConfig {
  id: string; // e.g. "wedding-rsvp-content"
  seoTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  useCases: string[];
  benefits: string[];
  bestPractices: string[];
}

export interface FAQItem {
  id: string; // e.g. "wifi-faq-1"
  question: string;
  answer: string;
}

export interface RelatedToolsConfig {
  id: string; // e.g. "wedding-rsvp"
  relatedIds: string[]; // Manual array of tool IDs for 100% control and indexing
}

export interface CapabilityConfig {
  id: string; // e.g. "wedding-rsvp-cap"
  supportsLogo: boolean;
  supportsGallery: boolean;
  supportsCountdown: boolean;
  isProOnly: boolean;
}

export interface MasterTool {
  id: string; // e.g. "wedding-rsvp"
  slug: string; // e.g. "wedding-rsvp-qr-code"
  name: string; // e.g. "Wedding RSVP QR Code Generator"
  category: 'Popular' | 'Social Media' | 'Business & Promo' | 'Utility & Personal' | 'E-Commerce' | 'Crypto & Web3';
  qrType: 'url' | 'wifi' | 'text' | 'crypto' | 'vcard' | 'mecard' | 'email' | 'sms' | 'phone' | 'geo' | 'whatsapp' | 'event' | 'social';
  
  // Database cross-references
  formId: string;
  themeGroupId: string;
  qrStyleId: string;
  previewId: string;
  printGuideId: string;
  contentId: string;
  faqIds: string[]; // Specific list of FAQ ids
  relatedId: string;
  capabilityId: string;
  
  keywords: string[];
  hindiTitle: string;
  hindiDesc: string;
  generateQRString: (values: Record<string, string>) => string;
}

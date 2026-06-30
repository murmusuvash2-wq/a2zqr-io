// ═══════════════════════════════════════════════════════════════════
//  TOOL JSON — Single source of truth per tool
//  Consolidates: tools.ts + forms.ts + toolContent.ts + validation
// ═══════════════════════════════════════════════════════════════════

import { z } from 'zod';

// ─── Field Definition ────────────────────────────────────────────
export interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'url' | 'tel' | 'email' | 'number' | 'select' | 'textarea' | 'color' | 'date' | 'password';
  placeholder: string;
  required: boolean;
  validation?: {
    type: 'url' | 'email' | 'phone' | 'number' | 'text' | 'upi' | 'wifi_ssid' | 'wifi_password' | 'crypto_address' | 'date' | 'hex';
    pattern?: string;          // Regex pattern
    minLength?: number;
    maxLength?: number;
    message?: string;          // Custom error message
  };
  options?: { value: string; label: string }[];  // For select fields
  defaultValue?: string;
  helpText?: string;           // Shown below field
}

// ─── QR Data Configuration ──────────────────────────────────────
export type QRDataType = 'url' | 'wifi' | 'text' | 'crypto' | 'vcard' | 'mecard' | 'email' | 'sms' | 'phone' | 'geo' | 'whatsapp' | 'event' | 'social';

// ─── Consolidated Tool JSON ─────────────────────────────────────
export interface ToolJSON {
  // Identity
  id: string;
  name: string;
  slug: string;
  
  // Classification
  category: string;
  industry: string;            // NEW: maps to Design Pack industry
  qrType: QRDataType;
  isHighTraffic: boolean;
  
  // Localization
  hindiTitle: string;
  hindiDesc: string;
  
  // Fields (consolidated from forms.ts)
  fields: {
    required: ToolField[];     // Step 1 — always show
    optional: ToolField[];    // Step 2 — user can skip
  };
  
  // SEO (from toolContent.ts)
  seo: {
    title: string;
    metaDescription?: string;
    keywords: string[];
  };
  
  // Content
  content: {
    benefits: string[];
    useCases: string[];
    bestPractices: string[];
  };
  
  // Performance
  config: {
    estimatedSeconds: number;  // Default: 15
    showTimer: boolean;        // Show 30s countdown?
  };
}

// ─── Zod Schema for Validation ──────────────────────────────────
export const ToolJSONSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string(),
  industry: z.string(),
  qrType: z.enum(['url','wifi','text','crypto','vcard','mecard','email','sms','phone','geo','whatsapp','event','social']),
  isHighTraffic: z.boolean(),
  fields: z.object({
    required: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['text','url','tel','email','number','select','textarea','color','date','password']),
      required: z.literal(true),
      validation: z.object({
        type: z.string(),
        pattern: z.string().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        message: z.string().optional()
      }).optional()
    })),
    optional: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['text','url','tel','email','number','select','textarea','color','date','password']),
      required: z.literal(false),
    }))
  })
});

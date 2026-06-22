import { PreviewLayoutConfig } from './schemas';

export const PREVIEW_LAYOUTS_DATABASE: Record<string, PreviewLayoutConfig> = {
  'wedding-invitation': {
    id: 'wedding-invitation',
    name: 'Wedding RSVP Classic Invitation',
    previewType: 'invitation',
    formats: ['Formal Wedding Invite Card', 'Greeting Entry Board', 'Glass Table Decal Card'],
    mockupBg: 'linear-gradient(to bottom, #FCE7F3, #F472B6)'
  },
  'menu-stand': {
    id: 'menu-stand',
    name: 'Restaurant Menu Table Standee',
    previewType: 'menu-stand',
    formats: ['Acrylic Table Tent T-Stand', 'Wood Base Menu Cardholder', 'Takeout Paper Bag Badge'],
    mockupBg: 'linear-gradient(to bottom, #FEF3C7, #F59E0B)'
  },
  'business-card': {
    id: 'business-card',
    name: 'Modern NFC Metal Business Card',
    previewType: 'business-card',
    formats: ['Matte PVC Corporate Business Card', 'Embossed Paper Card', 'Virtual Email Signature Layout'],
    mockupBg: 'linear-gradient(to bottom, #E0F2FE, #38BDF8)'
  },
  'property-flyer': {
    id: 'property-flyer',
    name: 'Real Estate Shop Window Flyer',
    previewType: 'property-flyer',
    formats: ['Acrylic Window Lightbox Flyer', 'Tri-fold Premium Brochure', 'Direct Outdoor Metal Signage'],
    mockupBg: 'linear-gradient(to bottom, #D1FAE5, #10B981)'
  },
  'wifi-card': {
    id: 'wifi-card',
    name: 'Secure Guest Lounge Counter Display',
    previewType: 'wifi-card',
    formats: ['Guest Desk Stand Flyer', 'Hotel Bedside Smart QR Sticker', 'Corporate Conference Room Card'],
    mockupBg: 'linear-gradient(to bottom, #EEF2FF, #818CF8)'
  }
};

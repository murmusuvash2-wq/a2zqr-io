import { CapabilityConfig } from './schemas';

export const CAPABILITIES_DATABASE: Record<string, CapabilityConfig> = {
  'wedding-rsvp': {
    id: 'wedding-rsvp',
    supportsLogo: true,
    supportsGallery: true,
    supportsCountdown: true,
    isProOnly: false
  },
  'restaurant-menu': {
    id: 'restaurant-menu',
    supportsLogo: true,
    supportsGallery: true,
    supportsCountdown: false,
    isProOnly: false
  },
  'wifi-password': {
    id: 'wifi-password',
    supportsLogo: false,
    supportsGallery: false,
    supportsCountdown: false,
    isProOnly: false
  }
};

export const DEFAULT_CAPABILITY: CapabilityConfig = {
  id: 'default',
  supportsLogo: true,
  supportsGallery: false,
  supportsCountdown: false,
  isProOnly: false
};

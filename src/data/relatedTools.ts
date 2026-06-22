import { RelatedToolsConfig } from './schemas';

export const RELATED_TOOLS_DATABASE: Record<string, RelatedToolsConfig> = {
  'wedding-rsvp': {
    id: 'wedding-rsvp',
    relatedIds: [
      'birthday-rsvp-invitation',
      'party-rsvp',
      'gps-map-coordinate',
      'photo-gallery-sharing'
    ]
  },
  'restaurant-menu': {
    id: 'restaurant-menu',
    relatedIds: [
      'digital-brochure',
      'google-business-review',
      'instagram-post-promotion',
      'wifi-password-sharing'
    ]
  },
  'wifi-password': {
    id: 'wifi-password',
    relatedIds: [
      'secure-passcode',
      'router-settings',
      'contact-card',
      'website-link'
    ]
  }
};

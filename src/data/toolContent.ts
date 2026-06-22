import { ToolContentConfig } from './schemas';

export const TOOL_CONTENT_DATABASE: Record<string, ToolContentConfig> = {
  'wedding-rsvp': {
    id: 'wedding-rsvp',
    seoTitle: 'Wedding RSVP QR Code Generator | Design Romantic Invitations Free',
    metaDescription: 'Create exquisite romantic Wedding RSVP QR codes easily. Direct scanners to dynamic digital invites, map coordinates, calendars and collect RSVPs in real-time.',
    heroTitle: 'Exquisite Wedding RSVP QR Codes',
    heroSubtitle: 'Simplify wedding organization. Print styled barcodes on invitations to collect RSVPs, share Google maps locations, and show timers.',
    useCases: [
      'Gold Border Invitation Cards: Embed a matching ruby rose QR inside card envelopes.',
      'Reception Welcome Signages: Display at banquet gates to direct guests to their specific table rows.',
      'Thank-You Postcards: Mail to guests after ceremonies to share wedding photo/video galleries.'
    ],
    benefits: [
      'Save Paper: Digitize tracking response sheets without traditional RSVP envelopes.',
      'Exact Directions: Link to precise coordinates so guest vehicles route easily.',
      'Live Count: Connect directly with RSVPs so caterers prepare correct diet plates.'
    ],
    bestPractices: [
      'Styling match: Apply our Rose Wedding color template to synchronize with floral stationery designs.',
      'Testing run: Hand-scan the code with multiple Android and Apple devices before bulk card printing.',
      'Focal border: Frame the square with simple calling words like "Scan to RSVP".'
    ]
  },
  'restaurant-menu': {
    id: 'restaurant-menu',
    seoTitle: 'Digital Restaurant Menu QR Code Maker | Fast Contactless Dining',
    metaDescription: 'Make high-speed digital menu QR codes for cafes, bars, and bistros. Minimize customer waiting time, keep menus updated, and print contactless table stands.',
    heroTitle: 'Contactless Dining Menu QR Codes',
    heroSubtitle: 'Instantly redirect hungry customers to your digital interactive menus, visual dish cards, or direct ordering web pages with a touch-free scan.',
    useCases: [
      'Table-top stands: Frame QR codes inside clear acrylic holders on dine-in spots.',
      'Window posters: Let walking prospects check dishes and prices before selecting tables.',
      'Takeaway packets: Apply labeled stickers on carton boxes to prompt automated home delivery repeating.'
    ],
    benefits: [
      'Update instantly: Change dishes or prices online without reprinting physical papers.',
      'Faster service: Customers select drinks and order instantly without waiter backlogs.',
      'Safe and clean: Hygienic touch-free dining improves consumer safety and trust.'
    ],
    bestPractices: [
      'Maintain contrast: Ensure codes are clearly legible against deep wooden or granite tabletops.',
      'Add Table IDs: Include unique indices in the link to know exactly which section scanned.',
      'Instruction ring: Provide simple help messages like: "Scan to view our specials".'
    ]
  },
  'wifi-generator': {
    id: 'wifi-generator',
    seoTitle: 'Wi-Fi Password QR Code Generator | Instant Guest Connectivity',
    metaDescription: 'Free secure scanner to auto-connect to Wi-Fi networks. Help family guests and shop clients log on without revealing raw passwords.',
    heroTitle: 'Instant Secure Wi-Fi QR Codes',
    heroSubtitle: 'Help guests connect to home or enterprise networks instantly with no passcode typing. Secure, encrypted, and extremely clean.',
    useCases: [
      'Living-room Frames: Display clean cards on tea desks or sideboards for guests.',
      'Conference Rooms: Mount on meeting walls to allow staff easy network login.',
      'Cafe Counter Boards: Display next to registers to check-in clients securely.'
    ],
    benefits: [
      'Type-free login: Bypasses confusing caps, digits, and special symbol keys of passcodes.',
      'Hidden passwords: Keys are encrypted. Scanners connect directly without viewing passcodes.',
      'Maximum privacy: Operates standard protocols locally. No internet transmission required.'
    ],
    bestPractices: [
      'Double check SSID: Make sure capitalization exactly matches your router broadband configurations.',
      'Use Secure Slate style: Indigo high contrast creates maximum rapid scanning under dim lights.',
      'Provide manual tips: Include SSID name on small text blocks under the QR for non-camera device users.'
    ]
  }
};

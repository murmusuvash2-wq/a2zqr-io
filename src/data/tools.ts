export interface ToolInput {
  key: string;
  label: string;
  type: 'text' | 'password' | 'textarea' | 'select' | 'number';
  placeholder: string;
  defaultValue?: string;
  options?: string[];
  isRequired?: boolean;
}

export interface QRTool {
  id: string;
  name: string;
  slug: string;
  category: 'Popular' | 'Social Media' | 'Business & Promo' | 'Utility & Personal' | 'E-Commerce' | 'Crypto & Web3';
  isHighTraffic: boolean;
  keywords: string[];
  description: string;
  hindiTitle: string;
  hindiDesc: string;
  type: 'url' | 'wifi' | 'text' | 'crypto' | 'vcard' | 'mecard' | 'email' | 'sms' | 'phone' | 'geo' | 'whatsapp' | 'event' | 'social';
  inputs: ToolInput[];
  generateQRString: (values: Record<string, string>) => string;
}

export const CATEGORIES = [
  'Popular',
  'Social Media',
  'Business & Promo',
  'Utility & Personal',
  'E-Commerce',
  'Crypto & Web3'
] as const;

export const QR_TOOLS: QRTool[] = [
  // ==========================================
  // POPULAR (HIGH TRAFFIC) TOOLS (1 to 10)
  // ==========================================
  {
    id: 'website-url',
    name: 'Website URL QR Code Generator',
    slug: 'website-url-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['website qr', 'url qr code', 'link qr generator', 'वेबसाइट क्यूआर', 'लिंक जेनरेटर'],
    description: 'Create a high-speed QR code for any website link, landing page, or online portal. Direct users to your online content with a simple camera scan.',
    hindiTitle: 'वेबसाइट यूआरएल क्यूआर कोड जनरेटर',
    hindiDesc: 'निःशुल्क अपनी वेबसाइट के लिंक या यूआरएल के लिए प्रोफेशनल क्यूआर कोड बनाएं। एक स्कैन में लोग आपकी साइट पर पहुंचेंगे।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Website URL / Link', type: 'text', placeholder: 'https://example.com', defaultValue: 'https://example.com', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'wifi-settings',
    name: 'Wi-Fi Network Password QR Code',
    slug: 'wifi-password-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['wifi qr code', 'share wifi password', 'wifi automatic connect', 'वाईफाई पासवर्ड क्यूआर', 'वाईफाई स्कैनर'],
    description: 'Allow guests and clients to automatically connect to your Wi-Fi network without typing complex security passwords. Safe and encrypted connection.',
    hindiTitle: 'वाई-फाई ऑटो-कनेक्ट क्यूआर कोड',
    hindiDesc: 'मेहमानों और कस्टमर्स के लिए क्यूआर कोड बनाएं। बिना पासवर्ड साझा किए सीधे वाईफाई से ऑटो-कनेक्ट करें।',
    type: 'wifi',
    inputs: [
      { key: 'ssid', label: 'Network Name (SSID)', type: 'text', placeholder: 'My Home WiFi', isRequired: true },
      { key: 'password', label: 'Network Password', type: 'password', placeholder: '••••••••', isRequired: false },
      { key: 'encryption', label: 'Security Type', type: 'select', placeholder: 'WPA/WPA2', defaultValue: 'WPA', options: ['WPA', 'WEP', 'nopass'], isRequired: true }
    ],
    generateQRString: (vals) => {
      const ssid = vals.ssid || 'WiFi';
      const password = vals.password || '';
      const enc = vals.encryption || 'WPA';
      return `WIFI:S:${ssid};T:${enc};P:${password};H:${password ? 'false' : 'true'};;`;
    }
  },
  {
    id: 'vcard-contact',
    name: 'vCard Professional Contact QR Code',
    slug: 'vcard-contact-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['vcard qr code', 'contact details qr', 'business card qr', 'संपर्क क्यूआर कोड', 'वीकार्ड जनरेटर'],
    description: 'Share your full professional digital business card in a single barcode. Scan to instantly save your Name, Phone Number, Email, and Address to the contact book.',
    hindiTitle: 'वीकार्ड मोबाइल कॉन्टैक्ट क्यूआर कोड',
    hindiDesc: 'अपना नाम, फोन नंबर, ईमेल और पता युक्त वीकार्ड क्यूआर बनाएं ताकि स्कैन करते ही सब कुछ सीधे मोबाइल में सेव हो जाए।',
    type: 'vcard',
    inputs: [
      { key: 'first', label: 'First Name', type: 'text', placeholder: 'Aarav', isRequired: true },
      { key: 'last', label: 'Last Name', type: 'text', placeholder: 'Sharma', isRequired: false },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210', isRequired: true },
      { key: 'email', label: 'Email Address', type: 'text', placeholder: 'aarav@company.com', isRequired: false },
      { key: 'company', label: 'Company / Org Name', type: 'text', placeholder: 'Innovative Tech', isRequired: false },
      { key: 'title', label: 'Job Title', type: 'text', placeholder: 'Managing Director', isRequired: false },
      { key: 'website', label: 'Website Link', type: 'text', placeholder: 'https://mysite.com', isRequired: false }
    ],
    generateQRString: (vals) => {
      const f = vals.first || 'Contact';
      const l = vals.last || '';
      const p = vals.phone || '';
      const e = vals.email || '';
      const c = vals.company || '';
      const t = vals.title || '';
      const w = vals.website || '';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${l};${f};;;\nFN:${f} ${l}\nORG:${c}\nTITLE:${t}\nTEL;TYPE=CELL:${p}\nEMAIL;TYPE=PREF,INTERNET:${e}\nURL:${w}\nEND:VCARD`;
    }
  },
  {
    id: 'plain-text',
    name: 'Plain Text Message QR Generator',
    slug: 'plain-text-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['plain text qr', 'text barcode', 'simple text code', 'प्लेन टेक्स्ट क्यूआर', 'सन्देश स्कैनर'],
    description: 'Inscribe plain alphanumeric text messages, system secrets, or structural product barcodes that show up immediately on the scanning device screen.',
    hindiTitle: 'प्लेन टेक्स्ट क्यूआर कोड जनरेटर',
    hindiDesc: 'किसी भी साधारण टेक्स्ट मैसेज, नोट्स या गोपनीय सन्देश को साझा करने के लिए क्यूआर कोड तैयार करें।',
    type: 'text',
    inputs: [
      { key: 'text', label: 'Your Plain Text', type: 'textarea', placeholder: 'Type your custom message, instructions, or notes here...', isRequired: true }
    ],
    generateQRString: (vals) => vals.text || 'Welcome to QR Tool Suite!'
  },
  {
    id: 'sms-sender',
    name: 'SMS Auto-sender QR Code Generator',
    slug: 'sms-auto-sender-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['sms qr code', 'send text message qr', 'sms automation', 'एसएमएस क्यूआर कोड', 'मोबाइल मैसेज'],
    description: 'Creates a barcode with a prefilled recipient phone number and message body. When scanned, it launches the native SMS app with text ready to send. Ideal for registrations.',
    hindiTitle: 'ऑटो एसएमएस प्री-फिल्ड क्यूआर कोड',
    hindiDesc: 'एक ऐसा क्यूआर बनाएं जिसे स्कैन करते ही मोबाइल संदेश बॉक्स में विशिष्ट मैसेज और नंबर प्री-फिल्ड हो जाए।',
    type: 'sms',
    inputs: [
      { key: 'phone', label: 'Recipient Phone Number', type: 'text', placeholder: '+919876543210', isRequired: true },
      { key: 'message', label: 'Prefilled Message Body', type: 'textarea', placeholder: 'Yes, please register me for the exclusive event!', isRequired: false }
    ],
    generateQRString: (vals) => `SMSTO:${vals.phone || ''}:${vals.message || ''}`
  },
  {
    id: 'email-sender',
    name: 'Email Composer QR Code Maker',
    slug: 'email-composer-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['email qr', 'mail composer qr', 'email marketing barcode', 'ईमेल कंपोजर क्यूआर', 'मेल स्कैनर'],
    description: 'Prompt scanners to instantly send an email to your address with prefilled subject lines and body drafts. Enhances customer support speeds.',
    hindiTitle: 'क्विक ईमेल कंपोजर क्यूआर कोड',
    hindiDesc: 'कस्टम विषय (Subject) और संदेश (Body) के साथ ईमेल कंपोज करने वाला आसान क्यूआर कोड बनाएं।',
    type: 'email',
    inputs: [
      { key: 'email', label: 'Recipient Email Address', type: 'text', placeholder: 'contact@brand.com', isRequired: true },
      { key: 'subject', label: 'Email Subject', type: 'text', placeholder: 'Customer Feedback Inquiry', isRequired: false },
      { key: 'body', label: 'Email Body Message', type: 'textarea', placeholder: 'Hi Team, I would like to inquire about...', isRequired: false }
    ],
    generateQRString: (vals) => {
      const email = vals.email || '';
      const subject = encodeURIComponent(vals.subject || '');
      const body = encodeURIComponent(vals.body || '');
      return `mailto:${email}?subject=${subject}&body=${body}`;
    }
  },
  {
    id: 'whatsapp-direct',
    name: 'WhatsApp Direct Message QR Code',
    slug: 'whatsapp-direct-msg-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['whatsapp qr', 'wa.me chat shortcut', 'whatsapp automated message', 'व्हाट्सएप डायरेक्ट क्यूआर', 'चैट लिंक'],
    description: 'Skip typing long contact phone numbers. Scan a barcode to start a private encrypted chat on WhatsApp with an optional prefilled welcome text.',
    hindiTitle: 'व्हाट्सएप डायरेक्ट चैट क्यूआर कोड',
    hindiDesc: 'नंबर सेव किए बिना सीधे व्हाट्सएप चैट शुरू करने के लिए क्यूआर कोड बनाएं। कस्टम स्वागत संदेश जोड़ें।',
    type: 'whatsapp',
    inputs: [
      { key: 'phone', label: 'WhatsApp Phone Number (with Country Code)', type: 'text', placeholder: '919876543210', isRequired: true },
      { key: 'message', label: 'Optional Welcome Chat Message', type: 'textarea', placeholder: 'Hello! I am interested in buying your product.', isRequired: false }
    ],
    generateQRString: (vals) => {
      const phone = (vals.phone || '').replace(/[^0-9]/g, '');
      const message = encodeURIComponent(vals.message || '');
      return `https://wa.me/${phone}${message ? '?text=' + message : ''}`;
    }
  },
  {
    id: 'phone-dialer',
    name: 'Phone Call Dialer QR Generator',
    slug: 'phone-call-dialer-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['phone dialer qr', 'click to call qr', 'direct call hotline', 'फोन कॉल डायलर', 'कॉल शॉर्टकट'],
    description: 'Make sharing hotlines, emergency numbers, or local sales representatives extremely easy. Scanning prompts the dialer to load the phone number automatically.',
    hindiTitle: 'फोन डायरेक्ट डायलर क्यूआर कोड',
    hindiDesc: 'स्कैनर को सीधे अपने सेल्स या सपोर्ट हेल्पलाइन नंबर डायल करने के लिए प्रेरित करें।',
    type: 'phone',
    inputs: [
      { key: 'phone', label: 'Direct Phone Number', type: 'text', placeholder: '+919876543210', isRequired: true }
    ],
    generateQRString: (vals) => `tel:${vals.phone || ''}`
  },
  {
    id: 'gps-location',
    name: 'Google Maps GPS Coordinate QR Code',
    slug: 'gps-map-coordinate-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['gps location qr', 'google maps coordinate', 'address location code', 'गूगल मैप्स लोकेशन क्यूआर', 'स्थान स्कैनर'],
    description: 'Ensure guests and visitors reach your retail outlets, weddings, or event spaces precisely using raw latitude and longitude GPS coordinates on standard maps.',
    hindiTitle: 'गूगल मैप्स जीपीएस लोकेशन क्यूआर कोड',
    hindiDesc: 'शादी, ऑफिस या दुकान की सटीक लोकेशन साझा करने के लिए अक्षांश एवं देशांतर आधारित जीपीएस क्यूआर कोड।',
    type: 'geo',
    inputs: [
      { key: 'lat', label: 'Latitude Coordinate', type: 'text', placeholder: '28.6139', isRequired: true },
      { key: 'lng', label: 'Longitude Coordinate', type: 'text', placeholder: '77.2090', isRequired: true },
      { key: 'label', label: 'Place Label (Optional)', type: 'text', placeholder: 'Connaught Place Main Office', isRequired: false }
    ],
    generateQRString: (vals) => {
      const lat = vals.lat || '28.6139';
      const lng = vals.lng || '77.2090';
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
  },
  {
    id: 'pdf-link-qr',
    name: 'PDF Flyer / Document QR Generator',
    slug: 'pdf-flyer-document-qr-code',
    category: 'Popular',
    isHighTraffic: true,
    keywords: ['pdf qr code', 'digital brochure qr', 'restaurant menu link', 'पीडीएफ फ्लायर क्यूआर', 'दस्तावेज स्कैनर'],
    description: 'Link your scan directly to digital cloud documents, brochures, flyers, or catalogs in PDF form hosted on web folders, Google Drive, or personal servers.',
    hindiTitle: 'पीडीएफ ब्रोशर / दस्तावेज क्यूआर कोड',
    hindiDesc: 'अपने बिजनेस या उत्पाद कैटलॉग के डिजिटल पीडीएफ लिंक को प्रिंट क्यूआर कोड में बदलें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'PDF Document Link (Public Access URL)', type: 'text', placeholder: 'https://docs.google.com/file/d/example/view', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },

  // ==========================================
  // SOCIAL MEDIA & CREATOR TOOLS (11 to 30)
  // ==========================================
  {
    id: 'youtube-video',
    name: 'YouTube Video Link QR Master',
    slug: 'youtube-video-link-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['youtube video qr', 'watch viral video qr', 'play tutorial code', 'यूट्यूब वीडियो लिंक क्यूआर', 'वीडियो कोड'],
    description: 'Share a high-definition video directly. Scanning prompts the native YouTube app to immediately load and stream the video for tutorials, music, or corporate ads.',
    hindiTitle: 'यूट्यूब वीडियो वॉच क्यूआर कोड',
    hindiDesc: 'अपने ट्यूटोरियल, रील या संगीत वीडियो को सीधे स्कैन करवाकर यूट्यूब ऐप पर प्ले करवाएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'YouTube Video Link', type: 'text', placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://youtube.com'
  },
  {
    id: 'youtube-channel',
    name: 'YouTube Channel Subscribe QR Maker',
    slug: 'youtube-channel-subscribe-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['youtube channel qr', 'get youtube subscribers', 'video content creator qr', 'यूट्यूब चैनल सब्सक्राइबर', 'चैनल क्यूआर'],
    description: 'Increase your subscriber counts elegantly. Direct scanners directly to your official YouTube channel homepage to let them explore all content playlists.',
    hindiTitle: 'यूट्यूब चैनल डायरेक्ट क्यूआर कोड',
    hindiDesc: 'यूट्यूब चैनल को फॉलो व सब्सक्राइब करवाने के लिए डायरेक्ट लिंक क्यूआर पैकर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'YouTube Channel URL', type: 'text', placeholder: 'https://youtube.com/@c/Google', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://youtube.com'
  },
  {
    id: 'youtube-playlist',
    name: 'YouTube Curated Playlist QR Creator',
    slug: 'youtube-playlist-curated-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['youtube playlist qr code', 'music playlist barcode', 'video course list', 'प्लेलिस्ट कोड'],
    description: 'Bundle video tutorials, product showcases, or music into one compiled list. Perfect for teaching classes or continuous visual demonstrations.',
    hindiTitle: 'यूट्यूब वीडियो प्लेलिस्ट क्यूआर कोड',
    hindiDesc: 'अपने कोर्सेज, पॉडकास्ट या ट्यूटोरियम प्लेलिस्ट का एक साझा स्कैनर बनाएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'YouTube Playlist Link', type: 'text', placeholder: 'https://youtube.com/playlist?list=PLuxexample', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://youtube.com'
  },
  {
    id: 'instagram-profile',
    name: 'Instagram Profile Page QR Shortcut',
    slug: 'instagram-profile-page-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['instagram qr code', 'get instagram followers', 'insta bio portal', 'इंस्टाग्राम प्रोफाइल क्यूआर', 'फॉलो क्यूआर'],
    description: 'Promote your Instagram handles on business cards, retail posters, or merchandise to increase your visual brand followers offline.',
    hindiTitle: 'इंस्टाग्राम प्रोफाइल फॉलो क्यूआर कोड',
    hindiDesc: 'व्यापार कार्ड या पोस्टर्स पर प्रिंट करके अपनी इंस्टाग्राम ऑडियंस और फॉलोअर्स तेजी से बढ़ाएं।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'Instagram Username', type: 'text', placeholder: 'aarav_sharma_official', isRequired: true }
    ],
    generateQRString: (vals) => {
      const u = vals.username ? vals.username.replace('@', '').trim() : 'instagram';
      return `https://instagram.com/${u}`;
    }
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post / Reel Spotlight QR',
    slug: 'instagram-post-reel-spotlight-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['instagram reel qr', 'viral insta post scanner', 'promote instagram post', 'रिल्स क्यूआर कोड'],
    description: 'Highlight a specific viral reel, image post, or carousel slide. Instantly direct scanners to your latest product launch or creative photography snippet.',
    hindiTitle: 'इंस्टाग्राम रील व पोस्ट स्पॉटलाइट क्यूआर',
    hindiDesc: 'अपनी किसी खास इंस्टाग्राम रील, फोटो या प्रोडक्ट फोटो को ऑफलाइन क्यूआर के जरिए वायरल करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Instagram Post / Reel URL', type: 'text', placeholder: 'https://www.instagram.com/p/Cexample/', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://instagram.com'
  },
  {
    id: 'x-twitter-post',
    name: 'X (Twitter) Tweet Share QR Code',
    slug: 'x-twitter-tweet-share-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['twitter post qr', 'x post qr code', 'share tweet barcode', 'ट्विटर ट्वीट क्यूआर'],
    description: 'Drive high-traffic engagements, retweets, and likes for a specific post on the X platform (formerly Twitter). Scans go straight to the tweet details.',
    hindiTitle: 'एक्स (ट्विटर) पोस्ट रि-ट्वीट क्यूआर',
    hindiDesc: 'ट्विटर पर अपने किसी खास ट्वीट, प्रेस नोट या घोषणा पर री-ट्वीट और लाइक बढ़ाने का बेहतरीन जरिया।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'X (Twitter) Post Link', type: 'text', placeholder: 'https://x.com/username/status/123456789', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://x.com'
  },
  {
    id: 'x-twitter-profile',
    name: 'X (Twitter) Profile Follow QR Maker',
    slug: 'x-twitter-profile-follow-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['twitter profile qr', 'x handle follower', 'follow official x page text', 'एक्स ट्विटर प्रोफाइल स्कैनर'],
    description: 'Connect with journalists, tech experts, and corporate entities on X. Display your logo and link your handle to acquire active followers.',
    hindiTitle: 'एक्स (ट्विटर) प्रोफाइल न्यू फॉलो क्यूआर',
    hindiDesc: 'एक्स सोशल फीड पर अपनी प्रोफाइल पर लोगों को तेजी से आकर्षित करने के लिए स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'X Username', type: 'text', placeholder: 'AaravSharmaX', isRequired: true }
    ],
    generateQRString: (vals) => {
      const u = vals.username ? vals.username.replace('@', '').trim() : 'x';
      return `https://x.com/${u}`;
    }
  },
  {
    id: 'linkedin-profile',
    name: 'LinkedIn Professional Profile QR',
    slug: 'linkedin-professional-profile-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['linkedin profile qr', 'cv link qr', 'resume job search QR', 'लिंक्डइन प्रोफाइल क्यूआर', 'नौकरी बायोडाटा'],
    description: 'Upgrade your traditional paper CV or paper business card. Scanning takes HR managers and prospective network connections straight to your LinkedIn achievements.',
    hindiTitle: 'लिंक्डइन प्रोफेशनल प्रोफाइल क्यूआर कोड',
    hindiDesc: 'अपने इंटरव्यू रिज्यूम या बायोडाटा पर क्यूआर कोड प्रिंट करें ताकि एचआर तुरंत आपकी प्रोफेशनल उपलब्धियां देख सके।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'LinkedIn Profile Link', type: 'text', placeholder: 'https://www.linkedin.com/in/aaravsharma', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://linkedin.com'
  },
  {
    id: 'linkedin-company',
    name: 'LinkedIn Company Business Page QR',
    slug: 'linkedin-company-business-page-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['linkedin company qr', 'corporate page linkedin', 'company hires link', 'कॉर्पोरेट कंपनी लिंक्डइन पेज'],
    description: 'Drive traffic to your firm\'s LinkedIn corporate handle. Connect with clients, showcase product milestones, and run recruitment funnels offline.',
    hindiTitle: 'लिंक्डइन कॉर्पोरेट कंपनी पेज क्यूआर',
    hindiDesc: 'अपनी कंपनी और ब्रांड के आधिकारिक लिंक्डइन पेज को प्रमोट करने हेतु सटीक क्यूआर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'LinkedIn Company URL', type: 'text', placeholder: 'https://www.linkedin.com/company/google', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://linkedin.com'
  },
  {
    id: 'facebook-page',
    name: 'Facebook Brand Page Like QR Tool',
    slug: 'facebook-brand-page-like-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['facebook page qr', 'fb business portal', 'fb brand like boost', 'फेसबुक ब्रांड पेज लाइक क्यूआर'],
    description: 'Grow your local shop or digital brand\'s Facebook page likes. Perfect for checkout counters, restaurant seating tables, and banner flyers.',
    hindiTitle: 'फेसबुक बिजनेस / ब्रांड पेज क्यूआर',
    hindiDesc: 'दुकान या काउंटर पर रखें ताकि ग्राहक आपके फेसबुक पेज को स्कैन करके लाइक कर सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Facebook Page URL', type: 'text', placeholder: 'https://facebook.com/GoogleInd', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://facebook.com'
  },
  {
    id: 'facebook-profile',
    name: 'Facebook Personal Profile QR Code',
    slug: 'facebook-personal-profile-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['facebook profile qr', 'fb add friend qr', 'personal profile code', 'फेसबुक आईडी ऐड फ्रेंड क्यूआर'],
    description: 'Add friends on Facebook instantly at networking events, college festivals, or social mixers without messy manual name spell checks.',
    hindiTitle: 'फेसबुक पर्सनल आईडी फ्रेंड क्यूआर कोड',
    hindiDesc: 'बिना नाम खोजे सीधे आपके प्रोफाइल पर फ्रेंड रिक्वेस्ट भेजने का आसान डिजिटल समाधान।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Facebook Profile URL', type: 'text', placeholder: 'https://facebook.com/aaravsharma', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://facebook.com'
  },
  {
    id: 'facebook-group',
    name: 'Facebook Community Group Invite QR',
    slug: 'facebook-community-group-invite-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['facebook group qr', 'fb group joins link', 'social club network', 'फेसबुक कम्युनिटी ग्रुप ज्वाइनर'],
    description: 'Gather community users, localized hobby groups, or flat-owner societies together. Scan QR to join your closed Facebook Group easily.',
    hindiTitle: 'फेसबुक कम्युनिटी ग्रुप ज्वाइंट स्कैनर',
    hindiDesc: 'अपने सोशल ग्रुप या वेलफेयर सोसायटी को ऑफलाइन पोस्टर्स से जोड़कर मेम्बर्स बढाएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Facebook Group URL', type: 'text', placeholder: 'https://facebook.com/groups/codingdevs', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://facebook.com'
  },
  {
    id: 'tiktok-profile',
    name: 'TikTok Video Profile Creator QR',
    slug: 'tiktok-video-profile-creator-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['tiktok qr', 'video viewer increase', 'viral tiktok page follower', 'टिकटॉक फॉलोवर क्यूआर'],
    description: 'Guide global audiences to your TikTok trending video portfolios. Perfect for printing on stickers, packages, and custom merch.',
    hindiTitle: 'टिकटॉक वायरल क्रिएटर प्रोफाइल क्यूआर',
    hindiDesc: 'वैश्विक दर्शकों के लिए टिकटॉक रील फीड और फॉलोवर आधार बढ़ाने हेतु कस्टम प्रमोटर।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'TikTok Username', type: 'text', placeholder: 'innovative_creator', isRequired: true }
    ],
    generateQRString: (vals) => {
      const u = vals.username ? vals.username.replace('@', '').trim() : 'tiktok';
      return `https://www.tiktok.com/@${u}`;
    }
  },
  {
    id: 'pinterest-board',
    name: 'Pinterest Board Pin Ideas QR Tool',
    slug: 'pinterest-board-pin-ideas-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['pinterest qr code', 'aesthetic styling boards', 'pin graphics link', 'पिनट्रेस्ट बोर्ड क्यूआर'],
    description: 'Showcase design templates, home decor portfolios, architecture projects, or fashion styling collections cataloged on Pinterest.',
    hindiTitle: 'पिनट्रेस्ट बोर्ड डिजाइन कैटलॉग क्यूआर',
    hindiDesc: 'अपने क्रिएटिव डिज़ाइन, आर्किटेक्चर या फैशन पोर्टफोलियो वाली पिनट्रेस्ट शीट सीधे स्कैन कराएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Pinterest Board URL', type: 'text', placeholder: 'https://pinterest.com/username/aesthetic-interiors/', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://pinterest.com'
  },
  {
    id: 'telegram-channel',
    name: 'Telegram Channel / Chat Joiner QR',
    slug: 'telegram-channel-chat-joiner-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['telegram channel qr', 'tg chat secure shortcut', 'crypto community joins', 'टेलीग्राम चैनल शॉर्टकट क्यूआर'],
    description: 'Promote crypto study groups, stock alerts, learning blogs, or discount coupon streams managed on Telegram chats and channels.',
    hindiTitle: 'टेलीग्राम सिक्योर चैनल और ग्रुप स्कैनर',
    hindiDesc: 'अपने टेलीग्राम न्यूज फीड, स्टॉक टिप्स या कोडिंग चैनल के सब्सक्राइबर आसानी से बढ़ाएं।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'Telegram Username/Link', type: 'text', placeholder: 'https://t.me/brandchannel', isRequired: true }
    ],
    generateQRString: (vals) => vals.username || 'https://t.me/'
  },
  {
    id: 'discord-server',
    name: 'Discord Interactive Server Invite QR',
    slug: 'discord-interactive-server-invite-qr',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['discord invite qr', 'gamer community server', 'discord lobby portal', 'डिस्कॉर्ड सर्वर इनवाइट क्यूआर'],
    description: 'Build your gamer lobbies, coding hubs, or customer support forums. Generate an invitation link QR to get verified community members.',
    hindiTitle: 'डिस्कॉर्ड सर्वर इनवाइट क्यूआर जनरेटर',
    hindiDesc: 'अपने गेमिंग गिल्ड या कोडिंग टीम के डिस्कॉर्ड सर्वर का क्विक डिजिटल न्योता पत्र बनाएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Discord Invite URL', type: 'text', placeholder: 'https://discord.gg/exinvitecode', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://discord.com'
  },
  {
    id: 'spotify-playlist',
    name: 'Spotify Music Playlist Album QR',
    slug: 'spotify-music-playlist-album-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['spotify qr code', 'share dynamic music playlist', 'podcast player link', 'स्पॉटिफाई म्यूजिक प्लेलिस्ट स्कैनर'],
    description: 'Perfect for cafes, yoga studios, or workout fitness centers. Share curated background music, podcasts, or original artist albums.',
    hindiTitle: 'स्पॉटिफाई म्यूजिक प्लेलिस्ट क्यूआर',
    hindiDesc: 'अपनी पसंदीदा गानों की प्लेलिस्ट या पॉडकास्ट सीरीज कैफ़े/जिम के ग्राहकों संग शेयर करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Spotify Playlist / Track Link', type: 'text', placeholder: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGg263S2', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://spotify.com'
  },
  {
    id: 'apple-music',
    name: 'Apple Music Track / Album Link QR',
    slug: 'apple-music-track-album-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['apple music qr', 'song track scan', 'album launch shortcut', 'एप्पल म्यूजिक सोंग ट्रैक क्यूआर'],
    description: 'Promote your latest audio singles, soundscapes, or iTunes classic albums directly on custom stickers and designer record covers.',
    hindiTitle: 'एप्पल म्यूजिक सॉन्ग / एल्बम लिंक क्यूआर',
    hindiDesc: 'म्यूजिक एल्बम के डिजिटल लिंक को सुंदर क्यूआर में बदलें और पोस्टर पर लगाएं।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Apple Music Track Link', type: 'text', placeholder: 'https://music.apple.com/in/album/example', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://music.apple.com'
  },
  {
    id: 'twitch-stream',
    name: 'Twitch Pro Streamer Live QR Tool',
    slug: 'twitch-pro-streamer-live-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['twitch stream qr', 'gamer live session alerts', 'twitch follower booster', 'ट्विच गेमर लाइव स्ट्रीम क्यूआर'],
    description: 'Let gaming enthusiasts join your active live streams instantly. Scanning loads the streamer lobby inside the Twitch mobile application.',
    hindiTitle: 'ट्विच गेमर लाइव स्ट्रीम फॉलो क्यूआर',
    hindiDesc: 'अपने प्रशंसकों को ट्विच लाइव गेमप्ले और टूर्नामेंट लॉबी में तुरंत लाइव बुलाएं।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'Twitch Channel Username', type: 'text', placeholder: 'ninja_pro_gamer', isRequired: true }
    ],
    generateQRString: (vals) => `https://twitch.tv/${vals.username || ''}`
  },
  {
    id: 'reddit-subreddit',
    name: 'Reddit Subreddit / Profile Forum QR',
    slug: 'reddit-subreddit-profile-forum-qr-code',
    category: 'Social Media',
    isHighTraffic: false,
    keywords: ['reddit qr code', 'subreddit discussion portal', 'ama forum scan', 'रेडिट सबरेडिट डिस्कशन क्यूआर'],
    description: 'Share a subreddit community boards or custom Ask Me Anything (AMA) panels with students and digital platform readers.',
    hindiTitle: 'रेडिट सबरेडिट कम्युनिटी डिस्कशन क्यूआर',
    hindiDesc: 'वर्चुअल कम्युनिटी और रेडिट धागे (Threads) का एक क्यूआर ताकि लोग सीधी चर्चा में जुड़ सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Reddit Post / Subreddit Link', type: 'text', placeholder: 'https://www.reddit.com/r/reactjs/', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://reddit.com'
  },

  // ==========================================
  // BUSINESS & PROMO TOOLS (31 to 50)
  // ==========================================
  {
    id: 'google-review',
    name: 'Google Business Maps Review QR Maker',
    slug: 'google-business-maps-review-qr-code',
    category: 'Business & Promo',
    isHighTraffic: true,
    keywords: ['google review qr', 'gmb review boost', 'maps restaurant rating', 'गूगल रिव्यू क्यूआर कोड', 'रेटिंग जनरेटर'],
    description: 'Get five-star reviews on Google Maps instantly. Placed on checkout counters or cafe tables, scanning prompts local maps review form directly.',
    hindiTitle: 'गूगल मैप्स रिव्यू एंड रेटिंग क्यूआर कोड',
    hindiDesc: 'कस्टमर्स से ५-स्टार गूगल रिव्यू पाने का सीधा जरिया। स्कैन करते ही सीधे बिजनेस रेटिंग पेज ओपन होगा।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Business Review Link / Map Link', type: 'text', placeholder: 'https://g.page/r/your-gmb-review-id/review', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://google.com'
  },
  {
    id: 'zoom-invite',
    name: 'Zoom Corporate Video Meeting QR Tool',
    slug: 'zoom-corporate-video-meeting-qr-code',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['zoom class qr', 'webinar meeting room', 'virtual team login', 'ज़ूम वीडियो मीटिंग रूम क्यूआर'],
    description: 'Display on virtual corporate emails or class notice boards. Scan to jump directly into the Zoom secure conference with passwords auto-loaded.',
    hindiTitle: 'ज़ूम वीडियो मीटिंग रूम इनवाइट क्यूआर',
    hindiDesc: 'सॉफ्टवेयर डेवलपर्स, छात्रों या टीम मीटिंग्स के लिए ज़ूम कॉन्फ्रेंस रूम का क्विक स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Zoom Invitation Link', type: 'text', placeholder: 'https://zoom.us/j/123456789?pwd=expass', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://zoom.us'
  },
  {
    id: 'calendly-appointment',
    name: 'Calendly Slot Schedule Appointment QR',
    slug: 'calendly-slot-schedule-appointment-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['calendly qr code', 'book business slot', 'schedule advisory chat', 'अपॉइंटमेंट बुकिंग क्यूआर'],
    description: 'Allows clients to reserve consultations, diagnostic surveys, or personal training hours instantly on your Calendly scheduler calendar.',
    hindiTitle: 'कैलेंडली स्लॉट अपॉइंटमेंट बुकिंग क्यूआर',
    hindiDesc: 'कॉल और कंसल्टेशन बुक करने के लिए कैलेंडली पेज को क्यूआर कोड में बदलकर ग्राहकों संग शेयर करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Calendly Schedule Link', type: 'text', placeholder: 'https://calendly.com/yourhandle/30min', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://calendly.com'
  },
  {
    id: 'skype-connect',
    name: 'Skype Instant Call / Chat Joiner QR',
    slug: 'skype-instant-call-chat-joiner-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['skype call qr', 'business conference skype', 'chat link skype', 'स्काइप मीटिंग इनवाइट'],
    description: 'Establish direct customer call channels. Launches Skype communication rooms with support staff instantly upon camera scan detection.',
    hindiTitle: 'स्काइप डायरेक्ट चैट एंड कॉल रूम क्यूआर',
    hindiDesc: 'सपोर्ट टीम के साथ ग्राहकों को सीधा ऑडियो/वीडियो चैट लिंक प्रदान करने का क्विक स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Skype Invite Link', type: 'text', placeholder: 'https://join.skype.com/invite/excode', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://skype.com'
  },
  {
    id: 'app-store',
    name: 'Apple App Store iOS Download QR Link',
    slug: 'apple-app-store-ios-download-qr-link',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['app store qr', 'ios download barcode', 'promote ios app qr', 'एप्पल ऐप स्टोर डाउनलोड क्यूआर'],
    description: 'Promote iPhone companion mobile applications in printed pamphlets. Scanning takes Apple users directly to App Store download page.',
    hindiTitle: 'एप्पल ऐप स्टोर आईओएस डाउनलोड क्यूआर',
    hindiDesc: 'सिस्टम पोस्टर्स या विज्ञापनों पर लगाएं ताकि आईफोन यूजर्स सीधे आपका ऐप डाउनलोड कर सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'App Store Download URL', type: 'text', placeholder: 'https://apps.apple.com/us/app/google/id284815942', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://apps.apple.com'
  },
  {
    id: 'google-play',
    name: 'Google Play Store Android App QR Maker',
    slug: 'google-play-store-android-app-qr-maker',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['google play qr code', 'play store download', 'promote android application', 'गूगल प्ले स्टोर एंड्राइड डाउनलोड क्यूआर'],
    description: 'Direct Android tablet and mobile phone users to your app listings. Maximize app installations by framing a downloadable scan code.',
    hindiTitle: 'गूगल प्ले स्टोर गेम व ऐप क्यूआर कोड',
    hindiDesc: 'एंड्राइड स्मार्टफोन उपयोगकर्ताओं के लिए गूगल प्ले स्टोर डाउनलोड लिंक जनरेटर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Play Store App URL', type: 'text', placeholder: 'https://play.google.com/store/apps/details?id=com.google.android.youtube', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://play.google.com'
  },
  {
    id: 'google-drive',
    name: 'Google Drive Public File Folder QR',
    slug: 'google-drive-public-file-folder-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['google drive qr', 'cloud sharing link', 'drive assets download', 'गूगल ड्राइव फ़ाइल शेयरर क्यूआर'],
    description: 'Share design kits, project zip bundles, audiobooks, or large data sheets hosted on Google Drive secure folder directories.',
    hindiTitle: 'गूगल ड्राइव फाइल व फोल्डर शेअर क्यूआर',
    hindiDesc: 'गूगल ड्राइव की जिप फाइलों, प्रोजेक्ट्स या कोडिंग असाइनमेंट्स का डायरेक्ट पब्लिक लिंक स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Drive Share Link', type: 'text', placeholder: 'https://drive.google.com/drive/folders/example_id', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://drive.google.com'
  },
  {
    id: 'dropbox-folder',
    name: 'Dropbox Folder Sync Download QR',
    slug: 'dropbox-folder-sync-download-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['dropbox qr', 'send file folder sync', 'dropbox share link', 'ड्रॉपबॉक्स फ़ोल्डर डाउनलोडर'],
    description: 'Exchange creative design photographs, video master cuts, or corporate presentations hosted inside Dropbox directories with clients.',
    hindiTitle: 'ड्रॉपबॉक्स फोल्डर पब्लिक शेअर क्यूआर',
    hindiDesc: 'ड्रॉपबॉक्स क्लाउड स्टोरेज लिंक को क्यूआर में कस्टमाइज़ एवं डाउनलोड करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Dropbox Sharing URL', type: 'text', placeholder: 'https://www.dropbox.com/sh/example_id', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://dropbox.com'
  },
  {
    id: 'onedrive-share',
    name: 'Microsoft OneDrive File Storage QR tool',
    slug: 'microsoft-onedrive-file-storage-qr-tool',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['onedrive qr', 'microsoft cloud link', 'share office doc url', 'माइक्रोसॉफ्ट वनड्राइव फाइल शेयरींग'],
    description: 'Distribute Excel sheets, Word files, or PowerPoint slides easily with team members. High speed storage link QR creator.',
    hindiTitle: 'वनड्राइव एक्सेल व वर्ड फ़ाइल शेयरींग क्यूआर',
    hindiDesc: 'माइक्रोसॉफ्ट वनड्राइव क्लाउड पर अपलोडेड फाइल्स को सीधे प्रमोट करने हेतु सटीक स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'OneDrive File Link', type: 'text', placeholder: 'https://onedrive.live.com/redir?resid=example_id', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://onedrive.live.com'
  },
  {
    id: 'pdf-catalogue',
    name: 'Interactive Product Catalogue PDF QR',
    slug: 'interactive-product-catalogue-pdf-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['pdf catalogue barcode', 'product flyers link', 'interactive brochures page', 'पीडीएफ उत्पाद कैटलॉग सेंडर'],
    description: 'Ideal for furniture showrooms, electrical warehouses, or clothing brands. Replaces or supports bulky physical catalogs with digital folders.',
    hindiTitle: 'डिजिटल उत्पाद कैटलॉग पीडीएफ क्यूआर',
    hindiDesc: 'कपड़ो या एक्सेसरीज के शोरूम पर प्रमोट करने के लिए संपूर्ण उत्पादों का सुन्दर कैटलॉग।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Catalogue Hosted URL', type: 'text', placeholder: 'https://mysite.com/catalogue.pdf', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'location-checkin',
    name: 'Retail Outlet Check-In Map QR Code',
    slug: 'retail-outlet-check-in-map-qr-code',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['location checkin', 'foursquare maps', 'retail store visit promo', 'दुकान विजिट स्थान स्कैनर'],
    description: 'Incentivize customer counts. Place checkout placards so shoppers can tag their active visits or find accurate directions on digital maps.',
    hindiTitle: 'दुकान / शोरूम विजिट चेक-इन लोकेशन क्यूआर',
    hindiDesc: 'ग्राहकों को सीधे स्टोर की जीपीएस दिशाएं बताने और चेक-इन दर्ज करने का आधुनिक तरीका।',
    type: 'geo',
    inputs: [
      { key: 'lat', label: 'Latitude', type: 'text', placeholder: '19.0760', isRequired: true },
      { key: 'lng', label: 'Longitude', type: 'text', placeholder: '72.8777', isRequired: true },
      { key: 'store', label: 'Store Name', type: 'text', placeholder: 'Suvash Astrology Studio', isRequired: false }
    ],
    generateQRString: (vals) => `https://www.google.com/maps/search/?api=1&query=${vals.lat || '19.0760'},${vals.lng || '72.8777'}`
  },
  {
    id: 'rsvp-event',
    name: 'Event Invitation & RSVP Registration QR',
    slug: 'event-invitation-rsvp-registration-qr-code',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['rsvp event qr', 'wedding invitation barcode', 'registration scanner', 'आरएसवीपी इवेंट आमंत्रण क्यूआर'],
    description: 'Collect registrations for seminars, product launches, birthdays, or weddings. Prints on beautiful paper cards to track guests digitally.',
    hindiTitle: 'शादी व इवेंट आमंत्रण आरएसवीपी क्यूआर',
    hindiDesc: 'विवाह पत्रिकाओं या सेमिनार पोस्टर्स पर प्रिंट करके मेहमानों की डिजिटल हाजिरी दर्ज करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'RSVP Form / Event Landing Page Link', type: 'text', placeholder: 'https://mywedding.com/registration', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Digital Menu Card QR Maker',
    slug: 'restaurant-digital-menu-card-qr-maker',
    category: 'Business & Promo',
    isHighTraffic: true,
    keywords: ['restaurant menu qr', 'food catalog scanner', 'cafe digital billing link', 'रेस्टोरेंट डिजिटल मेनू क्यूआर', 'खाद्य सूची'],
    description: 'Ensure touch-free hygienic experiences in cafes, bars, and family restaurants. Linking directly to interactive digital menus and online food portals.',
    hindiTitle: 'रेस्टोरेंट और कैफ़े डिजिटल मेनू कार्ड क्यूआर',
    hindiDesc: 'कांच की मेज या बिल काउंटर पर रखें ताकि ग्राहक मोबाइल से तुरंत पकवानों और खाद्य पदार्थों की सूची देख सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Digital Menu Web Link / PDF Menu', type: 'text', placeholder: 'https://mycafe.com/menu.pdf', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'customer-wifi-portal',
    name: 'Customer Spot Dedicated Wifi QR Link',
    slug: 'customer-spot-dedicated-wifi-qr-link',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['customer wifi', 'guest hotspot', 'cafeteria wifi pass', 'हॉटस्पॉट स्कैनर'],
    description: 'Provide curated secure hotspot details for hotel lounges, coworking spaces, and cafes. Simple setup config.',
    hindiTitle: 'होटल लाउंज व को-वर्किंग ग्राहक हॉटस्पॉट क्यूआर',
    hindiDesc: 'ग्राहकों को हाई-स्पीड परिसर वाई-फाई से जोड़ने हेतु सुंदर डिजाइन स्कैनर।',
    type: 'wifi',
    inputs: [
      { key: 'ssid', label: 'WiFi Hotspot ID (SSID)', type: 'text', placeholder: 'Hotel_Premium_Guest', isRequired: true },
      { key: 'password', label: 'Security Password', type: 'password', placeholder: 'guest2026', isRequired: false },
      { key: 'encryption', label: 'Encryption Mode', type: 'select', placeholder: 'WPA/WPA2', defaultValue: 'WPA', options: ['WPA', 'WEP', 'nopass'], isRequired: true }
    ],
    generateQRString: (vals) => `WIFI:S:${vals.ssid || 'Hotspot'};T:${vals.encryption || 'WPA'};P:${vals.password || ''};H:false;;`
  },
  {
    id: 'portfolio-link',
    name: 'Designer Creative Portfolio QR Tool',
    slug: 'designer-creative-portfolio-qr-tool',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['designer portfolio qr', 'behance dribbble shortcut', 'cv resume link QR', 'क्रिएटिव डिज़ाईन पोर्टफोलियो क्यूआर'],
    description: 'Direct corporate recruiters, art directors, or event managers to Behance, GitHub, or Dribbble portals to review mockups, UI work, or photography collections.',
    hindiTitle: 'डिजाइनर और डेवलपर पोर्टफोलियो क्यूआर',
    hindiDesc: 'अपने कलात्मक डिजाइनों, रेखाचित्रों या कोड सैंपलों को ऑफलाइन साक्षात्कार में प्रमोट करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Portfolio Link (Behance / GitHub)', type: 'text', placeholder: 'https://behance.net/aaravdesign', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://behance.net'
  },
  {
    id: 'invoice-payment',
    name: 'Digital CJS Invoice & Receipt QR Code',
    slug: 'digital-cjs-invoice-receipt-qr-code',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['invoice qr code', 'pay bill billing link', 'ecommerce checkout qr', 'डिजिटल बिल भुगतान क्यूआर'],
    description: 'Bind payment receipts or detailed PDF invoice summaries to orders, facilitating rapid client billing audits.',
    hindiTitle: 'डिजिटल बिल इनवॉइस व रसीद क्यूआर',
    hindiDesc: 'भुगतान पर्चियों और रसीदों का डिजिटल डेटा पारदर्शी क्यूआर में दर्ज करें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Invoice PDF / Payment Route URL', type: 'text', placeholder: 'https://accounting.com/invoice/99812/pdf', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'digital-ticket',
    name: 'Digital Event Concert Ticket QR Maker',
    slug: 'digital-event-concert-ticket-qr-maker',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['event ticket barcode', 'concert pass scan QR', 'secure checkin ticket', 'कॉन्सर्ट डिजिटल टिकट क्यूआर'],
    description: 'Generate scan validations for passes, movies, seminars, webinars, and public museum entry doors. Securely formatted.',
    hindiTitle: 'सिनेमा व कॉन्सर्ट डिजिटल टिकट प्रवेश क्यूआर',
    hindiDesc: 'दुकानदारों और कार्यक्रम संयोजकों के लिए प्रवेश टिकटों को स्कैन सत्यापित करने हेतु जनरेटर।',
    type: 'text',
    inputs: [
      { key: 'code', label: 'Ticket Unique ID / Serial Code', type: 'text', placeholder: 'TKT-2026-X892-092B', isRequired: true },
      { key: 'seat', label: 'Seat / Section Info', type: 'text', placeholder: 'Row G, Seat 24', isRequired: false },
      { key: 'venue', label: 'Venue Destination', type: 'text', placeholder: 'Pragati Maidan, Hall 4, Delhi', isRequired: false }
    ],
    generateQRString: (vals) => `TICKET_ID:${vals.code || 'NULL'}|SEAT:${vals.seat || 'GA'}|VENUE:${vals.venue || 'MAIN_HALL'}`
  },
  {
    id: 'feedback-survey',
    name: 'Client Feedback Questionnaire QR Tool',
    slug: 'client-feedback-questionnaire-qr-tool',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['feedback qr code', 'review sheet', 'customer stars audit', 'फीडबैक सर्वे प्रश्नावली क्यूआर'],
    description: 'Improve hotel or software service qualities. Get raw feedback sheets and scoring charts immediately from verified users using offline brochures.',
    hindiTitle: 'ग्राहक प्रतिक्रिया व सुझाव फार्म क्यूआर',
    hindiDesc: 'अपने स्टोर या क्लिनिक सुधार हेतु कस्टमर्स से सुझाव लेने वाली प्रश्नावली कोड।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Feedback / Survey Link', type: 'text', placeholder: 'https://docs.google.com/forms/example/viewform', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'google-survey',
    name: 'Google Forms Survey Questionnaire QR',
    slug: 'google-forms-survey-questionnaire-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['google form qr code', 'survey sheet generator', 'poll questionnaire', 'गूगल फॉर्म्स सर्वे क्यूआर'],
    description: 'Deploy online polls, data feedback collections, census records, or customer queries hosted on Google Forms.',
    hindiTitle: 'गूगल फॉर्म्स सर्वेक्षण प्रश्नावली क्यूआर',
    hindiDesc: 'स्कूलों, संस्थाओं या बाजार सर्वेक्षणों के लिए गूगल फॉर्म्स डेटा रिपोजिटरी स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Form Sharing URL', type: 'text', placeholder: 'https://forms.gle/exGoogleFormID', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://google.com'
  },
  {
    id: 'teams-meeting',
    name: 'Microsoft Teams Video Call Room QR',
    slug: 'microsoft-teams-video-call-room-qr',
    category: 'Business & Promo',
    isHighTraffic: false,
    keywords: ['teams meeting qr', 'corporate class room login', 'teams call connect', 'एमएस टीम्स मीटिंग क्यूआर'],
    description: 'Invite enterprise employees, project leads, or remote partners to join your active Microsoft Teams webinar and call lobbies.',
    hindiTitle: 'माइक्रोसॉफ्ट टीम्स ऑनलाइन मीटिंग क्यूआर',
    hindiDesc: 'कार्यालय की साप्ताहिक समीक्षा और रिमोट मीटिंग्स में तुरंत लॉग इन करने वाला डायरेक्ट कोड।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Microsoft Teams Meeting Link', type: 'text', placeholder: 'https://teams.microsoft.com/l/meetup-join/example', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://teams.microsoft.com'
  },

  // ==========================================
  // UTILITY & PERSONAL TOOLS (51 to 70)
  // ==========================================
  {
    id: 'calendar-event',
    name: 'Calendar Event Reminder QR Creator',
    slug: 'calendar-event-reminder-qr-creator',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['calendar event qr', 'add to calendar barcode', 'schedule task iCal', 'कैलेंडर इवेंट अनुस्मारक क्यूआर'],
    description: 'Schedule webinars, school quizzes, product sales, or meetings on users\' digital phone diaries. Adds event details, date, and description.',
    hindiTitle: 'कैलेण्डर रिमाइंडर इवेंट जोड़ने वाला क्यूआर',
    hindiDesc: 'स्कैनर को सीधे मोबाइल कैलेंडर में मीटिंग, परीक्षा समय या सेल की तारीख रिकॉर्ड करने का विकल्प दें।',
    type: 'event',
    inputs: [
      { key: 'title', label: 'Event Title', type: 'text', placeholder: 'Annual General Meeting', isRequired: true },
      { key: 'start', label: 'Start Date & Time (YYYYMMDDTHHMMSS)', type: 'text', placeholder: '20261225T100000', isRequired: true },
      { key: 'end', label: 'End Date & Time (YYYYMMDDTHHMMSS)', type: 'text', placeholder: '20261225T130000', isRequired: false },
      { key: 'details', label: 'Event Description / Location', type: 'textarea', placeholder: 'Corporate Hall B, New Delhi. Agenda: Growth Planning.', isRequired: false }
    ],
    generateQRString: (vals) => {
      const t = vals.title || 'Event';
      const s = vals.start || '20261225T100000';
      const e = vals.end || '20261225T130000';
      const d = vals.details || '';
      return `BEGIN:VEVENT\nSUMMARY:${t}\nDTSTART:${s}\nDTEND:${e}\nDESCRIPTION:${d}\nEND:VEVENT`;
    }
  },
  {
    id: 'clipboard-copy',
    name: 'Clipboard Text Auto-Copy QR Code',
    slug: 'clipboard-text-auto-copy-qr-code',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['clipboard copy qr', 'text to clipboard scan', 'copy coupon barcode', 'क्लिपबोर्ड ऑटो-कॉपी सन्देश'],
    description: 'Place promo coupon strings, server addresses, or raw API keys. Scan displays text on screen that is easily copyable to phone clipboards.',
    hindiTitle: 'क्लिपबोर्ड ऑटो-कॉपी टेक्स्ट क्यूआर',
    hindiDesc: 'कूपन कोड, वाईफाई पासवर्ड या सर्वर क्रेडेंशियल्स शेयर करने हेतु स्कैनर जिसे कॉपी करना सरल हो।',
    type: 'text',
    inputs: [
      { key: 'text', label: 'Text to Copy', type: 'textarea', placeholder: 'CONGRATS_FLAT_50_OFF', isRequired: true }
    ],
    generateQRString: (vals) => vals.text || ''
  },
  {
    id: 'secure-password',
    name: 'Secure Password Sharing QR Tool',
    slug: 'secure-password-sharing-qr-tool',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['password share qr', 'safe credentials qr', 'decrypt server pass', 'पासवर्ड शेयरींग गोपनीय क्यूआर'],
    description: 'Ensures safe sharing of digital hardware passwords, server keys, locker codes without leaking them over active chat network backups.',
    hindiTitle: 'सुरक्षित क्रेडेंशियल्स व पासवर्ड शेयरींग',
    hindiDesc: 'चैट बैकअप में पासवर्ड लीक किए बिना अपनी कंपनी के डेटा क्रेडेंशियल्स साझा करें।',
    type: 'text',
    inputs: [
      { key: 'label', label: 'Resource Label', type: 'text', placeholder: 'Database Server Node B', isRequired: true },
      { key: 'password', label: 'Credentials / Access Password', type: 'password', placeholder: 'AdminSecureKey#123', isRequired: true }
    ],
    generateQRString: (vals) => `RESOURCE:${vals.label || 'SYSTEM'}|PASSWORD:${vals.password || 'NULL'}`
  },
  {
    id: 'pgp-key',
    name: 'PGP/SSH Encryption Key Exchanger QR',
    slug: 'pgp-ssh-encryption-key-exchanger',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['pgp key code', 'ssh public key barcode', 'cybersecurity crypto exchange', 'एन्क्रिप्शन की एक्सचेंजर'],
    description: 'For tech administrators, developers, and blockchain experts. Distribute public cryptographic keys securely through scan modules.',
    hindiTitle: 'एन्क्रिप्शन PGP/SSH पब्लिक की एक्सचेंजर',
    hindiDesc: 'डेवलपर्स और सिस्टम एडमिनिस्ट्रेटर्स के लिए अपनी पब्लिक की शेयर करने का आधुनिक तरीका।',
    type: 'text',
    inputs: [
      { key: 'key', label: 'SSH / PGP Public Key Content', type: 'textarea', placeholder: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...', isRequired: true }
    ],
    generateQRString: (vals) => vals.key || ''
  },
  {
    id: 'audio-guide',
    name: 'Museum Audio Guide MP3 QR Link',
    slug: 'museum-audio-guide-mp3-qr-code',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['audio guide qr', 'museum tour recording', 'play podcast mp3 qr', 'ऑडियो गाइड एमपी३ संगीत क्यूआर'],
    description: 'Ideal for art exhibits, tracking centers, and archeological landmarks. Direct students to streaming explanation audio clips.',
    hindiTitle: 'ऑडियो गाइड व म्यूजियम एमपी३ प्लेयर क्यूआर',
    hindiDesc: 'धरोहर इतिहास केन्द्रों में प्रदर्शनियों और चित्रों के नीचे ऑडियो सन्देश बजाने वाला स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Audio Host / MP3 Link', type: 'text', placeholder: 'https://museumsite.com/audio/guide_item_12.mp3', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'slide-deck',
    name: 'Slide Deck PPT / PDF Presentation QR',
    slug: 'slide-deck-ppt-pdf-presentation-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['slide deck qr', 'powerpoint code', 'share speech project pdf', 'प्रस्तुति पीपीटी स्लाइड लिंक'],
    description: 'Showcase your corporate pitch slide deck, training manuals, or educational classroom PowerPoint files to listeners on stage.',
    hindiTitle: 'कॉर्पोरेट पीपीटी / पीडीएफ स्लाइड डेक क्यूआर',
    hindiDesc: 'मंच पर व्याख्यान देते समय स्क्रीन पर लगाएं ताकि दर्शक सीधे आपकी प्रेजेंटेशन फाइल पा सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Presentation Link (PDF/Google Slides)', type: 'text', placeholder: 'https://slideshare.com/docs/annual-pitch-2026', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'vcard-plus',
    name: 'Rich vCard Plus Biography QR Page',
    slug: 'rich-vcard-plus-biography-qr-page',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['vcard plus qr', 'rich contact card', 'biography resume portal', 'वीकार्ड प्लस रिच बायोडाटा'],
    description: 'Create a comprehensive digital card including social coordinates, profile images, portfolio targets and contact links.',
    hindiTitle: 'वीकार्ड प्लस व्यापक डिजिटल बायोडाटा क्यूआर',
    hindiDesc: 'साधारण वीकार्ड से भी बेहतर; डिजिटल फोटो और सोशल प्रोफाइल लिंक्स समेत आधुनिक संपर्क कार्ड।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Rich Digital Profile / Bio Link', type: 'text', placeholder: 'https://vcard.innovative.com/aarav_sharma', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'mecard-simple',
    name: 'MECARD High Speed Compact Contact QR',
    slug: 'mecard-high-speed-compact-contact-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['mecard code', 'compact contact barcode', 'mecard phone scanner', 'मीकार्ड संपर्क सूत्र क्यूआर'],
    description: 'A lighter counterpart to vCard. Due to lower data counts, QR codes generated are less dense, facilitating faster scan speeds on old cameras.',
    hindiTitle: 'मीकार्ड कॉम्पैक्ट मोबाइल संपर्क क्यूआर',
    hindiDesc: 'कम डेटा घनत्व वाला कॉम्पैक्ट स्कैनर, जो पुराने फोन और प्रिंट मीडिया पर भी तेजी से स्कैन होता है।',
    type: 'mecard',
    inputs: [
      { key: 'name', label: 'Contact Name', type: 'text', placeholder: 'Aarav Sharma', isRequired: true },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+919876543210', isRequired: true },
      { key: 'email', label: 'Email', type: 'text', placeholder: 'aarav@web.com', isRequired: false }
    ],
    generateQRString: (vals) => `MECARD:N:${vals.name || ''};TEL:${vals.phone || ''};EMAIL:${vals.email || ''};;`
  },
  {
    id: 'local-tour',
    name: 'Local Tour Map & Travel Itinerary QR',
    slug: 'local-tour-map-travel-itinerary-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['tour itinerary qr', 'travel coordinates bar', 'local directions pointer', 'पर्यटन यात्रा मार्गदर्शक क्यूआर'],
    description: 'Provide vacation details, city map trails, hotel landmarks, or custom sightseeing guides to foreign tourists inside vacation brochures.',
    hindiTitle: 'पर्यटन यात्रा मार्गदर्शक व दिशा सूचक क्यूआर',
    hindiDesc: 'ट्रेवल एजेंसियों और होटलों के लिए दर्शनीय स्थलों और पर्यटन मार्गों का एक साझा मैप रूट।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Travel Map / Custom Itinerary Route Link', type: 'text', placeholder: 'https://google.com/maps/dir/exroute', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://google.com'
  },
  {
    id: 'uber-place',
    name: 'Ride Calling Hook Event Uber QR Code',
    slug: 'ride-calling-hook-event-uber-qr-code',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['uber pickup coordinates', 'book taxi dispatch', 'ride helper widget', 'उबर टैक्सी पिकअप लोकेशन'],
    description: 'Make ride booking simple for party halls or business gates. Scans can launch taxi ride apps prefilled with destiny directions.',
    hindiTitle: 'उबर कैब बुकिंग डेस्टिनेशन पिकअप क्यूआर',
    hindiDesc: 'होटलों या क्लब द्वारों पर लगाएं ताकि मेहमान सीधे लोकेशन फीड के साथ कैब और टैक्सी बुला सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Uber Ride Destination / Pickup Link', type: 'text', placeholder: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://uber.com'
  },
  {
    id: 'airbnb-property',
    name: 'Airbnb Homestay Review & Booking QR',
    slug: 'airbnb-homestay-review-booking-qr-code',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['airbnb checkin qr', 'rent vacation spot portal', 'tenant house rule book', 'एयरबीएनबी होमस्टे गेस्टहाउस स्कैनर'],
    description: 'Enhance guest onboarding. Display inside the foyer so tenants can check-in, review rules, sync local guides, or rate the villa stay.',
    hindiTitle: 'एयरबीएनबी होमस्टे गाइड व बुकिंग क्यूआर',
    hindiDesc: 'गेस्टहाउस या फ्लैट के ड्रॉइंगरूम में लगाएं ताकि किराएदार वाईफाई रूल्स, हाउस गाइड और रेटिंग पा सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Airbnb Listing / Property Page Link', type: 'text', placeholder: 'https://airbnb.com/rooms/example_villa', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://airbnb.com'
  },
  {
    id: 'yelp-review',
    name: 'Yelp Digital Business Rating Scan QR',
    slug: 'yelp-digital-business-rating-scan-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['yelp business rating qr', 'local restaurant star feedback', 'get review sheets', 'यैल्प स्थानीय रेटिंग्स स्टार क्यूआर'],
    description: 'Boost local visibility in search sheets. Perfect for western diners, laundry houses, barbers, and boutiques targeting Yelp organic star ranks.',
    hindiTitle: 'यैल्प बिजनेस डायरेक्ट रेटिंग्स जनरेटर',
    hindiDesc: 'कस्टमर्स से सीधे यैल्प रिव्यू प्राप्त करने का ऑफलाइन डिजिटल समाधान।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Yelp Store Listing Link', type: 'text', placeholder: 'https://yelp.com/biz/your-shop-slug', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://yelp.com'
  },
  {
    id: 'tripadvisor-venue',
    name: 'TripAdvisor Hotel / Lounge Recommendation QR',
    slug: 'tripadvisor-hotel-lounge-recommendation',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['tripadvisor reviews barcode', 'hotel star rating scan', 'tourist resort recommend', 'ट्रिपएडवाइजर होटल अनुशंसा क्यूआर'],
    description: 'Acquire positive travel recommendations from guest diaries. Designed for five-star farm stays, mountain safaris, and heritage palaces.',
    hindiTitle: 'ट्रिपएडवाइजर टूरिस्ट स्पॉट रिव्यू क्यूआर',
    hindiDesc: 'पर्यटक रिजॉर्टों व होटलों के लिए मेहमानों के रिव्यू एकत्रित करने का प्रमुख मार्ग।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'TripAdvisor Resort Page Link', type: 'text', placeholder: 'https://tripadvisor.com/Hotel_Review-example', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://tripadvisor.com'
  },
  {
    id: 'customer-survey',
    name: 'Product Feedback Scoring Dashboard QR',
    slug: 'product-feedback-scoring-dashboard-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['customer score card', 'experience audit sheet', 'retail review dashboard', 'उत्पाद अनुभव स्कोरकार्ड'],
    description: 'Track software product metrics or food scores. Place on packaging boxes to receive consumer bugs, suggestions, and grading indices.',
    hindiTitle: 'उत्पाद गुणवत्ता अनुभव रेटिंग क्यूआर कोड',
    hindiDesc: 'पैकेजिंग बॉक्स पर प्रिंट करें ताकि खरीदार उत्पाद के उपयोग का अनुभव रेटिंग साझा कर सकें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Feedback Web App Link', type: 'text', placeholder: 'https://survey.mybrand.com/product-index', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'checkout-address',
    name: 'Self-Checkout Counter Billing Registry QR',
    slug: 'self-checkout-counter-billing-registry-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['self checkout scan qr', 'scan to pay registers', 'digital queuing cart', 'स्वयं-चेकआउट काउंटर पंजीकरण'],
    description: 'Improve supermarket queue management. Linking scan directly to modern self-checkout web carts or payment terminals.',
    hindiTitle: 'काउंटर कतार रहित सेल्फ-चेकआउट बिल लिंक क्यूआर',
    hindiDesc: 'सुपरमार्केट में कतारों से बचने हेतु ग्राहकों के मोबाइल भुगतान काउंटर को जोड़ने वाला कोड।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Checkout Portal Hook Link', type: 'text', placeholder: 'https://checkout.mystore.com/register?counter_id=C4', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'local-wifi-portal',
    name: 'Local Router Login Portal Sync QR',
    slug: 'local-router-login-portal-sync-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['router admin login', 'gateway portal config page', 'network setup code', 'राउटर लॉगिन गेटवे क्यूआर'],
    description: 'Ideal for broadband tech setups. Place on routers to direct staff directly to setup portals with IP parameters preconfigured.',
    hindiTitle: 'ब्रॉडबैंड गेटवे व राउटर लॉगिन पैनल क्यूआर',
    hindiDesc: 'राउटर उपकरणों के पीछे लगाने हेतु, ताकि एडमिन आईपी लॉगिन पेज (192.168.1.1) तुरंत ओपन हो सके।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Gateway Access Link', type: 'text', placeholder: 'http://192.168.1.1/admin', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'http://192.168.1.1'
  },
  {
    id: 'photo-slide',
    name: 'Event Image Gallery Slideshow Link QR',
    slug: 'event-image-gallery-slideshow-link-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['photo gallery share', 'cloud album access', 'wedding photos backup', 'शादी फोटो एलबम शेअर स्कैनर'],
    description: 'Exchanging wedding clicks, ceremony videos, or party group shots. Direct guests to shareable photo bucket links (Drive, iCloud, Flickr).',
    hindiTitle: 'शादी व पाटी फ़ोटो एलबम / स्लाइडशो क्यूआर',
    hindiDesc: 'मेहमानों को शादी के सुंदर फोटो एलबम और क्लाउड फ़ोटो एल्बम का एक्सेस प्रदान करने हेतु सटीक क्यूआर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Cloud Photos Folder Link', type: 'text', placeholder: 'https://photos.app.goo.gl/example_album_id', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://photos.google.com'
  },
  {
    id: 'google-docs',
    name: 'Google Docs Document Secure Share QR',
    slug: 'google-docs-document-secure-share-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['google docs qr', 'share office file link', 'docs assignment code', 'गूगल डॉक्स प्रलेख शेयरींग क्यूआर'],
    description: 'Review essays, research drafts, or contract copies. Scan links straight to Google Docs files open for public edits or reading access.',
    hindiTitle: 'गूगल डॉक्स असाइनमेंट और नोट्स शेयरींग क्यूआर',
    hindiDesc: 'प्रोजेक्ट रिपोर्ट्स और डिजिटल प्रलेखों को प्रमोट करने हेतु सटीक सहायक क्यूआर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Docs Public URL', type: 'text', placeholder: 'https://docs.google.com/document/d/example_docs_id/view', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://docs.google.com'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets Data Log Spreadsheet QR',
    slug: 'google-sheets-data-log-spreadsheet-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['google sheets qr code', 'spreadsheet database link', 'excel share bar', 'गूगल शीट्स डेटा रिकॉर्डर'],
    description: 'Share log records, student marks, inventory trackers, or budget worksheets created on cloud Google Sheets grids.',
    hindiTitle: 'गूगल शीट्स डेटा स्प्रेडशीट शेअर क्यूआर',
    hindiDesc: 'स्टॉक इन्वेंट्री या खर्चों वाली गूगल शीट्स को टीम में तेजी से शेयर करने हेतु जनरेटर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Sheets URL', type: 'text', placeholder: 'https://docs.google.com/spreadsheets/d/example_sheets_id/edit', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://docs.google.com'
  },
  {
    id: 'google-slides',
    name: 'Google Slides Event Presentation Live QR',
    slug: 'google-slides-event-presentation-live-qr',
    category: 'Utility & Personal',
    isHighTraffic: false,
    keywords: ['google slides qr code', 'live ppt reader', 'slides share portal', 'गूगल स्लाइड प्रस्तुति लाइव स्कैनर'],
    description: 'Link seminar audiences to your educational slide cards on stage to follow along during live training hours.',
    hindiTitle: 'गूगल स्लाइड्स लाइव प्रेजेंटेशन शेयरींग क्यूआर',
    hindiDesc: 'मंच पर प्रिव्यू करने के लिए अपनी शैक्षणिक प्रेजेंटेशन स्लाइड्स का सीधा स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Google Slides Public Link', type: 'text', placeholder: 'https://docs.google.com/presentation/d/example_slides_id/view', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://docs.google.com'
  },

  // ==========================================
  // E-COMMERCE & SUPPORT TOOLS (71 to 85)
  // ==========================================
  {
    id: 'amazon-product',
    name: 'Amazon Product Retail Affiliate Store QR',
    slug: 'amazon-product-retail-affiliate-store-qr',
    category: 'E-Commerce',
    isHighTraffic: true,
    keywords: ['amazon product qr', 'amazon affiliate barcode', 'buy item amazon link', 'अमेज़न उत्पाद एफिलिएट क्यूआर', 'खरीदारी स्कैनर'],
    description: 'Direct buyers to your affiliate product page or online Amazon store listings. Ideal for creators reviewing goods inside print journals.',
    hindiTitle: 'अमेज़न प्रोडक्ट डायरेक्ट बुकिंग व एफिलिएट क्यूआर',
    hindiDesc: 'यूट्यूब वीडियो रिव्यू या पत्रिकाओं के नीचे प्रमोट करने के लिए अमेज़न एफिलिएट लिंक प्रमोटर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Amazon Product Listing / Store URL', type: 'text', placeholder: 'https://amazon.in/dp/B0example', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://amazon.com'
  },
  {
    id: 'etsy-shop',
    name: 'Etsy Handcraft Store Listings Link QR',
    slug: 'etsy-handcraft-store-listings-link-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['etsy shop qr code', 'handcraft seller portal', 'buy vintage decor qr', 'एटसी प्राचीन हस्तशिल्प स्टोर'],
    description: 'Promote vintage items, hand-crafted decor and painting lists styled on Etsy. Attach stickers near custom product packing boxes.',
    hindiTitle: 'एटसी हस्तकला व विंटेज उत्पाद स्टोर क्यूआर',
    hindiDesc: 'छोटे कलाकारों और हस्तकला शिल्पकारों के लिए अपना ग्लोबल स्टोर ऑनलाइन ऑफलाइन मिलाने हेतु स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Etsy Storefront URL', type: 'text', placeholder: 'https://www.etsy.com/shop/aaravhandicrafts', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://etsy.com'
  },
  {
    id: 'ebay-seller',
    name: 'eBay Professional Seller Store Auction QR',
    slug: 'ebay-professional-seller-store-auction-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['ebay seller qr', 'ebay auction portal', 'buy vintage gear qr', 'ईबे सेलर उत्पाद नीलामी क्यूआर'],
    description: 'Drive high-traffic active bidding on custom collectibles, gadgets, or vehicles auctioned on the eBay marketplace.',
    hindiTitle: 'ईबे ग्राहक नीलामी और सेलर स्टोर क्यूआर',
    hindiDesc: 'ईबे सेलर आईडी और चल रही नीलामी प्रविष्टियों को सीधे ऑफलाइन खरीदारों से जोड़ने वाला स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'eBay Store / Listing Link', type: 'text', placeholder: 'https://www.ebay.com/itm/123456789', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://ebay.com'
  },
  {
    id: 'shopify-checkout',
    name: 'Shopify Store Checkout Cart Direct QR',
    slug: 'shopify-store-checkout-cart-direct-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['shopify checkout qr', 'ecom store pay', 'buy now cart link', 'शॉपिफाई डायरेक्ट चेकआउट कार्ट'],
    description: 'Speed up user ordering. Place tags on print ads so shoppers skip exploring site paths and jump straight to the purchase cart page.',
    hindiTitle: 'शॉपिफाई स्टोर डायरेक्ट खरीदें क्यूआर',
    hindiDesc: 'ग्राहकों को पूरी वेबसाइट पर घुमाने के बजाय सीधे कस्टमाइज्ड पेमेंट कार्ट पर भेजने का जरिया।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Shopify Product Checkout URL', type: 'text', placeholder: 'https://mybrand.com/cart/39812:1', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://shopify.com'
  },
  {
    id: 'woocommerce-checkout',
    name: 'WooCommerce Pay Terminal Link QR Tool',
    slug: 'woocommerce-pay-terminal-link-qr-tool',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['woocommerce qr', 'wp ecommerce gateway', 'scan to buy product', 'वर्डप्रेस वू-कॉमर्स भुगतान क्यूआर'],
    description: 'Ensure rapid WordPress cart billing. Connect offline display cards straight to your automated checkout checkout forms.',
    hindiTitle: 'वू-कॉमर्स डिजिटल स्टोर भुगतान गेटवे क्यूआर',
    hindiDesc: 'वर्डप्रेस पर आधारित ऑनलाइन स्टोर्स के लिए सीधे उत्पाद भुगतान और चेकआउट जनरेटर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'WooCommerce Checkout / Product URL', type: 'text', placeholder: 'https://mysite.com/checkout?add-to-cart=216', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  },
  {
    id: 'paypal-donation',
    name: 'PayPal NGO / Charity Donation Direct QR',
    slug: 'paypal-ngo-charity-donation-direct-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['paypal donation qr', 'charity support link', 'ngo fund funding bar', 'पेपाल एनजीओ दान चैरिटी क्यूआर'],
    description: 'Gather relief donations easily. Highlight on charity flyers so donors can send safe contributions using personal PayPal wallets.',
    hindiTitle: 'पेपाल चैरिटी व एनजीओ दान पे स्कैनर',
    hindiDesc: 'परोपकारी कार्यों और एनजीओ निधि के लिए सीधे पेपाल ऐप आधारित भुगतान लिंक प्रदाता।',
    type: 'url',
    inputs: [
      { key: 'email', label: 'PayPal Email Address', type: 'text', placeholder: 'ngo@helpfoundation.org', isRequired: true },
      { key: 'amount', label: 'Default Donation Amount ($)', type: 'number', placeholder: '25', isRequired: false },
      { key: 'cause', label: 'NGO Support Cause / Campaign Name', type: 'text', placeholder: 'Clean Water Relief Fund', isRequired: false }
    ],
    generateQRString: (vals) => {
      const email = vals.email || 'charity@paypal.com';
      const amt = vals.amount || '10';
      const cs = encodeURIComponent(vals.cause || 'Donation Support');
      return `https://www.paypal.com/donate?business=${email}&amount=${amt}&item_name=${cs}&currency_code=USD`;
    }
  },
  {
    id: 'paypal-payment',
    name: 'PayPal Merchant Goods Purchase QR Creator',
    slug: 'paypal-merchant-goods-purchase-qr-creator',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['paypal pay order', 'merchant paypal qr', 'buy digital asset code', 'पेपाल ग्राहक उत्पाद क्रय क्यूआर'],
    description: 'Charge buyers for ebooks, template packs or custom design commissions securely using verified web checkouts on PayPal.',
    hindiTitle: 'पेपाल मर्चेंट डिजिटल गुड्स व्यापार क्यूआर',
    hindiDesc: 'कस्टमर्स से सीधे सेवाओं और ई-बुक्स का मर्चेंट भुगतान सुरक्षित तरीके से वसूलें।',
    type: 'url',
    inputs: [
      { key: 'email', label: 'Merchant PayPal Email', type: 'text', placeholder: 'sales@innovativebrand.com', isRequired: true },
      { key: 'item', label: 'Product Name / ID', type: 'text', placeholder: 'Pro Developer Template Pack', isRequired: true },
      { key: 'price', label: 'Product Sales Price ($)', type: 'number', placeholder: '49', isRequired: true }
    ],
    generateQRString: (vals) => {
      const email = vals.email || 'sales@brand.com';
      const item = encodeURIComponent(vals.item || 'Generic Item');
      const price = vals.price || '5';
      return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${email}&item_name=${item}&amount=${price}&currency_code=USD`;
    }
  },
  {
    id: 'stripe-payment',
    name: 'Stripe Payment Button Checkout Portal QR',
    slug: 'stripe-payment-button-checkout-portal-qr',
    category: 'E-Commerce',
    isHighTraffic: true,
    keywords: ['stripe payment qr', 'stripe link checkout', 'buy template package', 'स्ट्राइप ऑनलाइन पेमेंट बटन क्यूआर'],
    description: 'Perfect for business invoices. Create a high contrast code connecting scanners straight to Stripe pre-configured Checkout links.',
    hindiTitle: 'स्ट्राइप कस्टमाइज्ड पेमेंट चेकआउट क्यूआर',
    hindiDesc: 'स्ट्राइप पेमेंट गेटवे को ऑफलाइन कस्टमाइज़ कार्ड पर दर्शा कर ग्राहकों से त्वरित पेमेंट लें।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Stripe Payment Link (Buy Link)', type: 'text', placeholder: 'https://buy.stripe.com/exPaymentLinkCode', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://stripe.com'
  },
  {
    id: 'buymeacoffee-support',
    name: 'Buy Me a Coffee Support Tip QR Maker',
    slug: 'buy-me-a-coffee-support-tip-qr-maker',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['buy me a coffee qr', 'creator support tip link', 'donation support channel', 'बाय मी अ कॉफ़ी डाएट सपोर्ट'],
    description: 'Great for writers, YouTubers, and podcasters. Display on slideshow screens so loyal audiences can fund small creator tips.',
    hindiTitle: 'बाय मी अ कॉफ़ी क्रिएटर सपोर्ट क्यूआर',
    hindiDesc: 'अपने ब्लॉग या रचनात्मक वीडियो पर लगाएं ताकि प्रशंसक सीधा आर्थिक योगदान भेज सकें।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'Buy Me a Coffee Username', type: 'text', placeholder: 'aarav_sharma', isRequired: true }
    ],
    generateQRString: (vals) => {
      const u = vals.username ? vals.username.replace('@', '').trim() : 'creator';
      return `https://buymeacoffee.com/${u}`;
    }
  },
  {
    id: 'patreon-member',
    name: 'Patreon Tiered Membership Portal QR',
    slug: 'patreon-tiered-membership-portal-qr-code',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['patreon supporter qr', 'members content access', 'recurring creator donation', 'पैट्रियन विशिष्ट लेख सदस्यता'],
    description: 'Promote exclusive creator content portals. Let loyal readers subscribe to monthly subscription tiers directly through scans.',
    hindiTitle: 'पैट्रियन विशिष्ट मेम्बरशिप पोर्टल क्यूआर',
    hindiDesc: 'अपनी रचनात्मक प्रीमियम सामग्री के ग्राहकों (Patrons) का आधार बढ़ाने के लिए कस्टमाइज्ड स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'username', label: 'Patreon Page Username', type: 'text', placeholder: 'aarav_studios', isRequired: true }
    ],
    generateQRString: (vals) => {
      const u = vals.username ? vals.username.replace('@', '').trim() : 'patreon';
      return `https://patreon.com/${u}`;
    }
  },
  {
    id: 'substack-news',
    name: 'Substack Newsletter Reader Subscription QR',
    slug: 'substack-newsletter-reader-subscription-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['substack qr code', 'subscribe newsletter news', 'read articles blog post', 'सबस्टैक न्यूज़लेटर रीडर सदस्यता'],
    description: 'Increase corporate or individual newsletter readers. Perfect for business consulting posters and presentation credit slides.',
    hindiTitle: 'सबस्टैक पब्लिशिंग न्यूज़लेटर क्यूआर कोड',
    hindiDesc: 'आपके बौद्धिक लेखों व खोजी पत्रकारिता न्यूज़लेटर के पाठकों की संख्या बढ़ाने हेतु कस्टमाइज्ड स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Substack Publication URL', type: 'text', placeholder: 'https://aaravletter.substack.com', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://substack.com'
  },
  {
    id: 'kickstarter-crowd',
    name: 'Kickstarter Creative Campaign Fund QR',
    slug: 'kickstarter-creative-campaign-fund-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['kickstarter qr link', 'startup crowd backup portal', 'fund innovation', 'किकस्टार्टर अभिनव स्टार्टअप फंडिंग'],
    description: 'Place scan codes on design prototypes to direct early backers straight to your product funding targets on Kickstarter.',
    hindiTitle: 'किकस्टार्टर स्टार्टअप क्राउडफंडिंग क्यूआर',
    hindiDesc: 'नवीन उत्पादों और आविष्कारों के लिए निवेशकों और बैकर्स को स्टार्टअप पेज पर लाने के लिए।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Kickstarter Project Link', type: 'text', placeholder: 'https://www.kickstarter.com/projects/creator/my-gadget', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://kickstarter.com'
  },
  {
    id: 'indiegogo-project',
    name: 'Indiegogo Crowdfunder Direct Portal QR',
    slug: 'indiegogo-crowdfunder-direct-portal-qr',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['indiegogo barcode url', 'support tech startup', 'early backing list', 'इंडीगोगो अभिनव प्रोजेक्ट निवेशक'],
    description: 'Collect active capital allocations, technology pre-orders, and film funding reserves managed on Indiegogo dashboards.',
    hindiTitle: 'इंडीगोगो स्टार्टअप प्री-ऑर्डर कैंपेन क्यूआर',
    hindiDesc: 'रचनात्मक फिल्मों और तकनीकी गैजेट्स की प्री-बुकिंग ऑफलाइन विज्ञापन द्वारा करवाने हेतु स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Indiegogo Campaign Link', type: 'text', placeholder: 'https://www.indiegogo.com/projects/example-innovative-gadget', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://indiegogo.com'
  },
  {
    id: 'gumroad-product',
    name: 'Gumroad Digital Product Checkout QR Link',
    slug: 'gumroad-digital-product-checkout-qr-link',
    category: 'E-Commerce',
    isHighTraffic: false,
    keywords: ['gumroad qr code', 'buy ebook link qr', 'digital presets asset store', 'गमरोड डिजिटल उत्पाद स्टोर क्यूआर'],
    description: 'Sell LUT presets, coders\' software scripts, vector assets, and digital workbooks smoothly. QR forwards right to store.',
    hindiTitle: 'गमरोड डिजिटल बुक और कोडिंग असेट्स क्यूआर',
    hindiDesc: 'अपनी कोडिंग बुक्स, फोटो फिल्टर्स या ब्रश पैक्स को गमरोड के जरिए डायरेक्ट ऑफलाइन बेचने हेतु।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Gumroad Store/Product URL', type: 'text', placeholder: 'https://aaravart.gumroad.com/l/probrush', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://gumroad.com'
  },
  {
    id: 'linktree-links',
    name: 'Linktree Multi-Link Biography Page QR',
    slug: 'linktree-multi-link-biography-page-qr-code',
    category: 'E-Commerce',
    isHighTraffic: true,
    keywords: ['linktree qr code', 'all in one social link', 'bio linktree code', 'लिंकट्री मल्टी-लिंक प्रोफाइल क्यूआर', 'बायो लिंक'],
    description: 'Gather all your website destinations, portfolios, YouTube setups and store portals into one neat consolidated directory page.',
    hindiTitle: 'लिंकट्री मल्टी-लिंक कॉम्बो प्रोफाइल क्यूआर',
    hindiDesc: 'एक ही कोड में आपकी वेबसाइट, यूट्यूब, फेसबुक और स्टोर के समस्त लिंक्स को समेटने वाला सुपर बायो स्कैनर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Linktree Profile URL', type: 'text', placeholder: 'https://linktr.ee/aarav_sharma', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://linktr.ee'
  },

  // ==========================================
  // CRYPTO & WEB3 TOOLS (86 to 100)
  // ==========================================
  {
    id: 'btc-wallet',
    name: 'Bitcoin (BTC) Wallet Transfer QR Creator',
    slug: 'bitcoin-btc-wallet-transfer-qr-creator',
    category: 'Crypto & Web3',
    isHighTraffic: true,
    keywords: ['bitcoin qr code', 'btc wallet address', 'crypto pay ledger', 'बिटकॉइन सार्वजनिक बटुआ क्यूआर', 'क्रिप्टो बटुआ'],
    description: 'Avoid transaction errors caused by typing messy long crypto strings. Scanning displays the recipient Bitcoin wallet address instantly.',
    hindiTitle: 'बिटकॉइन (BTC) सिक्योर वॉलेट एड्रेस क्यूआर',
    hindiDesc: 'गलती की गुंजाइश को समाप्त करें; ६४ अक्षरों वाले बिटकॉइन बटुआ एड्रेस का सहज स्कैन विजुअल बनाएं।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Bitcoin (BTC) Public Wallet Address', type: 'text', placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', isRequired: true },
      { key: 'amount', label: 'Requested Amount (BTC, Optional)', type: 'text', placeholder: '0.0025', isRequired: false }
    ],
    generateQRString: (vals) => {
      const addr = vals.address || '';
      const amt = vals.amount ? `?amount=${vals.amount}` : '';
      return `bitcoin:${addr}${amt}`;
    }
  },
  {
    id: 'eth-wallet',
    name: 'Ethereum (ETH) Wallet Ledger Route QR',
    slug: 'ethereum-eth-wallet-ledger-route-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['ethereum qr code', 'eth metamask smartcontract', 'receive eth coin barcode', 'इथेरियम ट्रांसफर क्यूआर'],
    description: 'Accept ETH, ERC-20 stablecoins, or NFT transfers. Secure encryption validator linking straight to the ledger destination.',
    hindiTitle: 'इथेरियम (ETH) और ERC-20 वॉलेट क्यूआर कोड',
    hindiDesc: 'मेटामास्क, ट्रस्ट वॉलेट या लेजर कस्टडी में इथेरियम सिक्के व टोकन प्राप्त करने का सुरक्षित कोड।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Ethereum (ETH) ERC-20 Address', type: 'text', placeholder: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', isRequired: true }
    ],
    generateQRString: (vals) => `ethereum:${vals.address || ''}`
  },
  {
    id: 'sol-wallet',
    name: 'Solana (SOL) SPL Token Transfer QR Tool',
    slug: 'solana-sol-spl-token-transfer-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['solana wallet qr', 'sol phantom address', 'receive spl token bar', 'सोलाना क्रिप्टो सेंडर क्यूआर'],
    description: 'Acquire high speed Solana or digital USDC-SPL transfers. Connects scanners directly to Phantom ledger repositories.',
    hindiTitle: 'सोलाना (SOL) और SPL वॉलेट एड्रेस क्यूआर',
    hindiDesc: 'फैंटम या सोलेयर वॉलेट्स में तेज गती सोलाना सैटलमेंट की सुविधा देने हेतु स्कैनर।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Solana (SOL) Wallet Address', type: 'text', placeholder: 'HN7cABviGo3SgR6vcdasHQ9gVAGX2...', isRequired: true }
    ],
    generateQRString: (vals) => vals.solAddress || vals.address || ''
  },
  {
    id: 'xrp-wallet',
    name: 'Ripple (XRP) Ledger Transaction Address QR',
    slug: 'ripple-xrp-ledger-transaction-address-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['ripple qr code', 'xrp tag address ledger', 'crypto pay bank transfer', 'रिपल एक्सआरपी बटुआ क्यूआर'],
    description: 'Receive bank-friendly digital assets. Generates address blocks combined with optional destination tags for exchange deposits.',
    hindiTitle: 'रिपल (XRP) लेजर व डेस्टिनेशन टैग क्यूआर',
    hindiDesc: 'एक्सआरपी वॉलेट के लिए विशिष्ट डेस्टिनेशन टैग और कस्टमाइज़ भुगतान ब्लॉक जनरेटर।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'XRP Public Address', type: 'text', placeholder: 'rEb8u7recox45ntLjgU8AM6cx9zjdLKY...', isRequired: true },
      { key: 'tag', label: 'Destination Tag (Numbers Only)', type: 'text', placeholder: '1098273', isRequired: false }
    ],
    generateQRString: (vals) => {
      const tag = vals.tag ? `?dt=${vals.tag}` : '';
      return `ripple:${vals.address || ''}${tag}`;
    }
  },
  {
    id: 'ada-wallet',
    name: 'Cardano (ADA) Ledger Payment Pointer QR',
    slug: 'cardano-ada-ledger-payment-pointer-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['cardano qr', 'ada yoroi address barcode', 'crypto web3 payment code', 'कार्डानो वॉलेट क्यूआर'],
    description: 'Ensure accurate Shelly-era Yoroi address sharing. Protect assets from mistyping ledger keys on system interfaces.',
    hindiTitle: 'कार्डानो (ADA) शेली-एरा वॉलेट क्यूआर',
    hindiDesc: 'योरोई व नमामि आधारित सुरक्षित कार्डानो सिक्कों के कलेक्टिव भुगतान हेतु जनरेटर।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Cardano (ADA) Public Key Address', type: 'text', placeholder: 'addr1q8v6ex...', isRequired: true }
    ],
    generateQRString: (vals) => vals.address || ''
  },
  {
    id: 'doge-wallet',
    name: 'Dogecoin (DOGE) Meme Coin Wallet QR Maker',
    slug: 'dogecoin-doge-meme-coin-wallet-qr-maker',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['dogecoin qr code', 'doge coin tracker', 'receive doge meme coin', 'डॉगकॉइन वॉलेट डिजिटल क्यूआर'],
    description: 'Recruiting tips or peer payments in Doge. Simple, quick scanning block layout compatible with decentral wallets.',
    hindiTitle: 'डॉगकॉइन (DOGE) डायरेक्ट वैलेट क्यूआर',
    hindiDesc: 'अपने प्रशंसकों या मीम कम्युनिटी से सीधे डॉगकॉइन रसीदें सहजता से लेने हेतु जनरेटर।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Dogecoin Address', type: 'text', placeholder: 'DFDshgJkK9vca...', isRequired: true }
    ],
    generateQRString: (vals) => `dogecoin:${vals.address || ''}`
  },
  {
    id: 'ltc-wallet',
    name: 'Litecoin (LTC) Ledger Express Pay QR',
    slug: 'litecoin-ltc-ledger-express-pay-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['litecoin qr', 'ltc transactions barcode', 'crypto fast payout link', 'लाइटकॉइन क्विक पे क्यूआर'],
    description: 'Provide quick digital micro-payments using Litecoin network grids. Protect assets using physical scan cards.',
    hindiTitle: 'लाइटकॉइन (LTC) एक्सप्रेस पे वॉलेट जनरेटर',
    hindiDesc: 'लाइटकॉइन के नगण्य ट्रांसफर शुल्क ढांचे का उपयोग करके त्वरित व्यापार भुगतान प्राप्त करें।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Litecoin (LTC) Wallet Address', type: 'text', placeholder: 'M8v6cx9zjdLky...', isRequired: true }
    ],
    generateQRString: (vals) => `litecoin:${vals.address || ''}`
  },
  {
    id: 'bnb-wallet',
    name: 'Binance Smart Chain (BNB) Transfer QR Tool',
    slug: 'binance-smart-chain-bnb-transfer-qr-tool',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['binance smart chain qr', 'bsc bep20 address', 'bnb trust wallet scan', 'बायनेस स्मार्ट चैन वॉलेट क्यूआर'],
    description: 'Direct users to your BEP-20 public addresses on Trust Wallet or Metamask to complete dApp services or payment receipts.',
    hindiTitle: 'बायनेन्स स्मार्ट चेन (BNB) BEP-20 क्यूआर',
    hindiDesc: 'बायनेन्स चैन पर न्यूनतम गैस-फीस आधारित लेनदेन और टोकन रिसीव करने का सुरक्षित मार्ग।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'BSC BNB Address (BEP-20)', type: 'text', placeholder: '0x71C7656EC7ab88b098defB751B7401B5f6d8975F', isRequired: true }
    ],
    generateQRString: (vals) => vals.address || ''
  },
  {
    id: 'usdt-wallet',
    name: 'Tether (USDT) Stablecoin Payment Vault QR',
    slug: 'tether-usdt-stablecoin-payment-vault-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['tether usdt qr', 'rc20 trc20 usdt address', 'digital dollar payout code', 'टीथर यूएसडीटी स्टेबलकॉइन बटुआ'],
    description: 'Collect digital USD equivalents on TRC-20, ERC-20, or Solana layers without high price volatility indexing.',
    hindiTitle: 'टीथर (USDT) स्टेबलकॉइन विनिमय क्यूआर',
    hindiDesc: 'डॉलर के मुकाबले स्थिर मूल्य वाले यूएसडीटी कॉइन्स कलेक्ट करने का मर्चेंट समाधान।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'USDT Receiving Address', type: 'text', placeholder: 'TXexTrc20AddressExampleStr...', isRequired: true },
      { key: 'network', label: 'Target Blockchain Network', type: 'select', placeholder: 'TRC-20 (Tron)', defaultValue: 'TRC-20', options: ['TRC-20', 'ERC-20', 'Solana-SPL', 'Polygon-BEP20'], isRequired: true }
    ],
    generateQRString: (vals) => `USDT_NETWORK:${vals.network || 'TRC20'}|ADDRESS:${vals.address || ''}`
  },
  {
    id: 'usdc-wallet',
    name: 'USD Coin (USDC) Secure Transaction QR code',
    slug: 'usd-coin-usdc-secure-transaction-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['usdc crypto qr', 'receive usdc payments', 'coinbase wallet usdc', 'यूएसडी कॉइन स्टेबल विनिमय स्कैनर'],
    description: 'Ensure secure audited stable payments using USD Coin. Compatible with global digital banking rails.',
    hindiTitle: 'यूएसडी कॉइन (USDC) सुरक्षित मर्चेंट सिक्का क्यूआर',
    hindiDesc: 'सर्किल और कॉइनबेस द्वारा समर्थित डिजिटल यूएसडीसी डॉलर कलेक्टिव स्कैनर।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'USDC Public Address', type: 'text', placeholder: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', isRequired: true }
    ],
    generateQRString: (vals) => vals.address || ''
  },
  {
    id: 'metamask-connect',
    name: 'MetaMask Smart Contract connection QR tool',
    slug: 'metamask-smart-contract-connection-qr-tool',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['metamask connect qr', 'dapp wallet trigger', 'web3 checkout portal', 'मेटामास्क वॉलेट कनेक्शन ट्रिगर'],
    description: 'Connect local tech apps to decentralized servers on smartphones. Scanning triggers native MetaMask browsers to initiate.',
    hindiTitle: 'मेटामास्क dApp वॉलेट कनेक्शन ट्रिगर क्यूआर',
    hindiDesc: 'स्मार्टफोन उपभोक्ताओं के लिए डायरेक्ट क्रिप्टो यूआरएल हुक क्रिएटर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'dApp Connection / Checkout URL', type: 'text', placeholder: 'https://dapp.example.com/checkout?wallet=metamask', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://metamask.io'
  },
  {
    id: 'matic-wallet',
    name: 'Polygon (MATIC) Layer-2 Wallet Address QR',
    slug: 'polygon-matic-layer-2-wallet-address',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['matic wallet qr', 'polygon transaction code', 'layer 2 crypto coin', 'पॉलीगॉन मैटिक वॉलेट एड्रेस'],
    description: 'Send and receive Layer-2 transactions with near-zero gas costs. Generate high contrast Polygon addresses safely.',
    hindiTitle: 'पॉलीगॉन (MATIC) लेयर-२ त्वरित क्रिप्टो स्कैनर',
    hindiDesc: 'भारतीय ओरिजिन वाले पॉलीगॉन नेटवर्क पर अति-द्रुत लेनदेन और सिक्के मंगाने हेतु बटुआ।',
    type: 'crypto',
    inputs: [
      { key: 'address', label: 'Polygon MATIC Wallet Address', type: 'text', placeholder: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', isRequired: true }
    ],
    generateQRString: (vals) => vals.address || ''
  },
  {
    id: 'coinbase-commerce',
    name: 'Coinbase Commerce API Billing Merchant QR',
    slug: 'coinbase-commerce-api-billing-merchant',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['coinbase commerce qr', 'crypto billing checkout button', 'accept card crypto', 'कॉइनबेस कॉमर्स पेमेंट गेटवे'],
    description: 'Generate point of sale scan modules connecting buyers directly to active Coinbase audited microcheckouts.',
    hindiTitle: 'कॉइनबेस कॉमर्स डिजिटल भुगतान मर्चेंट क्यूआर',
    hindiDesc: 'डिटेल स्टोर में ग्राहकों को सीधे कॉइनबेस गेटवे के जरिए भुगतान लेने का सुंदर बारकोड।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Coinbase Checkout URL', type: 'text', placeholder: 'https://commerce.coinbase.com/checkout/exCode', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://commerce.coinbase.com'
  },
  {
    id: 'ens-domain',
    name: 'Ethereum Name Service (ENS) Resolver QR',
    slug: 'ethereum-name-service-ens-resolver-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['ens domain qr code', 'eth web3 domain lookup', 'crypto address nickname', 'ईएनएस इथेरियम वेब३ डोमेन रिज़ॉल्वर'],
    description: 'Share your human-readable .eth crypto nicknames easily (e.g. aarav.eth) instead of hexadecimal strings of keys.',
    hindiTitle: 'ईएनएस (ENS) वेब३ .eth डोमेन रिज़ॉल्वर क्यूआर',
    hindiDesc: 'अपने लंबे वॉलेट अंकों की जगह "नाम.eth" को ऑफलाइन प्रदर्शित करने का कूल तरीका।',
    type: 'text',
    inputs: [
      { key: 'ens', label: 'Your ENS Domain Name (.eth)', type: 'text', placeholder: 'aarav.eth', isRequired: true }
    ],
    generateQRString: (vals) => {
      const ensName = vals.ens || 'vitalik.eth';
      return `https://app.ens.domains/${ensName}`;
    }
  },
  {
    id: 'crypto-donation',
    name: 'Multicurity Cryptographic Donation Hub QR',
    slug: 'multicurity-cryptographic-donation-hub-qr',
    category: 'Crypto & Web3',
    isHighTraffic: false,
    keywords: ['crypto donation hub qr', 'support open source bitcoin', 'blockchain developer fund', 'क्रिप्टो दान निधि कलेक्टिव स्कैनर'],
    description: 'Connect users to a web portal where they can filter and select their preferred blockchain (Bitcoin, Ethereum, Solana) to donate.',
    hindiTitle: 'क्रिप्टोकरेंसी कलेक्टिव दान और प्रमोटर स्कैनर',
    hindiDesc: 'ओपन-सोर्स डेवलपर्स और चैरिटी के लिए कई प्रकार के क्रिप्टो सिक्के स्वीकार करने हेतु यूआरएल क्यूआर।',
    type: 'url',
    inputs: [
      { key: 'url', label: 'Your Crypto Donation Portal Link', type: 'text', placeholder: 'https://mydonations.com/crypto-support', isRequired: true }
    ],
    generateQRString: (vals) => vals.url || 'https://example.com'
  }
];

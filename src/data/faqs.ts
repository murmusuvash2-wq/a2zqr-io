import { FAQItem } from './schemas';

export const FAQS_DATABASE: Record<string, FAQItem[]> = {
  'wedding-rsvp': [
    {
      id: 'wedding-faq-1',
      question: 'Will these Wedding RSVP QR codes stop working after the wedding date?',
      answer: 'No, our static QR codes are permanent and have no expiry date. Your guest guests can scan them decades later to view cherished media folders or memories.'
    },
    {
      id: 'wedding-faq-2',
      question: 'Can I change the RSVP details (like venue location) without reprinting the wedding cards?',
      answer: 'Since static QR codes raw-embed the data inside the pixels, updating the text requires generating a new QR code. For flexible changes without reprinting, please configure active web links or database RSVP endpoints instead.'
    },
    {
      id: 'wedding-faq-3',
      question: 'Do my guests need to download a special mobile application to RSVP?',
      answer: 'Not at all. Any modern default smartphone camera (iOS/Android) scanned directly will open the invitation website page in their browse app instantly.'
    }
  ],
  'restaurant-menu': [
    {
      id: 'menu-faq-1',
      question: 'Can I upload a premium PDF menu directly to my QR code?',
      answer: 'Yes! You can host your menu on cloud servers (such as Google Drive, Dropbox, or your restaurant website hosting) and paste the public link into our Website URL prompt to generate menu QR.'
    },
    {
      id: 'menu-faq-2',
      question: 'How do I add different table numbers to different QR codes?',
      answer: 'Simply use our Table Number input on our Restaurant Creator form. It appends specific parameters (e.g., ?table=5) to your menu link so your database server knows exactly which seat ordered.'
    },
    {
      id: 'menu-faq-3',
      question: 'Can I frame my brand logo in the middle of the menu QR code?',
      answer: 'Yes! With our Pro Customizer, you can upload your dining logo, customize colors to match your restaurant interior, and export ultra-high-resolution files.'
    }
  ],
  'wifi-generator': [
    {
      id: 'wifi-faq-1',
      question: 'Is it completely safe to share my Wi-Fi passcode using a QR code card?',
      answer: 'Absolutely. The QR code format merely formats the password into the standard W3C WIFI schema (WIFI:S:SSID;T:SEC;P:PASSWORD;;). Safe to display inside physical office rooms and home desks.'
    },
    {
      id: 'wifi-faq-2',
      question: 'Why does my iPhone camera connect immediately but my old Android requires confirming?',
      answer: 'Different mobile operating systems handle automatic SSID associations uniquely. iOS triggers native connection instantly, while certain older Android layers prompt a confirmation bubble first for secure sandboxing.'
    },
    {
      id: 'wifi-faq-3',
      question: 'Will this Wi-Fi QR work if I modify my security protocol to WPA3?',
      answer: 'Yes, both WPA and WPA2 styles are standard in our generation form, and they seamlessly fall back to support active WPA3 protocols safely.'
    }
  ]
};
export const DEFAULT_FAQ: FAQItem[] = [
  {
    id: 'gen-faq-1',
    question: 'How much do static QR codes cost to maintain?',
    answer: 'They are completely free. Once downloaded, static QR codes function independently of our services and can be scanned unlimited times without any expiry.'
  },
  {
    id: 'gen-faq-2',
    question: 'Do these QR codes limit scan counting?',
    answer: 'No. Static QR codes do not redirect through external intermediate trackers. Scanning is read direct, meaning there are zero scan limitations.'
  }
];

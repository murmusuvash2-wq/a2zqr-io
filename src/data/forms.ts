import { FormConfig } from './schemas';

export const FORMS_DATABASE: Record<string, FormConfig> = {
  wedding: {
    id: 'wedding',
    title: 'Wedding RSVP Detail Collector',
    fields: [
      {
        id: 'groom_name',
        label: 'Groom Name',
        type: 'text',
        required: true,
        placeholder: 'Aarav'
      },
      {
        id: 'bride_name',
        label: 'Bride Name',
        type: 'text',
        required: true,
        placeholder: 'Diya'
      },
      {
        id: 'wedding_date',
        label: 'Wedding Ceremony Date',
        type: 'text',
        required: true,
        placeholder: 'December 18, 2026'
      },
      {
        id: 'venue',
        label: 'Ceremony Venue Address',
        type: 'textarea',
        required: true,
        placeholder: 'The Grand Leela, Palace Road, New Delhi'
      },
      {
        id: 'rsvp_phone',
        label: 'RSVP Helpline Ring Number',
        type: 'tel',
        required: true,
        placeholder: '+91 91111 22222',
        validation: 'phone'
      }
    ]
  },
  restaurant_menu: {
    id: 'restaurant_menu',
    title: 'Digital Restaurant Menu Finder',
    fields: [
      {
        id: 'restaurant_name',
        label: 'Restaurant / Cafe Name',
        type: 'text',
        required: true,
        placeholder: 'Spicy Bistro'
      },
      {
        id: 'menu_url',
        label: 'Digital Menu Link (Public Link/PDF)',
        type: 'url',
        required: true,
        placeholder: 'https://spicybistro.com/menu',
        validation: 'url'
      },
      {
        id: 'table_number',
        label: 'Assign Table Number (Optional)',
        type: 'number',
        required: false,
        placeholder: '12'
      }
    ]
  },
  wifi: {
    id: 'wifi',
    title: 'Wi-Fi Network Instant Connector',
    fields: [
      {
        id: 'ssid',
        label: 'WiFi Network Name (SSID)',
        type: 'text',
        required: true,
        maxLength: 64,
        placeholder: 'Home WiFi Network',
        validation: 'wifi_ssid'
      },
      {
        id: 'password',
        label: 'Network Passcode Key',
        type: 'password',
        required: false,
        placeholder: '••••••••'
      },
      {
        id: 'encryption',
        label: 'WiFi Security Protocol',
        type: 'select',
        required: true,
        placeholder: 'WPA/WPA2',
        defaultValue: 'WPA',
        options: ['WPA', 'WEP', 'nopass']
      }
    ]
  },
  crypto: {
    id: 'crypto',
    title: 'Cryptocurrency Wallet Address Register',
    fields: [
      {
        id: 'address',
        label: 'Crypto Wallet Receiving Address',
        type: 'text',
        required: true,
        placeholder: '0x71C7656EC7ab88b098defB751B7401B5f6d8975F',
        validation: 'crypto_address'
      }
    ]
  },
  vcard_full: {
    id: 'vcard_full',
    title: 'Professional vCard QR Builder',
    fields: [],
    fieldGroupIds: ['contact_basic', 'business_profile', 'social_handles'] // will programmatically resolve at runtime
  }
};

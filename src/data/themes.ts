import { ThemeConfig } from './schemas';

export const THEMES_DATABASE: Record<string, ThemeConfig> = {
  'wedding-theme': {
    id: 'wedding-theme',
    name: 'Rose Wedding',
    primaryColor: '#DB2777', // Soft magenta-pink
    bgColor: '#FFF5F7',      // Barely pinkish white
    textColor: '#881337'
  },
  'restaurant-theme': {
    id: 'restaurant-theme',
    name: 'Amber Bistro',
    primaryColor: '#D97706', // Golden amber
    bgColor: '#FEF3C7',      // Light yellow amber mist
    textColor: '#78350F'
  },
  'crypto-theme': {
    id: 'crypto-theme',
    name: 'Cosmic Teal',
    primaryColor: '#0D9488', // Dark teal
    bgColor: '#F0FDFA',      // Clear arctic teal mist
    textColor: '#115E59'
  },
  'wifi-theme': {
    id: 'wifi-theme',
    name: 'Secure Slate',
    primaryColor: '#4F46E5', // Indigo
    bgColor: '#EEF2FF',      // Safe sky mist
    textColor: '#312E81'
  },
  'default-theme': {
    id: 'default-theme',
    name: 'Slate Minimal',
    primaryColor: '#12121E',
    bgColor: '#F2F2FF',
    textColor: '#12121E'
  }
};

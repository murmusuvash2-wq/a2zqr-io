import { QRStyleConfig } from './schemas';

export const QR_STYLES_DATABASE: Record<string, QRStyleConfig> = {
  liquid: {
    id: 'liquid',
    dots: 'rounded',
    corners: 'extra-rounded'
  },
  'sharp-classic': {
    id: 'sharp-classic',
    dots: 'square',
    corners: 'square'
  },
  'soft-orbit': {
    id: 'soft-orbit',
    dots: 'dots',
    corners: 'dot'
  },
  elegant: {
    id: 'elegant',
    dots: 'classy',
    corners: 'extra-rounded'
  }
};

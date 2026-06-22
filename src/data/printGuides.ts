import { PrintGuideConfig } from './schemas';

export const PRINT_GUIDES_DATABASE: Record<string, PrintGuideConfig> = {
  'standard-card': {
    id: 'standard-card',
    recommendedSize: '1.2" x 1.2" (3x3 cm) Minimum',
    scanDistance: '10 - 25 cm Recommended distance',
    placementTips: [
      'Contrast: Always keep the QR code darker than the backdrop background.',
      'Quiet Zone: Maintain at least 4mm border gap spacing around the entire QR square.',
      'Surface: Avoid highly curved surfaces or highly reflective metal materials.'
    ]
  },
  'table-stand': {
    id: 'table-stand',
    recommendedSize: '2.0" x 2.0" (5x5 cm) Clear resolution',
    scanDistance: '15 - 40 cm Optimal dining table distance',
    placementTips: [
      'Angle: Mount on table stands angled upward by 15-30 degrees for high visibility.',
      'Brightness: Protect cardboards from heavy shadows cast by dining side lamps.',
      'Lamination: Use non-glare, matte laminated protective casings to block heavy light flashes.'
    ]
  },
  'large-poster': {
    id: 'large-poster',
    recommendedSize: '4.0" x 4.0" (10x10 cm) High dimension',
    scanDistance: '1 - 3 Meters Long distance tracking range',
    placementTips: [
      'Height: Anchor the poster exactly at chest height (1.4m - 1.6m above floor floors).',
      'Resolution: Generate the QR code as high resolution vector file (SVG or PDF format).',
      'Data Denseness: Avoid long dynamic links. Wrap inside short A2Z redirection systems.'
    ]
  }
};

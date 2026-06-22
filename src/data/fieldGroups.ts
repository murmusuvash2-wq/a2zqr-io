import { FieldGroup } from './schemas';

export const FIELD_GROUPS: Record<string, FieldGroup> = {
  contact_basic: {
    id: 'contact_basic',
    name: 'Contact Basic Details',
    fields: [
      {
        id: 'first',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Aarav',
        maxLength: 32
      },
      {
        id: 'last',
        label: 'Last Name',
        type: 'text',
        required: false,
        placeholder: 'Sharma',
        maxLength: 32
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '+91 98765 43210',
        validation: 'phone'
      }
    ]
  },
  business_profile: {
    id: 'business_profile',
    name: 'Business Branding Hub',
    fields: [
      {
        id: 'company',
        label: 'Company / Org Name',
        type: 'text',
        required: false,
        placeholder: 'Innovative Tech Private Limited'
      },
      {
        id: 'website',
        label: 'Website Link',
        type: 'url',
        required: false,
        placeholder: 'https://mysite.com',
        validation: 'url'
      },
      {
        id: 'email',
        label: 'Business Email',
        type: 'email',
        required: false,
        placeholder: 'hello@company.com',
        validation: 'email'
      }
    ]
  },
  social_handles: {
    id: 'social_handles',
    name: 'Social Media Integrations',
    fields: [
      {
        id: 'instagram',
        label: 'Instagram Username',
        type: 'text',
        required: false,
        placeholder: 'aarav_sharma'
      },
      {
        id: 'linkedin',
        label: 'LinkedIn Profile URL',
        type: 'url',
        required: false,
        placeholder: 'https://linkedin.com/in/aaravsharma'
      }
    ]
  }
};

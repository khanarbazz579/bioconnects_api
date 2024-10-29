import { CanExternalApiOptions } from '@can/common/types/external-api.type';

export const GB_EMAIL_API_CONFIG: CanExternalApiOptions = {
  url: process.env.GB_EMAIL_API_URL,
  method: 'POST',
  data: {
    templateId: process.env.GB_EMAIL_TEMPLATE_ID,
    toEmails: [],
    fromEmail: process.env.GB_SENDER_EMAIL,
    params: {},
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

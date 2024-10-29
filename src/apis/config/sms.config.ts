import { CanExternalApiOptions } from '@can/common';

export const SMS_API_CONFIG: CanExternalApiOptions = {
  url: process.env.SMS_URL,
  method: 'GET',
  params: {
    authkey: process.env.SMS_AUTH_KEY,
    country: process.env.SMS_COUNTRY,
    sender: process.env.SMS_SENDER,
    route: process.env.SMS_ROUTE,
  },
};

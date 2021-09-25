import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const BASE_URL = () => {
  if (publicRuntimeConfig.env === 'development') {
    return 'http://localhost:5550';
  }
  if (publicRuntimeConfig.env === 'qa') {
    return 'https://consult.higglerslab.com';
  }
  return 'https://api.askurdoctor.com';
};

export const APP_URL = () => {
  if (publicRuntimeConfig.env === 'development') {
    return 'http://localhost:3000';
  }
  if (publicRuntimeConfig.env === 'qa') {
    return 'https://askurdoctor.higglerslab.com';
  }
  return 'https://api.askurdoctor.com';
};

export const RAZOR = () => {
  if (publicRuntimeConfig.env === 'development') {
    return 'rzp_test_5TkejTnYkeuaJL';
  }
  if (publicRuntimeConfig.env === 'qa') {
    return 'rzp_test_5TkejTnYkeuaJL';
  }
  return 'rzp_live_qctfM2KP4sVO7i';
};

export const APP_CONFIG = {
  name: 'Askurdoctor',
};

export const METHOD_TYPES = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const PATHS = {
  AUTH: {
    REGISTER_VISITORS: '/api/v1/users/onboard/visitors',
    REGISTER_DOCTORS: '/api/v1/users/onboard/doctors',
    LOGIN: '/api/v1/users/auth',
    SELF: '/api/v1/users/me',
    GET_BY_ID: '/api/v1/users/{id}',
    UPDATE_PASSWORD: '/api/v1/users/password/update',
    FORGOT_PASSWORD: '/api/v1/users/password/forgot',
    RESET_PASSWORD: '/api/v1/users/password/reset'
  },
  PROFILE: {
    UPDATE: '/api/v1/profile',
    IMAGE: '/api/v1/profile/image',
  },
  WALLET: {
    MY_WALLET: '/api/v1/wallets/mine',
  },
  DRUGS: {
    GET_ALL: '/api/v1/drugs?page={page}',
    SEARCH: '/api/v1/drugs/search?text={searchText}',
  },
  NOTES: {
    GET: '/api/v1/notes?appointmentId={id}',
    PATCH: '/api/v1/notes/{appointmentId}',
    CREATE: '/api/v1/notes',
  },
  QUALIFICATION: {
    GET: '/api/v1/qualification',
    GET_BY_ID: '/api/v1/qualification?userId={id}',
    LIST: '/api/v1/qualification/list',
    PATCH: '/api/v1/qualification',
    PROCESS: '/api/v1/qualification/{id}/process',
    SUBMIT: '/api/v1/qualification/{id}/submit',
    CREATE: '/api/v1/qualification',
  },
  RX: {
    GET: '/api/v1/rx?page={id}',
    GET_BY_ID: '/api/v1/rx/{id}',
    GET_BY_APPT_ID: '/api/v1/rx?appointmentId={id}',
    CREATE: '/api/v1/rx',
  },
  DOCTORS: {
    CREATE: '/api/v1/doctors',
    GET_ALL: '/api/v1/doctors',
    GET_DEFAULT_ALL: '/api/v1/doctors?isDefault=true',
    MAKE_DEFAULT: '/api/v1/doctors/{id}',
    GET_DOCTORS_SCHEDULE:
      '/api/v1/appointments/slots?doctorId={id}&date={date}',
    GET_FOLLOWUP_SCHEDULE:
      '/api/v1/appointments/slots/follow?doctorId={id}&date={date}&duration=60',
    APPROVE_CAMPAIGN_REQUEST: '/api/v1/appointments/slots',
    GET_BY_ID: '/api/v1/doctors?doctorId={id}',
    REQUEST: '/api/v1/campaigns/request',
    PUBLISH: '/api/v1/campaigns/{id}/status',
  },
  APPOINTMENT: {
    GET: '/api/v1/appointments',
    CREATE: '/api/v1/appointments',
    CREATE_FOLLOW_UP: '/api/v1/appointments/follow',
    UPDATE: '/api/v1/appointments/{id}',
    REFUND: '/api/v1/appointments/{id}/refund',
    COMPLETE: '/api/v1/appointments/{id}/complete',
    NOT_JOINED: '/api/v1/appointments/{id}/not-joined',
    GET_BY_ID: '/api/v1/appointments/{id}/details',
    EXTEND: '/api/v1/appointments/{id}/extend',
    FOLLOW: '/api/v1/appointments/{id}/follow',
  },
  VIDEO: {
    CREATE_CHANNEL: '/api/v1/video',
    CREATE_ROOM: '/api/v1/video/daily/rooms',
  },
  PATIENTS: {
    CREATE: '/api/v1/patients',
    GET_ALL: '/api/v1/patients',
    GET_BY_ID: '/api/v1/patients/{id}',
    GET_BY_QUERY: '/api/v1/patients?patientId={id}',

  },
  RESOURCE: {
    CREATE: '/api/v1/resources',
  },
  PAYMENT: {
    SESSION: '/api/v1/payments/razor/order',
    COMPLETION: '/api/v1/payments/razor/completion',
    TXN: '/api/v1/payments/transactions',
    LEDGER: '/api/v1/ledgers/transactions',
    LEDGER_BY_ID: '/api/v1/ledgers/transactions/{id}',
    WITHDRAWAL: '/api/v1/ledgers/withdraw',
    WITHDRAWAL_APPROVE: '/api/v1/ledgers/withdraw/{id}',
  },
  CONFIG: {
    GET: '/api/v1/configurations?region=IN',
    GCOINS: '/api/v1/configurations/gcoins',
  },
  ANALYTICS: {
    GET: '/api/v1/analytics',
  },
};

export const ROLES = {
  INFLUENCER: 'INFLUENCERS',
  BRAND: 'BRAND_MANAGERS',
};

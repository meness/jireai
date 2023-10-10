import { DataLayerObject } from '../gtm';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly NEXT_PUBLIC_APP_ENV: 'production' | 'staging' | 'development';
      readonly NEXT_PUBLIC_G_TAG_ID: string;
      readonly OPENAI_API_KEY: string;
      readonly NEXT_PUBLIC_NOW_PAYMENTS_API_KEY: string;
    }
  }

  interface Window {
    /** It might be undefined on some pages or specific environments */
    dataLayer: DataLayerObject[] | undefined;
  }
}

export {};

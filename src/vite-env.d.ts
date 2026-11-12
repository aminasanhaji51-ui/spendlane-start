/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_SALES_CALENDAR_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

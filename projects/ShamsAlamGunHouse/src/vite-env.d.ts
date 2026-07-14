/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_GOOGLE_REVIEWS_URL: string
  readonly VITE_GOOGLE_MAPS_EMBED_URL: string
  readonly VITE_CONTACT_FORM_ENDPOINT: string
  readonly VITE_ANALYTICS_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Application Phase Types
export type AppPhase = 'loading' | 'animating' | 'content';

// Asset Preloader Types
export interface PreloaderState {
  progress: number;
  loaded: number;
  total: number;
  isComplete: boolean;
  errors: string[];
}

// Stop Motion Player Types
export interface StopMotionConfig {
  frames: string[];
  fps: number;
  loop?: boolean;
  autoPlay?: boolean;
}

// Guestbook Types
export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
}

export interface GuestbookFormData {
  name: string;
  password: string;
  message: string;
}

// Location Types
export interface LocationInfo {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  floor?: string;
  hall?: string;
}

// Account Info Types
export interface AccountInfo {
  bank: string;
  accountNumber: string;
  holder: string;
}

export interface AccountSection {
  title: string;
  accounts: AccountInfo[];
}

// Wedding Info Types
export interface WeddingInfo {
  groomName: string;
  brideName: string;
  date: Date;
  time: string;
  location: LocationInfo;
  groomAccounts: AccountInfo[];
  brideAccounts: AccountInfo[];
}

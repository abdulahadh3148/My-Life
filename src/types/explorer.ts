export type PlaceStatus = 'visited' | 'want_to_visit' | 'favourite';

export type PlaceCategory =
  | 'nature'
  | 'heritage'
  | 'beach'
  | 'mountain'
  | 'culture'
  | 'wildlife'
  | 'city'
  | 'adventure'
  | 'other';

export interface PlacePhoto {
  id: string;
  url: string; // Base64 data URL or external asset URL
  caption?: string;
  uploadedAt: string;
}

export interface ExplorerPlace {
  id: string;
  title: string;
  district: string; // e.g. Matale, Galle, Kandy
  province: string; // e.g. Central, Southern, Western
  category: PlaceCategory;
  status: PlaceStatus;
  description: string;
  personalNotes?: string;
  rating?: number; // 1 to 5
  latitude: number;
  longitude: number;
  elevationMeters?: number; // Height above sea level in meters (auto-detected)
  visitDate?: string; // YYYY-MM-DD
  photos: PlacePhoto[];
  createdAt: string;
  updatedAt?: string;
}

export interface SriLankaDistrictInfo {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

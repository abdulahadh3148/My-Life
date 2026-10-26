import { PlaceCategory } from '../types/explorer';

export interface SriLankaLocationPreset {
  name: string;
  district: string;
  province: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  elevation: number; // in meters
  description: string;
}

export const POPULAR_SRI_LANKA_PLACES: SriLankaLocationPreset[] = [
  {
    name: 'Nawalapitiya',
    district: 'Kandy',
    province: 'Central',
    category: 'mountain',
    lat: 7.0544,
    lng: 80.5336,
    elevation: 589,
    description: 'Scenic hill country town nestled along Mahaweli River, famous for lush tea estates and waterfalls.'
  },
  {
    name: 'Kandy (Temple of the Tooth)',
    district: 'Kandy',
    province: 'Central',
    category: 'heritage',
    lat: 7.2936,
    lng: 80.6413,
    elevation: 500,
    description: 'Sacred UNESCO World Heritage cultural capital surrounded by hills and Kandy Lake.'
  },
  {
    name: 'Nuwara Eliya (Little England)',
    district: 'Nuwara Eliya',
    province: 'Central',
    category: 'mountain',
    lat: 6.9708,
    lng: 80.7829,
    elevation: 1868,
    description: 'Sri Lanka’s highest town with cool climate, colonial architecture, and Pedro tea plantations.'
  },
  {
    name: 'Ella (Nine Arch Bridge & Ella Rock)',
    district: 'Badulla',
    province: 'Uva',
    category: 'mountain',
    lat: 6.8667,
    lng: 81.0466,
    elevation: 1041,
    description: 'World-famous mountain village known for Demodara Nine Arches Bridge and Ravana Falls.'
  },
  {
    name: 'Sigiriya Rock Fortress',
    district: 'Matale',
    province: 'Central',
    category: 'heritage',
    lat: 7.9570,
    lng: 80.7603,
    elevation: 349,
    description: 'Ancient 5th-century palace fortress built atop a massive 200m vertical granite column.'
  },
  {
    name: 'Adams Peak (Sri Pada)',
    district: 'Ratnapura',
    province: 'Sabaragamuwa',
    category: 'mountain',
    lat: 6.8096,
    lng: 80.4994,
    elevation: 2243,
    description: 'Conical sacred mountain revered for sacred footprint and spectacular sunrise above clouds.'
  },
  {
    name: 'Galle Fort',
    district: 'Galle',
    province: 'Southern',
    category: 'heritage',
    lat: 6.0270,
    lng: 80.2170,
    elevation: 12,
    description: '17th-century coastal Dutch bastion with cobblestone streets, ramparts, and lighthouse.'
  },
  {
    name: 'Mirissa Beach & Whale Watching',
    district: 'Matara',
    province: 'Southern',
    category: 'beach',
    lat: 5.9482,
    lng: 80.4716,
    elevation: 5,
    description: 'Crescent beach known for Coconut Tree Hill, surfing breaks, and blue whale migrations.'
  },
  {
    name: 'Horton Plains & Worlds End',
    district: 'Nuwara Eliya',
    province: 'Central',
    category: 'nature',
    lat: 6.8028,
    lng: 80.8091,
    elevation: 2134,
    description: 'Mist-shrouded plateau ending at a dramatic 870m sheer precipice overlooking southern plains.'
  },
  {
    name: 'Yala National Park',
    district: 'Hambantota',
    province: 'Southern',
    category: 'wildlife',
    lat: 6.3687,
    lng: 81.5218,
    elevation: 35,
    description: 'Renowned wildlife sanctuary with highest leopard density in the world, elephants, and coastal lagoons.'
  },
  {
    name: 'Trincomalee (Nilaveli & Fort Frederick)',
    district: 'Trincomalee',
    province: 'Eastern',
    category: 'beach',
    lat: 8.5711,
    lng: 81.2335,
    elevation: 8,
    description: 'Natural deep-water harbor with crystal turquoise waters, Pigeon Island, and Koneswaram temple.'
  },
  {
    name: 'Jaffna Fort & Nallur',
    district: 'Jaffna',
    province: 'Northern',
    category: 'culture',
    lat: 9.6615,
    lng: 80.0255,
    elevation: 5,
    description: 'Vibrant cultural hub of northern peninsula featuring historic Jaffna Fort and Nallur Kandaswamy Kovil.'
  },
  {
    name: 'Dambulla Cave Temple',
    district: 'Matale',
    province: 'Central',
    category: 'heritage',
    lat: 7.8567,
    lng: 80.6483,
    elevation: 160,
    description: 'Magnificent ancient rock cave monastery complex containing over 150 Buddha statues and murals.'
  },
  {
    name: 'Kitulgala (White Water Rafting)',
    district: 'Kegalle',
    province: 'Sabaragamuwa',
    category: 'adventure',
    lat: 6.9912,
    lng: 80.4124,
    elevation: 210,
    description: 'Rainforest adventure center on Kelani River with thrilling grade 3 rapids and cave explorations.'
  },
  {
    name: 'Bentota Beach & Lagoon',
    district: 'Galle',
    province: 'Southern',
    category: 'beach',
    lat: 6.4259,
    lng: 79.9984,
    elevation: 4,
    description: 'Golden stretch of beach renowned for water sports, river safaris, and turtle hatcheries.'
  },
  {
    name: 'Haputale & Liptons Seat',
    district: 'Badulla',
    province: 'Uva',
    category: 'mountain',
    lat: 6.7681,
    lng: 80.9575,
    elevation: 1431,
    description: 'High ridge panoramic viewpoint where Sir Thomas Lipton surveyed his historic tea empire.'
  },
  {
    name: 'Pinnawala Elephant Orphanage',
    district: 'Kegalle',
    province: 'Sabaragamuwa',
    category: 'wildlife',
    lat: 7.3013,
    lng: 80.3869,
    elevation: 120,
    description: 'Large herd sanctuary famous for daily river bathing sessions along Maha Oya.'
  },
  {
    name: 'Colombo Lotus Tower & Galle Face',
    district: 'Colombo',
    province: 'Western',
    category: 'city',
    lat: 6.9271,
    lng: 79.8612,
    elevation: 7,
    description: 'Cosmopolitan waterfront capital featuring 350m Lotus Tower, colonial landmarks, and ocean esplanade.'
  },
  {
    name: 'Kalutara Bodhiya & Calido Beach',
    district: 'Kalutara',
    province: 'Western',
    category: 'heritage',
    lat: 6.5854,
    lng: 79.9607,
    elevation: 6,
    description: 'Hollow Buddhist stupa overlooking Kalu Ganga and the historic coastal strip of Beruwala.'
  },
  {
    name: 'Knuckles Mountain Range',
    district: 'Matale',
    province: 'Central',
    category: 'nature',
    lat: 7.4667,
    lng: 80.7833,
    elevation: 1863,
    description: 'Rugged UNESCO cloud forest wilderness resembling clenched fist knuckles, rich in endemic species.'
  },
  {
    name: 'Arugam Bay',
    district: 'Ampara',
    province: 'Eastern',
    category: 'adventure',
    lat: 6.8422,
    lng: 81.8288,
    elevation: 4,
    description: 'Premier international right-hand point break surfing haven on Sri Lanka’s tranquil southeast coast.'
  },
  {
    name: 'Polonnaruwa Ancient City',
    district: 'Polonnaruwa',
    province: 'North Central',
    category: 'heritage',
    lat: 7.9403,
    lng: 81.0188,
    elevation: 58,
    description: 'Medieval royal capital featuring Gal Vihara monumental rock-cut Buddha sculptures and ancient reservoirs.'
  },
  {
    name: 'Anuradhapura Sacred City',
    district: 'Anuradhapura',
    province: 'North Central',
    category: 'heritage',
    lat: 8.3114,
    lng: 80.4037,
    elevation: 81,
    description: 'Sprawling ancient metropolis with 2,200-year-old Sri Maha Bodhi tree and colossal white brick stupas.'
  },
  {
    name: 'Wilpattu National Park',
    district: 'Puttalam',
    province: 'North Western',
    category: 'wildlife',
    lat: 8.4554,
    lng: 80.0382,
    elevation: 25,
    description: 'Sri Lanka’s largest and oldest national park characterised by natural sand-rimmed water basins (villus).'
  },
  {
    name: 'Sinharaja Rain Forest Reserve',
    district: 'Ratnapura',
    province: 'Sabaragamuwa',
    category: 'nature',
    lat: 6.4167,
    lng: 80.4167,
    elevation: 450,
    description: 'Virgin tropical lowland rainforest and UNESCO Biosphere Reserve sheltering 95% of endemic birds.'
  }
];

/**
 * Fetch true elevation (height above sea level) in meters using Open-Meteo elevation API
 * 100% Free, no API key required, reliable global coverage.
 */
export async function fetchElevation(lat: number, lng: number): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.open-meteo.com/v1/elevation?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.elevation) && data.elevation.length > 0) {
        return Math.round(data.elevation[0]);
      }
    }
  } catch (err) {
    // Ignore network error and fall back to local estimation
  }

  // Fallback: estimate from local preset if close
  for (const p of POPULAR_SRI_LANKA_PLACES) {
    const dLat = Math.abs(p.lat - lat);
    const dLng = Math.abs(p.lng - lng);
    if (dLat < 0.1 && dLng < 0.1) {
      return p.elevation;
    }
  }

  // General Sri Lanka elevation baseline estimation
  if (lat >= 6.7 && lat <= 7.4 && lng >= 80.3 && lng <= 81.1) {
    return 650; // Central Highlands baseline
  }
  return 15; // Coastal plains baseline
}

export interface GeocodedLocation {
  name: string;
  district: string;
  province: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  elevation: number;
  description: string;
}

/**
 * Search Sri Lanka locations by name or keyword
 * Blends fast local offline presets with live OpenStreetMap Nominatim results
 */
export async function searchSriLankaLocations(query: string): Promise<GeocodedLocation[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: GeocodedLocation[] = [];

  // 1. Check local instant database
  const localMatches = POPULAR_SRI_LANKA_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.province.toLowerCase().includes(q)
  );

  for (const m of localMatches) {
    results.push({ ...m });
  }

  // 2. Query Nominatim if search string is 3+ chars
  if (q.length >= 3) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=lk&limit=5&q=${encodeURIComponent(
        query + ', Sri Lanka'
      )}`;

      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          // Only add if not already in results
          if (
            !results.some(
              (r) => Math.abs(r.lat - lat) < 0.01 && Math.abs(r.lng - lng) < 0.01
            )
          ) {
            const displayNameParts = item.display_name.split(',');
            const primaryName = displayNameParts[0]?.trim() || item.name;
            const district =
              displayNameParts.find((p: string) => p.toLowerCase().includes('district'))?.replace(/district/i, '').trim() ||
              displayNameParts[1]?.trim() ||
              'Central';

            const elev = (await fetchElevation(lat, lng)) || 50;

            results.push({
              name: primaryName,
              district,
              province: 'Sri Lanka',
              category: 'nature',
              lat,
              lng,
              elevation: elev,
              description: item.display_name
            });
          }
        }
      }
    } catch (err) {
      // Nominatim unavailable, local results remain
    }
  }

  return results.slice(0, 8);
}

/**
 * Reverse Geocode coordinates to place details in Sri Lanka
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<{ title: string; district: string; province: string; elevation: number }> {
  // 1. Check if very close to a known preset
  for (const p of POPULAR_SRI_LANKA_PLACES) {
    const dist = Math.hypot(p.lat - lat, p.lng - lng);
    if (dist < 0.05) {
      return {
        title: p.name,
        district: p.district,
        province: p.province,
        elevation: p.elevation
      };
    }
  }

  // 2. Try online reverse geocode
  let title = 'Selected Point';
  let district = 'Central';
  let province = 'Central';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'Accept-Language': 'en' }, signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.address) {
        title =
          data.address.tourism ||
          data.address.leisure ||
          data.address.town ||
          data.address.village ||
          data.address.suburb ||
          data.address.city ||
          data.name ||
          'Sri Lanka Spot';
        district = (data.address.county || data.address.state_district || 'Kandy').replace(/district/i, '').trim();
        province = (data.address.state || 'Central Province').replace(/province/i, '').trim();
      }
    }
  } catch (err) {
    // Fallback
  }

  const elevation = (await fetchElevation(lat, lng)) || 100;

  return { title, district, province, elevation };
}

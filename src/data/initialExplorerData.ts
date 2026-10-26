import { ExplorerPlace } from '../types/explorer';

export const INITIAL_EXPLORER_PLACES: ExplorerPlace[] = [
  {
    id: 'place-sigiriya',
    title: 'Sigiriya Ancient Rock Fortress',
    district: 'Matale',
    province: 'Central',
    category: 'heritage',
    status: 'visited',
    description: 'Ancient rock fortress and palace ruin built by King Kashyapa in the 5th century. Spectacular frescoes, mirror wall, and 360-degree panoramic jungle vistas.',
    personalNotes: 'Started climbing early at 6:45 AM before heat. The view from the summit palace foundation was breathtaking.',
    rating: 5,
    latitude: 7.9570,
    longitude: 80.7603,
    visitDate: '2026-08-14',
    photos: [
      {
        id: 'photo-sig-1',
        url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80',
        caption: 'Towering Sigiriya Lion Rock reflected in ancient water gardens.',
        uploadedAt: '2026-08-14T10:30:00Z'
      },
      {
        id: 'photo-sig-2',
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
        caption: 'The majestic lion paws staircase guarding the final summit ascent.',
        uploadedAt: '2026-08-14T11:45:00Z'
      }
    ],
    createdAt: '2026-08-14T18:00:00Z'
  },
  {
    id: 'place-galle',
    title: 'Galle Dutch Fort & Lighthouse',
    district: 'Galle',
    province: 'Southern',
    category: 'heritage',
    status: 'favourite',
    description: '17th-century coastal fortress built by the Portuguese and extensively fortified by the Dutch. UNESCO World Heritage ramparts overlooking the Indian Ocean.',
    personalNotes: 'Walked the ramparts at sunset. Beautiful colonial architecture, boutique cafes, and sea breeze along Point Utrecht bastion.',
    rating: 5,
    latitude: 6.0270,
    longitude: 80.2170,
    visitDate: '2026-09-02',
    photos: [
      {
        id: 'photo-gal-1',
        url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
        caption: 'Iconic Galle Fort white lighthouse standing proud against sunset skies.',
        uploadedAt: '2026-09-02T18:15:00Z'
      }
    ],
    createdAt: '2026-09-02T20:00:00Z'
  },
  {
    id: 'place-ella',
    title: 'Nine Arch Bridge & Ella Rock',
    district: 'Badulla',
    province: 'Uva',
    category: 'mountain',
    status: 'visited',
    description: 'Marvel of early 20th-century colonial railway engineering built entirely of stone, brick, and cement through lush tea plantation valleys.',
    personalNotes: 'Watched the blue highland train pass across the bridge at 9:30 AM. Spectacular mist rising over Demodara.',
    rating: 5,
    latitude: 6.8768,
    longitude: 81.0608,
    visitDate: '2026-07-20',
    photos: [
      {
        id: 'photo-ella-1',
        url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80',
        caption: 'Iconic Nine Arch Bridge surrounded by lush emerald tea bushes.',
        uploadedAt: '2026-07-20T09:40:00Z'
      }
    ],
    createdAt: '2026-07-20T14:00:00Z'
  },
  {
    id: 'place-mirissa',
    title: 'Coconut Tree Hill & Mirissa Bay',
    district: 'Matara',
    province: 'Southern',
    category: 'beach',
    status: 'favourite',
    description: 'Dramatic palm-fringed cliff dome overlooking golden sandy coves and turquoise southern ocean waves.',
    personalNotes: 'Unreal golden hour reflections. Gentle breeze and perfect coastal spot for photography.',
    rating: 5,
    latitude: 5.9458,
    longitude: 80.4578,
    visitDate: '2026-10-05',
    photos: [
      {
        id: 'photo-mir-1',
        url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=80',
        caption: 'Coconut Tree Hill dome overlooking the warm Indian Ocean.',
        uploadedAt: '2026-10-05T17:20:00Z'
      }
    ],
    createdAt: '2026-10-05T19:00:00Z'
  },
  {
    id: 'place-yala',
    title: 'Yala National Park Safari',
    district: 'Hambantota',
    province: 'Southern',
    category: 'wildlife',
    status: 'want_to_visit',
    description: 'Renowned wildlife sanctuary having one of the highest leopard densities in the world, alongside wild Asian elephants, sloth bears, and endemic birds.',
    personalNotes: 'Planned for the upcoming long weekend. Want to book Block 1 early morning safari.',
    rating: 5,
    latitude: 6.3725,
    longitude: 81.5142,
    photos: [],
    createdAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'place-horton',
    title: 'Horton Plains & World’s End',
    district: 'Nuwara Eliya',
    province: 'Central',
    category: 'nature',
    status: 'want_to_visit',
    description: 'High-altitude cloud forest plateau terminating at World’s End, an 880-meter sheer cliff precipice drop into southern lowlands.',
    personalNotes: 'Plan to hike Baker’s Falls circuit early morning before 9 AM cloud cover arrives.',
    latitude: 6.8028,
    longitude: 80.8091,
    photos: [],
    createdAt: '2026-10-12T15:00:00Z'
  },
  {
    id: 'place-jaffna',
    title: 'Jaffna Fort & Nallur Temple',
    district: 'Jaffna',
    province: 'Northern',
    category: 'culture',
    status: 'want_to_visit',
    description: 'Historic star-shaped coral stone fort overlooking Jaffna lagoon and the sacred Nallur Kandaswamy Kovil cultural landmark.',
    personalNotes: 'Explore northern coastal islands (Karainagar, Nainativu) and taste authentic Jaffna crab curry.',
    latitude: 9.6615,
    longitude: 80.0255,
    photos: [],
    createdAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'place-arugam',
    title: 'Arugam Bay Surf Point',
    district: 'Ampara',
    province: 'Eastern',
    category: 'beach',
    status: 'favourite',
    description: 'World-renowned point break surf destination on Sri Lanka’s sunny southeastern coast with vibrant laid-back coastal atmosphere.',
    personalNotes: 'Main point right-hand reef break is world-class.',
    rating: 5,
    latitude: 6.8415,
    longitude: 81.8361,
    visitDate: '2026-06-18',
    photos: [
      {
        id: 'photo-ab-1',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        caption: 'Pristine morning surf conditions at Arugam Bay main point.',
        uploadedAt: '2026-06-18T07:15:00Z'
      }
    ],
    createdAt: '2026-06-18T12:00:00Z'
  }
];

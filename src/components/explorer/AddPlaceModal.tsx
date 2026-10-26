import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Camera,
  Star,
  Plus,
  Trash2,
  Calendar,
  Tag,
  AlignLeft,
  Upload,
  Info,
  ShieldCheck,
  Compass,
  Mountain,
  Search,
  Loader2,
  Sparkles,
  Check,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ExplorerPlace, PlaceStatus, PlaceCategory, PlacePhoto } from '../../types/explorer';
import {
  searchSriLankaLocations,
  fetchElevation,
  reverseGeocodeCoordinates,
  SriLankaLocationPreset,
  POPULAR_SRI_LANKA_PLACES
} from '../../utils/sriLankaPlaces';
import { getTodayDateString } from '../../utils/time';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlace?: ExplorerPlace | null;
  initialCoordinates?: { lat: number; lng: number } | null;
  onSavePlace: (place: Omit<ExplorerPlace, 'id' | 'createdAt'>, id?: string) => void;
  onTriggerMapPinMode?: () => void;
}

// Sri Lanka 25 Districts mapping to Provinces & default coordinates
const SRI_LANKA_DISTRICTS: { name: string; province: string; lat: number; lng: number }[] = [
  { name: 'Colombo', province: 'Western', lat: 6.9271, lng: 79.8612 },
  { name: 'Gampaha', province: 'Western', lat: 7.0840, lng: 79.9940 },
  { name: 'Kalutara', province: 'Western', lat: 6.5854, lng: 79.9607 },
  { name: 'Kandy', province: 'Central', lat: 7.2906, lng: 80.6337 },
  { name: 'Matale', province: 'Central', lat: 7.4675, lng: 80.6234 },
  { name: 'Nuwara Eliya', province: 'Central', lat: 6.9497, lng: 80.7891 },
  { name: 'Galle', province: 'Southern', lat: 6.0535, lng: 80.2210 },
  { name: 'Matara', province: 'Southern', lat: 5.9549, lng: 80.5550 },
  { name: 'Hambantota', province: 'Southern', lat: 6.1429, lng: 81.1212 },
  { name: 'Jaffna', province: 'Northern', lat: 9.6615, lng: 80.0255 },
  { name: 'Kilinochchi', province: 'Northern', lat: 9.3803, lng: 80.3770 },
  { name: 'Mannar', province: 'Northern', lat: 8.9810, lng: 79.9044 },
  { name: 'Vavuniya', province: 'Northern', lat: 8.7542, lng: 80.4982 },
  { name: 'Mullaitivu', province: 'Northern', lat: 9.2671, lng: 80.8142 },
  { name: 'Batticaloa', province: 'Eastern', lat: 7.7310, lng: 81.6747 },
  { name: 'Ampara', province: 'Eastern', lat: 7.4167, lng: 81.8333 },
  { name: 'Trincomalee', province: 'Eastern', lat: 8.5874, lng: 81.2152 },
  { name: 'Kurunegala', province: 'North Western', lat: 7.4863, lng: 80.3623 },
  { name: 'Puttalam', province: 'North Western', lat: 8.0408, lng: 79.8394 },
  { name: 'Anuradhapura', province: 'North Central', lat: 8.3114, lng: 80.4037 },
  { name: 'Polonnaruwa', province: 'North Central', lat: 7.9403, lng: 81.0188 },
  { name: 'Badulla', province: 'Uva', lat: 6.9934, lng: 81.0550 },
  { name: 'Monaragala', province: 'Uva', lat: 6.8728, lng: 81.3507 },
  { name: 'Ratnapura', province: 'Sabaragamuwa', lat: 6.7056, lng: 80.3847 },
  { name: 'Kegalle', province: 'Sabaragamuwa', lat: 7.2513, lng: 80.3464 }
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  editingPlace,
  initialCoordinates,
  onSavePlace,
  onTriggerMapPinMode
}) => {
  const isEditing = Boolean(editingPlace);

  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [province, setProvince] = useState('Western');
  const [category, setCategory] = useState<PlaceCategory>('nature');
  const [status, setStatus] = useState<PlaceStatus>('visited');
  const [rating, setRating] = useState<number>(5);
  const [latitude, setLatitude] = useState<number>(6.9271);
  const [longitude, setLongitude] = useState<number>(79.8612);
  const [elevationMeters, setElevationMeters] = useState<number | undefined>(12);
  const [visitDate, setVisitDate] = useState<string>(getTodayDateString());
  const [description, setDescription] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Search Autocomplete state
  const [suggestions, setSuggestions] = useState<SriLankaLocationPreset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingElevation, setIsLoadingElevation] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (editingPlace) {
      setTitle(editingPlace.title);
      setDistrict(editingPlace.district);
      setProvince(editingPlace.province);
      setCategory(editingPlace.category);
      setStatus(editingPlace.status);
      setRating(editingPlace.rating || 5);
      setLatitude(editingPlace.latitude);
      setLongitude(editingPlace.longitude);
      setElevationMeters(editingPlace.elevationMeters);
      setVisitDate(editingPlace.visitDate || getTodayDateString());
      setDescription(editingPlace.description);
      setPersonalNotes(editingPlace.personalNotes || '');
      setPhotos(editingPlace.photos || []);
      setShowSuggestions(false);
    } else {
      setCategory('nature');
      setStatus('visited');
      setRating(5);
      setVisitDate(getTodayDateString());
      setDescription('');
      setPersonalNotes('');
      setPhotos([]);
      setShowSuggestions(false);

      if (initialCoordinates) {
        setLatitude(initialCoordinates.lat);
        setLongitude(initialCoordinates.lng);
        setTitle('Selected Location');

        // Automatically reverse geocode to identify place name and auto-fetch height/elevation
        setIsLoadingElevation(true);
        reverseGeocodeCoordinates(initialCoordinates.lat, initialCoordinates.lng)
          .then((res) => {
            if (res.title && res.title !== 'Selected Point') {
              setTitle(res.title);
            }
            if (res.district) setDistrict(res.district);
            if (res.province) setProvince(res.province);
            if (res.elevation !== undefined) setElevationMeters(res.elevation);
          })
          .catch((err) => {
            console.warn('Reverse geocode error:', err);
          })
          .finally(() => {
            setIsLoadingElevation(false);
          });
      } else {
        setTitle('');
        setDistrict('Colombo');
        setProvince('Western');
        setLatitude(6.9271);
        setLongitude(79.8612);
        setElevationMeters(12);
      }
    }
  }, [editingPlace, initialCoordinates, isOpen]);

  // Handle typing in Title with live Sri Lanka search autocomplete
  const handleTitleChange = (val: string) => {
    setTitle(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val || val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchSriLankaLocations(val);
        setSuggestions(results);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  // User clicked a suggested Sri Lanka location
  const handleSelectSuggestion = (item: SriLankaLocationPreset) => {
    setTitle(item.name);
    setDistrict(item.district);
    setProvince(item.province);
    setCategory(item.category);
    setLatitude(item.lat);
    setLongitude(item.lng);
    setElevationMeters(item.elevation);
    if (!description && item.description) {
      setDescription(item.description);
    }
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDistrictChange = (distName: string) => {
    setDistrict(distName);
    const d = SRI_LANKA_DISTRICTS.find((item) => item.name === distName);
    if (d) {
      setProvince(d.province);
      if (!isEditing) {
        setLatitude(d.lat);
        setLongitude(d.lng);
        handleAutoDetectElevation(d.lat, d.lng);
      }
    }
  };

  const handleAutoDetectElevation = async (lat: number, lng: number) => {
    setIsLoadingElevation(true);
    try {
      const elev = await fetchElevation(lat, lng);
      if (elev !== undefined && elev !== null) {
        setElevationMeters(elev);
      }
    } catch (err) {
      console.warn('Could not auto-fetch elevation:', err);
    } finally {
      setIsLoadingElevation(false);
    }
  };

  const getElevationLabel = (elev?: number) => {
    if (elev === undefined) return 'Height Not Measured';
    if (elev >= 1800) return 'Highland Peak (Cool Mountain Climate)';
    if (elev >= 1000) return 'Upper Montane Highlands';
    if (elev >= 400) return 'Mid-Country Hill Country';
    if (elev <= 20) return 'Coastal Plain / Sea Level';
    return 'Lowland Foothills';
  };

  // Compress image to max 1200px width/height and return base64
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const newPhotos: PlacePhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBase64 = await compressImage(files[i]);
        newPhotos.push({
          id: `photo-${Date.now()}-${i}`,
          url: compressedBase64,
          caption: '',
          uploadedAt: new Date().toISOString()
        });
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleUpdateCaption = (photoId: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, caption } : p)));
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSavePlace(
      {
        title: title.trim(),
        district,
        province,
        category,
        status,
        rating,
        latitude: Number(latitude) || 6.9271,
        longitude: Number(longitude) || 79.8612,
        elevationMeters: elevationMeters !== undefined ? Number(elevationMeters) : undefined,
        visitDate: status === 'visited' || status === 'favourite' ? visitDate : undefined,
        description: description.trim(),
        personalNotes: personalNotes.trim() || undefined,
        photos
      },
      editingPlace?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Place Journal' : 'Add Sri Lanka Destination'}
      subtitle="Save memories, height above sea level, GPS coordinates, and photo pin"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Title with Live Autocomplete Search */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Destination / Place Title *
            </label>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Search className="w-3 h-3" />
              <span>Type town name to auto-fill</span>
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="e.g. Nawalapitiya, Sigiriya, Ella, Kandy, Galle Fort..."
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-3 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{item.district} District</span>
                      <span>•</span>
                      <span>{item.province} Province</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <Mountain className="w-3 h-3" />
                      {item.elevation}m
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Preset Location Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar text-[11px]">
            <span className="text-slate-400 font-medium shrink-0">Quick Fill:</span>
            {['Nawalapitiya', 'Ella', 'Sigiriya', 'Nuwara Eliya', 'Kandy', 'Adams Peak', 'Galle Fort'].map((placeName) => (
              <button
                key={placeName}
                type="button"
                onClick={() => {
                  const match = POPULAR_SRI_LANKA_PLACES.find((p) => p.name.includes(placeName));
                  if (match) handleSelectSuggestion(match);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 shrink-0 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                + {placeName}
              </button>
            ))}
          </div>
        </div>

        {/* Live Photo Map Pin Preview */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-900/60 dark:to-slate-900/30 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex flex-col items-center shrink-0">
            <div
              className="w-12 h-12 rounded-full border-2 overflow-hidden shadow-md flex items-center justify-center bg-slate-800 relative"
              style={{
                borderColor: status === 'visited' ? '#10B981' : status === 'favourite' ? '#F59E0B' : '#3B82F6'
              }}
            >
              {photos.length > 0 && photos[0].url ? (
                <img src={photos[0].url} alt="Pin Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                  <Camera className="w-5 h-5 text-slate-400" />
                </div>
              )}
              {rating && (
                <div className="absolute bottom-0 right-0 bg-amber-500 text-white text-[8px] font-black px-1 rounded-tl-sm border border-white leading-none py-0.5">
                  ★{rating}
                </div>
              )}
            </div>
            <div
              className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]"
              style={{
                borderTopColor: status === 'visited' ? '#10B981' : status === 'favourite' ? '#F59E0B' : '#3B82F6'
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Map Photo Pin Preview</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Pins directly on Sri Lanka Map
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {photos.length > 0
                ? '✓ Your photo is ready to be pinned at these exact coordinates on the map!'
                : 'Upload your photo below to display a circular photo pin on the interactive map.'}
            </p>
          </div>
        </div>

        {/* Height / Elevation Auto-Detection Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                  {elevationMeters !== undefined
                    ? `🏔️ ${elevationMeters} meters (${Math.round(elevationMeters * 3.28084)} ft)`
                    : 'Altitude not measured'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white">
                  Auto-detected
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                {getElevationLabel(elevationMeters)} • Above Sea Level (ASL)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAutoDetectElevation(latitude, longitude)}
            disabled={isLoadingElevation}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            {isLoadingElevation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{isLoadingElevation ? 'Measuring Height...' : 'Re-check Height'}</span>
          </button>
        </div>

        {/* Status Classification Tabs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Classification Status *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['visited', 'want_to_visit', 'favourite'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  status === st
                    ? st === 'visited'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : st === 'favourite'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {st === 'visited' ? '✓ Visited' : st === 'favourite' ? '★ Favourite' : '📍 Want to Visit'}
              </button>
            ))}
          </div>
        </div>

        {/* District & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              District (Sri Lanka) *
            </label>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.province} Prov.)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PlaceCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="nature">Nature & Scenic</option>
              <option value="mountain">Highlands & Peaks</option>
              <option value="heritage">Heritage & History</option>
              <option value="beach">Coastal Beach & Bay</option>
              <option value="wildlife">Wildlife & Safari</option>
              <option value="culture">Culture & Temples</option>
              <option value="city">Urban & Landmark</option>
              <option value="adventure">Adventure & Trail</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Coordinates with Pick on Map button */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Coordinates (Latitude & Longitude) *
            </label>
            {onTriggerMapPinMode && (
              <button
                type="button"
                onClick={() => {
                  onTriggerMapPinMode();
                  onClose();
                }}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                <span>Pick on Map</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e) => {
                const lat = parseFloat(e.target.value);
                setLatitude(lat);
                if (!isNaN(lat) && !isNaN(longitude)) {
                  handleAutoDetectElevation(lat, longitude);
                }
              }}
              placeholder="Latitude (e.g. 7.0544)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              step="any"
              required
              value={longitude}
              onChange={(e) => {
                const lng = parseFloat(e.target.value);
                setLongitude(lng);
                if (!isNaN(latitude) && !isNaN(lng)) {
                  handleAutoDetectElevation(latitude, lng);
                }
              }}
              placeholder="Longitude (e.g. 80.5336)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Visit Date & Rating */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Visit Date
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Personal Rating (1-5 Stars)
            </label>
            <div className="flex items-center gap-1.5 pt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Personal Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Place Highlights & Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key highlights, altitude features, waterfalls, historical notes..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Personal Experience & Travel Tips
          </label>
          <textarea
            rows={2}
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            placeholder="Best time of day, weather, hiking tips, scenic viewpoints..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Photo Upload & Gallery Management */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                <span>Photo Journal & Map Pin ({photos.length})</span>
              </span>
              <p className="text-[11px] text-slate-400">
                The first photo will become the circular pin icon on the interactive map!
              </p>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>{isCompressing ? 'Compressing...' : 'Upload Photos'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isCompressing}
                className="hidden"
              />
            </label>
          </div>

          {/* Device Storage notice */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Synced with Cloud Firestore:</strong> Photos are compressed to ~80KB and synchronized across all your devices securely.
            </span>
          </div>

          {/* Photos thumbnails grid with caption input */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img
                    src={photo.url}
                    alt="Place photograph"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black tracking-wider uppercase">
                      Map Pin
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2">
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Save Journal Updates' : 'Add to Sri Lanka Explorer'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Star,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Share2,
  Compass,
  Sparkles,
  Mountain
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ExplorerPlace } from '../../types/explorer';
import { formatDisplayDate } from '../../utils/time';

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: ExplorerPlace | null;
  onEditPlace: (place: ExplorerPlace) => void;
  onDeletePlace: (placeId: string, title: string) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  isOpen,
  onClose,
  place,
  onEditPlace,
  onDeletePlace
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!place) return null;

  const photos = place.photos || [];
  const currentPhoto = photos[activePhotoIndex];

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={place.title}
      subtitle={`${place.district} District • ${place.province} Province, Sri Lanka`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 max-h-[82vh] overflow-y-auto pr-1">
        {/* Photo Gallery Viewer */}
        {photos.length > 0 ? (
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md aspect-video sm:aspect-[16/10] flex items-center justify-center group">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || place.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Photo Navigation Controls */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-mono font-bold">
                  {activePhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}

            {/* Photo Caption Overlay */}
            {currentPhoto.caption && (
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white text-xs">
                <span>{currentPhoto.caption}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50 dark:bg-slate-900/40">
            <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-500">No photos uploaded for this location yet.</div>
            <button
              onClick={() => onEditPlace(place)}
              className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline"
            >
              Upload memories & photos
            </button>
          </div>
        )}

        {/* Thumbnail Selector Strip */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-14 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activePhotoIndex ? 'border-emerald-500 scale-105 shadow-sm' : 'border-transparent opacity-60'
                }`}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Place Info Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                place.status === 'visited'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : place.status === 'favourite'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}
            >
              {place.status === 'visited' ? '✓ Visited' : place.status === 'favourite' ? '★ Favourite' : '📍 Want to Visit'}
            </span>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 capitalize">
              {place.category}
            </span>

            {place.elevationMeters !== undefined && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-mono">
                <Mountain className="w-3.5 h-3.5" />
                <span>{place.elevationMeters}m</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            {place.rating && (
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{place.rating}.0</span>
              </div>
            )}

            {place.visitDate && (
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDisplayDate(place.visitDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Coordinates & Elevation Callout */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold font-mono">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
            </span>
          </div>

          <div className="flex items-center gap-3">
            {place.elevationMeters !== undefined && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">
                <Mountain className="w-3.5 h-3.5" />
                <span>{place.elevationMeters}m ({Math.round(place.elevationMeters * 3.28084)} ft ASL)</span>
              </div>
            )}
            <span className="text-slate-400 text-[11px] font-sans">
              {place.district} District • {place.province} Province
            </span>
          </div>
        </div>

        {/* Description */}
        {place.description && (
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#121824] p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {place.description}
            </p>
          </div>
        )}

        {/* Personal Notes */}
        {place.personalNotes && (
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Memories & Notes
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-500/20 italic">
              "{place.personalNotes}"
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onDeletePlace(place.id, place.title)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Place</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onEditPlace(place)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Journal</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

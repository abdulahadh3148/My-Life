import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Camera,
  Star,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Navigation,
  Layers,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SriLankaMap } from './SriLankaMap';
import { AddPlaceModal } from './AddPlaceModal';
import { PlaceDetailsModal } from './PlaceDetailsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ExplorerPlace, PlaceStatus, PlaceCategory } from '../../types/explorer';
import { formatDisplayDate } from '../../utils/time';

export const ExplorerView: React.FC = () => {
  const {
    explorerPlaces = [],
    addExplorerPlace,
    updateExplorerPlace,
    deleteExplorerPlace
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlaceStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected Place & Modals
  const [selectedPlace, setSelectedPlace] = useState<ExplorerPlace | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<ExplorerPlace | null>(null);
  const [mapClickedCoords, setMapClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPinPlacingMode, setIsPinPlacingMode] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Statistics derived directly from actual saved places
  const totalPlaces = explorerPlaces.length;
  const visitedCount = explorerPlaces.filter((p) => p.status === 'visited').length;
  const wantToVisitCount = explorerPlaces.filter((p) => p.status === 'want_to_visit').length;
  const favouriteCount = explorerPlaces.filter((p) => p.status === 'favourite').length;

  const totalPhotosUploaded = explorerPlaces.reduce(
    (acc, curr) => acc + (curr.photos?.length || 0),
    0
  );

  // Unique Sri Lankan districts explored
  const uniqueDistrictsExplored = useMemo(() => {
    const districtsSet = new Set<string>();
    explorerPlaces
      .filter((p) => p.status === 'visited' || p.status === 'favourite')
      .forEach((p) => {
        if (p.district) districtsSet.add(p.district.trim().toLowerCase());
      });
    return districtsSet.size;
  }, [explorerPlaces]);

  // Filtered places list
  const filteredPlaces = useMemo(() => {
    return explorerPlaces.filter((place) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        place.title.toLowerCase().includes(q) ||
        place.district.toLowerCase().includes(q) ||
        place.province.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        (place.personalNotes && place.personalNotes.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || place.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [explorerPlaces, searchQuery, statusFilter, categoryFilter]);

  const handleMapClick = (lat: number, lng: number) => {
    setMapClickedCoords({ lat, lng });
    if (isPinPlacingMode) {
      setIsPinPlacingMode(false);
      setEditingPlace(null);
      setIsAddModalOpen(true);
    }
  };

  const handleSavePlace = (placeData: Omit<ExplorerPlace, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      updateExplorerPlace(id, placeData);
      if (selectedPlace?.id === id) {
        setSelectedPlace({ ...placeData, id, createdAt: selectedPlace.createdAt });
      }
    } else {
      addExplorerPlace(placeData);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteExplorerPlace(deleteTarget.id);
    if (selectedPlace?.id === deleteTarget.id) {
      setSelectedPlace(null);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Explorer Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-teal-50/20 to-white dark:from-[#0E1B1B] dark:via-[#111F24] dark:to-[#0A141A] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sri Lanka Explorer & Photo Journal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Interactive world-to-island map, travel memories, and photo galleries across all 25 Sri Lankan districts. Tap markers or search below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPinPlacingMode(!isPinPlacingMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isPinPlacingMode
                  ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isPinPlacingMode ? 'Click Map to Place Pin' : 'Drop Pin on Map'}</span>
            </button>

            <button
              onClick={() => {
                setEditingPlace(null);
                setMapClickedCoords(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>
        </div>

        {/* Real User Exploration Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Districts Explored</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {uniqueDistrictsExplored} <span className="text-xs text-slate-400 font-normal">/ 25</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Places Visited</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{visitedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Want to Visit</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{wantToVisitCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Photos Uploaded</span>
            <span className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono">{totalPhotosUploaded}</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Component */}
      <SriLankaMap
        places={filteredPlaces}
        selectedPlaceId={selectedPlace?.id}
        onSelectPlace={(place) => setSelectedPlace(place)}
        onMapClickCoordinates={handleMapClick}
        isPinPlacingMode={isPinPlacingMode}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, district, province, or notes..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs">
            {(['all', 'visited', 'want_to_visit', 'favourite'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize shrink-0 transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? `All Places (${explorerPlaces.length})`
                  : st === 'visited'
                  ? `Visited (${visitedCount})`
                  : st === 'favourite'
                  ? `Favourites (${favouriteCount})`
                  : `Wishlist (${wantToVisitCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Exploration Journal ({filteredPlaces.length} Destinations)
          </h3>
          <span className="text-xs text-slate-400">Click card for photos & memories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => {
            const hasPhotos = place.photos && place.photos.length > 0;
            const heroPhoto = hasPhotos ? place.photos[0].url : null;

            return (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Card Image Banner */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  {heroPhoto ? (
                    <img
                      src={heroPhoto}
                      alt={place.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                      <Camera className="w-8 h-8 mb-1 opacity-50" />
                      <span className="text-[11px]">No Photos Uploaded</span>
                    </div>
                  )}

                  {/* Status Pill Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${
                        place.status === 'visited'
                          ? 'bg-emerald-600/90 text-white'
                          : place.status === 'favourite'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-blue-600/90 text-white'
                      }`}
                    >
                      {place.status === 'visited'
                        ? 'Visited'
                        : place.status === 'favourite'
                        ? '★ Favourite'
                        : 'Wishlist'}
                    </span>
                  </div>

                  {/* Photo count badge */}
                  {hasPhotos && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{place.photos.length} photos</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
                        {place.title}
                      </h4>
                      {place.rating && (
                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{place.rating}.0</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{place.district} District • {place.province} Province</span>
                    </div>
                  </div>

                  {place.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {place.category}
                    </span>
                    {place.visitDate && (
                      <span>Visited {formatDisplayDate(place.visitDate)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPlaces.length === 0 && (
            <div className="col-span-full text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No destinations match your search or filter. Click Add Destination to add your favorite Sri Lankan place!
            </div>
          )}
        </div>
      </div>

      {/* Place Details & Photo Viewer Modal */}
      <PlaceDetailsModal
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        place={selectedPlace}
        onEditPlace={(place) => {
          setSelectedPlace(null);
          setEditingPlace(place);
          setIsAddModalOpen(true);
        }}
        onDeletePlace={(id, title) => {
          setSelectedPlace(null);
          setDeleteTarget({ id, title });
        }}
      />

      {/* Add / Edit Place Modal */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPlace(null);
        }}
        editingPlace={editingPlace}
        initialCoordinates={mapClickedCoords}
        onSavePlace={handleSavePlace}
        onTriggerMapPinMode={() => setIsPinPlacingMode(true)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Travel Journal Place?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All uploaded photos and notes for this place will be removed.`}
        confirmLabel="Delete Destination"
        isDestructive
      />
    </div>
  );
};

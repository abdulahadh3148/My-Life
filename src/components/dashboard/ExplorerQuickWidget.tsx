import React, { useMemo } from 'react';
import { Compass, MapPin, Camera, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExplorerQuickWidget: React.FC = () => {
  const { explorerPlaces = [], setActiveView } = useApp();

  const visitedCount = explorerPlaces.filter((p) => p.status === 'visited').length;
  const totalPhotos = explorerPlaces.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);

  const uniqueDistricts = useMemo(() => {
    const s = new Set<string>();
    explorerPlaces
      .filter((p) => p.status === 'visited' || p.status === 'favourite')
      .forEach((p) => {
        if (p.district) s.add(p.district.trim().toLowerCase());
      });
    return s.size;
  }, [explorerPlaces]);

  // Highlight a favorite or visited place with a photo
  const featuredPlace = explorerPlaces.find((p) => p.photos && p.photos.length > 0) || explorerPlaces[0];

  return (
    <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sri Lanka Explorer
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {uniqueDistricts} of 25 Districts Explored
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveView('explorer')}
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 group"
        >
          <span>Map & Journal</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {featuredPlace ? (
        <div
          onClick={() => setActiveView('explorer')}
          className="group cursor-pointer p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 hover:border-teal-400/40 transition-all"
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
            {featuredPlace.photos && featuredPlace.photos[0] ? (
              <img
                src={featuredPlace.photos[0].url}
                alt={featuredPlace.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <MapPin className="w-5 h-5 text-teal-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                {featuredPlace.title}
              </h4>
              {featuredPlace.rating && (
                <div className="flex items-center text-amber-500 text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{featuredPlace.rating}.0</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {featuredPlace.district} District • {featuredPlace.province} Province
            </div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
              {featuredPlace.photos?.length || 0} photos • {visitedCount} places visited
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-slate-400">
          No destinations recorded yet. Tap Map & Journal to explore!
        </div>
      )}
    </div>
  );
};

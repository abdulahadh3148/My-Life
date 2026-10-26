import React, { useState } from 'react';
import { MapPin, Search, Check, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { SRI_LANKA_CITIES, SriLankaCity } from '../../utils/prayerEngine';
import { Modal } from '../common/Modal';

interface SriLankaCitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: SriLankaCity) => void;
  madhab: 'shafii' | 'hanafi';
  onUpdateMadhab: (madhab: 'shafii' | 'hanafi') => void;
  isLoading?: boolean;
  onRecalculate: () => void;
}

export const SriLankaCitySelector: React.FC<SriLankaCitySelectorProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  madhab,
  onUpdateMadhab,
  isLoading = false,
  onRecalculate
}) => {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  const provinces = ['all', 'Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];

  const filteredCities = SRI_LANKA_CITIES.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.district.toLowerCase().includes(search.toLowerCase()) ||
      city.province.toLowerCase().includes(search.toLowerCase());
    const matchesProvince = selectedProvince === 'all' || city.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sri Lanka Prayer Location & Madhab"
      subtitle="Select your city or district across Sri Lanka for exact astronomical timings"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Madhab Selection Callout */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Juristic Method for Asr (Madhab)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
              Sri Lanka Standard: Shafi‘i
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onUpdateMadhab('shafii')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                madhab === 'shafii'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              }`}
            >
              <div className="font-bold">Shafi‘i Madhab</div>
              <div className="text-[10px] opacity-80 mt-0.5">Shadow length = 1.0x (Standard)</div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateMadhab('hanafi')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                madhab === 'hanafi'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              }`}
            >
              <div className="font-bold">Hanafi Madhab</div>
              <div className="text-[10px] opacity-80 mt-0.5">Shadow length = 2.0x (Later Asr)</div>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, district, or province..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Province Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {provinces.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium capitalize ${
                selectedProvince === prov
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {prov === 'all' ? 'All Sri Lanka' : prov}
            </button>
          ))}
        </div>

        {/* Cities Grid List */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
          {filteredCities.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {city.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {city.district} District • {city.province} Province ({city.latitude.toFixed(2)}° N, {city.longitude.toFixed(2)}° E)
                    </div>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              No matching Sri Lankan city found. Try a different search term.
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onRecalculate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live from AlAdhan API</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

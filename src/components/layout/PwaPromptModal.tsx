import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, Smartphone, CheckCircle, WifiOff } from 'lucide-react';
import { Modal } from '../common/Modal';

interface PwaPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaPromptModal: React.FC<PwaPromptModalProps> = ({ isOpen, onClose }) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Install MyLife OS PWA"
      subtitle="Fast, full-screen offline personal management"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Standalone status badge */}
        {isStandalone ? (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              MyLife OS is currently running in standalone PWA mode.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              Install to your Home Screen for full offline capabilities, safe-area immersion, and instant access without browser toolbars.
            </p>
          </div>
        )}

        {/* iPhone Safari Steps */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-900/40">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>iPhone / Safari Instructions</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex-1 pt-0.5">
                Tap the <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 font-semibold">Share <Share className="w-3.5 h-3.5 inline text-blue-500" /></strong> icon at the bottom of Safari.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1 pt-0.5">
                Scroll down the share sheet and tap <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 font-semibold">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" /></strong>.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1 pt-0.5">
                Tap <strong className="text-slate-900 dark:text-white font-semibold">Add</strong> in the top right corner. The icon will appear on your iOS home screen!
              </div>
            </div>
          </div>
        </div>

        {/* Offline notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
          <WifiOff className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Offline Support: Once installed and cached by the Service Worker, MyLife OS operates fully offline without an internet connection.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
};

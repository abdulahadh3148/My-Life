import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Loader2,
  Compass,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    loginWithGoogle,
    logout,
    syncWithCloud,
    isCloudSyncing
  } = useApp();

  const [inputEmail, setInputEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not complete Google Sign-In. Please check pop-up permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleGoogleLogin();
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? 'Account & Cloud Sync' : 'Sign In with Google'}
      subtitle={
        currentUser
          ? 'Your personal data is connected and synced with Google Cloud'
          : 'Sign in to access your Sri Lanka photo journal, timeline, and finances on all devices'
      }
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {currentUser ? (
          /* User is Signed In */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center gap-3.5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User Profile'}
                  className="w-14 h-14 rounded-full border-2 border-emerald-500 object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                    {currentUser.displayName || 'Google Account'}
                  </h3>
                  <span className="p-0.5 rounded-full bg-emerald-500 text-white shrink-0" title="Verified Account">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  {currentUser.email}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <Cloud className="w-3 h-3" />
                  <span>Google Cloud Active</span>
                </div>
              </div>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Cloud Firestore Sync</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your activities, Sri Lanka places & photos, prayer calculations, and financial ledgers automatically sync every few seconds.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={syncWithCloud}
                disabled={isCloudSyncing || isSubmitting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isCloudSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* User is NOT Signed In: Show Login Form */
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            {/* Google One-Click Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-800 dark:text-white font-extrabold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-[#121824] px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Or with Google Email
              </span>
            </div>

            {/* Email Quick Form */}
            <form onSubmit={handleEmailFormSubmit} className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Sign in with Google</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Features / Benefits list */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Why Sign In with Google?
              </span>

              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Save your custom Sri Lanka Explorer photos & location pins to Google Cloud.</span>
              </div>

              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Sync your daily routines, prayer times, and finances across all your devices.</span>
              </div>

              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>100% private, free, and secured directly with Firebase Authentication.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

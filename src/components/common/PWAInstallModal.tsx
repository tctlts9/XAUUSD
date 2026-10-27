import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X, Check } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
        setInstallSuccess(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Smartphone className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Install XAUUSD TRADING App</h3>
            <p className="text-xs text-slate-400">Fast and seamless mobile & desktop experience</p>
          </div>
        </div>

        {/* Status / Instruction Body */}
        <div className="mt-5 space-y-4 text-xs">
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block font-semibold">Already Installed!</strong>
                <span>You are currently running the installed standalone app.</span>
              </div>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2.5">
                <span className="font-semibold text-amber-400 block">Installation guide for iPhone / iPad (iOS):</span>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-white">Share icon (<Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" />)</strong> in the Safari bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    Scroll down and select <strong className="text-white">Add to Home Screen (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" />)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-white">Add</strong> in the top right. The XAUUSD app icon will appear on your home screen.
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Launch from your Home Screen for a clean full-screen experience without browser toolbars.
              </div>
            </div>
          ) : (
            /* Android / Chrome / Edge flow */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
                <span className="font-semibold text-white block">Mobile App Features:</span>
                <ul className="space-y-1.5 text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Full-screen standalone display with no browser address bar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Offline access with cached local data storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant launch directly from your home screen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ultra lightweight (&lt; 2MB), saves memory and battery</span>
                  </li>
                </ul>
              </div>

              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Install to Device Now</span>
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-slate-800/80 text-slate-300 text-[11px]">
                  <span>If the install button has not appeared, tap your browser's menu (three dots in top right) and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

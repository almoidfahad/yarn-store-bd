'use client';

import React, { useEffect, useState } from 'react';
import { EyeOff, Lock, ShieldAlert } from 'lucide-react';
import { DEFAULT_SECURITY_SETTINGS, type SecuritySettings } from '@/lib/securityTypes';

interface ContentProtectionShieldProps {
  scope: 'dashboard' | 'products';
  initialSettings?: SecuritySettings;
  liveSettings?: SecuritySettings;
  children: React.ReactNode;
}

export function ContentProtectionShield({
  scope,
  initialSettings,
  liveSettings,
  children,
}: ContentProtectionShieldProps) {
  const [fetchedSettings, setFetchedSettings] = useState<SecuritySettings>(
    initialSettings || DEFAULT_SECURITY_SETTINGS
  );
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [captureAttemptMsg, setCaptureAttemptMsg] = useState<string | null>(null);

  const settings = liveSettings || fetchedSettings;
  const isProtected =
    scope === 'dashboard'
      ? settings.dashboardScreenshotProtection
      : settings.productScreenshotProtection;

  // Poll / fetch latest security settings if not controlled directly by parent
  useEffect(() => {
    if (liveSettings) return;
    fetch('/api/security-settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.securitySettings) {
          setFetchedSettings(d.securitySettings);
        }
      })
      .catch(() => {});
  }, [liveSettings]);

  useEffect(() => {
    if (!isProtected) {
      setWindowBlurred(false);
      setCaptureAttemptMsg(null);
      return;
    }

    const triggerAlert = (reason: string) => {
      setCaptureAttemptMsg(reason);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText('Protected Content — Screenshot & Recording Disabled by YARN STORE BD.')
            .catch(() => {});
        }
      } catch {
        // Ignore clipboard permission errors
      }
      setTimeout(() => {
        setCaptureAttemptMsg((prev) => (prev === reason ? null : prev));
      }, 3200);
    };

    // 1. Block Browser Screen Recording API (getDisplayMedia)
    let originalGetDisplayMedia: typeof navigator.mediaDevices.getDisplayMedia | undefined;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
      originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async () => {
        triggerAlert('Screen & Video Recording is strictly disabled on protected content.');
        throw new DOMException('Screen recording blocked by YARN STORE BD Security Shield.', 'NotAllowedError');
      };
    }

    // 2. Intercept PrintScreen, Snipping Tool, macOS Screenshot, Save & DevTools keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        triggerAlert('Screenshot blocked! PrintScreen capture is disabled.');
        return false;
      }

      // macOS Cmd+Shift+3 / 4 / 5 / S or Windows Ctrl+Shift+S
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's', 'i', 'j', 'c'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        triggerAlert('Screen capture & inspection shortcuts are disabled.');
        return false;
      }

      // F12 DevTools or Ctrl+S / Ctrl+U
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && ['s', 'u'].includes(key))) {
        e.preventDefault();
        e.stopPropagation();
        triggerAlert('Saving & source inspection are disabled on protected pages.');
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerAlert('Screenshot blocked! Clipboard has been cleared by Security Shield.');
      }
    };

    // 3. Block Right-Click & Dragging
    const handleContextMenu = (e: MouseEvent) => {
      if (!settings.blockRightClickAndDrag) return;
      e.preventDefault();
      triggerAlert('Right-click & media download are disabled.');
    };

    const handleDragStart = (e: DragEvent) => {
      if (!settings.blockRightClickAndDrag) return;
      if (e.target instanceof HTMLImageElement || scope === 'dashboard') {
        e.preventDefault();
      }
    };

    // 4. Instant Window-Blur / Visibility Curtain against Snipping Tool, OBS, QuickTime & Mobile Recorders
    const handleBlur = () => {
      if (!settings.antiScreenRecordingBlur) return;
      // Allow native <select> dropdowns without false blackout
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'select' || activeTag === 'input') {
        // Still blackout if document itself became hidden
        if (document.hidden) setWindowBlurred(true);
        return;
      }
      setWindowBlurred(true);
    };

    const handleFocus = () => {
      setWindowBlurred(false);
    };

    const handleVisibility = () => {
      if (!settings.antiScreenRecordingBlur) return;
      if (document.hidden) {
        setWindowBlurred(true);
      } else {
        setWindowBlurred(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, [
    isProtected,
    scope,
    settings.antiScreenRecordingBlur,
    settings.blockRightClickAndDrag,
  ]);

  if (!isProtected) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative select-none"
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Print Blocker Style when protection is active (unless explicit print-only modal is active) */}
      <style jsx global>{`
        @media print {
          .ysb-protected-zone {
            visibility: hidden !important;
            filter: blur(28px) !important;
          }
        }
      `}</style>

      {/* Subtle Dynamic Forensic Watermark Overlay */}
      {settings.watermarkOverlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[45] overflow-hidden opacity-[0.035] select-none no-print"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 p-10 -rotate-12 scale-110">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="text-xs font-black tracking-widest text-[#063B19] whitespace-nowrap">
                PROTECTED · YARN STORE BD · NO SCREENSHOT / NO RECORDING
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot / Recording Attempt Red Warning Banner */}
      {captureAttemptMsg && (
        <div className="fixed inset-0 z-[95] bg-[#04240F]/95 backdrop-blur-xl flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-[#084720] border-2 border-amber-400 rounded-3xl p-7 text-center space-y-3 shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-extrabold">Screenshot &amp; Recording Blocked</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">{captureAttemptMsg}</p>
            <button
              type="button"
              onClick={() => setCaptureAttemptMsg(null)}
              className="px-5 py-2 rounded-full bg-[#F28C18] text-white text-xs font-extrabold"
            >
              Resume Protected View
            </button>
          </div>
        </div>
      )}

      {/* Instant 0ms Focus-Loss Anti-Snipping / Anti-Screen-Recorder Curtain */}
      {windowBlurred && settings.antiScreenRecordingBlur && (
        <div
          onClick={() => setWindowBlurred(false)}
          onMouseEnter={() => {
            if (document.hasFocus()) setWindowBlurred(false);
          }}
          className="fixed inset-0 z-[90] bg-[#04240F] flex items-center justify-center p-6 text-white cursor-pointer"
        >
          <div className="max-w-md w-full bg-white/10 border border-emerald-400/30 rounded-3xl p-7 text-center space-y-3">
            <EyeOff className="w-11 h-11 text-amber-400 mx-auto" />
            <h3 className="text-lg font-extrabold">
              {scope === 'dashboard'
                ? 'Admin Dashboard Cloaked Against Screen Capture'
                : 'Product Visuals & Specs Protected Against Capture'}
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Screen capture tools, snipping utilities, and background video recorders are blocked. Click anywhere inside this window to resume viewing.
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#08752B] text-white text-xs font-bold">
              <Lock className="w-3.5 h-3.5" /> Click to Unlock View
            </span>
          </div>
        </div>
      )}

      <div className="ysb-protected-zone">{children}</div>
    </div>
  );
}

/**
 * Protected Product Image / Media Vault:
 * Places an invisible anti-save shield + subtle corner watermark over product images
 * so right-click "Save Image As", drag-and-drop, and mobile long-press save are blocked.
 */
export function ProtectedProductImage({
  src,
  alt,
  className = '',
  protectedEnabled = true,
}: {
  src: string;
  alt: string;
  className?: string;
  protectedEnabled?: boolean;
}) {
  return (
    <div className="relative overflow-hidden select-none w-full h-full">
      <img
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={(e) => protectedEnabled && e.preventDefault()}
        className={`${className} select-none pointer-events-none`}
      />
      {protectedEnabled && (
        <>
          {/* Invisible Touch/Click Shield preventing direct <img> save/drag */}
          <div
            aria-hidden="true"
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-10 bg-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded bg-black/45 backdrop-blur-sm text-[9px] font-bold text-white/90 tracking-wider"
          >
            © YARN STORE BD · PROTECTED
          </span>
        </>
      )}
    </div>
  );
}

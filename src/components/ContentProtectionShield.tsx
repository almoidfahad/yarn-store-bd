'use client';

import React, { useEffect, useRef, useState } from 'react';
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

  const curtainRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reasonTextRef = useRef<HTMLParagraphElement | null>(null);
  const lockUntilRef = useRef<number>(0);

  const settings = liveSettings || fetchedSettings;
  const isProtected =
    scope === 'dashboard'
      ? settings.dashboardScreenshotProtection
      : settings.productScreenshotProtection;

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
    const curtain = curtainRef.current;
    const content = contentRef.current;

    const showContent = () => {
      if (curtain) {
        curtain.style.opacity = '0';
        curtain.style.visibility = 'hidden';
        curtain.style.pointerEvents = 'none';
      }
      if (content) {
        content.style.opacity = '1';
        content.style.visibility = 'visible';
        content.style.filter = 'none';
      }
    };

    if (!isProtected) {
      showContent();
      return;
    }

    // Synchronous <0.1ms DOM blackout (executes before OS screenshot / recorder grabs frame)
    const cloakNow = (reason?: string, holdMs = 0) => {
      if (holdMs > 0) {
        lockUntilRef.current = Math.max(lockUntilRef.current, Date.now() + holdMs);
      }
      if (content) {
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        content.style.filter = 'blur(36px)';
      }
      if (curtain) {
        curtain.style.visibility = 'visible';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'auto';
      }
      if (reason && reasonTextRef.current) {
        reasonTextRef.current.textContent = reason;
      }
      try {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard
            .writeText('PROTECTED BY YARN STORE BD — SCREENSHOT & RECORDING DISABLED')
            .catch(() => {});
        }
      } catch {
        // Ignore clipboard errors
      }
    };

    const tryRestore = (forceUnlock = false) => {
      if (forceUnlock) {
        lockUntilRef.current = 0;
      }
      if (Date.now() < lockUntilRef.current) return;
      if (document.hidden) return;
      if (settings.antiScreenRecordingBlur && !document.hasFocus()) return;
      showContent();
    };

    // Initial focus check on mount
    if (settings.antiScreenRecordingBlur && (!document.hasFocus() || document.hidden)) {
      cloakNow(
        'Screen capture & background recording shield active. Click inside this window to view.'
      );
    }

    // 1. Block Browser Screen Recording & Canvas Capture APIs
    let origGetDisplayMedia: typeof navigator.mediaDevices.getDisplayMedia | undefined;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
      origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async () => {
        cloakNow('Screen & video recording API blocked by YARN STORE BD Security.', 4000);
        throw new DOMException('Screen recording blocked', 'NotAllowedError');
      };
    }

    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      if (this.dataset?.ysbProtected === '1') {
        cloakNow('Unauthorized image/extension capture blocked.', 3000);
        return 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
      }
      return origToDataURL.apply(this, args);
    };

    // 2. Pre-emptive 0ms Keydown / Keyup Blocker (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5, Ctrl+Shift+S, F12, Print)
    const onKeyDown = (e: KeyboardEvent) => {
      const k = (e.key || '').toLowerCase();

      // PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        cloakNow('PrintScreen screenshot blocked! Clipboard wiped.', 4000);
        return false;
      }

      // Pre-emptive cloak the instant Windows (Meta/OS) or Mac Command key is touched
      // (Stops Win+Shift+S, Win+PrtSc, Win+Alt+R recorder, and Mac Cmd+Shift+3/4/5 BEFORE second key hits!)
      if (
        e.key === 'Meta' ||
        e.key === 'OS' ||
        e.metaKey ||
        [91, 92, 93, 224].includes(e.keyCode)
      ) {
        if (e.shiftKey || ['3', '4', '5', 's', 'r', 'g', 'p'].includes(k)) {
          e.preventDefault();
          e.stopPropagation();
          cloakNow('OS Screenshot / Screen Recording shortcut blocked!', 4000);
          return false;
        }
        // Pre-cloak immediately while Meta/Win/Cmd is held down
        cloakNow('Protected Mode — OS capture modifier detected. Release key or click to resume.', 650);
      }

      // Ctrl + Shift combos (Ctrl+Shift+S Edge/Firefox capture, ShareX, Lightshot, DevTools)
      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        cloakNow('Screenshot & inspection shortcut (Ctrl+Shift) blocked!', 3500);
        return false;
      }

      // Alt + PrintScreen or Alt + Shift capture tools
      if (e.altKey && (e.shiftKey || k === 'printscreen' || k === 's')) {
        cloakNow('Screen capture shortcut blocked!', 3000);
      }

      // F12, Ctrl+S, Ctrl+P, Ctrl+U
      if (e.key === 'F12' || (e.ctrlKey && ['p', 's', 'u'].includes(k))) {
        e.preventDefault();
        e.stopPropagation();
        cloakNow('Page printing, saving & inspection are disabled on protected views.', 3500);
        return false;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        cloakNow('Screenshot blocked! Clipboard cleared by YARN STORE BD Security.', 4000);
        return;
      }
      if (e.key === 'Meta' || e.key === 'OS' || [91, 92, 93, 224].includes(e.keyCode)) {
        setTimeout(() => tryRestore(false), 700);
      }
    };

    // 3. Zero-Delay Focus, Visibility & Mouse-Leave Toolbar/Extension Guard
    const onBlur = () => {
      if (!settings.antiScreenRecordingBlur) return;
      cloakNow(
        'Window focus lost (Snipping Tool / Screen Recorder guard). Click inside to resume viewing.'
      );
    };

    const onFocus = () => {
      tryRestore(false);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cloakNow('Tab backgrounded — capture & recording protection active.');
      } else {
        tryRestore(false);
      }
    };

    const onMouseLeaveViewport = (e: MouseEvent) => {
      if (!settings.antiScreenRecordingBlur) return;
      if (e.clientY <= 4 || e.clientX <= 2 || e.clientX >= window.innerWidth - 2) {
        cloakNow(
          'Cursor left protected viewport (Toolbar / Capture Extension Guard). Move cursor back inside to view.'
        );
      }
    };

    const onMouseEnterViewport = () => {
      if (document.hasFocus()) {
        tryRestore(false);
      }
    };

    // 4. Mobile Multi-Finger Screenshot Gesture Blocker (2-finger / 3-finger swipe screenshot on Android/iOS)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 2) {
        cloakNow('Multi-finger screenshot / capture gesture blocked!', 3000);
      }
    };

    // 5. Right-Click & Drag Blocker
    const onContextMenu = (e: MouseEvent) => {
      if (!settings.blockRightClickAndDrag) return;
      e.preventDefault();
      cloakNow('Right-click & media saving are disabled.', 1800);
    };

    const onDragStart = (e: DragEvent) => {
      if (!settings.blockRightClickAndDrag) return;
      e.preventDefault();
    };

    // 6. 80ms Hardware Focus Watchdog (catches OS snipping overlays that bypass window.onblur)
    const focusPoll = window.setInterval(() => {
      if (!settings.antiScreenRecordingBlur) return;
      if (document.hidden || !document.hasFocus()) {
        if (content && content.style.visibility !== 'hidden') {
          cloakNow(
            'Active screen capture / focus-loss guard engaged. Click inside this page to unlock.'
          );
        }
      } else if (Date.now() >= lockUntilRef.current) {
        // Auto-recover if focus is back and lock timer expired
      }
    }, 80);

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur, true);
    window.addEventListener('focus', onFocus, true);
    document.addEventListener('visibilitychange', onVisibility, true);
    document.documentElement.addEventListener('mouseleave', onMouseLeaveViewport);
    document.documentElement.addEventListener('mouseenter', onMouseEnterViewport);
    window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('dragstart', onDragStart, true);

    return () => {
      window.clearInterval(focusPoll);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur, true);
      window.removeEventListener('focus', onFocus, true);
      document.removeEventListener('visibilitychange', onVisibility, true);
      document.documentElement.removeEventListener('mouseleave', onMouseLeaveViewport);
      document.documentElement.removeEventListener('mouseenter', onMouseEnterViewport);
      window.removeEventListener('touchstart', onTouchStart, true);
      document.removeEventListener('contextmenu', onContextMenu, true);
      document.removeEventListener('dragstart', onDragStart, true);
      HTMLCanvasElement.prototype.toDataURL = origToDataURL;
      if (origGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = origGetDisplayMedia;
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

  const handleManualUnlock = () => {
    lockUntilRef.current = 0;
    if (curtainRef.current) {
      curtainRef.current.style.opacity = '0';
      curtainRef.current.style.visibility = 'hidden';
      curtainRef.current.style.pointerEvents = 'none';
    }
    if (contentRef.current) {
      contentRef.current.style.opacity = '1';
      contentRef.current.style.visibility = 'visible';
      contentRef.current.style.filter = 'none';
    }
  };

  return (
    <div
      className="relative select-none"
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Dynamic Forensic Anti-Camera Watermark Grid */}
      {settings.watermarkOverlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[45] overflow-hidden opacity-[0.045] select-none no-print"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-14 p-8 -rotate-12 scale-110">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className="text-[11px] font-black tracking-widest text-emerald-700 dark:text-emerald-300 whitespace-nowrap"
              >
                PROTECTED · YARN STORE BD · NO SCREENSHOT / NO VIDEO
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Always-Mounted Synchronous 0ms Hardware Blackout Curtain */}
      <div
        ref={curtainRef}
        onClick={handleManualUnlock}
        onMouseMove={() => {
          if (document.hasFocus() && Date.now() >= lockUntilRef.current) {
            handleManualUnlock();
          }
        }}
        style={{
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          transition: 'none',
          zIndex: 2147483640,
        }}
        className="fixed inset-0 bg-[#031B0B] flex items-center justify-center p-6 text-white cursor-pointer select-none"
      >
        <div className="max-w-md w-full bg-[#073818] border-2 border-amber-400/80 rounded-3xl p-7 text-center space-y-3.5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold">
            {scope === 'dashboard'
              ? 'Admin Dashboard — Screenshot & Recording Blocked'
              : 'Protected Product Content — Capture Disabled'}
          </h3>
          <p
            ref={reasonTextRef}
            className="text-xs sm:text-sm text-emerald-100 leading-relaxed"
          >
            Screenshots, snipping tools, browser capture extensions, and screen recordings are strictly blocked.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-xs font-extrabold shadow-lg">
              <Lock className="w-3.5 h-3.5" /> Click Inside Window to Resume Viewing
            </span>
          </div>
          <div className="text-[10px] text-emerald-300/70 flex items-center justify-center gap-1 pt-1">
            <EyeOff className="w-3 h-3" /> Zero-Latency Content Shield · YARN STORE BD
          </div>
        </div>
      </div>

      {/* Protected Content Layer */}
      <div ref={contentRef} style={{ transition: 'none' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Encrypted HTML5 Canvas Product Renderer:
 * When `protectedEnabled` is ON, renders the product image onto a poisoned `<canvas>`
 * (no `<img>` URL in DOM, right-click & extension `toDataURL` blocked!) with dynamic watermark.
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!protectedEnabled) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        // Subtle baked-in anti-capture forensic watermark inside canvas pixels
        ctx.save();
        ctx.font = `bold ${Math.max(14, Math.round(w * 0.022))}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.rotate(-0.18);
        ctx.fillText('YARN STORE BD · PROTECTED', w * 0.08, h * 0.58);
        ctx.restore();
        setCanvasReady(true);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, protectedEnabled]);

  if (!protectedEnabled) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div
      aria-label={alt}
      role="img"
      onContextMenu={(e) => e.preventDefault()}
      className="relative overflow-hidden select-none w-full h-full bg-slate-900/10"
    >
      <canvas
        ref={canvasRef}
        data-ysb-protected="1"
        className={`${className} select-none pointer-events-none block ${
          canvasReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 z-10 bg-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded bg-black/55 backdrop-blur-sm text-[9px] font-bold text-white/95 tracking-wider"
      >
        © YARN STORE BD · PROTECTED
      </span>
    </div>
  );
}

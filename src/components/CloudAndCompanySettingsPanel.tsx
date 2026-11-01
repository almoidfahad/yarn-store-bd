'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  Database,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Shield,
  ShieldOff,
} from 'lucide-react';
import { DEFAULT_SECURITY_SETTINGS, type SecuritySettings } from '@/lib/securityTypes';
import type { PlatformDB } from '@/lib/db';

interface IntegrationStatus {
  vercel: { active: boolean; environment: string; region: string };
  supabase: { configured: boolean; urlPreview: string; hasServiceRole: boolean };
  resend: { configured: boolean; fromEmail: string };
}

export function CloudAndCompanySettingsPanel({
  companyProfile,
  securitySettings,
  onSaveCompanyProfile,
  onUpdateSecuritySettings,
}: {
  companyProfile: PlatformDB['companyProfile'];
  securitySettings?: SecuritySettings;
  onSaveCompanyProfile: (updated: PlatformDB['companyProfile']) => void;
  onUpdateSecuritySettings: (updated: SecuritySettings) => void;
}) {
  const sec = securitySettings || DEFAULT_SECURITY_SETTINGS;
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState(companyProfile.email || 'almoidfahad@gmail.com');
  const [testing, setTesting] = useState(false);

  const [form, setForm] = useState(companyProfile);

  useEffect(() => {
    fetch('/api/integrations')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStatus(d.integrations);
      })
      .catch(() => {});
  }, []);

  async function runTest(action: 'TEST_SUPABASE' | 'TEST_RESEND') {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, testEmail }),
      });
      const data = await res.json();
      setTestResult(data.message);
    } catch {
      setTestResult('Connection check encountered a network error.');
    } finally {
      setTesting(false);
    }
  }

  function toggleFlag(key: keyof SecuritySettings) {
    onUpdateSecuritySettings({
      ...sec,
      [key]: !sec[key],
    });
  }

  const allOn =
    sec.dashboardScreenshotProtection && sec.productScreenshotProtection;

  return (
    <div className="lg:col-span-2 space-y-5">
      {/* =====================================================================
          1. ANTI-SCREENSHOT & ANTI-SCREEN-RECORDING ON/OFF CONTROL PANEL
      ===================================================================== */}
      <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                allOn ? 'bg-[#08752B] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {allOn ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Anti-Screenshot &amp; Anti-Screen-Recording Security Shield (ON / OFF)
              </h3>
              <p className="text-xs text-slate-500">
                Control screenshot blocking, screen-recorder blackout curtains, and image save protection across your Admin Dashboard and Product Pages in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onUpdateSecuritySettings({
                  dashboardScreenshotProtection: true,
                  productScreenshotProtection: true,
                  antiScreenRecordingBlur: true,
                  blockRightClickAndDrag: true,
                  watermarkOverlay: true,
                })
              }
              className="px-3.5 py-2 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white text-xs font-extrabold"
            >
              Enable All Protection
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSecuritySettings({
                  ...sec,
                  dashboardScreenshotProtection: false,
                  productScreenshotProtection: false,
                })
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold"
            >
              Turn All OFF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              key: 'dashboardScreenshotProtection' as const,
              title: 'Admin Dashboard Anti-Screenshot & Recording',
              desc: 'Blocks PrintScreen, Snipping Tool, macOS/Windows screenshot shortcuts & screen recorders inside /admin.',
            },
            {
              key: 'productScreenshotProtection' as const,
              title: 'Product Pages Anti-Screenshot & Video Recording',
              desc: 'Protects /products & all product photos/specs from screenshots, video recording, right-click save & drag.',
            },
            {
              key: 'antiScreenRecordingBlur' as const,
              title: 'Instant Blackout Curtain on Snipping Tool / Recorder',
              desc: 'Immediately cloaks screen when Snipping Tool, OBS, QuickTime, or mobile capture steals window focus.',
            },
            {
              key: 'blockRightClickAndDrag' as const,
              title: 'Block Right-Click, Save Image & DevTools Inspect',
              desc: 'Prevents "Save Image As", image dragging, F12 inspect, and Ctrl+S page downloading.',
            },
            {
              key: 'watermarkOverlay' as const,
              title: 'Dynamic Forensic Anti-Camera Watermark',
              desc: 'Places subtle protected watermark across protected views to deter external phone camera photos.',
            },
          ].map((item) => {
            const enabled = sec[item.key];
            return (
              <div
                key={item.key}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                  enabled
                    ? 'bg-[#F3FAF5] border-emerald-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Lock className={`w-3.5 h-3.5 ${enabled ? 'text-[#08752B]' : 'text-slate-400'}`} />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => toggleFlag(item.key)}
                  className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full px-1 transition-colors font-extrabold text-[10px] ${
                    enabled ? 'bg-[#08752B] text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                  style={{ width: '56px' }}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. VERCEL + SUPABASE + RESEND CLOUD STACK STATUS
      ===================================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
            Cloud Deployment Stack — Vercel + Supabase + Resend
          </h3>
          <p className="text-xs text-slate-500">
            Live cloud database &amp; email infrastructure status, plus optional external OAuth callback URL (`https://xiyfzjjgkmtoxchfexyi.supabase.co/auth/v1/callback`) for LinkedIn, Google, Facebook &amp; X.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-[#F5F9F6] border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-extrabold text-[#10371E]">
                <Cloud className="w-4 h-4 text-[#08752B]" /> Vercel Hosting
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold text-[10px]">
                {status?.vercel.active ? 'Vercel Live' : 'Ready to Deploy'}
              </span>
            </div>
            <p className="text-slate-600">
              Env: <strong>{status?.vercel.environment || 'local-demo'}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F9F6] border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-extrabold text-[#10371E]">
                <Database className="w-4 h-4 text-[#08752B]" /> Supabase PostgreSQL
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  status?.supabase.configured
                    ? 'bg-emerald-100 text-[#08752B]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status?.supabase.configured ? 'Cloud Connected' : 'Demo Store Mode'}
              </span>
            </div>
            <p className="text-slate-600 truncate">
              {status?.supabase.urlPreview || '23-Table RLS SQL Ready'}
            </p>
            <button
              type="button"
              disabled={testing}
              onClick={() => runTest('TEST_SUPABASE')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#08752B] text-white font-bold text-[11px]"
            >
              <RefreshCw className="w-3 h-3" /> Verify Supabase Connection
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F9F6] border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-extrabold text-[#10371E]">
                <Mail className="w-4 h-4 text-[#08752B]" /> Resend Email API
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  status?.resend.configured
                    ? 'bg-emerald-100 text-[#08752B]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status?.resend.configured ? 'Resend Live' : 'Demo Sandbox Mode'}
              </span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Test email..."
                className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px]"
              />
              <button
                type="button"
                disabled={testing}
                onClick={() => runTest('TEST_RESEND')}
                className="px-2.5 py-1 rounded-lg bg-[#F28C18] text-white font-bold text-[11px]"
              >
                Send Test
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#063B19] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#08752B] shrink-0" />
            <span>{testResult}</span>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. COMPANY INFORMATION QUICK EDITOR
      ===================================================================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveCompanyProfile(form);
        }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3.5 text-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Company Information Editor (Demo Data — Edit Anytime)
            </h3>
            <p className="text-slate-500">
              Change your company name, official email, WhatsApp hotline, Dhaka office address, or ERC license here whenever ready.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white font-bold"
          >
            <Save className="w-3.5 h-3.5" /> Save Company Info
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Brand Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Sub-Brand / Trade Name</label>
            <input
              value={form.legalSubtitle}
              onChange={(e) => setForm({ ...form, legalSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Official Export Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Hotline &amp; WhatsApp</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value, whatsapp: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-600 block mb-1">Export Head Office Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Spinning Mill / Factory Address</label>
            <input
              value={form.factoryAddress}
              onChange={(e) => setForm({ ...form, factoryAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">ERC Export License No.</label>
            <input
              value={form.ercNumber}
              onChange={(e) => setForm({ ...form, ercNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cloud, Database, Mail, RefreshCw, Save } from 'lucide-react';
import type { PlatformDB } from '@/lib/db';

interface IntegrationStatus {
  vercel: { active: boolean; environment: string; region: string };
  supabase: { configured: boolean; urlPreview: string; hasServiceRole: boolean };
  resend: { configured: boolean; fromEmail: string };
}

export function CloudAndCompanySettingsPanel({
  companyProfile,
  onSaveCompanyProfile,
}: {
  companyProfile: PlatformDB['companyProfile'];
  onSaveCompanyProfile: (updated: PlatformDB['companyProfile']) => void;
}) {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState(companyProfile.email || 'info@yarnstorebd.com');
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

  return (
    <div className="lg:col-span-2 space-y-5">
      {/* 1. Vercel + Supabase + Resend Integration Status Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Cloud Deployment Stack — Vercel + Supabase + Resend
            </h3>
            <p className="text-xs text-slate-500">
              Runs out-of-the-box with Demo Data right now, and automatically switches to Cloud PostgreSQL &amp; Live Transactional Email as soon as environment variables are added in Vercel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {/* Vercel */}
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
              Env: <strong>{status?.vercel.environment || 'local-demo'}</strong> · Serverless `/tmp` + Cloud Safe
            </p>
          </div>

          {/* Supabase */}
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

          {/* Resend */}
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

      {/* 2. Demo -> Real Company Information Quick Editor */}
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
              Company Information Editor (Currently Using Demo Data — Edit Anytime)
            </h3>
            <p className="text-slate-500">
              Change your company name, official email, WhatsApp hotline, Dhaka office address, or ERC license here whenever you are ready to replace demo data.
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

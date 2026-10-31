import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Leadership & International Export Desk Team',
  description: 'Meet the management, export sales, quality assurance, and sourcing specialists at YARN STORE BD.',
};

export default function TeamPage() {
  const db = readDB();

  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            DEDICATED EXPORT LEADERSHIP
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
            Responsible People Behind Every Container Shipment
          </h1>
          <p className="text-sm text-emerald-100 mt-2">
            International buyers work directly with accountable department heads across Export Sales, Spinning Production, Uster Quality Assurance, and Port Logistics.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {db.teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ECF6EE] text-[#08752B] font-black text-base flex items-center justify-center mb-3">
                  {member.name
                    .trim()
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] text-[11px] font-bold">
                  {member.role}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-2">{member.name}</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{member.accessScope}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#08752B]" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#08752B]" />
                  <span>Verified Export Contact</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#ECF6EE] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-bold text-[#10371E]">
            Direct International Export Hotline: <span className="text-[#08752B]">+880 1677 852904</span>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#08752B] text-white text-xs font-bold px-5 py-2.5 rounded-full"
          >
            <Phone className="w-3.5 h-3.5" /> Schedule Video Consultation
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}

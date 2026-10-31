'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export default function ContactPage() {
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    inquiryType: 'Bulk Export Enquiry',
    subject: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSentRef(data.reference);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            INTERNATIONAL EXPORT SALES DESK
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Contact YARN STORE BD — MHR Thread &amp; Accessories
          </h1>
          <p className="text-sm text-emerald-100">
            Reach our Dhaka Export Office via Official Email, WhatsApp Business, or schedule a video call with our Sales &amp; Production Team.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-12 gap-8">
        {/* Left Contact Channels & Dhaka Map */}
        <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-extrabold text-[#10371E]">Direct Corporate Channels</h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#08752B] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Export Head Office</div>
                <div className="text-slate-600">123 Textile Industrial Area, Dhaka, Bangladesh</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#08752B] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Export Hotline &amp; WhatsApp Business</div>
                <a href="tel:+8801677852904" className="text-[#08752B] font-bold hover:underline">
                  +880 1677 852904
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#08752B] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Official Business Email</div>
                <a href="mailto:info@yarnstorebd.com" className="text-[#08752B] font-bold hover:underline">
                  info@yarnstorebd.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://wa.me/8801677852904"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#16A34A] text-white text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    inquiryType: 'Scheduled Video Meeting',
                    subject: 'Requesting Zoom/Teams Mill & Export Call',
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-50 text-[#08752B] border border-emerald-200 text-xs font-bold"
              >
                <Calendar className="w-4 h-4" /> Book Video Meeting
              </button>
            </div>
          </div>

          {/* Embedded Industrial Corridor Map SVG */}
          <div className="bg-[#ECF6EE] rounded-3xl border border-emerald-200 p-4 overflow-hidden">
            <div className="text-xs font-extrabold text-[#063B1B] mb-2">
              Bangladesh Textile Corridor — Dhaka HQ · Gazipur Spinning · Chattogram Port
            </div>
            <svg viewBox="0 0 360 180" className="w-full rounded-2xl bg-white border border-emerald-100">
              <rect width="360" height="180" fill="#F3FAF5" />
              <path d="M40 30 Q 150 70 190 95 T 310 155" stroke="#08752B" strokeWidth="2.5" strokeDasharray="5 4" fill="none" />
              <circle cx="155" cy="65" r="7" fill="#08752B" />
              <text x="167" y="68" fontSize="10" fontWeight="700" fill="#10371E">Gazipur Spinning Unit</text>
              <circle cx="182" cy="92" r="8" fill="#F28C18" />
              <text x="194" y="96" fontSize="10.5" fontWeight="800" fill="#063B1B">Dhaka Export HQ</text>
              <circle cx="295" cy="148" r="7" fill="#2563EB" />
              <text x="200" y="166" fontSize="10" fontWeight="700" fill="#1E3A8A">Chattogram Deep Sea Port</text>
            </svg>
          </div>
        </div>

        {/* Right Direct CRM Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          {sentRef ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#08752B] mx-auto" />
              <h2 className="text-2xl font-extrabold text-[#10371E]">
                Enquiry Logged in CRM ({sentRef})
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                An instant acknowledgement has been recorded and our Export Sales Executive will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <h2 className="text-xl font-extrabold text-[#10371E]">
                Send a Message or Schedule a Sourcing Call
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enquiry Type</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option>Bulk Export Enquiry</option>
                    <option>Scheduled Video Meeting</option>
                    <option>Sample Cone Follow-up</option>
                    <option>Partner Mill Verification</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Monthly 20ft FCL Cotton Yarn Supply"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share your yarn specifications, target destination port, or preferred meeting time..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#08752B] hover:bg-[#065C22] text-white font-extrabold shadow"
              >
                {loading ? 'Sending Message...' : 'Send Message to Export Desk →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicShell>
  );
}

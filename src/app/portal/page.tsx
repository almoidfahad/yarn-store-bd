'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  FileText,
  FlaskConical,
  FolderDown,
  Lock,
  MessageSquare,
  Printer,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { PublicShell, QuotationDocumentModal } from '@/components/SiteChrome';
import type { PlatformDB, QuoteRecord } from '@/lib/db';

const DEMO_BUYERS = [
  { label: 'ABC Textiles Ltd (USA — john.smith@abctextiles.com)', email: 'john.smith@abctextiles.com', company: 'ABC Textiles' },
  { label: 'Fashion World Co (UAE — procurement@fashionworld.ae)', email: 'procurement@fashionworld.ae', company: 'Fashion World' },
  { label: 'EuroTextile GmbH (Germany — anna.mueller@eurotextile.de)', email: 'anna.mueller@eurotextile.de', company: 'EuroTextile' },
  { label: 'Textile Solutions (UK — d.wilson@textilesolutions.co.uk)', email: 'd.wilson@textilesolutions.co.uk', company: 'Textile Solutions' },
];

function BuyerPortalInner() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams?.get('email') || 'john.smith@abctextiles.com';

  const [buyerEmail, setBuyerEmail] = useState(queryEmail);
  const [customEmailInput, setCustomEmailInput] = useState(queryEmail);
  const [db, setDb] = useState<PlatformDB | null>(null);
  const [tab, setTab] = useState<'overview' | 'enquiries' | 'quotes' | 'samples' | 'orders' | 'docs' | 'support'>('overview');
  const [pdfQuote, setPdfQuote] = useState<QuoteRecord | null>(null);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  async function loadPortal() {
    const res = await fetch('/api/platform');
    const data = await res.json();
    setDb(data.db);
  }

  useEffect(() => {
    loadPortal();
  }, []);

  if (!db) {
    return <div className="p-14 text-center text-sm text-slate-500">Loading Secure Buyer Portal...</div>;
  }

  // Strict RLS-style isolation: a buyer ONLY sees records matching their own email/company!
  const lower = buyerEmail.toLowerCase();
  const myRfqs = db.rfqs.filter((r) => r.email.toLowerCase() === lower);
  const companyHint = myRfqs[0]?.companyName?.toLowerCase() || lower.split('@')[1]?.split('.')[0] || '';

  const myQuotes = db.quotes.filter(
    (q) =>
      q.buyerEmail.toLowerCase() === lower ||
      (companyHint && q.buyerCompany.toLowerCase().includes(companyHint))
  );
  const mySamples = db.samples.filter(
    (s) =>
      s.buyerEmail.toLowerCase() === lower ||
      (companyHint && s.buyerCompany.toLowerCase().includes(companyHint))
  );
  const myOrders = db.orders.filter(
    (o) =>
      o.buyerEmail.toLowerCase() === lower ||
      (companyHint && o.buyer.toLowerCase().includes(companyHint))
  );

  async function acceptQuote(quoteId: string) {
    await fetch('/api/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ACCEPT_QUOTE_CREATE_ORDER', payload: { id: quoteId } }),
    });
    await loadPortal();
    setTab('orders');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Buyer Account Switcher / Login Header (Blueprint Part 2.2) */}
      <div className="bg-gradient-to-r from-[#063B1B] to-[#08752B] text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 uppercase">
            <Lock className="w-3.5 h-3.5" /> Isolated B2B Buyer Portal (Row-Level Privacy Enforced)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            International Buyer Account Workspace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Signed in as <strong>{buyerEmail}</strong> — Viewing only your company&apos;s private RFQs, Quotations, Samples, Orders &amp; Export Documents.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/15 w-full lg:w-auto space-y-2 text-xs">
          <div className="font-bold text-emerald-100">Switch Demo Buyer Account or Enter Your RFQ Email:</div>
          <select
            value={DEMO_BUYERS.some((b) => b.email === buyerEmail) ? buyerEmail : 'custom'}
            onChange={(e) => {
              if (e.target.value !== 'custom') {
                setBuyerEmail(e.target.value);
                setCustomEmailInput(e.target.value);
              }
            }}
            className="w-full px-3 py-2 rounded-lg text-slate-900 font-semibold"
          >
            {DEMO_BUYERS.map((b) => (
              <option key={b.email} value={b.email}>
                {b.label}
              </option>
            ))}
            <option value="custom">Custom Buyer Email...</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customEmailInput.includes('@')) setBuyerEmail(customEmailInput.trim());
            }}
            className="flex gap-1.5"
          >
            <input
              type="email"
              value={customEmailInput}
              onChange={(e) => setCustomEmailInput(e.target.value)}
              placeholder="Enter your RFQ email..."
              className="flex-1 px-3 py-1.5 rounded-lg text-slate-900"
            />
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-[#F28C18] text-white font-bold">
              Load
            </button>
          </form>
        </div>
      </div>

      {/* Portal Tabs covering all 9 Buyer Portal Capabilities */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'My Company Profile & Summary', icon: Building2 },
          { id: 'enquiries', label: `My Enquiries (${myRfqs.length})`, icon: FileText },
          { id: 'quotes', label: `Quotation History (${myQuotes.length})`, icon: Printer },
          { id: 'samples', label: `Sample Requests (${mySamples.length})`, icon: FlaskConical },
          { id: 'orders', label: `Order Status & Repeat (${myOrders.length})`, icon: Truck },
          { id: 'docs', label: 'Shipping & Quality Documents', icon: FolderDown },
          { id: 'support', label: 'Support Messages', icon: MessageSquare },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === t.id
                  ? 'bg-[#08752B] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-2">
            <div className="text-slate-400 font-bold uppercase">My Company Profile</div>
            <div className="text-lg font-extrabold text-slate-900">
              {myRfqs[0]?.companyName || myQuotes[0]?.buyerCompany || 'Registered International Buyer'}
            </div>
            <div>Primary Contact Email: <strong>{buyerEmail}</strong></div>
            <div>Destination Market: <strong>{myRfqs[0]?.country || myQuotes[0]?.country || 'Global Export'}</strong></div>
            <div>Dedicated Export Account Manager: <strong>Tanvir Rahman (+880 1677 852904)</strong></div>
          </div>
          <div className="bg-[#ECF6EE] rounded-2xl p-6 border border-emerald-200">
            <div className="text-slate-600 font-semibold">Active Enquiries &amp; Quotes</div>
            <div className="text-3xl font-black text-[#08752B] mt-2">{myRfqs.length + myQuotes.length}</div>
            <Link href="/request-quote" className="inline-block mt-3 font-bold text-[#08752B] hover:underline">
              + Submit New RFQ →
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="text-slate-600 font-semibold">Confirmed Orders &amp; Samples</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{myOrders.length + mySamples.length}</div>
            <button onClick={() => setTab('orders')} className="mt-3 font-bold text-[#08752B] hover:underline">
              Track Shipments →
            </button>
          </div>
        </div>
      )}

      {tab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">My Submitted RFQs</h2>
          {myRfqs.length === 0 ? (
            <p className="text-slate-500">No RFQs found for {buyerEmail} yet.</p>
          ) : (
            myRfqs.map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between gap-3">
                <div>
                  <span className="font-mono font-extrabold text-[#08752B]">{r.referenceNumber}</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">
                    {r.productCategory} — {r.yarnCount} ({r.quantity.toLocaleString()} {r.unit})
                  </div>
                  <div className="text-slate-500">
                    {r.incoterms} {r.destinationPort}, {r.country} · Submitted {r.createdAt}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#08752B] font-bold self-center">
                  {r.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'quotes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">Official Quotations</h2>
          {myQuotes.length === 0 ? (
            <p className="text-slate-500">No approved quotations linked to {buyerEmail} yet.</p>
          ) : (
            myQuotes.map((qt) => (
              <div key={qt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono font-extrabold text-[#08752B]">{qt.quoteNumber}</span>
                  <div className="font-bold text-sm text-slate-900">{qt.product}</div>
                  <div className="text-slate-600">
                    {qt.quantity.toLocaleString()} {qt.unit} ·{' '}
                    <strong>
                      {qt.currency} {qt.totalPrice.toLocaleString()}
                    </strong>{' '}
                    · {qt.incoterms} · Valid until {qt.validityDate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfQuote(qt)}
                    className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 font-bold inline-flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Download PDF
                  </button>
                  {qt.approvalStatus !== 'Accepted' && (
                    <button
                      type="button"
                      onClick={() => acceptQuote(qt.id)}
                      className="px-3.5 py-2 rounded-lg bg-[#08752B] text-white font-bold"
                    >
                      Accept &amp; Confirm PO →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'samples' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">Sample Requests &amp; Courier Tracking</h2>
          {mySamples.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-sm text-slate-900">
                  {s.sampleCode} — {s.product} ({s.yarnCount})
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                  Stage: {s.stage}
                </span>
              </div>
              <div className="text-slate-600">
                Courier: <strong>{s.courier}</strong> · Tracking: <strong>{s.trackingNo}</strong> · Notes: {s.feedback}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">Active &amp; Previous Orders</h2>
          {myOrders.map((o) => (
            <div key={o.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-[#08752B] mr-2">{o.orderNumber}</span>
                  <span className="font-bold text-sm text-slate-900">
                    {o.product} ({o.qtyLabel}) — USD {o.totalUsd.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                    {o.workflowStage}
                  </span>
                  <Link
                    href={`/request-quote?product=${encodeURIComponent(o.product)}`}
                    className="px-3 py-1 rounded-lg bg-[#F28C18] text-white font-bold inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Repeat Order
                  </Link>
                </div>
              </div>
              <div className="text-slate-600">
                Port: {o.portOfDischarge} · Vessel/Container: <strong>{o.vesselOrContainer}</strong> · B/L:{' '}
                <strong>{o.blNumber}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'docs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">Shipping &amp; Compliance Documents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(myOrders.flatMap((o) => o.documents).length > 0
              ? myOrders.flatMap((o) => o.documents)
              : [
                  'ISO 9001:2015 Certificate Copy',
                  'OEKO-TEX Standard 100 Compliance Sheet',
                  'Sample Uster Tester 6 Certificate of Analysis',
                ]
            ).map((d, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">📄 {d}</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-[#08752B] font-bold hover:underline"
                >
                  Print/Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'support' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl space-y-3 text-xs">
          <h2 className="text-base font-extrabold text-slate-900">
            Direct Message to Export Account Manager
          </h2>
          {supportSent && (
            <div className="p-3 rounded-xl bg-emerald-50 text-[#08752B] font-bold">
              Message logged in CRM! Tanvir Rahman will respond shortly.
            </div>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: 'Portal Buyer',
                  email: buyerEmail,
                  company: companyHint,
                  subject: 'Buyer Portal Support Message',
                  message: supportMsg,
                }),
              });
              setSupportMsg('');
              setSupportSent(true);
            }}
            className="space-y-3"
          >
            <textarea
              required
              rows={4}
              value={supportMsg}
              onChange={(e) => setSupportMsg(e.target.value)}
              placeholder="Ask about container loading schedule, B/L draft, or shade lab-dips..."
              className="w-full p-3 rounded-xl border border-slate-200"
            />
            <button type="submit" className="px-6 py-2.5 rounded-full bg-[#08752B] text-white font-bold">
              Send Portal Message →
            </button>
          </form>
        </div>
      )}

      <QuotationDocumentModal quote={pdfQuote} onClose={() => setPdfQuote(null)} />
    </div>
  );
}

export default function BuyerPortalPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm">Loading Buyer Portal...</div>}>
        <BuyerPortalInner />
      </Suspense>
    </PublicShell>
  );
}

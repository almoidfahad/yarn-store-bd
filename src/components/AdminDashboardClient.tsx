'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Users,
  FileText,
  Package,
  Factory,
  Calculator,
  FlaskConical,
  Truck,
  Mail,
  Shield,
  BarChart3,
  Settings,
  Search,
  Bell,
  Globe,
  ChevronDown,
  Calendar,
  ArrowRight,
  Zap,
  Plus,
  Send,
  Star,
  ThumbsUp,
  Headphones,
  ExternalLink,
  CheckCircle2,
  Printer,
  Archive,
  Sparkles,
  LogOut,
  ShieldOff,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { QuotationDocumentModal } from './SiteChrome';
import { CloudAndCompanySettingsPanel } from './CloudAndCompanySettingsPanel';
import { AdminLoginGate } from './AdminLoginGate';
import { ContentProtectionShield } from './ContentProtectionShield';
import type { AdminSessionUser } from './AdminLoginGate';
import type {
  PlatformDB,
  LeadStage,
  SampleStage,
  OrderStage,
  QuoteRecord,
} from '@/lib/db';

type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'rfqs'
  | 'products'
  | 'manufacturing'
  | 'quotations'
  | 'samples'
  | 'orders'
  | 'emails'
  | 'team'
  | 'reports'
  | 'settings';

const LEAD_STAGES: LeadStage[] = [
  'New Lead',
  'Qualified',
  'Contacted',
  'Quotation Sent',
  'Negotiation',
  'Sample Stage',
  'Won',
  'Lost',
];

const SAMPLE_STAGES: SampleStage[] = [
  'Request',
  'Review',
  'Approved',
  'Prepared',
  'Dispatched',
  'Delivered',
  'Feedback',
];

const ORDER_STAGES: OrderStage[] = [
  'Purchase Order Received',
  'Order Confirmation',
  'Production/Sourcing',
  'Quality Inspection',
  'Packing',
  'Shipment',
  'Delivered',
];

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 110 42" className="w-24 h-10 shrink-0 overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,40 ${points} 110,40`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function AdminDashboardClient({
  initialDb,
  initialKpis,
  initialAdminUser,
}: {
  initialDb: PlatformDB;
  initialKpis: {
    totalLeads: number;
    newRfqs: number;
    quotesSent: number;
    confirmedOrders: number;
    customerSatisfactionPct: number;
  };
  initialAdminUser?: AdminSessionUser | null;
}) {
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(initialAdminUser ?? null);
  const [db, setDb] = useState<PlatformDB>(initialDb);
  const [kpis, setKpis] = useState(initialKpis);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activeRole, setActiveRole] = useState('Super Admin');
  const [selectedQuotePdf, setSelectedQuotePdf] = useState<QuoteRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Quick Form States
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Cotton Yarn',
    supplyType: 'Manufactured by YARN STORE BD',
    counts: 'Ne 30/1 Combed',
    yarnType: 'Ring Spun',
    moqKg: '1000',
    monthlyCapacityMt: '250',
    leadTime: '12–16 Business Days',
  });

  const [newQuote, setNewQuote] = useState({
    rfqRef: 'YSB-RFQ-2026-002',
    buyerCompany: 'Global Fabrics Inc',
    buyerEmail: 'm.weber@globalfabrics.de',
    country: 'Germany',
    product: '100% Polyester Yarn — 150D/48F SD',
    specification: 'AA-Grade Filament · 5.0kg Bobbins · Verified Partner Mill',
    quantity: '12000',
    unit: 'KG',
    currency: 'USD',
    unitPrice: '1.92',
    incoterms: 'CIF Hamburg, Germany',
    deliveryTime: '12 Business Days',
    paymentTerms: '30% T/T Advance, 70% Against B/L Copy',
  });

  const [newLeadQuick, setNewLeadQuick] = useState({
    buyerName: '',
    company: '',
    country: 'USA',
    email: '',
    phone: '',
    product: 'Cotton Yarn',
    quantityKg: '10000',
    source: 'LinkedIn',
  });

  const [composeEmail, setComposeEmail] = useState({
    recipient: 'john.smith@abctextiles.com',
    subject: 'Follow-up on Quotation YSB-QT-2026-101 — YARN STORE BD Export Desk',
    body: 'Dear John, Following up on your 18,000 KG Ne 30/1 Combed Cotton Yarn inquiry for Savannah Port...',
  });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function mutate(action: string, payload: Record<string, unknown>, successMsg: string) {
    const res = await fetch('/api/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json();
    if (data.ok) {
      setDb(data.db);
      setKpis(data.computedKpis);
      showToast(successMsg);
    }
  }

  const unreadCount = db.notifications.filter((n) => n.unread).length;

  const filteredLeads = db.leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      l.company.toLowerCase().includes(q) ||
      l.buyerName.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.product.toLowerCase().includes(q)
    );
  });

  const filteredOrders = db.orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.buyer.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q)
    );
  });

  const statusPillStyle = (badge: string) => {
    switch (badge) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Contacted':
        return 'bg-emerald-100 text-emerald-700';
      case 'Quotation':
        return 'bg-amber-100 text-amber-700';
      case 'Sample':
        return 'bg-purple-100 text-purple-700';
      case 'Negotiation':
        return 'bg-green-100 text-green-800';
      case 'Confirmed':
      case 'Delivered':
      case 'Won':
        return 'bg-emerald-100 text-emerald-700';
      case 'Processing':
        return 'bg-amber-100 text-amber-700';
      case 'Shipped':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const sidebarItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', label: 'Leads & Customers', icon: Users },
    { id: 'rfqs', label: 'RFQ Management', icon: FileText, badge: 7 + db.rfqs.length }, // 12 on seed!
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'manufacturing', label: 'Manufacturing & Suppliers', icon: Factory },
    { id: 'quotations', label: 'Quotations', icon: Calculator, badge: 3 + db.quotes.length }, // 8 on seed!
    { id: 'samples', label: 'Sample Management', icon: FlaskConical, badge: db.samples.length }, // 3 on seed!
    { id: 'orders', label: 'Orders & Shipments', icon: Truck },
    { id: 'emails', label: 'Email Center', icon: Mail },
    { id: 'team', label: 'Team & Permissions', icon: Shield },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Build SVG Sales Overview Chart coordinates matching Screenshot #2
  const chartW = 540;
  const chartH = 175;
  const maxY = 150;
  const pointsFor = (key: 'leads' | 'quotes' | 'orders') =>
    db.salesMonthly
      .map((d, idx) => {
        const x = 34 + (idx / (db.salesMonthly.length - 1)) * (chartW - 68);
        const y = chartH - 22 - (d[key] / maxY) * (chartH - 42);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  async function handleLogout() {
    await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LOGOUT' }),
    }).catch(() => {});
    setAdminUser(null);
  }

  if (!adminUser) {
    return (
      <AdminLoginGate
        hasRegisteredAdmins={Array.isArray(db.adminAccounts) && db.adminAccounts.length > 0}
        onAuthenticated={(user) => setAdminUser(user)}
      />
    );
  }

  return (
    <ContentProtectionShield scope="dashboard" liveSettings={db.securitySettings}>
    <div className="ysb-admin-root min-h-screen flex bg-[#F3F6F4] text-[#17231C]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#063B1B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-emerald-400/40 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* =====================================================================
          LEFT FIXED SIDEBAR — Pixel-Faithful to Screenshot #2
      ===================================================================== */}
      <aside className="w-[258px] shrink-0 bg-gradient-to-b from-[#073D1D] via-[#063619] to-[#052B14] text-white hidden lg:flex flex-col justify-between relative overflow-hidden select-none">
        <div>
          {/* Brand Logo */}
          <div className="px-5 pt-5 pb-4 border-b border-emerald-800/60">
            <BrandLogo theme="dark" compact href="/" />
          </div>

          {/* 12 Navigation Items */}
          <nav className="px-3 py-3 space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    active
                      ? 'bg-[#0F8A38] text-white shadow-md'
                      : 'text-emerald-100/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#EF4444] text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sustainability Visual + Live Support Pill + Wave Ribbon matching Screenshot #2 */}
        <div className="px-3.5 pb-6 space-y-3 relative z-10">
          <div className="rounded-2xl overflow-hidden bg-[#0A4E24] border border-emerald-700/60 shadow-lg">
            <div className="h-24 overflow-hidden relative">
              <img
                src="/images/faq-cones-leaves.jpg"
                alt="Sustainable Yarn"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0A4E24] to-transparent" />
            </div>
            <div className="px-3 pb-3 pt-1 text-center">
              <p className="text-xs italic font-semibold text-emerald-50 leading-snug">
                Together
                <span className="block">For a Sustainable</span>
                <span className="block text-emerald-300">Textile Future 🌿</span>
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#116A31] hover:bg-[#147D3A] border border-emerald-500/30 transition"
          >
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-white">Live Support</div>
              <div className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] inline-block" /> Online
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Wave Trim */}
        <svg viewBox="0 0 260 36" className="absolute bottom-0 left-0 w-full pointer-events-none">
          <path d="M0 24 Q 120 6 260 18 L260 36 L0 36 Z" fill="#F28C18" />
          <path d="M0 30 Q 130 14 260 24 L260 36 L0 36 Z" fill="#0B5E28" />
        </svg>
      </aside>

      {/* =====================================================================
          RIGHT MAIN AREA — Top Header + Active Screen
      ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top White Header Bar matching Screenshot #2 */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-7 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Global Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, orders, products..."
              className="w-full pl-10 pr-9 py-2 rounded-full bg-[#F1F5F2] border border-transparent focus:bg-white focus:border-[#08752B] text-xs sm:text-sm focus:outline-none"
            />
          </div>

          {/* Mobile Tab Selector */}
          <select
            aria-label="Mobile section selector"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="lg:hidden text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50"
          >
            {sidebarItems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Right Controls: Public Website Link, Bell (5), Language, Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden xl:flex items-center gap-2 text-xs">
              <Link
                href="/"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-[#08752B] font-bold hover:bg-emerald-100 transition"
              >
                Public Website <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Buyer Portal <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                title="Configure Anti-Screenshot & Recording Shield in Settings"
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold transition ${
                  db.securitySettings?.dashboardScreenshotProtection
                    ? 'bg-emerald-950 text-emerald-200 hover:bg-emerald-900'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {db.securitySettings?.dashboardScreenshotProtection ? (
                  <>
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Shield ON</span>
                  </>
                ) : (
                  <>
                    <ShieldOff className="w-3 h-3" />
                    <span>Shield OFF</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => mutate('MARK_NOTIFICATIONS_READ', {}, 'All notifications marked as read')}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Admin Profile + Role Preview Switcher */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#08752B] to-[#052E15] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                AD
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-extrabold text-slate-900">Admin</div>
                <select
                  aria-label="RBAC Role Preview"
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value)}
                  className="text-[11px] text-slate-500 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Quality Manager">Quality Manager</option>
                  <option value="Finance Manager">Finance Manager</option>
                </select>
                <div className="text-[10px] font-bold text-[#08752B] truncate max-w-[120px]">
                  {adminUser.providerLabel}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out & Lock Dashboard"
                className="p-2 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ===================================================================
            MAIN CONTENT CANVAS
        =================================================================== */}
        <main className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1440px] w-full mx-auto">
          {/* =================================================================
              TAB 1: OVERVIEW DASHBOARD — Exact Twin of Screenshot #2
          ================================================================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* Greeting Row + Last 30 Days Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#17231C] flex items-center gap-2">
                    <span>👋</span>
                    <span>Welcome back, Admin!</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Here&apos;s what&apos;s happening with your business today.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm self-start sm:self-auto">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <select
                    aria-label="Date period"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Last 90 Days</option>
                    <option>Full Year 2026</option>
                  </select>
                </div>
              </div>

              {/* 4 KPI STAT CARDS — Exact Colors, Numbers, % Arrows & Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Leads',
                    value: kpis.totalLeads,
                    trend: '↑ 12%',
                    iconBg: 'bg-[#16A34A]',
                    icon: Users,
                    sparkColor: '#16A34A',
                    points: '0,34 18,26 36,31 54,19 72,27 90,12 110,8',
                    onClick: () => setActiveTab('leads'),
                  },
                  {
                    label: 'New RFQs',
                    value: kpis.newRfqs,
                    trend: '↑ 20%',
                    iconBg: 'bg-[#F59E0B]',
                    icon: Mail,
                    sparkColor: '#F59E0B',
                    points: '0,35 20,30 38,33 56,22 74,26 92,15 110,9',
                    onClick: () => setActiveTab('rfqs'),
                  },
                  {
                    label: 'Quotes Sent',
                    value: kpis.quotesSent,
                    trend: '↑ 8%',
                    iconBg: 'bg-[#2563EB]',
                    icon: FileText,
                    sparkColor: '#2563EB',
                    points: '0,36 20,31 38,24 56,29 74,18 92,21 110,7',
                    onClick: () => setActiveTab('quotations'),
                  },
                  {
                    label: 'Confirmed Orders',
                    value: kpis.confirmedOrders,
                    trend: '↑ 29%',
                    iconBg: 'bg-[#7C3AED]',
                    icon: Truck,
                    sparkColor: '#7C3AED',
                    points: '0,36 20,28 38,32 56,21 74,25 92,13 110,6',
                    onClick: () => setActiveTab('orders'),
                  },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      onClick={card.onClick}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/75 shadow-soft hover:border-emerald-300 transition cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-full ${card.iconBg} text-white flex items-center justify-center shadow-sm shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-500">{card.label}</div>
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 tabular-nums">
                              {card.value}
                            </span>
                            <span className="text-xs font-bold text-[#16A34A]">{card.trend}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">vs previous period</div>
                        </div>
                      </div>
                      <Sparkline color={card.sparkColor} points={card.points} />
                    </div>
                  );
                })}
              </div>

              {/* MIDDLE ROW: Sales Overview Line Chart + Leads by Country Donut + Top Products */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Sales Overview Card (6 cols) */}
                <div className="xl:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                      <BarChart3 className="w-4 h-4 text-[#08752B]" />
                      <span>Sales Overview</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" /> Leads
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Quotes
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Orders
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">
                        Monthly ▾
                      </span>
                    </div>
                  </div>

                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-48 overflow-visible">
                    {[0, 50, 100, 150].map((val) => {
                      const y = chartH - 22 - (val / maxY) * (chartH - 42);
                      return (
                        <g key={val}>
                          <line
                            x1="30"
                            x2={chartW - 18}
                            y1={y}
                            y2={y}
                            stroke="#EEF2EF"
                            strokeWidth="1"
                          />
                          <text x="6" y={y + 3} fontSize="10" fill="#64748B">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Polylines for Leads, Quotes, Orders */}
                    <polyline
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="2.2"
                      points={pointsFor('leads')}
                    />
                    <polyline
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.2"
                      points={pointsFor('quotes')}
                    />
                    <polyline
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      points={pointsFor('orders')}
                    />

                    {/* Dots & Month X-Axis Labels */}
                    {db.salesMonthly.map((d, idx) => {
                      const x = 34 + (idx / (db.salesMonthly.length - 1)) * (chartW - 68);
                      const yL = chartH - 22 - (d.leads / maxY) * (chartH - 42);
                      const yQ = chartH - 22 - (d.quotes / maxY) * (chartH - 42);
                      const yO = chartH - 22 - (d.orders / maxY) * (chartH - 42);
                      return (
                        <g key={d.month}>
                          <circle cx={x} cy={yL} r="3" fill="#16A34A" />
                          <circle cx={x} cy={yQ} r="3" fill="#F59E0B" />
                          <circle cx={x} cy={yO} r="3" fill="#2563EB" />
                          <text x={x} y={chartH - 4} textAnchor="middle" fontSize="10" fill="#64748B">
                            {d.month}
                          </text>
                        </g>
                      );
                    })}

                    {/* Floating Right Callout Badges (128, 72, 38) matching Screenshot #2 */}
                    <g transform={`translate(${chartW - 44}, 14)`}>
                      <rect width="32" height="17" rx="5" fill="#16A34A" />
                      <text x="16" y="12" textAnchor="middle" fill="#FFF" fontSize="9.5" fontWeight="700">
                        {kpis.totalLeads}
                      </text>
                    </g>
                    <g transform={`translate(${chartW - 44}, 68)`}>
                      <rect width="32" height="17" rx="5" fill="#F59E0B" />
                      <text x="16" y="12" textAnchor="middle" fill="#FFF" fontSize="9.5" fontWeight="700">
                        72
                      </text>
                    </g>
                    <g transform={`translate(${chartW - 44}, 103)`}>
                      <rect width="32" height="17" rx="5" fill="#2563EB" />
                      <text x="16" y="12" textAnchor="middle" fill="#FFF" fontSize="9.5" fontWeight="700">
                        38
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Leads by Country Donut Chart Card (3 cols) */}
                <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft flex flex-col justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                    <Globe className="w-4 h-4 text-[#08752B]" />
                    <span>Leads by Country</span>
                  </div>

                  <div className="my-3 flex items-center justify-between gap-3">
                    {/* Multi-Segment SVG Donut */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="6" />
                        {/* USA 28% */}
                        <circle
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke="#15803D"
                          strokeWidth="6"
                          strokeDasharray="28 72"
                          strokeDashoffset="0"
                        />
                        {/* Germany 22% */}
                        <circle
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke="#F59E0B"
                          strokeWidth="6"
                          strokeDasharray="22 78"
                          strokeDashoffset="-28"
                        />
                        {/* UK 18% */}
                        <circle
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke="#2563EB"
                          strokeWidth="6"
                          strokeDasharray="18 82"
                          strokeDashoffset="-50"
                        />
                        {/* UAE 15% */}
                        <circle
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke="#7C3AED"
                          strokeWidth="6"
                          strokeDasharray="15 85"
                          strokeDashoffset="-68"
                        />
                        {/* Others 17% */}
                        <circle
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke="#94A3B8"
                          strokeWidth="6"
                          strokeDasharray="17 83"
                          strokeDashoffset="-83"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-slate-900 leading-none">
                          {kpis.totalLeads}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Total Leads
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-xs">
                      {db.leadsByCountry.map((c) => (
                        <div key={c.country} className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.country}
                          </span>
                          <span className="font-extrabold text-slate-900">{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Products Card (3 cols) */}
                <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                      <Package className="w-4 h-4 text-[#08752B]" />
                      <span>Top Products</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-[#08752B] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {db.topProductsShare.map((tp) => (
                      <div key={tp.name} className="flex items-center gap-3">
                        <img
                          src={tp.image}
                          alt={tp.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-800 truncate">{tp.name}</span>
                            <span className="font-extrabold text-slate-900">{tp.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#16A34A]"
                              style={{ width: `${tp.pct * 2.5}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLES + PROMO CARD ROW: Recent Leads + Recent Orders + Container Ship Promo */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Recent Leads Table (5 cols) */}
                <div className="xl:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                      <Users className="w-4 h-4 text-[#08752B]" />
                      <span>Recent Leads</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-bold text-[#08752B] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-100">
                          <th className="pb-2 font-semibold">#</th>
                          <th className="pb-2 font-semibold">Company</th>
                          <th className="pb-2 font-semibold">Country</th>
                          <th className="pb-2 font-semibold">Product</th>
                          <th className="pb-2 font-semibold">Status</th>
                          <th className="pb-2 font-semibold text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLeads.slice(0, 5).map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 text-slate-500 font-medium">{lead.code}</td>
                            <td className="py-2.5 font-bold text-slate-900">{lead.company}</td>
                            <td className="py-2.5 text-slate-600">{lead.country}</td>
                            <td className="py-2.5 text-slate-700">{lead.product}</td>
                            <td className="py-2.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusPillStyle(
                                  lead.dashboardBadge
                                )}`}
                              >
                                {lead.dashboardBadge}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-500">{lead.dateLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Orders Table (4 cols) */}
                <div className="xl:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                      <Truck className="w-4 h-4 text-[#08752B]" />
                      <span>Recent Orders</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#08752B] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-100">
                          <th className="pb-2 font-semibold">#</th>
                          <th className="pb-2 font-semibold">Buyer</th>
                          <th className="pb-2 font-semibold">Product</th>
                          <th className="pb-2 font-semibold">Qty</th>
                          <th className="pb-2 font-semibold">Status</th>
                          <th className="pb-2 font-semibold text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 font-semibold text-slate-700">{ord.orderNumber}</td>
                            <td className="py-2.5 font-bold text-slate-900">{ord.buyer}</td>
                            <td className="py-2.5 text-slate-700">{ord.product}</td>
                            <td className="py-2.5 font-semibold text-slate-800">{ord.qtyLabel}</td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusPillStyle(
                                  ord.displayStatus
                                )}`}
                              >
                                {ord.displayStatus}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-500">{ord.dateLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Container Ship Promo Card matching Screenshot #2 (3 cols) */}
                <div className="xl:col-span-3 relative rounded-2xl overflow-hidden text-white p-5 flex flex-col justify-between min-h-[240px] shadow-md">
                  <div
                    className="absolute inset-0 bg-cover bg-bottom"
                    style={{ backgroundImage: "url('/images/cargo-ship-port.jpg')" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(6,62,28,0.95) 0%, rgba(7,78,35,0.86) 52%, rgba(7,78,35,0.35) 100%)',
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-lg font-extrabold leading-snug">
                      Ready to Grow
                      <span className="block">Your Business Globally?</span>
                    </h3>
                    <p className="mt-1.5 text-xs text-emerald-100 leading-relaxed">
                      Get a free quotation for your textile yarn requirements.
                    </p>
                    <Link
                      href="/request-quote"
                      className="mt-4 inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#073E1C] text-xs font-extrabold px-4 py-2.5 rounded-full shadow transition"
                    >
                      <span>Request a Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Quick Actions + Customer Satisfaction (98%) + Notifications */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Quick Actions (5 cols) */}
                <div className="xl:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft">
                  <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900 mb-3.5">
                    <Zap className="w-4 h-4 text-[#16A34A]" />
                    <span>Quick Actions</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { label: 'Add Product', icon: Package, tab: 'products' as AdminTab },
                      { label: 'Create RFQ', icon: FileText, tab: 'rfqs' as AdminTab },
                      { label: 'Send Quote', icon: Send, tab: 'quotations' as AdminTab },
                      { label: 'Update Order', icon: Truck, tab: 'orders' as AdminTab },
                      { label: 'View Reports', icon: BarChart3, tab: 'reports' as AdminTab },
                    ].map((qa) => {
                      const Icon = qa.icon;
                      return (
                        <button
                          key={qa.label}
                          type="button"
                          onClick={() => setActiveTab(qa.tab)}
                          className="p-3 rounded-xl bg-[#ECF6EE] hover:bg-[#DDF0E2] border border-emerald-200/60 flex flex-col items-center justify-center text-center gap-2 transition"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white text-[#08752B] flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-[#10371E] leading-tight">
                            {qa.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Satisfaction 98% (3 cols) */}
                <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft flex flex-col justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Customer Satisfaction</span>
                  </div>
                  <div className="my-2 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black text-slate-900">
                        {kpis.customerSatisfactionPct}%
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Positive Feedback</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#ECF6EE] text-[#16A34A] flex items-center justify-center">
                      <ThumbsUp className="w-6 h-6 fill-[#16A34A]" />
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: `${kpis.customerSatisfactionPct}%` }}
                    />
                  </div>
                </div>

                {/* Notifications Feed (4 cols) */}
                <div className="xl:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/75 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900">
                      <Bell className="w-4 h-4 text-[#08752B]" />
                      <span>Notifications</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('emails')}
                      className="text-xs font-bold text-[#08752B] hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {db.notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="flex items-center justify-between gap-2 py-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              n.color === 'green'
                                ? 'bg-[#16A34A]'
                                : n.color === 'orange'
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#2563EB]'
                            }`}
                          />
                          <span className="font-semibold text-slate-800 truncate">{n.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{n.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              TAB 2: LEADS & CUSTOMERS (CRM Pipeline + AI Lead Scoring)
          ================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    CRM Leads &amp; International Buyer Pipeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    8-Stage Sales Pipeline with AI Priority Scoring, Lead Source Attribution &amp; Follow-up History
                  </p>
                </div>
              </div>

              {/* Quick Add Lead Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLeadQuick.company) return;
                  mutate('QUICK_CREATE_LEAD', newLeadQuick, `Added ${newLeadQuick.company} to CRM Pipeline`);
                  setNewLeadQuick({ ...newLeadQuick, buyerName: '', company: '', email: '', phone: '' });
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs"
              >
                <input
                  required
                  value={newLeadQuick.company}
                  onChange={(e) => setNewLeadQuick({ ...newLeadQuick, company: e.target.value })}
                  placeholder="Buyer Company *"
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  value={newLeadQuick.buyerName}
                  onChange={(e) => setNewLeadQuick({ ...newLeadQuick, buyerName: e.target.value })}
                  placeholder="Contact Person"
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  type="email"
                  required
                  value={newLeadQuick.email}
                  onChange={(e) => setNewLeadQuick({ ...newLeadQuick, email: e.target.value })}
                  placeholder="Corporate Email *"
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  value={newLeadQuick.country}
                  onChange={(e) => setNewLeadQuick({ ...newLeadQuick, country: e.target.value })}
                  placeholder="Country (e.g. USA)"
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <select
                  value={newLeadQuick.source}
                  onChange={(e) => setNewLeadQuick({ ...newLeadQuick, source: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option>LinkedIn</option>
                  <option>Google Organic</option>
                  <option>Google Ads</option>
                  <option>Alibaba</option>
                  <option>Global Sources</option>
                  <option>Direct Website</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#08752B] hover:bg-[#065C22] text-white font-bold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add CRM Lead
                </button>
              </form>

              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{lead.code}</span>
                          <span className="text-base font-extrabold text-slate-900">{lead.company}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-700">
                            {lead.country}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-[#08752B] inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI: {lead.aiPriority} ({lead.aiScore}/100)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                            Source: {lead.source}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          <strong>{lead.buyerName}</strong> · {lead.email} · {lead.phone} · Interested:{' '}
                          <strong>{lead.product}</strong> ({lead.estimatedQty})
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Assigned: {lead.assignedTo} · Next Follow-up: <strong>{lead.nextFollowUp}</strong> · AI Note: {lead.aiReason}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500">Stage:</label>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            mutate(
                              'UPDATE_LEAD_STATUS',
                              { id: lead.id, status: e.target.value },
                              `Updated ${lead.company} to ${e.target.value}`
                            )
                          }
                          className="text-xs font-bold border border-emerald-300 rounded-lg px-3 py-1.5 bg-emerald-50 text-[#08752B]"
                        >
                          {LEAD_STAGES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-xs bg-slate-50 rounded-xl p-3 text-slate-700">
                      <strong>Notes:</strong> {lead.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: RFQ MANAGEMENT
          ================================================================= */}
          {activeTab === 'rfqs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Buyer RFQ Management ({db.rfqs.length} Active Records)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Every submission from /request-quote generates a unique YSB-RFQ-2026-XXX tracking ID and links directly to Quotation Builder.
                  </p>
                </div>
                <Link
                  href="/request-quote"
                  className="px-4 py-2 rounded-xl bg-[#08752B] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Open Public Multi-Step RFQ Form
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-soft">
                <table className="w-full text-xs">
                  <thead className="bg-[#063B1B] text-white text-left">
                    <tr>
                      <th className="p-3.5">RFQ Ref #</th>
                      <th className="p-3.5">Buyer &amp; Company</th>
                      <th className="p-3.5">Destination</th>
                      <th className="p-3.5">Product &amp; Count</th>
                      <th className="p-3.5">Volume &amp; Terms</th>
                      <th className="p-3.5">AI Priority</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {db.rfqs.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-extrabold text-[#08752B]">{r.referenceNumber}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{r.companyName}</div>
                          <div className="text-slate-500">{r.fullName} · {r.email}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold">{r.country}</div>
                          <div className="text-slate-500">{r.destinationPort}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold">{r.productCategory}</div>
                          <div className="text-slate-500">{r.yarnCount} · {r.yarnType}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold">
                            {r.quantity.toLocaleString()} {r.unit}
                          </div>
                          <div className="text-slate-500">{r.incoterms} · {r.paymentPreference}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#08752B] font-bold">
                            {r.aiPriority}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setNewQuote({
                                rfqRef: r.referenceNumber,
                                buyerCompany: r.companyName,
                                buyerEmail: r.email,
                                country: r.country,
                                product: `${r.productCategory} — ${r.yarnCount}`,
                                specification: `${r.yarnType} · ${r.incoterms} ${r.destinationPort}`,
                                quantity: String(r.quantity),
                                unit: r.unit === 'TON' ? 'MT' : 'KG',
                                currency: 'USD',
                                unitPrice: '3.25',
                                incoterms: `${r.incoterms} ${r.destinationPort}`,
                                deliveryTime: '14 Business Days',
                                paymentTerms: r.paymentPreference,
                              });
                              setActiveTab('quotations');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold"
                          >
                            Build Quote →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: PRODUCTS & INVENTORY (Separate Specs + Supply Source + Soft Archive)
          ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Products, Technical Specs &amp; Supply Source Control
                </h2>
                <p className="text-xs text-slate-500">
                  Database Rules Enforced: Product &amp; Technical Specs separated · Own Manufacturing vs Verified Partner separated · Soft-Archive instead of hard delete.
                </p>
              </div>

              {/* Add Product Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newProd.name) return;
                  mutate('ADD_PRODUCT', newProd, `Published "${newProd.name}" to live Product Catalog`);
                  setNewProd({ ...newProd, name: '' });
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs"
              >
                <div className="font-bold text-sm text-slate-900">Add New Export Product SKU</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="Product Name (e.g. Organic Compact Cotton Yarn)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Cotton Yarn</option>
                    <option>Polyester Yarn</option>
                    <option>Embroidery Thread</option>
                    <option>Yarn Cones</option>
                  </select>
                  <select
                    value={newProd.supplyType}
                    onChange={(e) => setNewProd({ ...newProd, supplyType: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 font-semibold text-[#08752B]"
                  >
                    <option value="Manufactured by YARN STORE BD">Manufactured by YARN STORE BD</option>
                    <option value="Supplied through Verified Manufacturing Partner">
                      Supplied through Verified Manufacturing Partner
                    </option>
                  </select>
                  <input
                    value={newProd.counts}
                    onChange={(e) => setNewProd({ ...newProd, counts: e.target.value })}
                    placeholder="Counts (e.g. Ne 24/1, 30/1)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    value={newProd.yarnType}
                    onChange={(e) => setNewProd({ ...newProd, yarnType: e.target.value })}
                    placeholder="Yarn Type (e.g. Compact Ring Spun)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="number"
                    value={newProd.moqKg}
                    onChange={(e) => setNewProd({ ...newProd, moqKg: e.target.value })}
                    placeholder="MOQ (KG)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="number"
                    value={newProd.monthlyCapacityMt}
                    onChange={(e) => setNewProd({ ...newProd, monthlyCapacityMt: e.target.value })}
                    placeholder="Monthly Capacity (MT)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <button
                    type="submit"
                    className="bg-[#08752B] hover:bg-[#065C22] text-white font-bold rounded-lg px-4 py-2 inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Save Product &amp; Spec
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {db.products.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl p-4 border shadow-soft flex gap-4 ${
                      p.archivedAt ? 'opacity-55 border-amber-300' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400">{p.sku}</span>
                          <h3 className="text-sm font-extrabold text-slate-900">{p.name}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            mutate(
                              'ARCHIVE_PRODUCT',
                              { id: p.id },
                              p.archivedAt ? `Restored ${p.name}` : `Soft-archived ${p.name}`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <Archive className="w-3 h-3" /> {p.archivedAt ? 'Restore' : 'Archive'}
                        </button>
                      </div>
                      <div className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-[#08752B] font-bold text-[11px]">
                        {p.supplyType}
                      </div>
                      <div className="text-slate-600">
                        Counts: <strong>{p.spec.counts}</strong> · MOQ: <strong>{p.moqKg} KG</strong> · Capacity:{' '}
                        <strong>{p.monthlyCapacityMt} MT/mo</strong>
                      </div>
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-block text-[#08752B] font-bold hover:underline"
                      >
                        Open Public SEO Page (/products/{p.slug}) →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 5: MANUFACTURING & SUPPLIERS
          ================================================================= */}
          {activeTab === 'manufacturing' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Own Manufacturing Units &amp; Verified Partner Mills
                </h2>
                <p className="text-xs text-slate-500">
                  Complete supply chain separation between in-house production facilities (`facilities` table) and audited partner spinning/filament mills (`suppliers` table).
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {db.facilities.map((f) => (
                  <div key={f.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold ${
                          f.type === 'Own Manufacturing Facility'
                            ? 'bg-emerald-100 text-[#08752B]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {f.type}
                      </span>
                      <span className="font-mono font-bold text-slate-400">{f.code}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{f.name}</h3>
                    <div className="text-slate-600">{f.location}</div>
                    <div className="text-slate-700">
                      <strong>Specialization:</strong> {f.specialization}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>
                        Monthly Capacity: <strong>{f.monthlyCapacityMt} MT</strong>
                      </span>
                      <span>
                        Line Utilization: <strong>{f.utilizationPct}%</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.certifications.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: QUOTATIONS (Builder + Sales Manager Approval + PDF Print)
          ================================================================= */}
          {activeTab === 'quotations' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Quotation Builder &amp; Sales Manager Approval Gate
                </h2>
                <p className="text-xs text-slate-500">
                  Supports USD, EUR &amp; GBP, Incoterms (EXW/FOB/CFR/CIF/DAP), Manager Approval before Buyer Dispatch, and Printable Official PDF Quotations.
                </p>
              </div>

              {/* Create Quotation Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate('CREATE_QUOTE', newQuote, `Draft Quotation created for ${newQuote.buyerCompany}`);
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs"
              >
                <div className="font-bold text-sm text-slate-900">Generate New B2B Export Quotation</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    required
                    value={newQuote.buyerCompany}
                    onChange={(e) => setNewQuote({ ...newQuote, buyerCompany: e.target.value })}
                    placeholder="Buyer Company *"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    required
                    type="email"
                    value={newQuote.buyerEmail}
                    onChange={(e) => setNewQuote({ ...newQuote, buyerEmail: e.target.value })}
                    placeholder="Buyer Email *"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    value={newQuote.product}
                    onChange={(e) => setNewQuote({ ...newQuote, product: e.target.value })}
                    placeholder="Product & Count"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={newQuote.quantity}
                      onChange={(e) => setNewQuote({ ...newQuote, quantity: e.target.value })}
                      placeholder="Qty"
                      className="w-2/3 px-3 py-2 rounded-lg border border-slate-200"
                    />
                    <select
                      value={newQuote.unit}
                      onChange={(e) => setNewQuote({ ...newQuote, unit: e.target.value })}
                      className="w-1/3 px-2 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="KG">KG</option>
                      <option value="MT">MT</option>
                    </select>
                  </div>
                  <div className="flex gap-1.5">
                    <select
                      value={newQuote.currency}
                      onChange={(e) => setNewQuote({ ...newQuote, currency: e.target.value })}
                      className="w-1/3 px-2 py-2 rounded-lg border border-slate-200 font-bold"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={newQuote.unitPrice}
                      onChange={(e) => setNewQuote({ ...newQuote, unitPrice: e.target.value })}
                      placeholder="Unit Price"
                      className="w-2/3 px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <input
                    value={newQuote.incoterms}
                    onChange={(e) => setNewQuote({ ...newQuote, incoterms: e.target.value })}
                    placeholder="Incoterms (e.g. CIF Hamburg)"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    value={newQuote.paymentTerms}
                    onChange={(e) => setNewQuote({ ...newQuote, paymentTerms: e.target.value })}
                    placeholder="Payment Terms"
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <button
                    type="submit"
                    className="bg-[#08752B] hover:bg-[#065C22] text-white font-bold rounded-lg px-4 py-2"
                  >
                    + Create Draft Quote
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-soft">
                <table className="w-full text-xs">
                  <thead className="bg-[#063B1B] text-white text-left">
                    <tr>
                      <th className="p-3.5">Quote #</th>
                      <th className="p-3.5">Buyer</th>
                      <th className="p-3.5">Product &amp; Terms</th>
                      <th className="p-3.5">Total Value</th>
                      <th className="p-3.5">Approval Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {db.quotes.map((qt) => (
                      <tr key={qt.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-extrabold text-[#08752B]">{qt.quoteNumber}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{qt.buyerCompany}</div>
                          <div className="text-slate-500">{qt.country} · {qt.buyerEmail}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold">{qt.product}</div>
                          <div className="text-slate-500">
                            {qt.quantity.toLocaleString()} {qt.unit} · {qt.incoterms}
                          </div>
                        </td>
                        <td className="p-3.5 font-black text-slate-900">
                          {qt.currency} {qt.totalPrice.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold ${
                              qt.approvalStatus === 'Pending Manager Approval'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-[#08752B]'
                            }`}
                          >
                            {qt.approvalStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                          {qt.approvalStatus === 'Pending Manager Approval' && (
                            <button
                              type="button"
                              onClick={() =>
                                mutate(
                                  'APPROVE_AND_SEND_QUOTE',
                                  { id: qt.id, nextStatus: 'Sent to Buyer' },
                                  `Manager Approved & Sent ${qt.quoteNumber}`
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-[#08752B] text-white font-bold"
                            >
                              Approve &amp; Send
                            </button>
                          )}
                          {qt.approvalStatus !== 'Accepted' && qt.approvalStatus !== 'Pending Manager Approval' && (
                            <button
                              type="button"
                              onClick={() =>
                                mutate(
                                  'ACCEPT_QUOTE_CREATE_ORDER',
                                  { id: qt.id },
                                  `Converted ${qt.quoteNumber} into Confirmed Export Order`
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-[#F28C18] text-white font-bold"
                            >
                              Convert to Order
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedQuotePdf(qt)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 7: SAMPLE MANAGEMENT (7-Stage Workflow)
          ================================================================= */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  7-Stage International Sample Cone Workflow
                </h2>
                <p className="text-xs text-slate-500">
                  Request → Review → Approved → Prepared → Dispatched → Delivered → Feedback
                </p>
              </div>
              <div className="space-y-3">
                {db.samples.map((smp) => (
                  <div key={smp.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-[#08752B] mr-2">{smp.sampleCode}</span>
                        <span className="font-extrabold text-sm text-slate-900">{smp.buyerCompany}</span>
                        <span className="ml-2 text-slate-500">({smp.country})</span>
                      </div>
                      <select
                        value={smp.stage}
                        onChange={(e) =>
                          mutate(
                            'UPDATE_SAMPLE_STAGE',
                            { id: smp.id, stage: e.target.value },
                            `Sample ${smp.sampleCode} moved to "${e.target.value}"`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-[#08752B]"
                      >
                        {SAMPLE_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-slate-600">
                      Product: <strong>{smp.product}</strong> ({smp.yarnCount}) · Cones: <strong>{smp.conesCount}</strong> · Shade Card:{' '}
                      <strong>{smp.shadeCard ? 'Included' : 'No'}</strong> · Courier: <strong>{smp.courier}</strong> ({smp.trackingNo})
                    </div>
                    {/* 7-Stage Visual Progress Bar */}
                    <div className="grid grid-cols-7 gap-1 pt-1">
                      {SAMPLE_STAGES.map((st, idx) => {
                        const curIdx = SAMPLE_STAGES.indexOf(smp.stage);
                        return (
                          <div key={st} className="text-center">
                            <div
                              className={`h-1.5 rounded-full ${
                                idx <= curIdx ? 'bg-[#16A34A]' : 'bg-slate-200'
                              }`}
                            />
                            <span className="text-[10px] text-slate-500 block mt-1 truncate">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 8: ORDERS & SHIPMENTS (7-Stage Export Order Workflow)
          ================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Confirmed Export Orders &amp; Port Shipments
                </h2>
                <p className="text-xs text-slate-500">
                  Purchase Order Received → Order Confirmation → Production/Sourcing → Quality Inspection → Packing → Shipment → Delivered
                </p>
              </div>
              <div className="space-y-3">
                {db.orders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-extrabold text-[#08752B] text-sm mr-2">{ord.orderNumber}</span>
                        <span className="font-extrabold text-sm text-slate-900">{ord.buyer}</span>
                        <span className="ml-2 text-slate-500">
                          ({ord.country} · Quote Ref: {ord.quoteNumber})
                        </span>
                      </div>
                      <select
                        value={ord.workflowStage}
                        onChange={(e) =>
                          mutate(
                            'UPDATE_ORDER_STAGE',
                            { id: ord.id, workflowStage: e.target.value },
                            `Order ${ord.orderNumber} stage updated to "${e.target.value}"`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-[#08752B]"
                      >
                        {ORDER_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-slate-600">
                      <strong>{ord.product}</strong> · Volume: <strong>{ord.qtyLabel}</strong> · Value:{' '}
                      <strong>USD {ord.totalUsd.toLocaleString()}</strong> · {ord.incoterms} · Vessel/Container:{' '}
                      <strong>{ord.vesselOrContainer}</strong> (B/L: {ord.blNumber})
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {ORDER_STAGES.map((st, idx) => {
                        const curIdx = ORDER_STAGES.indexOf(ord.workflowStage);
                        return (
                          <div key={st} className="text-center">
                            <div
                              className={`h-1.5 rounded-full ${
                                idx <= curIdx ? 'bg-[#08752B]' : 'bg-slate-200'
                              }`}
                            />
                            <span className="text-[10px] text-slate-500 block mt-1 truncate">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ord.documents.map((doc) => (
                        <span
                          key={doc}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 9: EMAIL CENTER (Automated Resend Transactional Logs + Compose)
          ================================================================= */}
          {activeTab === 'emails' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs">
                <h3 className="text-base font-extrabold text-slate-900">Compose Buyer Email Reply</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate(
                      'SEND_CUSTOM_EMAIL',
                      composeEmail,
                      `Email dispatched to ${composeEmail.recipient}`
                    );
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Recipient Buyer Email</label>
                    <input
                      required
                      type="email"
                      value={composeEmail.recipient}
                      onChange={(e) => setComposeEmail({ ...composeEmail, recipient: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Subject</label>
                    <input
                      required
                      value={composeEmail.subject}
                      onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Message</label>
                    <textarea
                      rows={4}
                      value={composeEmail.body}
                      onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white font-bold"
                  >
                    Send Official Export Email →
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3 text-xs">
                <h3 className="text-base font-extrabold text-slate-900">
                  Automated Email &amp; Notification Log (Resend Engine)
                </h3>
                <div className="divide-y divide-slate-100">
                  {db.emailLogs.map((em) => (
                    <div key={em.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#08752B] font-bold text-[10px]">
                          {em.trigger}
                        </span>
                        <div className="font-bold text-slate-900 mt-1">{em.subject}</div>
                        <div className="text-slate-500">To: {em.recipient}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">
                          {em.status}
                        </span>
                        <div className="text-slate-400 mt-1">{em.sentAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 10: TEAM & PERMISSIONS (8 RBAC Roles + Security Audit Logs)
          ================================================================= */}
          {activeTab === 'team' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  8-Role RBAC Staff Access &amp; Admin Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Active Viewing Role: <strong>{activeRole}</strong> · MFA Enforced · Sales Executives restricted from private Finance &amp; unassigned buyer records.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                {db.teamMembers.map((tm) => (
                  <div key={tm.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                        {tm.role}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">MFA ON</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900">{tm.name}</div>
                    <div className="text-slate-500">{tm.email}</div>
                    <div className="text-slate-600 pt-1 border-t border-slate-100">{tm.accessScope}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft text-xs">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3">Admin Security Audit Logs</h3>
                <div className="divide-y divide-slate-100">
                  {db.auditLogs.map((a) => (
                    <div key={a.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <strong>{a.actor}</strong> <span className="text-slate-400">({a.role})</span> — {a.action}
                      </div>
                      <span className="text-slate-400">{a.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 11: REPORTS & ANALYTICS (90-Day Marketing Experiment + Funnel)
          ================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-5 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  International Buyer Acquisition &amp; 90-Day Marketing Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Tracking Qualified Visitors → RFQs → Quotations → Samples → Confirmed Container Orders across Google SEO, LinkedIn, Google Ads, Alibaba &amp; Global Sources.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {db.marketing90Day.map((m) => (
                  <div key={m.phase} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#08752B]">{m.phase} · {m.days}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#08752B] font-bold">
                        {m.status}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{m.focus}</p>
                    <div className="pt-2 border-t border-slate-100 font-bold text-slate-900">{m.kpis}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 12: SETTINGS + CLOUD INTEGRATIONS + PREP & LAUNCH CHECKLISTS
          ================================================================= */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
              <CloudAndCompanySettingsPanel
                companyProfile={db.companyProfile}
                securitySettings={db.securitySettings}
                onSaveCompanyProfile={(updated) =>
                  mutate(
                    'UPDATE_COMPANY_PROFILE',
                    updated,
                    'Company profile updated (Demo -> Custom Details Saved)'
                  )
                }
                onUpdateSecuritySettings={(updatedSec) =>
                  mutate(
                    'UPDATE_SECURITY_SETTINGS',
                    { ...updatedSec },
                    `Anti-Screenshot Shield Updated (Dashboard: ${
                      updatedSec.dashboardScreenshotProtection ? 'ON' : 'OFF'
                    }, Products: ${updatedSec.productScreenshotProtection ? 'ON' : 'OFF'})`
                  )
                }
              />

              {/* 12-Item Business Preparation Checklist (Turn 21 Section 13) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Business Preparation Checklist (12 Steps)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                    {db.prepChecklist.filter((c) => c.completed).length}/{db.prepChecklist.length} Complete
                  </span>
                </div>
                <div className="space-y-2">
                  {db.prepChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() =>
                          mutate(
                            'TOGGLE_CHECKLIST',
                            { listType: 'prep', id: item.id },
                            'Updated Business Preparation Checklist'
                          )
                        }
                        className="accent-[#08752B] w-4 h-4"
                      />
                      <span className={item.completed ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 15-Item Website Launch Quality Checklist (Turn 34 Part 10) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Final Launch Quality Checklist (15 Steps)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                    {db.launchChecklist.filter((c) => c.completed).length}/{db.launchChecklist.length} Complete
                  </span>
                </div>
                <div className="space-y-2">
                  {db.launchChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() =>
                          mutate(
                            'TOGGLE_CHECKLIST',
                            { listType: 'launch', id: item.id },
                            'Updated Launch Quality Checklist'
                          )
                        }
                        className="accent-[#08752B] w-4 h-4"
                      />
                      <span className={item.completed ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <QuotationDocumentModal quote={selectedQuotePdf} onClose={() => setSelectedQuotePdf(null)} />
    </div>
    </ContentProtectionShield>
  );
}

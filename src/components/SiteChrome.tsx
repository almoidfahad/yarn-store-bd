'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Phone,
  Globe,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  MapPin,
  Bot,
  Send,
  MessageCircle,
  LayoutDashboard,
  UserCheck,
  Sparkles,
  Printer,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WebsiteQrCode } from './VisualBadges';
import { ContentProtectionShield } from './ContentProtectionShield';
import { CURRENCY_RATES, LANGUAGE_LABELS } from '@/lib/staticContent';
import type { QuoteRecord } from '@/lib/db';

interface GlobalPrefsContextValue {
  lang: 'EN' | 'DE' | 'ES' | 'AR';
  setLang: (l: 'EN' | 'DE' | 'ES' | 'AR') => void;
  currency: 'USD' | 'EUR' | 'GBP';
  setCurrency: (c: 'USD' | 'EUR' | 'GBP') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const GlobalPrefsContext = createContext<GlobalPrefsContextValue>({
  lang: 'EN',
  setLang: () => {},
  currency: 'USD',
  setCurrency: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

export function useGlobalPrefs() {
  return useContext(GlobalPrefsContext);
}

export function GlobalPrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'ES' | 'AR'>('EN');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ysb_color_mode');
      if (saved === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore storage access error
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ysb_color_mode', next ? 'dark' : 'normal');
      } catch {
        // Ignore
      }
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <GlobalPrefsContext.Provider
      value={{ lang, setLang, currency, setCurrency, darkMode, toggleDarkMode }}
    >
      {children}
    </GlobalPrefsContext.Provider>
  );
}

export function PublicHeader() {
  const pathname = usePathname();
  const { lang, setLang, currency, setCurrency, darkMode, toggleDarkMode } = useGlobalPrefs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prodDrop, setProdDrop] = useState(false);
  const [resDrop, setResDrop] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm no-print">
      {/* Top Emerald Utility Bar — Exact Match to Screenshot #1 */}
      <div className="bg-[#085D28] text-white text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <a
              href="mailto:info@yarnstorebd.com"
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-200" />
              <span>info@yarnstorebd.com</span>
            </a>
            <a
              href="tel:+8801677852904"
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-200" />
              <span>+880 1677 852904</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Quick Access Pills for Buyer Portal & Admin Dashboard */}
            <div className="hidden md:flex items-center gap-2 pr-2 border-r border-white/20">
              <Link
                href="/portal"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-medium transition"
              >
                <UserCheck className="w-3 h-3 text-amber-300" />
                Buyer Portal
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-[11px] font-semibold transition shadow-sm"
              >
                <LayoutDashboard className="w-3 h-3" />
                Admin Dashboard
              </Link>
            </div>

            {/* Currency Switcher (Part 6.2) */}
            <select
              aria-label="Currency selector"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer hidden sm:block"
              title={CURRENCY_RATES[currency].sourceNote}
            >
              <option value="USD" className="text-slate-900">USD ($)</option>
              <option value="EUR" className="text-slate-900">EUR (€)</option>
              <option value="GBP" className="text-slate-900">GBP (£)</option>
            </select>

            {/* Language Selector matching screenshot globe + English v */}
            <div className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-200" />
              <select
                aria-label="Language selector"
                value={lang}
                onChange={(e) => setLang(e.target.value as 'EN' | 'DE' | 'ES' | 'AR')}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="EN" className="text-slate-900">English</option>
                <option value="DE" className="text-slate-900">Deutsch</option>
                <option value="ES" className="text-slate-900">Español</option>
                <option value="AR" className="text-slate-900">العربية</option>
              </select>
            </div>

            {/* Social Icons matching top-right of Screenshot #1 */}
            <div className="hidden sm:flex items-center gap-1.5 pl-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-[10px] font-bold"
              >
                in
              </a>
              <a
                href="#factory-tour"
                aria-label="YouTube Factory Video"
                className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-[9px]"
              >
                ▶
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-[10px] font-bold"
              >
                f
              </a>
              <a
                href="https://wa.me/8801677852904"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-[10px]"
              >
                ✆
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — Supports Normal Light Mode & Luxury Dark Mode */}
      <div
        className={`backdrop-blur border-b transition-colors ${
          darkMode
            ? 'bg-[#081A10]/95 border-emerald-900/60 text-emerald-50'
            : 'bg-white/98 border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between gap-4">
          <BrandLogo theme={darkMode ? 'dark' : 'light'} />

          {/* Desktop Navigation */}
          <nav
            className={`hidden lg:flex items-center gap-6 text-[14px] font-semibold ${
              darkMode ? 'text-emerald-50' : 'text-[#17231C]'
            }`}
          >
            <Link
              href="/"
              className={`py-2 relative transition-colors ${
                isActive('/') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProdDrop(true)}
              onMouseLeave={() => setProdDrop(false)}
            >
              <Link
                href="/products"
                className={`inline-flex items-center gap-1 py-2 relative transition-colors ${
                  isActive('/products') || isActive('/trading') || isActive('/wholesale')
                    ? 'text-[#08752B]'
                    : 'hover:text-[#08752B]'
                }`}
              >
                Products <ChevronDown className="w-3.5 h-3.5 opacity-75" />
                {isActive('/products') && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
                )}
              </Link>

              {prodDrop && (
                <div className="absolute left-0 top-full pt-1 w-72 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-2 grid gap-1">
                    <Link href="/products" className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs font-bold text-[#08752B] flex items-center justify-between">
                      All Yarn &amp; Thread Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/products/cotton-yarn" className="px-3 py-2 rounded-lg hover:bg-slate-50 text-xs">
                      <div className="font-semibold text-slate-900">100% Cotton Yarn</div>
                      <div className="text-[11px] text-slate-500">Ne 10s–40s Carded, Combed &amp; Compact</div>
                    </Link>
                    <Link href="/products/polyester-yarn" className="px-3 py-2 rounded-lg hover:bg-slate-50 text-xs">
                      <div className="font-semibold text-slate-900">100% Polyester Yarn</div>
                      <div className="text-[11px] text-slate-500">75D/36F · 150D/48F · 300D/96F Filament</div>
                    </Link>
                    <Link href="/products/embroidery-thread" className="px-3 py-2 rounded-lg hover:bg-slate-50 text-xs">
                      <div className="font-semibold text-slate-900">Cotton Embroidery Thread</div>
                      <div className="text-[11px] text-slate-500">40/2 &amp; 60/2 · 480+ Colorfast Shades</div>
                    </Link>
                    <Link href="/products/yarn-cones" className="px-3 py-2 rounded-lg hover:bg-slate-50 text-xs">
                      <div className="font-semibold text-slate-900">Cotton Yarn Cones</div>
                      <div className="text-[11px] text-slate-500">Auto-Coner Paper &amp; Perforated Dye Cones</div>
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <Link href="/trading" className="px-3 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700">
                      Trading &amp; Verified Sourcing
                    </Link>
                    <Link href="/wholesale" className="px-3 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700">
                      Wholesale &amp; Bulk Container Orders
                    </Link>
                    <Link href="/request-sample" className="px-3 py-1.5 rounded-lg hover:bg-amber-50 text-xs font-semibold text-amber-700">
                      Request Sample Cones →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`py-2 relative transition-colors ${
                isActive('/about') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              About Us
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>

            <Link
              href="/manufacturing"
              className={`py-2 relative transition-colors ${
                isActive('/manufacturing') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              Manufacturing
              {isActive('/manufacturing') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>

            <Link
              href="/quality"
              className={`py-2 relative transition-colors ${
                isActive('/quality') || isActive('/certifications') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              Quality
              {(isActive('/quality') || isActive('/certifications')) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>

            <Link
              href="/export"
              className={`py-2 relative transition-colors ${
                isActive('/export') || isActive('/industries') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              Export
              {(isActive('/export') || isActive('/industries')) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResDrop(true)}
              onMouseLeave={() => setResDrop(false)}
            >
              <Link
                href="/resources"
                className={`inline-flex items-center gap-1 py-2 relative transition-colors ${
                  isActive('/resources') || isActive('/blog') || isActive('/gallery') || isActive('/faq')
                    ? 'text-[#08752B]'
                    : 'hover:text-[#08752B]'
                }`}
              >
                Resources <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </Link>
              {resDrop && (
                <div className="absolute right-0 top-full pt-1 w-64 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-2 grid gap-1 text-xs">
                    <Link href="/resources" className="px-3 py-2 rounded-lg hover:bg-emerald-50 font-semibold text-[#08752B]">
                      Yarn Count Converter &amp; Tools
                    </Link>
                    <Link href="/certifications" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      ISO, OEKO-TEX &amp; ERC Certificates
                    </Link>
                    <Link href="/industries" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Industries We Serve
                    </Link>
                    <Link href="/about/team" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Our Leadership &amp; Export Team
                    </Link>
                    <Link href="/gallery" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Factory &amp; Warehouse Gallery
                    </Link>
                    <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      B2B Textile &amp; SEO Blog
                    </Link>
                    <Link href="/faq" className="px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Buyer FAQ
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <Link href="/portal" className="px-3 py-2 rounded-lg hover:bg-emerald-50 font-semibold text-[#08752B]">
                      International Buyer Portal
                    </Link>
                    <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-amber-50 font-semibold text-amber-700">
                      Admin CRM Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`py-2 relative transition-colors ${
                isActive('/contact') ? 'text-[#08752B]' : 'hover:text-[#08752B]'
              }`}
            >
              Contact
              {isActive('/contact') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#08752B] rounded-full" />
              )}
            </Link>
          </nav>

          {/* Right Dark/Normal Mode Toggle + Pill CTA + Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to Normal Mode' : 'Switch to Dark Mode'}
              title={darkMode ? 'Switch to Normal Mode' : 'Switch to Dark Mode'}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold border transition-all ${
                darkMode
                  ? 'bg-[#12311F] hover:bg-[#19422A] text-amber-300 border-emerald-600/60 shadow-sm'
                  : 'bg-[#ECF7EE] hover:bg-emerald-100 text-[#08752B] border-emerald-200'
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Normal</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#08752B]" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 bg-[#0A5C28] hover:bg-[#08752B] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all"
            >
              <span>{LANGUAGE_LABELS[lang].ctaQuote}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Products', href: '/products' },
                { label: 'Cotton Yarn', href: '/products/cotton-yarn' },
                { label: 'Polyester Yarn', href: '/products/polyester-yarn' },
                { label: 'Embroidery Thread', href: '/products/embroidery-thread' },
                { label: 'Yarn Cones', href: '/products/yarn-cones' },
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/about/team' },
                { label: 'Manufacturing', href: '/manufacturing' },
                { label: 'Trading & Sourcing', href: '/trading' },
                { label: 'Wholesale & Bulk', href: '/wholesale' },
                { label: 'Quality Control', href: '/quality' },
                { label: 'Certifications', href: '/certifications' },
                { label: 'Export & Logistics', href: '/export' },
                { label: 'Industries', href: '/industries' },
                { label: 'Request Sample', href: '/request-sample' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Resources & Tools', href: '/resources' },
                { label: 'Blog', href: '/blog' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Buyer Portal', href: '/portal' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg bg-[#F28C18] text-white text-sm font-semibold"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/request-quote"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg bg-[#08752B] text-white text-sm font-semibold"
              >
                Request a Quote →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative bg-[#06381A] text-white overflow-hidden no-print">
      {/* Top Emerald Accent Hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-[#08752B] via-[#22C55E] to-[#F28C18]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-emerald-800/70">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-3 space-y-3">
            <BrandLogo theme="dark" />
            <p className="text-sm text-emerald-100/90 leading-relaxed pt-1">
              Connecting the World with Quality Yarn
            </p>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              International B2B Manufacturer, Verified Sourcing Partner &amp; Bulk Exporter of Cotton Yarn, Polyester Filament, Embroidery Thread &amp; Cones from Bangladesh.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs text-emerald-100/85">
              <li><Link href="/" className="hover:text-amber-300 transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-amber-300 transition">Products</Link></li>
              <li><Link href="/about" className="hover:text-amber-300 transition">About Us</Link></li>
              <li><Link href="/manufacturing" className="hover:text-amber-300 transition">Manufacturing</Link></li>
              <li><Link href="/trading" className="hover:text-amber-300 transition">Trading &amp; Sourcing</Link></li>
              <li><Link href="/export" className="hover:text-amber-300 transition">Export &amp; Logistics</Link></li>
              <li><Link href="/portal" className="hover:text-amber-300 transition">Buyer Portal</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Our Products */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">Our Products</h3>
            <ul className="space-y-2 text-xs text-emerald-100/85">
              <li><Link href="/products/cotton-yarn" className="hover:text-amber-300 transition">Cotton Yarn</Link></li>
              <li><Link href="/products/polyester-yarn" className="hover:text-amber-300 transition">Polyester Yarn</Link></li>
              <li><Link href="/products/embroidery-thread" className="hover:text-amber-300 transition">Embroidery Thread</Link></li>
              <li><Link href="/products/yarn-cones" className="hover:text-amber-300 transition">Yarn Cones</Link></li>
              <li><Link href="/wholesale" className="hover:text-amber-300 transition">Wholesale &amp; Bulk</Link></li>
              <li><Link href="/request-sample" className="hover:text-amber-300 transition">Request a Sample</Link></li>
              <li><Link href="/export/yarn-supplier-bangladesh" className="hover:text-amber-300 transition">Bangladesh Export Desk</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">Contact Us</h3>
            <ul className="space-y-3 text-xs text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>123 Textile Industrial Area, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <a href="tel:+8801677852904" className="hover:text-amber-300">+880 1677 852904</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <a href="mailto:info@yarnstorebd.com" className="hover:text-amber-300">info@yarnstorebd.com</a>
              </li>
            </ul>
          </div>

          {/* Col 5: Follow Us + QR Code matching Screenshot #1 */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-end gap-4">
            <div className="w-full lg:text-right">
              <h3 className="text-sm font-bold text-white tracking-wide mb-3">Follow Us</h3>
              <div className="flex lg:justify-end items-center gap-2">
                {['in', '▶', 'f', '✆'].map((icon, i) => (
                  <a
                    key={i}
                    href="#top"
                    className="w-7 h-7 rounded-full bg-white text-[#06381A] hover:bg-[#F28C18] hover:text-white transition flex items-center justify-center text-xs font-extrabold"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <WebsiteQrCode />
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/80">
          <p>© 2026 YARN STORE BD. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <span>|</span>
            <Link href="/admin" className="text-amber-300 hover:text-amber-200 font-medium transition">Staff CRM</Link>
          </div>
        </div>
      </div>

      {/* Signature Bottom-Right Orange & Green Ribbon Wave matching Screenshot #1 */}
      <svg
        viewBox="0 0 500 90"
        className="absolute bottom-0 right-0 w-72 sm:w-96 h-auto pointer-events-none"
        fill="none"
      >
        <path d="M120 90 C 230 45, 360 15, 500 8 L500 90 Z" fill="#F28C18" />
        <path d="M165 90 C 265 55, 385 32, 500 26 L500 90 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M185 90 C 285 62, 395 40, 500 35 L500 90 Z" fill="#0B5E28" />
      </svg>
    </footer>
  );
}

export function FloatingExportAssistants() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'assistant' | 'user'; text: string; links?: { label: string; href: string }[] }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I am the YARN STORE BD AI Export Advisor. Ask me about Cotton Yarn counts (10s–40s), Polyester Filament (75/36, 150D/48F, 300D/96F), Embroidery Thread (40/2 & 60/2), MOQ, Sample Cones, or Shipping Terms.',
      links: [
        { label: 'Request Official Quote →', href: '/request-quote' },
        { label: 'Order Sample Cones', href: '/request-sample' },
      ],
    },
  ]);

  async function sendPrompt(customPrompt?: string) {
    const q = (customPrompt ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Please submit an RFQ so our Export Sales Team can assist.',
          links: data.suggestedLinks || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'You can reach our Export Sales Desk directly at info@yarnstorebd.com or +880 1677 852904.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 no-print">
      {open && (
        <div className="w-[340px] sm:w-[375px] bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden mb-1">
          <div className="bg-gradient-to-r from-[#063B1B] to-[#08752B] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  AI Export Advisor <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-[11px] text-emerald-100">Approved Spec &amp; RFQ Guide · Human-Verified Quotes</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/15">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 max-h-72 overflow-y-auto space-y-3 bg-[#F7FAF8] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-xl px-3 py-2.5 leading-relaxed max-w-[90%] ${
                    m.role === 'user'
                      ? 'bg-[#08752B] text-white'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.links && m.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.links.map((lnk, lIdx) => (
                      <Link
                        key={lIdx}
                        href={lnk.href}
                        onClick={() => setOpen(false)}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#08752B] font-semibold hover:bg-emerald-100 transition"
                      >
                        {lnk.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-slate-400 italic">Checking approved catalog...</div>}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              'Cotton Yarn MOQ & Counts',
              'Polyester 150D/48F',
              'Embroidery 40/2 & 60/2',
              'Sample Cones',
              'Pricing Policy',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => sendPrompt(chip)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#08752B] text-slate-700 font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about yarn specs, MOQ, shipping..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#08752B]"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#08752B] hover:bg-[#065C22] text-white"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/8801677852904"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold px-3.5 py-2.5 rounded-full shadow-lg transition"
          title="WhatsApp Export Sales Desk"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Desk</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 bg-[#063B1B] hover:bg-[#08752B] text-white text-xs font-bold px-4 py-3 rounded-full shadow-xl border border-emerald-400/30 transition"
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>AI Sales Assistant</span>
        </button>
      </div>
    </div>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <GlobalPrefsProvider>
      <ContentProtectionShield scope="products">
        <div id="top" className="ysb-public-root min-h-screen flex flex-col bg-white text-[#17231C]">
          <PublicHeader />
          <main className="flex-1">{children}</main>
          <PublicFooter />
          <FloatingExportAssistants />
        </div>
      </ContentProtectionShield>
    </GlobalPrefsProvider>
  );
}

export function QuotationDocumentModal({
  quote,
  onClose,
}: {
  quote: QuoteRecord | null;
  onClose: () => void;
}) {
  if (!quote) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-[#063B1B] text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span className="font-bold text-sm">Official B2B Export Quotation — {quote.quoteNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-xs font-bold px-3.5 py-2 rounded-lg"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-800">
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <BrandLogo theme="light" href="" />
              <p className="text-xs text-slate-500 mt-2">
                123 Textile Industrial Area, Dhaka, Bangladesh · ERC: ERC-BD-2014-88412
              </p>
              <p className="text-xs text-slate-500">
                Email: info@yarnstorebd.com · Tel/WhatsApp: +880 1677 852904
              </p>
            </div>
            <div className="sm:text-right space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#08752B]">
                Commercial Export Quotation
              </div>
              <div className="text-lg font-extrabold text-slate-900">{quote.quoteNumber}</div>
              <div className="text-xs text-slate-500">RFQ Ref: {quote.rfqRef}</div>
              <div className="text-xs text-slate-500">Issued: {quote.createdAt} · Valid Until: {quote.validityDate}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 bg-[#F5F8F5] rounded-xl p-4 text-xs">
            <div>
              <div className="font-bold text-slate-500 uppercase mb-1">Buyer Details</div>
              <div className="font-bold text-slate-900 text-sm">{quote.buyerCompany}</div>
              <div>Country: {quote.country}</div>
              <div>Email: {quote.buyerEmail}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500 uppercase mb-1">Commercial Terms</div>
              <div><span className="font-semibold">Incoterms:</span> {quote.incoterms}</div>
              <div><span className="font-semibold">Lead Time:</span> {quote.deliveryTime}</div>
              <div><span className="font-semibold">Payment Terms:</span> {quote.paymentTerms}</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#08752B] text-white text-left">
                <tr>
                  <th className="p-3">Product &amp; Technical Specification</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{quote.product}</div>
                    <div className="text-slate-500 mt-0.5">{quote.specification}</div>
                  </td>
                  <td className="p-3 font-semibold">
                    {quote.quantity.toLocaleString()} {quote.unit}
                  </td>
                  <td className="p-3 font-semibold">
                    {quote.currency} {quote.unitPrice.toLocaleString()} / {quote.unit}
                  </td>
                  <td className="p-3 text-right font-extrabold text-slate-900">
                    {quote.currency} {quote.totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-600">Approval Status: </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                {quote.approvalStatus}
              </span>
              <div className="text-slate-500 mt-1">Authorized Sign-off: {quote.approvedBy}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Total Export Quotation Value</div>
              <div className="text-2xl font-black text-[#08752B]">
                {quote.currency} {quote.totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

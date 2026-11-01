'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import {
  ContentProtectionShield,
  ProtectedProductImage,
} from '@/components/ContentProtectionShield';

const GALLERY_ITEMS = [
  { src: '/images/hero-yarn-mill.jpg', cat: 'Factory', title: 'High-Speed Ring Spinning Bobbins — Gazipur Unit' },
  { src: '/images/prod-cotton-yarn.jpg', cat: 'Products', title: '100% Cotton Yarn Cones (Ne 10s–40s)' },
  { src: '/images/prod-polyester-yarn.jpg', cat: 'Products', title: '100% Polyester Filament Bobbins (75/36, 150D/48F, 300D/96F)' },
  { src: '/images/prod-embroidery-thread.jpg', cat: 'Products', title: 'MHR 40/2 & 60/2 Industrial Embroidery Thread Shades' },
  { src: '/images/prod-yarn-cones.jpg', cat: 'Products', title: 'Precision Auto-Coner Tapered Export Cones' },
  { src: '/images/factory-floor.jpg', cat: 'Factory', title: 'Automated Spinning & Winding Production Floor' },
  { src: '/images/quality-lab.jpg', cat: 'Quality Lab', title: 'Uster Evenness & Tensile Strength Inspection Lab' },
  { src: '/images/warehouse-export.jpg', cat: 'Export', title: 'Palletized Moisture-Proof Export Cartons Ready for Loading' },
  { src: '/images/cargo-ship-port.jpg', cat: 'Export', title: 'International FCL Container Vessel Shipment from Chattogram' },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const visible = GALLERY_ITEMS.filter((g) => filter === 'All' || g.cat === filter);

  return (
    <PublicShell>
        <section className="bg-[#063B1B] text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              FACILITY &amp; PRODUCT GALLERY
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Inside Our Spinning Floor, Quality Lab &amp; Export Warehouse
            </h1>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-wrap gap-2">
            {['All', 'Products', 'Factory', 'Quality Lab', 'Export'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  filter === c ? 'bg-[#08752B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightbox(item)}
                className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft"
              >
                <div className="h-56 overflow-hidden">
                  <ProtectedProductImage
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase text-[#08752B]">{item.cat}</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{item.title}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden">
              <div className="px-5 py-3 bg-[#063B1B] text-white flex justify-between items-center">
                <span className="text-sm font-bold">{lightbox.title}</span>
                <button onClick={() => setLightbox(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full max-h-[75vh] bg-black">
                <ProtectedProductImage
                  src={lightbox.src}
                  alt={lightbox.title}
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
    </PublicShell>
  );
}

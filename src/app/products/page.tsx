import React from 'react';
import type { Metadata } from 'next';
import { PublicShell } from '@/components/SiteChrome';
import { ProductsCatalogClient } from '@/components/ProductsCatalogClient';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Export Yarn & Thread Product Catalog — Cotton, Polyester, Embroidery & Cones',
  description:
    'Browse YARN STORE BD B2B export catalog: 100% Cotton Yarn (10s–40s), 100% Polyester Yarn (75/36, 150D/48F, 300D/96F), Cotton Embroidery Thread (40/2, 60/2), and Yarn Cones.',
};

export default function ProductsPage() {
  const db = readDB();
  const activeProducts = db.products.filter((p) => !p.archivedAt);

  return (
    <PublicShell>
      <ProductsCatalogClient products={activeProducts} />
    </PublicShell>
  );
}

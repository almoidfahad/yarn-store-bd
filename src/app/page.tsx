import React from 'react';
import { PublicShell } from '@/components/SiteChrome';
import { HomeClient } from '@/components/HomeClient';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = readDB();
  const activeProducts = db.products.filter((p) => !p.archivedAt);

  return (
    <PublicShell>
      <HomeClient products={activeProducts} />
    </PublicShell>
  );
}

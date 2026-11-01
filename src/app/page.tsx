import React from 'react';
import { PublicShell } from '@/components/SiteChrome';
import { HomeClient } from '@/components/HomeClient';
import { readDBCloud } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = await readDBCloud();
  const activeProducts = db.products.filter((p) => !p.archivedAt);

  return (
    <PublicShell>
      <HomeClient
        products={activeProducts}
        initialSecuritySettings={db.securitySettings}
      />
    </PublicShell>
  );
}

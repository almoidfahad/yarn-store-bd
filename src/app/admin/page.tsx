import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { readDBCloud, getComputedKpis } from '@/lib/db';
import { ADMIN_SESSION_COOKIE, getVerifiedAdminFromCookieValue } from '@/lib/adminSession';
import { AdminDashboardClient } from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin CRM & Operations Dashboard',
  description:
    'YARN STORE BD Internal B2B CRM, RFQ, Quotation, Sample, Order & Analytics Management Dashboard.',
};

export default async function AdminPage() {
  const db = await readDBCloud();
  const kpis = getComputedKpis(db);
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const initialAdminUser = getVerifiedAdminFromCookieValue(sessionCookie);

  return (
    <AdminDashboardClient
      initialDb={db}
      initialKpis={kpis}
      initialAdminUser={initialAdminUser}
    />
  );
}

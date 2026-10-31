import React from 'react';
import type { Metadata } from 'next';
import { readDB, getComputedKpis } from '@/lib/db';
import { AdminDashboardClient } from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin CRM & Operations Dashboard',
  description: 'YARN STORE BD Internal B2B CRM, RFQ, Quotation, Sample, Order & Analytics Management Dashboard.',
};

export default function AdminPage() {
  const db = readDB();
  const kpis = getComputedKpis(db);
  return <AdminDashboardClient initialDb={db} initialKpis={kpis} />;
}

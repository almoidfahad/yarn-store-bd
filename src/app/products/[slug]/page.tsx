import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PublicShell } from '@/components/SiteChrome';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { readDB, readDBCloud } from '@/lib/db';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const db = readDB();
  const product = db.products.find((p) => p.slug === params.slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${product.name} Supplier & Exporter Bangladesh (${product.spec.counts})`,
    description: `${product.shortDescription} MOQ: ${product.moqKg} KG. ${product.supplyType}. Request FOB/CIF export quote.`,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const db = await readDBCloud();
  const product = db.products.find((p) => p.slug === params.slug && !p.archivedAt);
  if (!product) {
    notFound();
  }

  const related = db.products.filter((p) => p.id !== product.id && !p.archivedAt).slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'YARN STORE BD — MHR THREAD & ACCESSORIES',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.facilityOrPartnerName,
    },
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient
        product={product}
        related={related}
        initialSecuritySettings={db.securitySettings}
      />
    </PublicShell>
  );
}

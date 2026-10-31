import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'YARN STORE BD — International B2B Yarn & Thread Supplier Bangladesh | MHR Thread & Accessories',
    template: '%s | YARN STORE BD — MHR Thread & Accessories',
  },
  description:
    'Trusted global B2B supplier, manufacturer & exporter of 100% Cotton Yarn (Ne 10s–40s), 100% Polyester Yarn (75/36, 150D/48F, 300D/96F), Cotton Embroidery Thread (40/2, 60/2), and Precision Yarn Cones from Dhaka, Bangladesh.',
  keywords: [
    'Cotton Yarn Supplier Bangladesh',
    'Polyester Yarn Wholesale Supplier',
    'Textile Yarn Exporter Bangladesh',
    'Bulk Cotton Yarn Supplier',
    'Industrial Embroidery Thread Supplier',
    'YARN STORE BD',
    'MHR Thread & Accessories',
  ],
  openGraph: {
    title: 'YARN STORE BD — Your Trusted Global Yarn Supply Partner',
    description:
      'Quality Yarn. Reliable Supply. Stronger Partnerships. Bulk Cotton Yarn, Polyester Filament, Embroidery Thread & Cones exported worldwide from Bangladesh.',
    type: 'website',
    locale: 'en_US',
    siteName: 'YARN STORE BD',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YARN STORE BD — MHR THREAD & ACCESSORIES',
  foundingDate: '2010',
  email: 'info@yarnstorebd.com',
  telephone: '+880 1677 852904',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Textile Industrial Area',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
  description:
    'International B2B manufacturer, verified sourcing partner, and bulk exporter of Cotton Yarn, Polyester Yarn, Embroidery Thread, and Yarn Cones from Bangladesh.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-[#17231C]">{children}</body>
    </html>
  );
}

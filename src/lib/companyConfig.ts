/**
 * Centralized Company & Demo Configuration
 * ---------------------------------------------------------------------------
 * Currently loaded with Demo Information so you can deploy & test immediately
 * on Vercel + Supabase + Resend. Later, replace values here, via environment
 * variables, or directly inside /admin -> Settings -> Company Profile Editor.
 */

export interface CompanyProfileConfig {
  brandName: string;
  subBrand: string;
  tagline: string;
  officialEmail: string;
  salesAlertEmail: string;
  phoneDisplay: string;
  whatsappDigits: string;
  headOfficeAddress: string;
  factoryAddress: string;
  portOfLoading: string;
  ercRegistrationNo: string;
  establishedYear: string;
  websiteUrl: string;
  isDemoData: boolean;
}

export const DEFAULT_COMPANY_CONFIG: CompanyProfileConfig = {
  brandName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'YARN STORE BD',
  subBrand: process.env.NEXT_PUBLIC_COMPANY_SUBBRAND || 'MHR THREAD & ACCESSORIES',
  tagline: 'Connecting the World with Quality Yarn',
  officialEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@yarnstorebd.com',
  salesAlertEmail:
    process.env.SALES_NOTIFICATION_EMAIL ||
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ||
    'info@yarnstorebd.com',
  phoneDisplay: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+880 1677 852904',
  whatsappDigits: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '8801677852904',
  headOfficeAddress:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    '123 Textile Industrial Area, Dhaka, Bangladesh',
  factoryAddress:
    process.env.NEXT_PUBLIC_FACTORY_ADDRESS ||
    'Gazipur Ring Spinning & Auto-Coner Industrial Zone, Bangladesh',
  portOfLoading: 'Chattogram Deep Sea Port / Dhaka HSIA Air Cargo',
  ercRegistrationNo: process.env.NEXT_PUBLIC_ERC_NUMBER || 'ERC-BD-2014-88412 (Demo)',
  establishedYear: '2010',
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yarnstorebd.com',
  isDemoData: process.env.NEXT_PUBLIC_IS_LIVE_DATA !== 'true',
};

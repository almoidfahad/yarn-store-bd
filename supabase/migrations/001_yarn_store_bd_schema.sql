-- =============================================================================
-- YARN STORE BD — MHR THREAD & ACCESSORIES
-- International B2B Yarn & Textile Export Platform
-- Complete 22-Table PostgreSQL + Supabase RLS Schema (Blueprint Part 5.3 - 5.5)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users (Identity & Auth Role Mapping)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'super_admin',
    'sales_manager',
    'sales_executive',
    'product_manager',
    'operations_manager',
    'quality_manager',
    'content_manager',
    'finance_manager',
    'buyer'
  )),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 2. profiles (User Details)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  full_name TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. companies (Buyer Companies)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  website TEXT,
  business_type TEXT, -- Garments Factory, Importer, Wholesaler, Knitting Mill, etc.
  verified_importer BOOLEAN DEFAULT FALSE,
  tax_or_import_reg TEXT,
  owner_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 4. contacts (Company Contacts)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  job_title TEXT,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 5. suppliers (Verified Partner Manufacturing Mills - Trading Division)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_code TEXT UNIQUE NOT NULL,
  mill_name TEXT NOT NULL,
  location TEXT NOT NULL,
  specialization TEXT NOT NULL,
  monthly_capacity_mt NUMERIC(10,2),
  iso_certified BOOLEAN DEFAULT TRUE,
  oeko_tex_certified BOOLEAN DEFAULT FALSE,
  audit_status TEXT DEFAULT 'Verified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 6. facilities (Own Factory Details - Manufacturing Division)
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_code TEXT UNIQUE NOT NULL,
  facility_name TEXT NOT NULL,
  location TEXT NOT NULL,
  division TEXT NOT NULL,
  machinery_summary TEXT,
  spindle_or_head_count TEXT,
  monthly_capacity_mt NUMERIC(10,2),
  certifications TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 7. products (Core Product Catalog — Rule 1 & 2: Separate Specs & Separate Supply Source)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  overview TEXT NOT NULL,
  supply_type TEXT NOT NULL CHECK (supply_type IN (
    'Manufactured by YARN STORE BD',
    'Supplied through Verified Manufacturing Partner'
  )),
  facility_id UUID REFERENCES facilities(id),
  supplier_id UUID REFERENCES suppliers(id),
  moq_kg INTEGER NOT NULL,
  monthly_capacity_mt INTEGER NOT NULL,
  lead_time_days TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ -- Rule 6: Soft-archive instead of hard delete
);

-- 8. product_specs (Rule 1: Technical Specifications stored separately from products)
CREATE TABLE IF NOT EXISTS product_specs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  material TEXT NOT NULL,
  yarn_counts TEXT NOT NULL,
  composition TEXT NOT NULL,
  yarn_type TEXT NOT NULL,
  packaging TEXT NOT NULL,
  cone_weight TEXT NOT NULL,
  applications TEXT[] NOT NULL,
  colors_available TEXT NOT NULL,
  quality_standard TEXT NOT NULL,
  datasheet_code TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. product_images (Product Photos)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

-- 10. rfqs (Buyer Enquiries — Rule 3: One Buyer can submit multiple RFQs)
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL, -- e.g. YSB-RFQ-2026-001
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  destination_country TEXT NOT NULL,
  destination_port TEXT,
  incoterms TEXT DEFAULT 'FOB',
  payment_preference TEXT,
  preferred_delivery_date DATE,
  sample_required BOOLEAN DEFAULT FALSE,
  attachment_private_path TEXT, -- Rule: Private storage only, never public
  additional_notes TEXT,
  status TEXT DEFAULT 'New',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 11. rfq_items (RFQ Product Line Details)
CREATE TABLE IF NOT EXISTS rfq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id),
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  yarn_count TEXT,
  yarn_type TEXT,
  required_quantity NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('KG', 'TON', 'MT', 'PCS')),
  monthly_requirement TEXT
);

-- 12. leads (CRM Lead Pipeline + AI Lead Scoring)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_code TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  rfq_id UUID REFERENCES rfqs(id),
  interested_product TEXT NOT NULL,
  estimated_quantity TEXT,
  lead_source TEXT NOT NULL, -- Google Organic, Google Ads, LinkedIn, Alibaba, Global Sources, Referral, Direct
  assigned_salesperson UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN (
    'New Lead',
    'Qualified',
    'Contacted',
    'Quotation Sent',
    'Negotiation',
    'Sample Stage',
    'Won',
    'Lost'
  )),
  ai_priority TEXT DEFAULT 'Positive Signal',
  ai_score INTEGER DEFAULT 75,
  next_followup_date DATE,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 13. lead_activities (Calls, Notes, Emails, Status Transitions)
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  actor_user_id UUID REFERENCES users(id),
  activity_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. quotes (Rule 4: Multiple Quotations allowed per RFQ; Manager Approval Required)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  rfq_id UUID REFERENCES rfqs(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate_note TEXT,
  incoterms TEXT NOT NULL DEFAULT 'FOB Chattogram',
  delivery_lead_time TEXT NOT NULL,
  payment_terms TEXT NOT NULL,
  valid_until DATE NOT NULL,
  total_amount NUMERIC(14,2) NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'Pending Manager Approval' CHECK (approval_status IN (
    'Draft',
    'Pending Manager Approval',
    'Approved',
    'Sent to Buyer',
    'Accepted',
    'Expired'
  )),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 15. quote_items (Quotation Line Items)
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id),
  product_id UUID REFERENCES products(id),
  product_description TEXT NOT NULL,
  specification TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(14,2) NOT NULL
);

-- 16. samples (7-Stage Sample Workflow)
CREATE TABLE IF NOT EXISTS samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sample_code TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id),
  product_name TEXT NOT NULL,
  yarn_count TEXT NOT NULL,
  cone_qty INTEGER DEFAULT 2,
  shade_card_included BOOLEAN DEFAULT TRUE,
  courier_name TEXT,
  tracking_number TEXT,
  workflow_stage TEXT NOT NULL CHECK (workflow_stage IN (
    'Request',
    'Review',
    'Approved',
    'Prepared',
    'Dispatched',
    'Delivered',
    'Feedback'
  )),
  buyer_feedback TEXT,
  responsible_person TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 17. orders (Rule 5: Linked to Quote & Buyer Company; 7-Stage Order Workflow)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES quotes(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  product_summary TEXT NOT NULL,
  quantity_mt NUMERIC(10,2) NOT NULL,
  total_value_usd NUMERIC(14,2) NOT NULL,
  incoterms TEXT NOT NULL,
  workflow_stage TEXT NOT NULL CHECK (workflow_stage IN (
    'Purchase Order Received',
    'Order Confirmation',
    'Production/Sourcing',
    'Quality Inspection',
    'Packing',
    'Shipment',
    'Delivered'
  )),
  display_status TEXT NOT NULL, -- Confirmed, Processing, Shipped, Delivered
  responsible_manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 18. shipments (Container, Port & Vessel Tracking)
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  port_of_loading TEXT DEFAULT 'Chattogram Port, Bangladesh',
  port_of_discharge TEXT NOT NULL,
  vessel_name TEXT,
  container_no TEXT,
  bl_number TEXT,
  etd DATE,
  eta DATE,
  status TEXT NOT NULL
);

-- 19. documents (Certificates, Datasheets, Export Commercial Docs)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  doc_category TEXT NOT NULL, -- Certificate, Export Document, Technical Datasheet, Quality Report
  related_order_id UUID REFERENCES orders(id),
  company_id UUID REFERENCES companies(id),
  is_public BOOLEAN DEFAULT FALSE,
  verified_status TEXT DEFAULT 'Verified',
  issued_date DATE
);

-- 20. email_logs (Transactional & Automated Buyer Communication History)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trigger_event TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'Delivered',
  provider TEXT DEFAULT 'Resend',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. notifications (Admin & Buyer Real-time Alerts)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- rfq, order, sample, quote, system
  title TEXT NOT NULL,
  time_label TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. audit_logs (Admin Security & Compliance Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_ref TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) across sensitive B2B tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 23. platform_state_snapshots (Cloud CRM & Editable Demo/Company Config Sync for Vercel)
CREATE TABLE IF NOT EXISTS platform_state_snapshots (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE platform_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;

-- Public read policy for active (non-archived) catalog products & specs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public read active products'
  ) THEN
    CREATE POLICY "Public read active products"
      ON products FOR SELECT
      USING (archived_at IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'product_specs' AND policyname = 'Public read product specs'
  ) THEN
    CREATE POLICY "Public read product specs"
      ON product_specs FOR SELECT
      USING (TRUE);
  END IF;
END $$;


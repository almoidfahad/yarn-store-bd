# YARN STORE BD — MHR THREAD & ACCESSORIES
### International B2B Yarn & Textile Export Platform (Public Website + Buyer Portal + Admin CRM + AI Advisor)

Complete full-stack Next.js 14 + TypeScript + Tailwind CSS platform implementing every step, page, workflow, database table, and pixel-faithful UI design for **YARN STORE BD (MHR Thread & Accessories)**.

## Key Platform Modules

1. **Public International B2B Website (23+ Routes)**
   - `/` — Pixel-faithful Homepage (`Green #08752B`, `White`, `Orange #F28C18`), Hero Factory Tour, 4-Pillar Trust Bar, Product Collection, About Since 2010, Global Export Map, ISO/OEKO-TEX/BCI Certifications & Container Vessel Banner, Flag Testimonials, FAQ & Dual CTA Band, QR-Code Footer
   - `/products` & `/products/[slug]` — `cotton-yarn`, `polyester-yarn`, `embroidery-thread` (interactive shade card), `yarn-cones` with 10-point technical specification sheets, printable TDS, and explicit Supply Source separation (`Manufactured by YARN STORE BD` vs `Supplied through Verified Manufacturing Partner`)
   - `/about`, `/about/team`, `/manufacturing`, `/trading`, `/wholesale`, `/quality`, `/certifications`, `/export`, `/export/yarn-supplier-bangladesh`, `/industries`, `/gallery`, `/resources` (Live Yarn Count Converter & Container Load Calculator), `/blog` + 4 SEO guides, `/faq`, `/contact`, `/privacy-policy`, `/terms`
   - `/request-quote` — Interactive 3-Step Multi-Step RFQ Form generating `YSB-RFQ-2026-XXX` reference codes + AI Lead Scoring + Auto Email Logs
   - `/request-sample` — International Sample Cone & Master Shade Card Request System
   - Floating **AI Export Sales Assistant** (strictly bounded to approved specs; never fabricates unverified prices/discounts) + **WhatsApp Business Desk**

2. **Isolated International Buyer Portal (`/portal`)**
   - Company Profile, My Enquiries (RFQs), Official Quotations (with printable PDF & 1-click PO confirmation), Sample Request 7-stage tracker, Order Status 7-stage tracker, Shipping Documents, Repeat Order, and Direct Account Manager Support.

3. **Enterprise Admin & CRM Dashboard (`/admin`)**
   - Pixel-faithful Overview Dashboard (`Total Leads: 128`, `New RFQs: 24`, `Quotes Sent: 18`, `Confirmed Orders: 9`, Monthly Sales Overview, Leads by Country Donut, Top Products, Recent Leads, Recent Orders, Quick Actions, 98% Customer Satisfaction, Notifications)
   - All 12 Interactive Sidebar Modules: `Dashboard`, `Leads & Customers`, `RFQ Management`, `Products & Inventory`, `Manufacturing & Suppliers`, `Quotations` (Manager Approval Gate + Printable Official PDF), `Sample Management`, `Orders & Shipments`, `Email Center`, `Team & Permissions` (8 RBAC roles + Audit Logs), `Reports & Analytics` (90-Day Marketing Tracker), and `Settings` (Interactive 12-item Business Prep & 15-item Launch Checklists).

4. **Database Schema**
   - Live local persistent relational store: `data/platform-db.json`
   - Full 22-table PostgreSQL + Supabase Row-Level Security migration: `supabase/migrations/001_yarn_store_bd_schema.sql`

## Commands

```bash
npm install
npm run dev     # Development server on 0.0.0.0:3000
npm run build   # Production build
npm start       # Production server on 0.0.0.0:3000
```

# YARN STORE BD — Vercel + Supabase + Resend সেটআপ ও ডেপ্লয়মেন্ট গাইড

এই প্রজেক্টটি এমনভাবে কনফিগার করা হয়েছে যাতে আপনি **প্রথমে সম্পূর্ণ ডেমো ইনফরমেশন (Demo Data)** দিয়ে **Vercel + Supabase + Resend**-এ লাইভ করতে পারেন এবং **পরবর্তীতে কোডে হাত না দিয়েই সরাসরি `/admin` → `Settings` থেকে অথবা `.env` থেকে আসল কোম্পানির তথ্য বসাতে পারেন।**

---

## ধাপ ১: ডেমো মোডে সরাসরি টেস্ট ও পরে তথ্য পরিবর্তন করার নিয়ম
বর্তমানে ওয়েবসাইটে নিচের ডেমো তথ্য সেট করা আছে:
- **Brand Name:** `YARN STORE BD` (`MHR THREAD & ACCESSORIES`)
- **Email:** `info@yarnstorebd.com`
- **Phone / WhatsApp:** `+880 1677 852904`
- **Address:** `123 Textile Industrial Area, Dhaka, Bangladesh`
- **ERC No:** `ERC-BD-2014-88412`

**পরে যেভাবে ডেমো তথ্য পরিবর্তন করবেন (২টি সহজ উপায়):**
1. **Admin Dashboard থেকে (সবচেয়ে সহজ):** `/admin` পেজে যান → বাম পাশের সাইডবারে **`Settings`** ক্লিক করুন → **`Company Information Editor`** বক্সে নতুন নাম, ইমেইল, ফোন, ঠিকানা ও ERC নম্বর লিখে **`Save Company Info`** বাটনে ক্লিক করুন।
2. **কোড/Environment থেকে:** `src/lib/companyConfig.ts` ফাইলে অথবা Vercel-এর Environment Variables-এ (`NEXT_PUBLIC_COMPANY_EMAIL`, `NEXT_PUBLIC_COMPANY_PHONE` ইত্যাদি) বসিয়ে দিন।

---

## ধাপ ২: Supabase PostgreSQL ডাটাবেস সেটআপ (৫ মিনিট)

1. [https://supabase.com](https://supabase.com)-এ গিয়ে **New Project** তৈরি করুন (যেমন নাম দিন: `yarn-store-bd`, Region: `Singapore ap-southeast-1` বা আপনার পছন্দের রিজিয়ন)।
2. প্রজেক্ট তৈরি হলে বাম মেনু থেকে **SQL Editor** → **New Query**-তে যান।
3. এই প্রজেক্টের ভেতরে থাকা ফাইল:
   `supabase/migrations/001_yarn_store_bd_schema.sql`
   পুরোটা কপি করে SQL Editor-এ পেস্ট করুন এবং **Run** ক্লিক করুন।
   *(এতে এক ক্লিকে ২৩টি PostgreSQL টেবিল ও Row-Level Security পলিসি তৈরি হয়ে যাবে।)*
4. এবার **Project Settings (⚙️) → API** থেকে নিচের ৩টি তথ্য কপি করে রাখুন:
   - `Project URL` → এটি হবে `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → এটি হবে `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → এটি হবে `SUPABASE_SERVICE_ROLE_KEY`

---

## ধাপ ৩: Resend ইমেইল সার্ভিস সেটআপ (৩ মিনিট)

1. [https://resend.com](https://resend.com)-এ অ্যাকাউন্ট খুলে **API Keys → Create API Key** ক্লিক করুন।
2. `re_...` দিয়ে শুরু হওয়া কী-টি কপি করুন → এটি হবে `RESEND_API_KEY`।
3. **ডেমো টেস্টিংয়ের সময়:** আলাদা ডোমেইন না থাকলেও চলবে! `RESEND_FROM_EMAIL` হিসেবে রাখুন:
   `YARN STORE BD Export Desk <onboarding@resend.dev>`
   এবং `SALES_NOTIFICATION_EMAIL`-এ আপনার নিজের ইমেইল দিন।
4. **পরে আসল ডোমেইন যুক্ত করলে:** Resend-এর **Domains → Add Domain**-এ আপনার `.com` ডোমেইন যোগ করে DNS-এ `SPF` ও `DKIM` রেকর্ড বসালে `info@yarnstorebd.com` থেকে সব বায়ারের কাছে ব্র্যান্ডেড ইমেইল যাবে।

---

## ধাপ ৪: Vercel-এ লাইভ ডেপ্লয়মেন্ট (৫ মিনিট)

### পদ্ধতি A: GitHub এর মাধ্যমে (Recommended)
1. প্রজেক্ট ফোল্ডার (`/home/user/yarn-store-bd`) আপনার একটি প্রাইভেট GitHub রিপোজিটরিতে পুশ করুন:
   ```bash
   git init
   git add .
   git commit -m "Initial YARN STORE BD B2B Platform (Demo + Cloud Ready)"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/yarn-store-bd.git
   git push -u origin main
   ```
2. [https://vercel.com/new](https://vercel.com/new)-এ গিয়ে GitHub রিপোজিটরিটি **Import** করুন।
3. **Environment Variables** সেকশনে `.env.example` অনুযায়ী নিচের ভ্যারিয়েবলগুলো পেস্ট করুন:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = *(ধাপ ২ থেকে)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(ধাপ ২ থেকে)*
   - `SUPABASE_SERVICE_ROLE_KEY` = *(ধাপ ২ থেকে)*
   - `RESEND_API_KEY` = *(ধাপ ৩ থেকে)*
   - `RESEND_FROM_EMAIL` = `YARN STORE BD Export Desk <onboarding@resend.dev>`
   - `SALES_NOTIFICATION_EMAIL` = *(আপনার ইমেইল)*
4. **Deploy** বাটনে ক্লিক করুন! ১–২ মিনিটের মধ্যে আপনার সাইট লাইভ হয়ে যাবে।

### পদ্ধতি B: সরাসরি Vercel CLI দিয়ে
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## ধাপ ৫: ডেপ্লয়ের পর ১-ক্লিক ভেরিফিকেশন
সাইট লাইভ হওয়ার পর ব্রাউজারে যান:
- `https://your-project.vercel.app/admin` → বাম মেনুতে **`Settings`** ক্লিক করুন।
- সেখানে **`Verify Supabase Connection`** এবং **`Send Test`** (Resend ইমেইল টেস্ট) বাটনে ক্লিক করলেই সবুজ টিক চিহ্নসহ কানেকশন কনফার্মেশন দেখতে পাবেন!

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const publishableKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  const secretKey = (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();

  const isValidUrl =
    Boolean(url) &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    !url.includes('your-project-ref');

  const activeKey = secretKey || publishableKey;
  const hasKeys = Boolean(activeKey && !activeKey.includes('...'));

  return {
    url,
    publishableKey,
    secretKey,
    activeKey,
    isValidUrl,
    hasKeys,
    fullyConfigured: isValidUrl && hasKeys,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv().fullyConfigured;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env.fullyConfigured) return null;
  if (cachedAdminClient) return cachedAdminClient;

  cachedAdminClient = createClient(env.url, env.activeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cachedAdminClient;
}

export async function syncRfqToSupabase(params: {
  referenceNumber: string;
  fullName: string;
  companyName: string;
  companyWebsite?: string;
  email: string;
  phone?: string;
  country: string;
  destinationPort?: string;
  productCategory: string;
  yarnCount: string;
  yarnType: string;
  quantity: number;
  unit: string;
  monthlyRequirement?: string;
  incoterms: string;
  paymentPreference?: string;
  preferredDeliveryDate?: string;
  sampleRequired: boolean;
  additionalRequirements?: string;
  leadCode: string;
  aiPriority: string;
  aiScore: number;
}): Promise<{ synced: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { synced: false };

  try {
    const { data: comp, error: compErr } = await supabase
      .from('companies')
      .insert({
        company_name: params.companyName,
        country: params.country,
        website: params.companyWebsite || null,
        business_type: 'International Textile Buyer',
      })
      .select('id')
      .single();

    if (compErr) throw compErr;

    const { data: contact, error: contErr } = await supabase
      .from('contacts')
      .insert({
        company_id: comp.id,
        full_name: params.fullName,
        email: params.email,
        phone: params.phone || null,
        whatsapp: params.phone || null,
      })
      .select('id')
      .single();

    if (contErr) throw contErr;

    const { data: rfq, error: rfqErr } = await supabase
      .from('rfqs')
      .insert({
        reference_number: params.referenceNumber,
        company_id: comp.id,
        contact_id: contact.id,
        destination_country: params.country,
        destination_port: params.destinationPort || null,
        incoterms: params.incoterms,
        payment_preference: params.paymentPreference || null,
        preferred_delivery_date: params.preferredDeliveryDate || null,
        sample_required: params.sampleRequired,
        additional_notes: params.additionalRequirements || null,
        status: 'New',
      })
      .select('id')
      .single();

    if (rfqErr) throw rfqErr;

    await supabase.from('rfq_items').insert({
      rfq_id: rfq.id,
      product_name: params.productCategory,
      yarn_count: params.yarnCount,
      yarn_type: params.yarnType,
      required_quantity: params.quantity,
      unit: ['KG', 'TON', 'MT', 'PCS'].includes(params.unit) ? params.unit : 'KG',
      monthly_requirement: params.monthlyRequirement || null,
    });

    const { data: lead } = await supabase
      .from('leads')
      .insert({
        lead_code: `LD-${params.leadCode}-${Date.now().toString().slice(-4)}`,
        company_id: comp.id,
        contact_id: contact.id,
        rfq_id: rfq.id,
        interested_product: params.productCategory,
        estimated_quantity: `${params.quantity} ${params.unit}`,
        lead_source: 'Direct Website',
        status: 'New Lead',
        ai_priority: params.aiPriority,
        ai_score: params.aiScore,
        internal_notes: params.additionalRequirements || null,
      })
      .select('id')
      .single();

    if (lead?.id) {
      await supabase.from('lead_activities').insert({
        lead_id: lead.id,
        activity_type: 'RFQ_SUBMITTED',
        summary: `Submitted ${params.referenceNumber} (${params.quantity} ${params.unit} ${params.productCategory})`,
      });
    }

    await supabase.from('notifications').insert({
      category: 'rfq',
      title: `New RFQ ${params.referenceNumber} from ${params.companyName} (${params.country})`,
      time_label: 'Just now',
    });

    return { synced: true };
  } catch (err) {
    return {
      synced: false,
      error: err instanceof Error ? err.message : 'Supabase RFQ sync failed',
    };
  }
}

export async function syncSampleToSupabase(params: {
  sampleCode: string;
  buyerCompany: string;
  buyerName?: string;
  buyerEmail: string;
  phone?: string;
  country: string;
  product: string;
  yarnCount: string;
  conesCount: number;
  shadeCard: boolean;
  courier: string;
  trackingNo: string;
}): Promise<{ synced: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { synced: false };

  try {
    const { data: comp } = await supabase
      .from('companies')
      .insert({
        company_name: params.buyerCompany,
        country: params.country,
        business_type: 'Sample Evaluation Buyer',
      })
      .select('id')
      .single();

    if (comp?.id) {
      await supabase.from('contacts').insert({
        company_id: comp.id,
        full_name: params.buyerName || params.buyerCompany,
        email: params.buyerEmail,
        phone: params.phone || null,
      });
    }

    const { error } = await supabase.from('samples').insert({
      sample_code: params.sampleCode,
      company_id: comp?.id || null,
      product_name: params.product,
      yarn_count: params.yarnCount,
      cone_qty: params.conesCount,
      shade_card_included: params.shadeCard,
      courier_name: params.courier,
      tracking_number: params.trackingNo,
      workflow_stage: 'Request',
      responsible_person: 'Rashedul Islam (QA Lab)',
    });

    if (error) throw error;
    return { synced: true };
  } catch (err) {
    return {
      synced: false,
      error: err instanceof Error ? err.message : 'Supabase sample sync failed',
    };
  }
}

export async function syncEmailLogToSupabase(params: {
  trigger: string;
  recipient: string;
  subject: string;
  status: string;
  provider: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    await supabase.from('email_logs').insert({
      trigger_event: params.trigger,
      recipient_email: params.recipient,
      subject: params.subject,
      status: params.status,
      provider: params.provider,
    });
  } catch {
    // Non-blocking
  }
}

export async function saveSnapshotToSupabase(snapshot: unknown): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('platform_state_snapshots').upsert(
      {
        id: 'primary',
        payload: snapshot,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch {
    return false;
  }
}

export async function loadSnapshotFromSupabase<T>(): Promise<T | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('platform_state_snapshots')
      .select('payload')
      .eq('id', 'primary')
      .maybeSingle();
    if (error || !data?.payload) return null;
    return data.payload as T;
  } catch {
    return null;
  }
}

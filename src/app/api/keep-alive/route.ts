import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // A cheap read to keep Supabase awake. Any request (query, RPC, auth) resets the idle timer.
  const { error } = await supabase
    .from('expenses')
    .select('id')
    .limit(1)
    .single();

  if (error) console.warn('[keep-alive] query error:', error);

  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}

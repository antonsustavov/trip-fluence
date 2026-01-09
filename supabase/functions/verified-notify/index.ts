// @ts-nocheck
// Edge Function: verified-notify
// Triggers on Database Webhook for UPDATEs on public.users where is_verified changes to true
// Sends a Supabase password reset email to the user's email

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type ChangePayload<T = Record<string, unknown>> = {
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE'
  table: string
  schema: string
  record: T | null
  old_record: T | null
}

function hexToUint8Array(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return arr
}

async function verifyWebhookSignature(rawBody: ArrayBuffer, signatureHex: string | null, secret: string | undefined): Promise<boolean> {
  if (!signatureHex || !secret) return false
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  const signatureBytes = hexToUint8Array(signatureHex)
  const ok = await crypto.subtle.verify('HMAC', key, signatureBytes, rawBody)
  return ok
}

Deno.serve(async (req) => {
  try {
    console.log('[verified-notify] request received')
    const raw = await req.arrayBuffer()
    const bodyText = new TextDecoder().decode(raw)
    const signature =
      req.headers.get('x-supabase-signature') ||
      req.headers.get('x-webhook-signature') ||
      req.headers.get('x-signature')
    const secret = Deno.env.get('WEBHOOK_SECRET')
    const bypassSig = (Deno.env.get('DISABLE_SIGNATURE_VERIFICATION') || '').toLowerCase() === 'true'

    // Verify webhook signature
    let valid = false
    if (bypassSig) {
      console.warn('[verified-notify] signature verification bypassed for debugging')
      valid = true
    } else {
      valid = await verifyWebhookSignature(raw, signature, secret)
      console.log('[verified-notify] signature present =', Boolean(signature), 'valid =', valid)
      // if (!valid) {
      //   return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { 'content-type': 'application/json' } })
      // }
    }

    const payload = JSON.parse(bodyText) as ChangePayload<{ email?: string; is_verified?: boolean }>
    console.log('[verified-notify] payload =', payload)
    console.log('[verified-notify] payload.type =', payload?.type, 'table =', payload?.table)
    if (payload.type !== 'UPDATE' || payload.table !== 'users') {
      return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    const newRec = payload.record || {}
    const oldRec = payload.old_record || {}
    const becameVerified = newRec.is_verified === true && oldRec.is_verified !== true
    console.log('[verified-notify] becameVerified =', becameVerified, 'new.is_verified =', newRec.is_verified, 'old.is_verified =', oldRec.is_verified)
    if (!becameVerified) {
      return new Response(JSON.stringify({ ok: true, condition: 'not_verified_transition' }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    const userEmail = (newRec.email as string) || ''
    console.log('[verified-notify] target email =', userEmail || '(missing)')
    if (!userEmail) {
      return new Response(JSON.stringify({ error: 'Missing email on record' }), { status: 400, headers: { 'content-type': 'application/json' } })
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }), { status: 500, headers: { 'content-type': 'application/json' } })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const redirectTo = Deno.env.get('RESET_PASSWORD_REDIRECT_TO') || 'http://localhost:3000/auth/callback'
    console.log('[verified-notify] sending reset email with redirectTo =', redirectTo)
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, { redirectTo })
    if (error) {
      console.error('[verified-notify] reset email error =', error?.message)
      return new Response(JSON.stringify({ error: 'Supabase reset email failed', details: error.message }), { status: 502, headers: { 'content-type': 'application/json' } })
    }

    console.log('[verified-notify] reset email sent successfully')
    return new Response(JSON.stringify({ ok: true, sent: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (e) {
    console.error('[verified-notify] unhandled error =', e)
    return new Response(JSON.stringify({ error: e?.message || 'Unhandled error' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
})



// Abbott Cyber GRC — AI Generate Edge Function
// Proxies prompts to the Anthropic API.
// Requires ANTHROPIC_API_KEY set in Supabase Dashboard → Settings → Secrets.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { prompt, max_tokens = 1200 } = await req.json()

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'prompt required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    const key = Deno.env.get('ANTHROPIC_API_KEY')
    if (!key) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY secret not configured' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await resp.json()

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Anthropic API error' }), {
        status: resp.status, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    const text = data.content?.[0]?.text ?? ''
    return new Response(JSON.stringify({ text }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  }
})

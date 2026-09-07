import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '';
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const requiredFields = {
  estimate: ['name', 'email', 'vehicle', 'category', 'preferredContact', 'safeToDrive', 'description'],
  appointment: ['name', 'phone', 'vehicle', 'date', 'timeWindow', 'service']
};

const estimateCategories = new Set(['Mechanical', 'Body or collision', 'Not sure']);
const preferredContactMethods = new Set(['Phone', 'Email']);
const driveSafetyResponses = new Set(['Yes', 'No', 'Not sure']);
const appointmentTimeWindows = new Set(['Morning', 'Afternoon', 'Either']);

function response(body: Record<string, string>, status: number, origin: string) {
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin'
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return Response.json(body, {
    status,
    headers
  });
}

async function fingerprint(request: Request) {
  const source = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? '';
  const permittedOrigin = allowedOrigin && origin === allowedOrigin ? origin : '';

  if (request.method === 'OPTIONS') {
    return permittedOrigin ? response({}, 204, permittedOrigin) : response({ error: 'Forbidden' }, 403, '');
  }

  if (request.method !== 'POST' || !permittedOrigin) {
    return response({ error: 'Forbidden' }, 403, '');
  }

  try {
    const body = await request.json();
    const requestType = body?.requestType;
    const fields = body?.fields;
    const required = requiredFields[requestType as keyof typeof requiredFields];

    if (!required || !fields || typeof fields !== 'object' || fields.website) {
      return response({ error: 'Invalid request' }, 400, permittedOrigin);
    }

    const cleanFields = Object.fromEntries(
      Object.entries(fields)
        .filter(([key]) => key !== 'website')
        .map(([key, value]) => [key, typeof value === 'string' ? value.trim().slice(0, 2000) : ''])
    );

    if (required.some((field) => !cleanFields[field])) {
      return response({ error: 'Required information is missing' }, 400, permittedOrigin);
    }

    if (
      requestType === 'estimate' && (
        !/^\S+@\S+\.\S+$/.test(cleanFields.email) ||
        !estimateCategories.has(cleanFields.category) ||
        !preferredContactMethods.has(cleanFields.preferredContact) ||
        !driveSafetyResponses.has(cleanFields.safeToDrive)
      )
    ) {
      return response({ error: 'Invalid estimate request' }, 400, permittedOrigin);
    }

    if (
      requestType === 'appointment' && (
        !appointmentTimeWindows.has(cleanFields.timeWindow) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(cleanFields.date) ||
        cleanFields.date < new Date().toISOString().slice(0, 10)
      )
    ) {
      return response({ error: 'Invalid appointment request' }, 400, permittedOrigin);
    }

    const { error } = await supabase.rpc('submit_service_request', {
      p_request_type: requestType,
      p_fields: cleanFields,
      p_client_fingerprint: await fingerprint(request)
    });

    if (error) {
      console.error('Request submission failed', error.message);
      if (error.message.includes('duplicate request')) {
        return response({ error: 'Duplicate request' }, 409, permittedOrigin);
      }
      return response({ error: 'Unable to submit request' }, 503, permittedOrigin);
    }

    return response({ status: 'accepted' }, 202, permittedOrigin);
  } catch {
    return response({ error: 'Invalid request' }, 400, permittedOrigin);
  }
});
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { consentError, phoneError } from '../../lib/validation'
import { POLITICA_VERSION } from '../../lib/privacy'

// Tabla quiz_results. Solo se accede desde acá con la service role;
// la clave anónima no tiene permisos sobre ella.

const MAX_SCORE = 180
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

// Guarda el resultado del quiz y devuelve el id de la fila
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Faltan variables de entorno de Supabase')
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
    }

    const { score, answers } = await req.json()

    const validAnswers =
      Array.isArray(answers) &&
      answers.length <= 5 &&
      answers.every(a => typeof a === 'string' && a.length <= 300)
    if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE || !validAnswers) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .insert([{
        score,
        q1: answers[0] ?? null,
        q2: answers[1] ?? null,
        q3: answers[2] ?? null,
        q4: answers[3] ?? null,
        q5: answers[4] ?? null,
      }])
      .select('id')
      .single()

    if (error) {
      console.error('Error guardando quiz en Supabase:', error)
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('Error en submit-quiz POST:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// Agrega WhatsApp y consentimiento a UNA fila, identificada por id
export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Faltan variables de entorno de Supabase')
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
    }

    const { id, telefono, consentimiento } = await req.json()

    if (typeof id !== 'string' || !UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
    const validationError = phoneError(telefono) || consentError(consentimiento)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // .is('whatsapp', null): una fila que ya tiene número no se sobrescribe
    const { data, error } = await supabase
      .from('quiz_results')
      .update({
        whatsapp: telefono.trim(),
        consentimiento: true,
        consentimiento_fecha: new Date().toISOString(),
        politica_version: POLITICA_VERSION,
      })
      .eq('id', id)
      .is('whatsapp', null)
      .select('id')

    if (error) {
      console.error('Error actualizando quiz en Supabase:', error)
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 })
    }
    if (!data?.length) {
      return NextResponse.json({ error: 'Resultado no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-quiz PATCH:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

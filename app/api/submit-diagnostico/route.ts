import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ACTIVEPIECES_WEBHOOK = 'https://cloud.activepieces.com/api/v1/webhooks/hnOyI74mg97pmuw3IIIC2'

async function sendToActivepieces(answers: Record<string, unknown>) {
  try {
    await fetch(ACTIVEPIECES_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: answers['nombre'] || '-',
        email: answers['email'] || '-',
        telefono: answers['telefono'] || '-',
        empresa: answers['empresa'] || '-',
        situacion: answers['situacion'] || '-',
        tarea: answers['tarea'] || '-',
        cliente: answers['cliente'] || '-',
        respuesta_fds: answers['respuesta_fds'] || '-',
        sentimiento: answers['sentimiento'] || '-',
        prioridad: answers['prioridad'] || '-',
        comentario: answers['comentario'] || '-',
      }),
    })
  } catch (err) {
    console.error('Error enviando a ActivePieces:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Faltan variables de entorno de Supabase')
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ error: 'No se recibieron respuestas' }, { status: 400 })
    }

    const { error } = await supabase.from('diagnosticos_express').insert([
      {
        nombre: answers['nombre'] || null,
        email: answers['email'] || null,
        telefono: answers['telefono'] || null,
        empresa: answers['empresa'] || null,
        situacion: answers['situacion'] || null,
        tarea: answers['tarea'] || null,
        cliente: answers['cliente'] || null,
        respuesta_fds: answers['respuesta_fds'] || null,
        sentimiento: answers['sentimiento'] || null,
        prioridad: answers['prioridad'] || null,
        comentario: answers['comentario'] || null,
      },
    ])

    if (error) {
      console.error('Error guardando en Supabase:', error)
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 })
    }

    await sendToActivepieces(answers)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-diagnostico:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

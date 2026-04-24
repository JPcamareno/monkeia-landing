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
        rol: answers['rol'] || '-',
        tamano: answers['tamano'] || '-',
        objetivo_12m: answers['objetivo-12m'] || '-',
        area_urgente: answers['area-urgente'] || '-',
        presupuesto: answers['presupuesto-mensual'] || '-',
        plazo: answers['plazo-resultados'] || '-',
        uso_ia: answers['uso-ia-previo'] || '-',
        comentario: answers['comentario-libre'] || '-',
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

    const { error } = await supabase.from('diagnosticos').insert([
      {
        empresa: answers['empresa'] || null,
        nombre: answers['nombre'] || null,
        email: answers['email'] || null,
        telefono: answers['telefono'] || null,
        rol: answers['rol'] || null,
        tamano: answers['tamano'] || null,
        canales: answers['canales'] || null,
        skus: answers['skus'] || null,
        sistemas: answers['sistemas'] || null,
        tiempo_respuesta: answers['tiempo-respuesta'] || null,
        inventario: answers['inventario'] || null,
        tareas_repetitivas: answers['tareas-repetitivas'] || null,
        objetivo_12m: answers['objetivo-12m'] || null,
        area_urgente: answers['area-urgente'] || null,
        satisfaccion_respuesta: answers['satisfaccion-respuesta'] || null,
        pct_repetidas: answers['pct-repetidas'] || null,
        uso_ia_previo: answers['uso-ia-previo'] || null,
        actitud_tecnologia: answers['actitud-tecnologia'] || null,
        documentacion: answers['documentacion'] || null,
        datos_historicos: answers['datos-historicos'] || null,
        presupuesto_mensual: answers['presupuesto-mensual'] || null,
        decision_maker: answers['decision-maker'] || null,
        plazo_resultados: answers['plazo-resultados'] || null,
        comentario_libre: answers['comentario-libre'] || null,
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

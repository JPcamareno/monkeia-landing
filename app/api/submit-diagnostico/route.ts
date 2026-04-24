import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MANYCHAT_TOKEN = process.env.MANYCHAT_API_TOKEN!
const WHATSAPP_NUMBER = process.env.NOTIFICATION_WHATSAPP!

async function sendWhatsAppNotification(answers: Record<string, unknown>) {
  const empresa = (answers['empresa'] as string) || 'Sin nombre'
  const rol = (answers['rol'] as string) || '-'
  const tamano = (answers['tamano'] as string) || '-'
  const areaUrgente = (answers['area-urgente'] as string) || '-'
  const presupuesto = (answers['presupuesto-mensual'] as string) || '-'
  const plazo = (answers['plazo-resultados'] as string) || '-'
  const objetivo = (answers['objetivo-12m'] as string) || '-'
  const usoIa = (answers['uso-ia-previo'] as string) || '-'
  const comentario = (answers['comentario-libre'] as string) || '-'

  const message = `🔔 *Nuevo diagnóstico IA completado*

🏢 *Empresa:* ${empresa}
👤 *Rol:* ${rol}
👥 *Tamaño:* ${tamano}
🎯 *Objetivo 12m:* ${objetivo}
🚨 *Área urgente:* ${areaUrgente}
💰 *Presupuesto:* ${presupuesto}
⏱ *Plazo esperado:* ${plazo}
🤖 *Experiencia con IA:* ${usoIa}
💬 *Comentario:* ${comentario}

Ver todos los datos en Supabase → diagnosticos`

  try {
    // Buscar o crear el subscriber en ManyChat por número de WhatsApp
    const findRes = await fetch('https://api.manychat.com/fb/subscriber/findByPhone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANYCHAT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: `+${WHATSAPP_NUMBER}` }),
    })

    const findData = await findRes.json()
    const subscriberId = findData?.data?.id

    if (!subscriberId) {
      console.error('No se encontró el subscriber en ManyChat:', findData)
      return
    }

    // Enviar mensaje por WhatsApp vía ManyChat
    await fetch('https://api.manychat.com/fb/sending/sendContent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANYCHAT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        data: {
          version: 'v2',
          content: {
            messages: [
              {
                type: 'text',
                text: message,
              },
            ],
          },
        },
        message_tag: 'ACCOUNT_UPDATE',
      }),
    })
  } catch (err) {
    console.error('Error enviando WhatsApp:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ error: 'No se recibieron respuestas' }, { status: 400 })
    }

    // Guardar en Supabase
    const { error } = await supabase.from('diagnosticos').insert([
      {
        empresa: answers['empresa'] || null,
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

    // Enviar notificación por WhatsApp
    await sendWhatsAppNotification(answers)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-diagnostico:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

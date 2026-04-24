import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

async function sendWhatsAppNotification(answers: Record<string, unknown>) {
  const token = process.env.MANYCHAT_API_TOKEN
  const whatsapp = process.env.NOTIFICATION_WHATSAPP

  if (!token || !whatsapp) {
    console.error('Faltan variables de entorno de ManyChat')
    return
  }

  const empresa = (answers['empresa'] as string) || 'Sin nombre'
  const nombre = (answers['nombre'] as string) || '-'
  const email = (answers['email'] as string) || '-'
  const telefono = (answers['telefono'] as string) || '-'
  const rol = (answers['rol'] as string) || '-'
  const tamano = (answers['tamano'] as string) || '-'
  const areaUrgente = (answers['area-urgente'] as string) || '-'
  const presupuesto = (answers['presupuesto-mensual'] as string) || '-'
  const plazo = (answers['plazo-resultados'] as string) || '-'
  const objetivo = (answers['objetivo-12m'] as string) || '-'
  const usoIa = (answers['uso-ia-previo'] as string) || '-'
  const comentario = (answers['comentario-libre'] as string) || '-'

  const message = `🔔 *Nuevo diagnóstico IA completado*

👤 *Contacto:* ${nombre}
📧 *Email:* ${email}
📱 *Teléfono:* ${telefono}
🏢 *Empresa:* ${empresa}
💼 *Rol:* ${rol}
👥 *Tamaño:* ${tamano}
🎯 *Objetivo 12m:* ${objetivo}
🚨 *Área urgente:* ${areaUrgente}
💰 *Presupuesto:* ${presupuesto}
⏱ *Plazo esperado:* ${plazo}
🤖 *Experiencia IA:* ${usoIa}
💬 *Comentario:* ${comentario}`

  try {
    const findRes = await fetch('https://api.manychat.com/fb/subscriber/findByPhone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: `+${whatsapp}` }),
    })

    const findData = await findRes.json()
    const subscriberId = findData?.data?.id

    if (!subscriberId) {
      console.error('No se encontró el subscriber en ManyChat:', findData)
      return
    }

    await fetch('https://api.manychat.com/fb/sending/sendContent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        data: {
          version: 'v2',
          content: {
            messages: [{ type: 'text', text: message }],
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

    await sendWhatsAppNotification(answers)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-diagnostico:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

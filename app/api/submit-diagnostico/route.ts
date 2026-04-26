import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ACTIVEPIECES_WEBHOOK = 'https://cloud.activepieces.com/api/v1/webhooks/hnOyI74mg97pmuw3IIIC2'

async function generarDiagnostico(answers: Record<string, unknown>): Promise<string> {
  const prompt = `Eres un consultor experto en transformación digital e inteligencia artificial para empresas. 
Basándote en las siguientes respuestas de un cuestionario de diagnóstico, genera un borrador de diagnóstico profesional en español.

RESPUESTAS DEL FORMULARIO:
- Empresa: ${answers['empresa'] || '-'}
- Nombre del contacto: ${answers['nombre'] || '-'}
- Situación más familiar: ${answers['situacion'] || '-'}
- Tarea que más tiempo consume: ${answers['tarea'] || '-'}
- Tipo de cliente promedio: ${answers['cliente'] || '-'}
- Respuesta fuera de horario: ${answers['respuesta_fds'] || '-'}
- Sentimiento del equipo: ${answers['sentimiento'] || '-'}
- Prioridad de mejora: ${answers['prioridad'] || '-'}
- Comentario adicional: ${answers['comentario'] || '-'}

Genera un diagnóstico con esta estructura exacta:

## Diagnóstico IA Express — ${answers['empresa'] || 'Tu empresa'}

**Nivel de madurez digital:** [Básico / Intermedio / Avanzado]

### Las 2 áreas donde la IA puede generar más retorno:

**Área 1: [Nombre del área]**
[2-3 oraciones explicando el problema identificado y cómo la IA lo resuelve específicamente para esta empresa]

**Área 2: [Nombre del área]**
[2-3 oraciones explicando el problema identificado y cómo la IA lo resuelve específicamente para esta empresa]

### Solución recomendada:
[2-3 oraciones con una recomendación concreta y accionable]

### Próximos pasos sugeridos:
1. [Paso concreto 1]
2. [Paso concreto 2]
3. [Paso concreto 3]

---
*Este diagnóstico fue generado automáticamente y requiere revisión del equipo Monkeia antes de enviarse al cliente.*`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  return data.content?.[0]?.text || 'Error generando diagnóstico'
}

async function sendToActivepieces(answers: Record<string, unknown>, diagnostico: string) {
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
        diagnostico_borrador: diagnostico,
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

    // Guardar en Supabase
    const { error } = await supabase.from('diagnosticos_express').insert([{
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
    }])

    if (error) {
      console.error('Error guardando en Supabase:', error)
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 })
    }

    // Generar diagnóstico con Claude Haiku 4.5
    const diagnostico = await generarDiagnostico(answers)

    // Enviar a ActivePieces con el borrador incluido
    await sendToActivepieces(answers, diagnostico)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-diagnostico:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

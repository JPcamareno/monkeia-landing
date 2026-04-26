import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ACTIVEPIECES_WEBHOOK = 'https://cloud.activepieces.com/api/v1/webhooks/hnOyI74mg97pmuw3IIIC2'

async function generarDiagnostico(answers: Record<string, unknown>): Promise<string> {
  const ecosistema = Array.isArray(answers['ecosistema']) ? (answers['ecosistema'] as string[]).join(', ') : answers['ecosistema']

  const prompt = `Eres un consultor experto en automatización IA para negocios B2C, e-commerce, restaurantes, academias, estéticas, clínicas, inmobiliarias, coaches e influencers.

Basándote en las respuestas de este diagnóstico, genera un informe personalizado y accionable en español. Habla directamente al dueño del negocio, en tono cercano pero profesional. Sé específico con su nicho.

DATOS DEL NEGOCIO:
- Nombre: ${answers['nombre'] || '-'}
- Negocio: ${answers['empresa'] || '-'}
- Nicho: ${answers['nicho'] || '-'}
- Mayor dolor: ${answers['dolor'] || '-'}
- Atención actual: ${answers['atencion_actual'] || '-'}
- Volumen de mensajes/semana: ${answers['volumen'] || '-'}
- Ecosistema actual: ${ecosistema || '-'}
- Resultado deseado: ${answers['resultado'] || '-'}
- Presupuesto mensual: ${answers['presupuesto'] || '-'}

Genera el diagnóstico con esta estructura:

## Diagnóstico IA — ${answers['empresa'] || 'Tu negocio'}
**Nicho:** ${answers['nicho'] || '-'}

**Nivel de madurez digital:** [Básico / Intermedio / Avanzado]

### Las 2 áreas donde la IA puede transformar tu negocio:

**Área 1: [Nombre específico del área]**
[2-3 oraciones concretas sobre el problema identificado y cómo la IA lo resuelve para este nicho específico. Menciona herramientas o flujos concretos.]

**Área 2: [Nombre específico del área]**
[2-3 oraciones concretas sobre el problema identificado y cómo la IA lo resuelve para este nicho específico. Menciona herramientas o flujos concretos.]

### Solución recomendada para ${answers['nicho'] || 'tu negocio'}:
[2-3 oraciones con una recomendación concreta, realista y alineada al presupuesto indicado]

### Próximos pasos:
1. [Acción concreta semana 1]
2. [Acción concreta semana 2-3]
3. [Resultado esperado en 30-60 días]

---
*Diagnóstico generado automáticamente — requiere revisión del equipo Monkeia antes de enviarse al cliente.*`

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
  const ecosistema = Array.isArray(answers['ecosistema']) ? (answers['ecosistema'] as string[]).join(', ') : answers['ecosistema']
  try {
    await fetch(ACTIVEPIECES_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: answers['nombre'] || '-',
        email: answers['email'] || '-',
        telefono: answers['telefono'] || '-',
        empresa: answers['empresa'] || '-',
        nicho: answers['nicho'] || '-',
        dolor: answers['dolor'] || '-',
        atencion_actual: answers['atencion_actual'] || '-',
        volumen: answers['volumen'] || '-',
        ecosistema: ecosistema || '-',
        resultado: answers['resultado'] || '-',
        presupuesto: answers['presupuesto'] || '-',
        diagnostico_borrador: diagnostico,
        formulario: 'B2C',
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
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ error: 'No se recibieron respuestas' }, { status: 400 })
    }

    const { error } = await supabase.from('diagnosticos_b2c').insert([{
      nombre: answers['nombre'] || null,
      email: answers['email'] || null,
      telefono: answers['telefono'] || null,
      empresa: answers['empresa'] || null,
      nicho: answers['nicho'] || null,
      dolor: answers['dolor'] || null,
      atencion_actual: answers['atencion_actual'] || null,
      volumen: answers['volumen'] || null,
      ecosistema: Array.isArray(answers['ecosistema']) ? answers['ecosistema'] : null,
      resultado: answers['resultado'] || null,
      presupuesto: answers['presupuesto'] || null,
    }])

    if (error) {
      console.error('Error guardando en Supabase:', error)
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 })
    }

    const diagnostico = await generarDiagnostico(answers)
    await sendToActivepieces(answers, diagnostico)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en submit-diagnostico-b2c:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

type Answers = Record<string, string | string[]>

type Question = {
  field: string
  label: string
  type: string
  hint?: string
  placeholder?: string
  options?: string[]
}

const SECTIONS: { id: string; num: string; title: string; questions: Question[] }[] = [
  {
    id: 'sec-0',
    num: 'SECCIÓN 01 · TUS DATOS',
    title: 'Primero, cuéntanos quién eres',
    questions: [
      {
        field: 'nombre',
        label: '¿Cuál es tu nombre?',
        type: 'text',
        placeholder: 'Tu nombre completo',
      },
      {
        field: 'email',
        label: '¿Cuál es tu email?',
        type: 'text',
        placeholder: 'tu@empresa.com',
      },
      {
        field: 'telefono',
        label: '¿Cuál es tu WhatsApp o teléfono?',
        type: 'text',
        placeholder: '+506 8888 8888',
      },
      {
        field: 'empresa',
        label: '¿Cómo se llama tu empresa?',
        type: 'text',
        placeholder: 'Nombre de la empresa',
      },
      {
        field: 'rol',
        label: '¿Cuál es tu rol en la empresa?',
        type: 'single',
        options: ['Gerente / Dueño', 'Gerente comercial', 'Jefe de operaciones', 'Responsable TI', 'Otro'],
      },
      {
        field: 'tamano',
        label: '¿Cuántas personas trabajan en la empresa?',
        type: 'single',
        options: ['1–5', '6–15', '16–30', 'Más de 30'],
      },
    ],
  },
  {
    id: 'sec-1',
    num: 'SECCIÓN 02 · CANALES Y PRODUCTOS',
    title: '¿Cómo vendes y qué vendes?',
    questions: [
      {
        field: 'canales',
        label: '¿Cuáles son los principales canales de venta hoy?',
        hint: 'Puedes seleccionar más de uno',
        type: 'multi',
        options: ['Tienda online (web)', 'WhatsApp / teléfono', 'Vendedor presencial', 'Correo electrónico', 'Distribuidores / mayoristas'],
      },
      {
        field: 'skus',
        label: '¿Cuántos productos o servicios manejan aproximadamente?',
        type: 'single',
        options: ['Menos de 50', '50–200', '200–1.000', 'Más de 1.000', 'No lo sé con exactitud'],
      },
    ],
  },
  {
    id: 'sec-2',
    num: 'SECCIÓN 03 · OPERACIONES Y PROCESOS',
    title: '¿Cómo funciona hoy la operación?',
    questions: [
      {
        field: 'sistemas',
        label: '¿Qué sistemas o herramientas digitales utilizan actualmente?',
        hint: 'Puedes seleccionar más de uno',
        type: 'multi',
        options: ['ERP (SAP, Defontana, etc.)', 'CRM (HubSpot, Pipedrive, etc.)', 'WooCommerce / Shopify / Mercado Libre', 'Excel / Google Sheets', 'WhatsApp Business', 'Ninguno formal'],
      },
      {
        field: 'tiempo-respuesta',
        label: '¿Cuánto tiempo demora en promedio atender una consulta de cliente?',
        type: 'single',
        options: ['Menos de 1 hora', '1–4 horas', '4–24 horas', 'Más de 24 horas'],
      },
      {
        field: 'inventario',
        label: '¿Cómo manejan actualmente el inventario o los recursos?',
        type: 'single-col',
        options: ['Sistema automatizado con alertas', 'Revisión manual periódica (semanal/mensual)', 'Reaccionamos cuando hay problemas', 'Depende del proveedor o de la experiencia del equipo'],
      },
      {
        field: 'tareas-repetitivas',
        label: '¿Qué tareas consumen más tiempo innecesario a tu equipo hoy?',
        hint: 'Puedes seleccionar más de uno',
        type: 'multi',
        options: ['Responder consultas repetidas', 'Generar cotizaciones manualmente', 'Actualizar catálogo o base de datos', 'Seguimiento de órdenes o clientes', 'Reportes y análisis de ventas', 'Coordinación interna de tareas'],
      },
    ],
  },
  {
    id: 'sec-3',
    num: 'SECCIÓN 04 · PRIORIDADES Y EXPERIENCIA IA',
    title: '¿Dónde quieren crecer y qué han explorado?',
    questions: [
      {
        field: 'objetivo-12m',
        label: '¿Cuál es el principal objetivo de la empresa para los próximos 12 meses?',
        type: 'single-col',
        options: ['Aumentar ventas online', 'Mejorar la atención y retención de clientes', 'Escalar el equipo sin perder eficiencia', 'Expandirse a nuevas regiones o segmentos', 'Reducir costos operativos y mejorar márgenes'],
      },
      {
        field: 'area-urgente',
        label: '¿Qué área de la empresa tiene mayor urgencia de mejora?',
        type: 'single-col',
        options: ['Ventas y adquisición de clientes', 'Soporte técnico y atención al cliente', 'Logística e inventario', 'Marketing y visibilidad digital', 'Administración y finanzas', 'Gestión del conocimiento interno'],
      },
      {
        field: 'pct-repetidas',
        label: '¿Qué porcentaje de las consultas de clientes son preguntas repetidas?',
        type: 'single',
        options: ['Menos del 20%', '20–40%', '40–60%', 'Más del 60%', 'No lo hemos medido'],
      },
      {
        field: 'uso-ia-previo',
        label: '¿Han usado alguna herramienta de inteligencia artificial en la empresa?',
        type: 'single-col',
        options: ['Sí, ya tenemos soluciones IA en producción', 'Sí, hemos hecho pruebas puntuales (ChatGPT, etc.)', 'Hemos explorado el tema pero no hemos implementado nada', 'No hemos tocado el tema aún'],
      },
      {
        field: 'actitud-tecnologia',
        label: '¿Cuál es la actitud general del equipo frente a adoptar nuevas tecnologías?',
        type: 'single-col',
        options: ['Muy abiertos — siempre buscamos mejorar con tecnología', 'Abiertos si ven resultados concretos primero', 'Hay resistencia — prefieren los procesos actuales', 'Depende del área — hay de todo'],
      },
      {
        field: 'datos-historicos',
        label: '¿Tienen datos históricos de ventas, clientes o actividad disponibles?',
        type: 'single-col',
        options: ['Sí, en un sistema organizado y accesible', 'Sí, pero en archivos Excel o dispersos', 'Parcialmente — tenemos algunos datos históricos', 'No tenemos datos históricos estructurados'],
      },
    ],
  },
  {
    id: 'sec-4',
    num: 'SECCIÓN 05 · PRESUPUESTO Y DECISIÓN',
    title: 'Información para dimensionar la propuesta',
    questions: [
      {
        field: 'presupuesto-mensual',
        label: '¿Cuánto estarían dispuestos a invertir mensualmente en una solución IA?',
        type: 'single-col',
        options: ['Menos de $300 USD / mes', '$300–$800 USD / mes', '$800–$1.500 USD / mes', 'Más de $1.500 USD / mes (si el ROI está claro)', 'Aún no lo tenemos definido'],
      },
      {
        field: 'decision-maker',
        label: '¿Quién toma la decisión final de adoptar una solución como esta?',
        type: 'single',
        options: ['Yo mismo', 'Gerencia general', 'Decisión compartida', 'Dueño / directorio'],
      },
      {
        field: 'plazo-resultados',
        label: '¿En qué plazo esperarían ver resultados medibles?',
        type: 'single',
        options: ['1–2 meses', '3–6 meses', '6–12 meses', 'Más de 12 meses'],
      },
      {
        field: 'comentario-libre',
        label: '¿Hay algo específico que te gustaría que la IA resolviera en tu empresa?',
        type: 'textarea',
        placeholder: 'Escribe aquí tus comentarios o ideas adicionales...',
      },
    ],
  },
]

export default function DiagnosticoPage() {
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = SECTIONS.length

  function select(field: string, value: string, multi: boolean) {
    setAnswers(prev => {
      if (multi) {
        const arr = (prev[field] as string[]) || []
        return {
          ...prev,
          [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
        }
      }
      return { ...prev, [field]: value }
    })
  }

  function isSelected(field: string, value: string) {
    const a = answers[field]
    if (Array.isArray(a)) return a.includes(value)
    return a === value
  }

  function navNext() {
    if (cur < total - 1) {
      setCur(c => c + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  function navBack() {
    if (cur > 0) {
      setCur(c => c - 1)
      window.scrollTo(0, 0)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit-diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setDone(true)
      window.scrollTo(0, 0)
    } catch {
      setError('Hubo un error al enviar. Por favor intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const pct = ((cur + 1) / total) * 100
  const section = SECTIONS[cur]

  if (done) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-blue/10 border border-blue/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">¡Cuestionario completado!</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Gracias por tomarte el tiempo. Con esta información podemos preparar un diagnóstico preciso y una hoja de ruta IA personalizada para tu empresa.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { label: 'Nombre', val: answers['nombre'] },
              { label: 'Empresa', val: answers['empresa'] },
              { label: 'Área prioritaria', val: answers['area-urgente'] },
              { label: 'Presupuesto mensual', val: answers['presupuesto-mensual'] },
            ].filter(i => i.val).map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xs text-white/30 mb-1">{item.label}</div>
                <div className="text-sm font-medium text-white">
                  {typeof item.val === 'string' ? item.val.replace(/ \(.*?\)/g, '') : item.val}
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/50683225178?text=Acabo%20de%20completar%20el%20diagn%C3%B3stico%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Hablar con el equipo →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-xl mx-auto">

        <div className="mb-8">
          <a href="/" className="inline-block mb-6">
            <Image src="/logo.svg" alt="Monkeia" width={120} height={32} />
          </a>
          <div className="inline-block bg-blue/10 text-blue text-xs font-medium px-3 py-1 rounded-full mb-3">
            Diagnóstico IA · Monkeia
          </div>
          <h1 className="text-xl font-medium text-white mb-2">
            Cuestionario de madurez digital y oportunidades IA
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Responde este cuestionario en 10–15 minutos. Tus respuestas nos permiten identificar con precisión dónde la inteligencia artificial puede generar más impacto en tu operación.
          </p>
        </div>

        <div className="mb-8">
          <div className="text-xs text-white/30 mb-2">Sección {cur + 1} de {total}</div>
          <div className="h-[2px] bg-white/10 rounded-full">
            <div
              className="h-full bg-blue rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-6 pb-4 border-b border-white/10">
            <div className="text-xs text-white/30 font-medium tracking-widest mb-1">{section.num}</div>
            <h2 className="text-lg font-medium text-white">{section.title}</h2>
          </div>

          {section.questions.map(q => (
            <div key={q.field} className="mb-6">
              <label className="block text-sm font-medium text-white mb-2 leading-snug">{q.label}</label>
              {q.hint && <p className="text-xs text-white/40 mb-2">{q.hint}</p>}

              {q.type === 'single' && (
                <div className="flex flex-wrap gap-2">
                  {q.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => select(q.field, opt, false)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                        isSelected(q.field, opt)
                          ? 'border-blue bg-blue/10 text-blue font-medium'
                          : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'single-col' && (
                <div className="flex flex-col gap-2">
                  {q.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => select(q.field, opt, false)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                        isSelected(q.field, opt)
                          ? 'border-blue bg-blue/10 text-blue font-medium'
                          : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'multi' && (
                <div className="flex flex-wrap gap-2">
                  {q.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => select(q.field, opt, true)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                        isSelected(q.field, opt)
                          ? 'border-blue bg-blue/10 text-blue font-medium'
                          : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30 min-w-[70px]">Insatisfecho</span>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '5'].map(v => (
                      <button
                        key={v}
                        onClick={() => select(q.field, v, false)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium border transition-all ${
                          isSelected(q.field, v)
                            ? 'border-blue bg-blue/10 text-blue'
                            : 'border-white/10 text-white/50 hover:border-blue/50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/30 min-w-[70px] text-right">Satisfecho</span>
                </div>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  placeholder={q.placeholder || ''}
                  value={(answers[q.field] as string) || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors"
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  placeholder={q.placeholder || ''}
                  value={(answers[q.field] as string) || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors resize-none"
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button
            onClick={navBack}
            className={`px-5 py-2 rounded-xl text-sm border border-white/10 text-white/40 hover:bg-white/5 transition-all ${cur === 0 ? 'invisible' : ''}`}
          >
            ← Anterior
          </button>
          <button
            onClick={navNext}
            disabled={submitting}
            className="px-6 py-2 rounded-xl text-sm font-medium bg-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : cur === total - 1 ? 'Enviar cuestionario →' : 'Siguiente →'}
          </button>
        </div>

      </div>
    </div>
  )
}

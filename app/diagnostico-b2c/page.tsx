'use client'

import { useState, useEffect, useRef } from 'react'
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

const COUNTRIES = [
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'DO', dial: '+1', flag: '🇩🇴', name: 'Rep. Dominicana' },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canadá' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japón' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'Emiratos Árabes' },
]

const SECTIONS: { id: string; num: string; title: string; questions: Question[] }[] = [
  {
    id: 'sec-0',
    num: 'PASO 01',
    title: 'Primero, cuéntanos quién eres',
    questions: [
      { field: 'nombre', label: '¿Cuál es tu nombre?', type: 'text', placeholder: 'Tu nombre completo' },
      { field: 'empresa', label: '¿Cómo se llama tu negocio?', type: 'text', placeholder: 'Nombre de tu negocio o marca' },
      { field: 'email', label: '¿Cuál es tu email?', type: 'text', placeholder: 'tu@negocio.com' },
      { field: 'telefono', label: '¿Cuál es tu WhatsApp?', type: 'phone', placeholder: '8888 8888' },
    ],
  },
  {
    id: 'sec-1',
    num: 'PASO 02',
    title: '¿A qué se dedica tu negocio?',
    questions: [
      {
        field: 'nicho',
        label: '',
        type: 'single-col-other',
        options: [
          'E-commerce / tienda online',
          'Restaurante / café / food service',
          'Academia / escuela / cursos online',
          'Estética / spa / centro de bienestar',
          'Clínica / salud / veterinaria',
          'Inmobiliaria / bienes raíces',
          'Coach / consultor / agencia',
          'Creador de contenido / influencer',
          'Otro',
        ],
      },
    ],
  },
  {
    id: 'sec-2',
    num: 'PASO 03',
    title: '¿Cuál es tu mayor dolor hoy?',
    questions: [
      {
        field: 'dolor',
        label: '',
        type: 'single-col',
        options: [
          'Pierdo clientes porque no respondo rápido por WhatsApp o Instagram',
          'Me llegan muchas consultas repetidas que consumen todo mi tiempo',
          'No tengo un sistema para agendar citas o reservas automáticamente',
          'No doy seguimiento a mis leads y se me enfrían antes de comprar',
          'Mi equipo está saturado atendiendo clientes de forma manual',
          'No tengo visibilidad de qué está funcionando y qué no en mi negocio',
        ],
      },
    ],
  },
  {
    id: 'sec-3',
    num: 'PASO 04',
    title: '¿Cómo manejas hoy la atención al cliente?',
    questions: [
      {
        field: 'atencion_actual',
        label: '',
        type: 'single-col',
        options: [
          'Todo manual — yo mismo respondo por WhatsApp e Instagram',
          'Tengo alguien del equipo dedicado a responder mensajes',
          'Uso alguna herramienta pero no funciona como espero',
          'No tenemos un proceso definido, cada quien hace lo que puede',
        ],
      },
    ],
  },
  {
    id: 'sec-4',
    num: 'PASO 05',
    title: '¿Cuántos mensajes o consultas recibes por semana aproximadamente?',
    questions: [
      {
        field: 'volumen',
        label: '',
        type: 'single',
        options: ['Menos de 50', '50–200', '200–500', 'Más de 500'],
      },
    ],
  },
  {
    id: 'sec-5',
    num: 'PASO 06',
    title: '¿Qué herramientas usas hoy para gestionar tu negocio?',
    questions: [
      {
        field: 'ecosistema',
        label: '',
        hint: 'Selecciona todas las que apliquen',
        type: 'multi-other',
        options: [
          'WhatsApp Business',
          'Instagram / Facebook',
          'CRM (HubSpot, Pipedrive, etc.)',
          'Sistema de agendamiento (Calendly, etc.)',
          'Tienda online (Shopify, WooCommerce, etc.)',
          'Email marketing (Mailchimp, ActiveCampaign, etc.)',
          'Ninguna herramienta formal',
          'Otra',
        ],
      },
    ],
  },
  {
    id: 'sec-6',
    num: 'PASO 07',
    title: '¿Qué resultado te cambiaría el negocio este año?',
    questions: [
      {
        field: 'resultado',
        label: '',
        type: 'single-col',
        options: [
          'Responder al 100% de leads sin contratar más personas',
          'Aumentar mis ventas sin aumentar el presupuesto de publicidad',
          'Liberar tiempo de mi equipo para tareas de más valor',
          'Tener todo centralizado en un solo sistema que funcione solo',
          'Escalar mi negocio sin que la operación me consuma',
        ],
      },
      {
        field: 'presupuesto',
        label: '¿Cuánto estarías dispuesto a invertir mensualmente en una solución IA?',
        type: 'single-col',
        options: [
          '$400–$800 USD / mes',
          '$800–$1.500 USD / mes',
          '$1.500–$3.000 USD / mes',
          'Más de $3.000 USD / mes',
          'Aún no lo tengo definido',
        ],
      },
    ],
  },
]

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [country, setCountry] = useState(COUNTRIES.find(c => c.code === 'CR') || COUNTRIES[0])
  const [number, setNumber] = useState('')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const found = COUNTRIES.find(c => c.code === data.country_code)
        if (found) setCountry(found)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    onChange(`${country.dial}${number}`)
  }, [country, number, onChange])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  )

  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch('') }}
          className="flex items-center gap-2 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:border-blue/50 transition-colors min-w-[100px]"
        >
          <span className="text-lg">{country.flag}</span>
          <span className="text-white/60 text-xs">{country.dial}</span>
          <span className="text-white/30 ml-auto text-xs">▾</span>
        </button>
        <input
          type="tel"
          placeholder="8888 8888"
          value={number}
          onChange={e => setNumber(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#111] border border-white/10 rounded-xl z-50 overflow-hidden shadow-xl">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              placeholder="Buscar país o código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { setCountry(c); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${c.code === country.code ? 'text-blue bg-blue/5' : 'text-white/70'}`}
              >
                <span className="text-lg">{c.flag}</span>
                <span>{c.name}</span>
                <span className="ml-auto text-white/30 text-xs">{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DiagnosticoB2CPage() {
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [otherNicho, setOtherNicho] = useState('')
  const [otherEcosistema, setOtherEcosistema] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = SECTIONS.length

  function select(field: string, value: string, multi: boolean) {
    setAnswers(prev => {
      if (multi) {
        const arr = (prev[field] as string[]) || []
        return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
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
    // Merge "Otro" fields
    const finalAnswers = { ...answers }
    if (isSelected('nicho', 'Otro') && otherNicho) finalAnswers['nicho'] = `Otro: ${otherNicho}`
    const eco = (answers['ecosistema'] as string[]) || []
    if (eco.includes('Otra') && otherEcosistema) {
      finalAnswers['ecosistema'] = [...eco.filter(e => e !== 'Otra'), `Otra: ${otherEcosistema}`]
    }
    setAnswers(finalAnswers)

    if (cur < total - 1) { setCur(c => c + 1); window.scrollTo(0, 0) }
    else handleSubmit(finalAnswers)
  }

  function navBack() {
    if (cur > 0) { setCur(c => c - 1); window.scrollTo(0, 0) }
  }

  async function handleSubmit(finalAnswers: Answers) {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit-diagnostico-b2c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
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
    const nombre = (answers['nombre'] as string) || ''
    const empresa = (answers['empresa'] as string) || ''
    let score = 0
    if (answers['dolor'] && answers['dolor'] !== '') score += 20
    if (answers['atencion_actual'] === 'Todo manual — yo mismo respondo por WhatsApp e Instagram') score += 25
    if (answers['volumen'] === 'Más de 500') score += 25
    else if (answers['volumen'] === '200–500') score += 15
    if (answers['presupuesto'] === 'Más de $3.000 USD / mes') score += 30
    else if (answers['presupuesto'] === '$1.500–$3.000 USD / mes') score += 25
    else if (answers['presupuesto'] === '$800–$1.500 USD / mes') score += 15

    const nivel = score >= 70 ? 'Alto potencial IA' : score >= 40 ? 'Potencial medio IA' : 'Explorando IA'
    const nivelColor = score >= 70 ? '#3b82f6' : score >= 40 ? '#8b5cf6' : '#6b7280'
    const nivelDesc = score >= 70
      ? 'Tu negocio tiene condiciones ideales para implementar IA con resultados rápidos y medibles.'
      : score >= 40
      ? 'Hay oportunidades claras. La IA puede resolver tus cuellos de botella específicos.'
      : 'Estás en el momento ideal para explorar qué puede hacer la IA por tu negocio.'

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .fade-1 { animation: fadeUp 0.7s ease 0.1s both; }
          .fade-2 { animation: fadeUp 0.7s ease 0.3s both; }
          .fade-3 { animation: fadeUp 0.7s ease 0.5s both; }
          .fade-4 { animation: fadeUp 0.7s ease 0.7s both; }
          .fade-5 { animation: fadeUp 0.7s ease 0.9s both; }
          .fade-6 { animation: fadeUp 0.7s ease 1.1s both; }
          .dot-pulse { animation: pulse 2s ease-in-out infinite; }
          .ring-spin { animation: spin 8s linear infinite; }
        `}</style>

        <div style={{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:'400px',height:'400px',background:`radial-gradient(circle, ${nivelColor}15 0%, transparent 70%)`,pointerEvents:'none'}} />

        <div className="fade-1 flex items-center gap-2 mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-blue dot-pulse" />
          <span className="text-xs text-white/30 tracking-widest uppercase">Diagnóstico recibido</span>
        </div>

        <div className="fade-2 relative flex items-center justify-center mb-8">
          <svg width="140" height="140" viewBox="0 0 140 140" className="ring-spin" style={{position:'absolute'}}>
            <circle cx="70" cy="70" r="64" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
            <circle cx="70" cy="70" r="64" fill="none" stroke={nivelColor} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
          <div style={{width:120,height:120,borderRadius:'50%',border:`1px solid ${nivelColor}40`,background:`${nivelColor}08`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:36,fontWeight:700,color:nivelColor,lineHeight:1}}>{score}</span>
            <span style={{fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:2,marginTop:4}}>SCORE</span>
          </div>
        </div>

        <div className="fade-3 text-center mb-2">
          <span style={{fontSize:11,fontWeight:600,color:nivelColor,letterSpacing:3,textTransform:'uppercase'}}>{nivel}</span>
        </div>

        <div className="fade-3 text-center mb-3 max-w-sm">
          <h1 className="text-3xl font-semibold text-white leading-tight">
            {nombre ? `${nombre},` : ''} tu diagnóstico<br />
            <span style={{color:nivelColor}}>está en camino.</span>
          </h1>
        </div>

        <div className="fade-3 text-center mb-10 max-w-xs">
          <p className="text-white/30 text-sm leading-relaxed">{nivelDesc}</p>
        </div>

        <div className="fade-4 w-full max-w-sm h-px bg-white/5 mb-10" />

        <div className="fade-4 w-full max-w-sm mb-10">
          <p className="text-xs text-white/20 tracking-widest uppercase mb-5 text-center">Qué pasa ahora</p>
          <div className="flex flex-col gap-4">
            {[
              { n: '01', title: 'Analizamos tu negocio', desc: 'Identificamos las 2 áreas donde la IA puede generar más retorno para ti.' },
              { n: '02', title: 'Te enviamos el diagnóstico', desc: 'En menos de 24h recibes un análisis personalizado con pasos concretos.' },
              { n: '03', title: 'Hablamos si quieres profundizar', desc: 'Sin compromiso. Solo si tiene sentido para tu negocio.' },
            ].map(step => (
              <div key={step.n} className="flex gap-4 items-start">
                <span style={{fontSize:11,fontWeight:700,color:nivelColor,letterSpacing:1,minWidth:24,paddingTop:2}}>{step.n}</span>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">{step.title}</p>
                  <p className="text-white/30 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-5 text-center">
          {empresa && <p className="text-white/20 text-xs mb-4">Diagnóstico para <span className="text-white/40">{empresa}</span></p>}
          <a
            href="https://wa.me/50683225178?text=Acabo%20de%20completar%20el%20diagn%C3%B3stico%20IA%20de%20Monkeia"
            target="_blank"
            rel="noopener noreferrer"
            style={{background:nivelColor}}
            className="inline-block text-white text-sm font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Hablar con el equipo →
          </a>
          <p className="text-white/20 text-xs mt-3">Sin compromiso · Respuesta en menos de 24h</p>
        </div>

        <div className="fade-6 mt-16">
          <Image src="/logo.svg" alt="Monkeia" width={70} height={20} className="opacity-10" />
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
            Diagnóstico IA · 7 preguntas · 3 minutos
          </div>
          <h1 className="text-xl font-medium text-white mb-2">
            Descubre cómo la IA puede hacer crecer tu negocio sin trabajar más horas
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Al terminar, recibes un diagnóstico personalizado con los pasos concretos para automatizar lo que hoy te consume tiempo y dinero.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-white/30 mb-2">
            <span>{section.num}</span>
            <span>{cur + 1} de {total}</span>
          </div>
          <div className="h-[2px] bg-white/10 rounded-full">
            <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-6 pb-4 border-b border-white/10">
            <h2 className="text-lg font-medium text-white leading-snug">{section.title}</h2>
          </div>

          {section.questions.map(q => (
            <div key={q.field} className="mb-6">
              {q.label && <label className="block text-sm font-medium text-white mb-2 leading-snug">{q.label}</label>}
              {q.hint && <p className="text-xs text-white/40 mb-2">{q.hint}</p>}

              {q.type === 'single-col' && (
                <div className="flex flex-col gap-2">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => select(q.field, opt, false)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${isSelected(q.field, opt) ? 'border-blue bg-blue/10 text-blue font-medium' : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'single-col-other' && (
                <div className="flex flex-col gap-2">
                  {q.options!.map(opt => (
                    <div key={opt}>
                      <button onClick={() => select(q.field, opt, false)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${isSelected(q.field, opt) ? 'border-blue bg-blue/10 text-blue font-medium' : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'}`}>
                        {opt}
                      </button>
                      {opt === 'Otro' && isSelected(q.field, 'Otro') && (
                        <input
                          type="text"
                          placeholder="¿Cuál es tu industria?"
                          value={otherNicho}
                          onChange={e => setOtherNicho(e.target.value)}
                          className="mt-2 w-full bg-white/5 border border-blue/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'single' && (
                <div className="flex flex-wrap gap-2">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => select(q.field, opt, false)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${isSelected(q.field, opt) ? 'border-blue bg-blue/10 text-blue font-medium' : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'multi-other' && (
                <div className="flex flex-col gap-2">
                  {q.options!.map(opt => (
                    <div key={opt}>
                      <button onClick={() => select(q.field, opt, true)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${isSelected(q.field, opt) ? 'border-blue bg-blue/10 text-blue font-medium' : 'border-white/10 text-white/50 hover:border-blue/50 hover:text-blue/80'}`}>
                        {opt}
                      </button>
                      {opt === 'Otra' && isSelected(q.field, 'Otra') && (
                        <input
                          type="text"
                          placeholder="¿Qué herramienta usas?"
                          value={otherEcosistema}
                          onChange={e => setOtherEcosistema(e.target.value)}
                          className="mt-2 w-full bg-white/5 border border-blue/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'text' && (
                <input type="text" placeholder={q.placeholder || ''}
                  value={(answers[q.field] as string) || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors" />
              )}

              {q.type === 'phone' && (
                <PhoneField
                  value={(answers[q.field] as string) || ''}
                  onChange={v => setAnswers(prev => ({ ...prev, [q.field]: v }))}
                />
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button onClick={navBack}
            className={`px-5 py-2 rounded-xl text-sm border border-white/10 text-white/40 hover:bg-white/5 transition-all ${cur === 0 ? 'invisible' : ''}`}>
            ← Anterior
          </button>
          <button onClick={navNext} disabled={submitting}
            className="px-6 py-2 rounded-xl text-sm font-medium bg-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? 'Enviando...' : cur === total - 1 ? 'Enviar diagnóstico →' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

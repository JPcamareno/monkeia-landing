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
  { code: 'AF', dial: '+93', flag: '🇦🇫', name: 'Afganistán' },
  { code: 'AL', dial: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: 'AD', dial: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: 'AO', dial: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Arabia Saudita' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Argelia' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'AM', dial: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: 'AZ', dial: '+994', flag: '🇦🇿', name: 'Azerbaiyán' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'BA', dial: '+387', flag: '🇧🇦', name: 'Bosnia y Herzegovina' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: 'BG', dial: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canadá' },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'CY', dial: '+357', flag: '🇨🇾', name: 'Chipre' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'Corea del Sur' },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'HR', dial: '+385', flag: '🇭🇷', name: 'Croacia' },
  { code: 'CU', dial: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Dinamarca' },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egipto' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'Emiratos Árabes' },
  { code: 'SK', dial: '+421', flag: '🇸🇰', name: 'Eslovaquia' },
  { code: 'SI', dial: '+386', flag: '🇸🇮', name: 'Eslovenia' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: 'EE', dial: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: 'ET', dial: '+251', flag: '🇪🇹', name: 'Etiopía' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Filipinas' },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finlandia' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: 'GE', dial: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: 'GH', dial: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'GR', dial: '+30', flag: '🇬🇷', name: 'Grecia' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'HK', dial: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: 'HU', dial: '+36', flag: '🇭🇺', name: 'Hungría' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: 'IR', dial: '+98', flag: '🇮🇷', name: 'Irán' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japón' },
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'Jordania' },
  { code: 'KZ', dial: '+7', flag: '🇰🇿', name: 'Kazajistán' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenia' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'LV', dial: '+371', flag: '🇱🇻', name: 'Letonia' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Líbano' },
  { code: 'LT', dial: '+370', flag: '🇱🇹', name: 'Lituania' },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxemburgo' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malasia' },
  { code: 'MT', dial: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Marruecos' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Países Bajos' },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'Nueva Zelanda' },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistán' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Polonia' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'PR', dial: '+1', flag: '🇵🇷', name: 'Puerto Rico' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'CZ', dial: '+420', flag: '🇨🇿', name: 'República Checa' },
  { code: 'DO', dial: '+1', flag: '🇩🇴', name: 'República Dominicana' },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Rumania' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Rusia' },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'RS', dial: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapur' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'Sudáfrica' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Suecia' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Suiza' },
  { code: 'TH', dial: '+66', flag: '🇹🇭', name: 'Tailandia' },
  { code: 'TW', dial: '+886', flag: '🇹🇼', name: 'Taiwán' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turquía' },
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Ucrania' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'VN', dial: '+84', flag: '🇻🇳', name: 'Vietnam' },
]

const SECTIONS: { id: string; num: string; title: string; subtitle?: string; questions: Question[] }[] = [
  {
    id: 'sec-0',
    num: 'PASO 01',
    title: 'Primero, cuéntanos quién eres',
    questions: [
      { field: 'nombre', label: '¿Cuál es tu nombre?', type: 'text', placeholder: 'Tu nombre completo' },
      { field: 'empresa', label: '¿Cómo se llama tu empresa?', type: 'text', placeholder: 'Nombre de la empresa' },
      { field: 'email', label: '¿Cuál es tu email?', type: 'text', placeholder: 'tu@empresa.com' },
      { field: 'telefono', label: '¿Cuál es tu WhatsApp o teléfono?', type: 'phone', placeholder: '8888 8888' },
    ],
  },
  {
    id: 'sec-1',
    num: 'PASO 02',
    title: 'De estas situaciones, ¿cuál te suena más familiar esta semana?',
    questions: [
      {
        field: 'situacion', label: '', type: 'single-col',
        options: [
          'Perdimos una venta porque tardamos demasiado en responder una cotización',
          'Tuvimos que repetirle a un cliente la misma información que ya está disponible',
          'Nos quedamos sin stock de algo crítico y el cliente se fue a la competencia',
          'Mi equipo está saturado respondiendo consultas en vez de cerrar negocios grandes',
          'Sé que hay clientes que no nos compran porque no nos encuentran online',
          'Ninguna de las anteriores, vamos bien en general',
        ],
      },
    ],
  },
  {
    id: 'sec-2',
    num: 'PASO 03',
    title: '¿Cuál de estas tareas le quita más tiempo a tu equipo cada semana?',
    questions: [
      {
        field: 'tarea', label: '', type: 'single-col',
        options: [
          'Responder consultas técnicas y de cotización por WhatsApp o teléfono',
          'Buscar información o compatibilidades de productos/servicios',
          'Generar y enviar cotizaciones manualmente',
          'Hacer seguimiento de órdenes y entregas',
          'Coordinar con proveedores y revisar stock',
          'Registrar información en planillas o sistemas distintos',
        ],
      },
    ],
  },
  {
    id: 'sec-3',
    num: 'PASO 04',
    title: '¿Cuál de estos clientes describe mejor a tu cliente promedio?',
    questions: [
      {
        field: 'cliente', label: '', type: 'single-col',
        options: [
          'Empresa que compra recurrentemente en volúmenes medianos',
          'Cliente independiente o taller que compra puntualmente',
          'Empresa de gran escala con compras grandes pero poco frecuentes',
          'Cliente final que busca un producto o servicio específico',
        ],
      },
    ],
  },
  {
    id: 'sec-4',
    num: 'PASO 05',
    title: 'Cuando un cliente nuevo te contacta un sábado a las 10pm, ¿qué pasa?',
    questions: [
      {
        field: 'respuesta_fds', label: '', type: 'single-col',
        options: [
          'Le respondemos en el momento, tenemos turnos',
          'Le respondemos el lunes en la mañana',
          'A veces se nos pasa y respondemos tarde',
          'No tenemos cómo medir cuánto se nos pasa',
        ],
      },
    ],
  },
  {
    id: 'sec-5',
    num: 'PASO 06',
    title: '¿Cuál de estas frases describe mejor cómo se siente tu equipo con la operación actual?',
    questions: [
      {
        field: 'sentimiento', label: '', type: 'single-col',
        options: [
          'Funcionamos bien, pero sabemos que podríamos crecer mucho más si fuéramos más eficientes',
          'Hay áreas claras donde estamos perdiendo oportunidades por falta de tiempo o herramientas',
          'Estamos saturados, el día a día nos consume y no alcanzamos a hacer todo lo que queremos',
          'Honestamente no lo había pensado en estos términos hasta ahora',
        ],
      },
    ],
  },
  {
    id: 'sec-6',
    num: 'PASO 07',
    title: '¿Qué tan prioritario es mejorar la eficiencia operativa este año?',
    questions: [
      {
        field: 'prioridad', label: '', type: 'single-col',
        options: [
          'Es de las 3 prioridades principales del negocio',
          'Es importante pero hay otras cosas más urgentes ahora',
          'Lo tenemos en el radar pero no tiene plazo definido',
          'Recién estamos empezando a pensarlo',
        ],
      },
      {
        field: 'comentario',
        label: 'Si no hacemos nada y todo sigue igual los próximos 12 meses, ¿qué crees que pasa con tu empresa? (opcional)',
        type: 'textarea',
        placeholder: 'Máximo 2 líneas...',
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
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
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
    if (cur < total - 1) { setCur(c => c + 1); window.scrollTo(0, 0) }
    else handleSubmit()
  }

  function navBack() {
    if (cur > 0) { setCur(c => c - 1); window.scrollTo(0, 0) }
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
    const nombre = (answers['nombre'] as string) || ''
    const empresa = (answers['empresa'] as string) || ''

    // Calcular score de madurez IA
    let score = 0
    if (answers['situacion'] && answers['situacion'] !== 'Ninguna de las anteriores, vamos bien en general') score += 20
    if (answers['respuesta_fds'] === 'Le respondemos en el momento, tenemos turnos') score += 10
    else if (answers['respuesta_fds'] === 'A veces se nos pasa y respondemos tarde' || answers['respuesta_fds'] === 'No tenemos cómo medir cuánto se nos pasa') score += 25
    if (answers['sentimiento'] === 'Estamos saturados, el día a día nos consume y no alcanzamos a hacer todo lo que queremos') score += 25
    else if (answers['sentimiento'] === 'Hay áreas claras donde estamos perdiendo oportunidades por falta de tiempo o herramientas') score += 20
    if (answers['prioridad'] === 'Es de las 3 prioridades principales del negocio') score += 25
    else if (answers['prioridad'] === 'Es importante pero hay otras cosas más urgentes ahora') score += 15

    const nivel = score >= 70 ? 'Alto potencial IA' : score >= 40 ? 'Potencial medio IA' : 'Explorando IA'
    const nivelColor = score >= 70 ? '#3b82f6' : score >= 40 ? '#8b5cf6' : '#6b7280'
    const nivelDesc = score >= 70
      ? 'Tu operación tiene condiciones ideales para implementar IA con ROI rápido.'
      : score >= 40
      ? 'Hay oportunidades claras. La IA puede resolver cuellos de botella específicos.'
      : 'Estás en el momento ideal para explorar qué puede hacer la IA por tu negocio.'

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
          .fade-1 { animation: fadeUp 0.7s ease 0.1s both; }
          .fade-2 { animation: fadeUp 0.7s ease 0.3s both; }
          .fade-3 { animation: fadeUp 0.7s ease 0.5s both; }
          .fade-4 { animation: fadeUp 0.7s ease 0.7s both; }
          .fade-5 { animation: fadeUp 0.7s ease 0.9s both; }
          .fade-6 { animation: fadeUp 0.7s ease 1.1s both; }
          .dot-pulse { animation: pulse 2s ease-in-out infinite; }
          .ring-spin { animation: spin 8s linear infinite; }
        `}</style>

        {/* Background glow */}
        <div style={{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:'400px',height:'400px',background:`radial-gradient(circle, ${nivelColor}15 0%, transparent 70%)`,pointerEvents:'none'}} />

        {/* Status */}
        <div className="fade-1 flex items-center gap-2 mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-blue dot-pulse" />
          <span className="text-xs text-white/30 tracking-widest uppercase">Diagnóstico recibido</span>
        </div>

        {/* Score ring */}
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

        {/* Nivel */}
        <div className="fade-3 text-center mb-2">
          <span style={{fontSize:11,fontWeight:600,color:nivelColor,letterSpacing:3,textTransform:'uppercase'}}>{nivel}</span>
        </div>

        {/* Headline */}
        <div className="fade-3 text-center mb-3 max-w-sm">
          <h1 className="text-3xl font-semibold text-white leading-tight">
            {nombre ? `${nombre},` : ''} tu diagnóstico<br />
            <span style={{color:nivelColor}}>está en camino.</span>
          </h1>
        </div>

        <div className="fade-3 text-center mb-10 max-w-xs">
          <p className="text-white/30 text-sm leading-relaxed">{nivelDesc}</p>
        </div>

        {/* Divider */}
        <div className="fade-4 w-full max-w-sm h-px bg-white/5 mb-10" />

        {/* Próximos pasos */}
        <div className="fade-4 w-full max-w-sm mb-10">
          <p className="text-xs text-white/20 tracking-widest uppercase mb-5 text-center">Qué pasa ahora</p>
          <div className="flex flex-col gap-4">
            {[
              { n: '01', title: 'Analizamos tus respuestas', desc: 'Identificamos las 2 áreas de mayor retorno para tu operación.' },
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

        {/* CTA */}
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

        {/* Logo */}
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
            Diagnóstico IA Express · 7 preguntas · 3 minutos
          </div>
          <h1 className="text-xl font-medium text-white mb-2">
            Descubre las 2 áreas donde la IA puede generar más retorno para tu negocio
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Al terminar, recibes un diagnóstico personalizado con los siguientes pasos.
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
            {section.subtitle && <p className="text-sm text-white/40 mt-1">{section.subtitle}</p>}
          </div>

          {section.questions.map(q => (
            <div key={q.field} className="mb-6">
              {q.label && <label className="block text-sm font-medium text-white mb-2 leading-snug">{q.label}</label>}
              {q.hint && <p className="text-xs text-white/40 mb-2">{q.hint}</p>}

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

              {q.type === 'text' && (
                <input
                  type="text"
                  placeholder={q.placeholder || ''}
                  value={(answers[q.field] as string) || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors"
                />
              )}

              {q.type === 'phone' && (
                <PhoneField
                  value={(answers[q.field] as string) || ''}
                  onChange={v => setAnswers(prev => ({ ...prev, [q.field]: v }))}
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  placeholder={q.placeholder || ''}
                  value={(answers[q.field] as string) || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.field]: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue/50 transition-colors resize-none"
                />
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

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
            {submitting ? 'Enviando...' : cur === total - 1 ? 'Enviar diagnóstico →' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

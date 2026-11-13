/**
 * Alpha Nova Capital · Homepage
 * Concept: "Dalla stella polare alla guida"
 *
 * Componente unico React + Tailwind. Unica dipendenza esterna: lucide-react.
 * Logo atteso in /public/brand/ (vedi README / istruzioni di setup):
 *   - secondary-logo-light.png  → versione chiara (AV bianco) per fondi navy
 *   - secondary-logo.png        → versione originale (AV navy) per fondi chiari
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Compass,
  Handshake,
  Lock,
  Menu,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   CONFIGURAZIONE CONTENUTI
   ───────────────────────────────────────────────────────────── */

const LOGO_LIGHT = '/brand/secondary-logo-light.png'
const LOGO_DARK = '/brand/secondary-logo.png'

// Video hero (scrub con lo scroll) generato con Magnific. Se manca o non si carica,
// l'hero resta interamente in canvas (stesso concept). Desktop e senza reduced-motion.
const HERO_VIDEO = '/media/hero-scrub.mp4'
const HERO_POSTER = '/media/hero-poster.jpg'

const CONTACT = {
  email: '', // TODO cliente: indirizzo email di contatto riservato
  phone: '', // TODO cliente: telefono (facoltativo)
  address: '', // TODO cliente: sede legale / operativa
  // TODO cliente: P.IVA / C.F. / REA, es. "P.IVA 00000000000"
  piva: '',
}

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' }, // TODO cliente: URL informativa privacy
  { label: 'Cookie Policy', href: '/cookie' }, // TODO cliente: URL cookie policy
]

// Endpoint di invio del modulo.
// TODO: collegare endpoint (API route, Formspree, HubSpot Forms API, CRM…).
// Finché è vuoto il modulo simula l'invio (solo per demo): NON va in produzione così.
const FORM_ENDPOINT = ''

const NAV = [
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Approccio', href: '#approccio' },
  { label: 'Per gli imprenditori', href: '#imprenditori' },
  { label: 'Contatti', href: '#contatti' },
]

const PILLARS = [
  {
    icon: Handshake,
    title: 'Acquisizione totale o di maggioranza',
    text: "Rilevare l'intera azienda o una quota di controllo, con un interlocutore unico e un percorso chiaro. Sei tu a stabilire quanto e quando cedere.",
  },
  {
    icon: Users,
    title: 'Passaggio generazionale',
    text: "Quando in famiglia manca un successore, o non c'è accordo, offriamo una strada ordinata che protegge l'azienda e chi ci lavora.",
  },
  {
    icon: ShieldCheck,
    title: 'Continuità e valorizzazione del team',
    text: 'Le persone, i clienti e i fornitori che hanno reso solida la tua azienda restano al centro. Il valore costruito non si disperde.',
  },
  {
    icon: TrendingUp,
    title: 'Crescita e sviluppo',
    text: 'Dopo il passaggio, capitale e competenze per far crescere ciò che esiste già, senza snaturarlo e senza fretta.',
  },
]

const STEPS = [
  { title: 'Primo contatto riservato', text: 'Una conversazione a porte chiuse, senza impegno, per capire se c’è sintonia.' },
  { title: 'Conoscenza', text: 'Ascoltiamo la storia dell’azienda, i tuoi obiettivi e le tue condizioni.' },
  { title: 'Proposta', text: 'Una proposta costruita sulla tua azienda e sulle tue priorità, non su un modello.' },
  { title: 'Closing', text: 'Si definiscono insieme tempi e modalità, con trasparenza fino alla firma.' },
  { title: 'Accompagnamento', text: 'Restiamo accanto all’azienda e al team anche dopo il passaggio.' },
]

const TARGET_PROFILES = [
  'Un’azienda con una storia solida e un nome rispettato nel suo mercato',
  'Clienti fidelizzati e rapporti duraturi con fornitori e partner',
  'Un team competente, motivato e con voglia di crescere',
  'Prodotti o servizi con un’identità chiara e riconoscibile',
  'Una gestione prudente e un’attività in equilibrio economico',
  'Qualsiasi settore, in tutta Italia',
  // TODO cliente: soglie dimensionali indicative (fatturato / EBITDA) e criteri geografici da confermare
]

const VALUES = [
  { icon: Lock, title: 'Riservatezza', text: 'Dipendenti, clienti e fornitori non sanno nulla finché non lo decidi tu.' },
  { icon: Building2, title: 'Rispetto della storia', text: 'Il nome, la cultura e le relazioni dell’azienda sono un patrimonio da custodire.' },
  { icon: Compass, title: 'Visione di lungo periodo', text: 'Costruiamo valore nel tempo, senza forzare decisioni di breve termine.' },
]

const WHY_ALPHA_NOVA = [
  'Un unico interlocutore, dal primo contatto al closing',
  'Una proposta cucita sulla tua azienda e sulle tue esigenze',
  'Attenzione al dopo: team, clienti e fornitori restano al centro',
]

// TODO cliente: loghi di partner / aziende accompagnate (solo se autorizzati). Array vuoto = sezione nascosta.
const PARTNER_LOGOS = [] // [{ name: '', src: '', alt: '' }]
// TODO cliente: testimonianze reali e autorizzate. Array vuoto = sezione nascosta.
const TESTIMONIALS = [] // [{ quote: '', author: '', role: '' }]
// TODO cliente: dato da confermare (es. n. operazioni, anni di attività, capitale gestito). NON inserire cifre non verificate.

const SECTORS = [
  'Manifatturiero e industria',
  'Meccanica e automazione',
  'Alimentare e agroalimentare',
  'Moda, design e arredo',
  'Edilizia e impiantistica',
  'Commercio e distribuzione',
  'Logistica e trasporti',
  'Servizi alle imprese',
  'Sanità e benessere',
  'Tecnologia e digitale',
  'Turismo e ristorazione',
  'Altro settore',
] // TODO cliente: confermare l'elenco dei settori

const REVENUE_BANDS = [
  'Fino a 2 milioni di euro',
  'Da 2 a 5 milioni di euro',
  'Da 5 a 10 milioni di euro',
  'Da 10 a 25 milioni di euro',
  'Oltre 25 milioni di euro',
  'Preferisco non indicarlo',
] // TODO cliente: confermare le fasce di fatturato

/* ─────────────────────────────────────────────────────────────
   UTILITÀ
   ───────────────────────────────────────────────────────────── */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const win = (p, a, b, f = 0.04) => clamp(Math.min((p - a) / f, (b - p) / f))

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GOLD_GRADIENT = 'bg-gradient-to-r from-[#C2883A] to-[#C59B27] bg-clip-text text-transparent'

/* Stella a 4 punte (decorativa) */
function Spark({ className = '', size = 16 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M12 0 Q12.8 11.2 24 12 Q12.8 12.8 12 24 Q11.2 12.8 0 12 Q11.2 11.2 12 0Z" />
    </svg>
  )
}

/* Rivela al primo ingresso nel viewport */
function useInView(once = true, threshold = 0.2) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          if (once) io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, threshold])
  return [ref, seen]
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView()
  return (
    <Tag
      ref={ref}
      style={{ '--d': `${delay}ms` }}
      className={`an-rv ${seen ? 'an-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

function Eyebrow({ children, dark = false, className = '' }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] ${
        dark ? 'text-[#0A1F3C]/70' : 'text-[#C2883A]'
      } ${className}`}
    >
      <Spark size={12} className={dark ? 'text-[#C2883A]' : 'text-[#C59B27]'} />
      {children}
    </p>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO · IL VIAGGIO DELLA STELLA (canvas pilotato dallo scroll)
   ───────────────────────────────────────────────────────────── */

// Nodi della costellazione (coordinate unitarie). Il nodo 0 è la stella polare.
const NODES = [
  [0.5, 0.52],
  [0.66, 0.4],
  [0.8, 0.26],
  [0.95, 0.14],
  [0.36, 0.66],
  [0.2, 0.78],
  [0.06, 0.6],
  [0.34, 0.36],
  [0.2, 0.2],
  [0.74, 0.72],
  [0.92, 0.62],
]
// Rotta: ogni coppia è un tratto della "rotta di crescita"
const EDGES = [
  [0, 1], [1, 2], [2, 3],
  [0, 4], [4, 5], [5, 6],
  [0, 7], [7, 8],
  [0, 9], [9, 10], [1, 9],
]
// Celle della griglia (colonna 0..6, riga 0..4) in cui i nodi "atterrano"
const GRID_CELLS = [
  [3, 2], [4, 1], [5, 0], [6, 1], [2, 3], [1, 4], [0, 3], [2, 1], [1, 0], [4, 3], [5, 3],
]
const FIRST_INCOMING = NODES.map((_, i) => EDGES.findIndex(([, b]) => b === i))

function HeroJourney() {
  const sec = useRef(null)
  const cv = useRef(null)
  const vidRef = useRef(null)
  const txt = useRef(null)
  const c1 = useRef(null)
  const c2 = useRef(null)
  const c3 = useRef(null)
  const scrim = useRef(null)
  const hint = useRef(null)

  useEffect(() => {
    const section = sec.current
    const canvas = cv.current
    const ctx = canvas && canvas.getContext('2d')
    if (!section || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let mobile = false
    let stars = []
    let nodes = []
    let grid = []
    let start = { x: 0, y: 0 }
    let raf = 0
    let visible = true
    let cur = reduce ? 0.7 : 0
    const vid = vidRef.current
    let videoOn = false
    let seeking = false
    let seekAt = 0
    let blobUrl = ''
    let vKey = ''
    let last = performance.now()
    const cache = new WeakMap()

    // Scrive nel DOM solo se il valore cambia
    const setEl = (el, op, ty) => {
      if (!el) return
      const key = `${op.toFixed(3)}|${ty.toFixed(1)}`
      if (cache.get(el) === key) return
      cache.set(el, key)
      el.style.opacity = String(op)
      el.style.transform = `translate3d(0,${ty}px,0)`
      el.style.visibility = op < 0.01 ? 'hidden' : 'visible'
    }

    const build = () => {
      const rnd = mulberry32(11)
      const n = Math.round(clamp((w * h) / 8500, 60, mobile ? 110 : 210))
      stars = Array.from({ length: n }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        r: rnd() * 1.1 + 0.25,
        a: rnd() * 0.5 + 0.2,
        s: rnd() * 1.6 + 0.4,
        ph: rnd() * 6.28,
        z: rnd(),
      }))
      const rx0 = mobile ? 0.1 : 0.08
      const rx1 = mobile ? 0.9 : 0.92
      const ry0 = mobile ? 0.2 : 0.18
      const ry1 = 0.84
      nodes = NODES.map(([u, v]) => ({ x: (rx0 + (rx1 - rx0) * u) * w, y: (ry0 + (ry1 - ry0) * v) * h }))
      grid = GRID_CELLS.map(([c, r]) => ({ x: (0.04 + (0.92 * c) / 6) * w, y: (0.1 + (0.8 * r) / 4) * h }))
      start = mobile ? { x: 0.5 * w, y: 0.24 * h } : { x: 0.74 * w, y: 0.44 * h }
    }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      mobile = w < 768
      if (mobile && videoOn) {
        videoOn = false
        vid.style.display = 'none'
      }
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      draw(cur, performance.now())
      applyText(cur)
      applyVideo(cur)
    }

    // Stella a 4 punte con alone e flare
    const drawStar = (x, y, R, alpha = 1, flare = false) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, R * 5)
      g.addColorStop(0, `rgba(197,155,39,${0.5 * alpha})`)
      g.addColorStop(0.12, `rgba(197,155,39,${0.26 * alpha})`)
      g.addColorStop(0.3, `rgba(194,136,58,${0.1 * alpha})`)
      g.addColorStop(0.6, `rgba(194,136,58,${0.025 * alpha})`)
      g.addColorStop(1, 'rgba(194,136,58,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, R * 5, 0, 6.2832)
      ctx.fill()
      if (flare) {
        const L = R * 5.5
        const fx = ctx.createLinearGradient(x - L, y, x + L, y)
        fx.addColorStop(0, 'rgba(197,155,39,0)')
        fx.addColorStop(0.5, `rgba(197,155,39,${0.55 * alpha})`)
        fx.addColorStop(1, 'rgba(197,155,39,0)')
        ctx.fillStyle = fx
        ctx.fillRect(x - L, y - 0.5, L * 2, 1)
        const fy = ctx.createLinearGradient(x, y - L, x, y + L)
        fy.addColorStop(0, 'rgba(197,155,39,0)')
        fy.addColorStop(0.5, `rgba(197,155,39,${0.55 * alpha})`)
        fy.addColorStop(1, 'rgba(197,155,39,0)')
        ctx.fillStyle = fy
        ctx.fillRect(x - 0.5, y - L, 1, L * 2)
      }
      const body = ctx.createLinearGradient(x - R, y - R, x + R, y + R)
      body.addColorStop(0, '#C2883A')
      body.addColorStop(1, '#C59B27')
      ctx.globalAlpha = alpha
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.moveTo(x, y - R)
      ctx.quadraticCurveTo(x + R * 0.07, y - R * 0.07, x + R, y)
      ctx.quadraticCurveTo(x + R * 0.07, y + R * 0.07, x, y + R)
      ctx.quadraticCurveTo(x - R * 0.07, y + R * 0.07, x - R, y)
      ctx.quadraticCurveTo(x - R * 0.07, y - R * 0.07, x, y - R)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function draw(p, now) {
      const t = reduce ? 0 : now / 1000
      const V = videoOn // con il video attivo, stella e rotta arrivano dal video
      ctx.clearRect(0, 0, w, h)

      const A = ease(clamp(p / 0.25)) // avvicinamento della stella
      const q = clamp((p - 0.22) / 0.5) // disegno della rotta
      const m = ease(clamp((p - 0.74) / 0.22)) // costellazione → griglia

      const pos = nodes.map((n, i) => ({ x: lerp(n.x, grid[i].x, m), y: lerp(n.y, grid[i].y, m) }))
      const ps = { x: lerp(start.x, pos[0].x, A), y: lerp(start.y, pos[0].y, A) }

      // Frazione di disegno per ogni tratto
      const E = EDGES.length
      const frac = EDGES.map((_, k) => clamp((q - (k / E) * 0.78) / 0.22))
      const lit = nodes.map((_, i) => (i === 0 ? clamp(A * 1.2) : clamp((frac[FIRST_INCOMING[i]] - 0.85) / 0.15)))

      // Teste di disegno: "agganciano" le stelle vicine
      const heads = []
      EDGES.forEach(([a, b], k) => {
        const f = frac[k]
        if (f > 0 && f < 1) heads.push({ x: lerp(pos[a].x, pos[b].x, f), y: lerp(pos[a].y, pos[b].y, f) })
      })
      nodes.forEach((_, i) => {
        if (lit[i] > 0.9 && m < 0.5) heads.push(pos[i])
      })

      // Campo di stelle
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const y = s.y - p * h * 0.05 * s.z
        let b = 0
        for (let k = 0; k < heads.length; k++) {
          const dx = s.x - heads[k].x
          const dy = y - heads[k].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) b = Math.max(b, 1 - d / 110)
        }
        const tw = reduce ? 1 : 0.7 + 0.3 * Math.sin(t * s.s + s.ph)
        if (b > 0.02) {
          ctx.fillStyle = `rgba(232,190,100,${clamp(s.a * tw + b * 0.65)})`
          ctx.beginPath()
          ctx.arc(s.x, y, s.r * (1 + b * 0.9), 0, 6.2832)
        } else {
          ctx.fillStyle = `rgba(255,255,255,${s.a * tw})`
          ctx.beginPath()
          ctx.arc(s.x, y, s.r, 0, 6.2832)
        }
        ctx.fill()
      }

      // Griglia (arrivo)
      if (m > 0.01) {
        ctx.strokeStyle = `rgba(197,155,39,${0.16 * m})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let c = 0; c <= 6; c++) {
          const x = (0.04 + (0.92 * c) / 6) * w
          ctx.moveTo(x, 0.1 * h)
          ctx.lineTo(x, 0.9 * h)
        }
        for (let r = 0; r <= 4; r++) {
          const y = (0.1 + (0.8 * r) / 4) * h
          ctx.moveTo(0.04 * w, y)
          ctx.lineTo(0.96 * w, y)
        }
        ctx.stroke()
        ctx.fillStyle = `rgba(197,155,39,${0.4 * m})`
        for (let c = 0; c <= 6; c++) {
          for (let r = 0; r <= 4; r++) {
            ctx.beginPath()
            ctx.arc((0.04 + (0.92 * c) / 6) * w, (0.1 + (0.8 * r) / 4) * h, 1.4, 0, 6.2832)
            ctx.fill()
          }
        }
      }

      // Rotta
      const edgeAlpha = V ? 0 : 1 - clamp(m / 0.6)
      if (edgeAlpha > 0.01) {
        EDGES.forEach(([a, b], k) => {
          const f = frac[k]
          if (f <= 0) return
          const x2 = lerp(pos[a].x, pos[b].x, f)
          const y2 = lerp(pos[a].y, pos[b].y, f)
          ctx.lineCap = 'round'
          ctx.strokeStyle = `rgba(197,155,39,${0.12 * edgeAlpha})`
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(pos[a].x, pos[a].y)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          ctx.strokeStyle = `rgba(215,170,80,${0.7 * edgeAlpha})`
          ctx.lineWidth = 1
          ctx.stroke()
          if (f < 1) {
            ctx.fillStyle = `rgba(255,226,150,${0.9 * edgeAlpha})`
            ctx.beginPath()
            ctx.arc(x2, y2, 2, 0, 6.2832)
            ctx.fill()
          }
        })
      }

      // Nodi (aziende)
      for (let i = 1; i < nodes.length; i++) {
        const L = V ? lit[i] * m : lit[i]
        if (L <= 0.01) continue
        const R = (mobile ? 5 : 6.5) * L
        drawStar(pos[i].x, pos[i].y, R, L * (0.65 + 0.35 * (reduce ? 1 : 0.5 + 0.5 * Math.sin(t * 1.4 + i))), false)
        ctx.strokeStyle = `rgba(197,155,39,${0.3 * L})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(pos[i].x, pos[i].y, R * 2.2, 0, 6.2832)
        ctx.stroke()
      }

      // Stella polare
      const R = lerp(mobile ? 11 : 15, mobile ? 20 : 30, A) * (1 + 0.04 * Math.sin(t * 1.3))
      if (!V || m > 0.01) drawStar(ps.x, ps.y, R, V ? m : 1, true)
    }

    function applyVideo(p) {
      if (!videoOn) return
      const A = ease(clamp(p / 0.25))
      const m = ease(clamp((p - 0.74) / 0.22))
      const key = `${A.toFixed(3)}|${m.toFixed(3)}`
      if (key === vKey) return
      vKey = key
      // la stella del video parte a destra (come nel canvas) e si porta al centro
      const tx = (1 - A) * 0.24 * w
      const ty = lerp(-0.06, 0.023, A) * h
      vid.style.opacity = String(1 - m)
      vid.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(1.15)`
    }

    function scrubVideo(p, now) {
      if (!videoOn) return
      if (seeking && now - seekAt < 300) return
      seeking = false
      const d = vid.duration || 6
      const t = clamp(p / 0.72) * (d - 0.05)
      if (Math.abs(t - vid.currentTime) > 0.02) {
        seeking = true
        seekAt = now
        vid.currentTime = t
      }
    }

    function applyText(p) {
      if (reduce) {
        setEl(txt.current, 1, 0)
        setEl(scrim.current, 1, 0)
        return
      }
      setEl(txt.current, 1 - clamp((p - 0.07) / 0.14), -p * 80)
      setEl(hint.current, 1 - clamp(p / 0.05), 0)
      const o1 = win(p, 0.3, 0.52)
      const o2 = win(p, 0.55, 0.73)
      const o3 = clamp((p - 0.78) / 0.05)
      setEl(c1.current, o1, (1 - o1) * 16)
      setEl(c2.current, o2, (1 - o2) * 16)
      setEl(c3.current, o3, (1 - o3) * 16)
      setEl(scrim.current, Math.max(o1, o2, o3) * 0.9, 0)
    }

    const frame = (now) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const rect = section.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const target = reduce ? 0.7 : clamp(-rect.top / total)
      cur += (target - cur) * (1 - Math.pow(0.0005, dt))
      if (Math.abs(target - cur) < 0.0004) cur = target
      draw(cur, now)
      applyText(cur)
      applyVideo(cur)
      scrubVideo(cur, now)
      raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf && !reduce && visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) kick()
      },
      { rootMargin: '120px' },
    )
    io.observe(section)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', kick)

    // Carica il video come Blob (seek affidabili) solo su desktop e senza reduced-motion
    const onSeeked = () => {
      seeking = false
    }
    const onLoaded = () => {
      if (window.innerWidth < 768) return
      videoOn = true
      vKey = ''
      vid.pause()
      vid.style.display = 'block'
      draw(cur, performance.now())
      applyVideo(cur)
    }
    if (vid && !reduce && window.innerWidth >= 768) {
      vid.addEventListener('seeked', onSeeked)
      vid.addEventListener('loadeddata', onLoaded)
      fetch(HERO_VIDEO)
        .then((r) => {
          if (!r.ok) throw new Error('video')
          return r.blob()
        })
        .then((b) => {
          blobUrl = URL.createObjectURL(b)
          vid.src = blobUrl
          vid.load()
        })
        .catch(() => {})
    }
    resize()
    kick()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', kick)
      if (vid) {
        vid.removeEventListener('seeked', onSeeked)
        vid.removeEventListener('loadeddata', onLoaded)
      }
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [])

  return (
    <section
      id="top"
      ref={sec}
      aria-label="Alpha Nova Capital"
      className="relative h-[270vh] md:h-[330vh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#0F2B52_0%,#0A1F3C_48%,#06142A_100%)]">
        <video
          ref={vidRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          style={{ display: 'none' }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_42%,transparent_80%)] [mask-image:radial-gradient(ellipse_at_center,#000_42%,transparent_80%)]"
        />
        <canvas ref={cv} className="absolute inset-0 h-full w-full motion-reduce:opacity-60" aria-hidden="true" />
        <div className="an-grain pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Scrim: garantisce il contrasto dei testi sopra il campo di stelle */}
        <div
          ref={scrim}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#06142A] via-[#06142A]/70 to-transparent opacity-0 motion-reduce:opacity-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#06142A]/80 via-[#06142A]/30 to-transparent md:w-3/4"
        />

        {/* Messaggio iniziale */}
        <div ref={txt} className="absolute inset-0 flex items-end pb-28 will-change-transform md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-5 pt-24 sm:px-8">
            <Eyebrow className="mb-6">Alpha Nova Capital</Eyebrow>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.05] tracking-tight text-white md:text-7xl xl:text-8xl">
              La <span className={`font-normal ${GOLD_GRADIENT}`}>stella</span> che guida il{' '}
              <span className={`font-normal ${GOLD_GRADIENT}`}>futuro</span> della tua azienda.
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/70 md:mt-8 md:text-lg">
              Il valore che hai costruito in anni di lavoro merita continuità. Ti affianchiamo per dargli una direzione,
              nel rispetto della tua storia, del tuo team e della tua riservatezza.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row md:mt-10">
              <a
                href="#contatti"
                className="group inline-flex items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-[#C2883A] to-[#C59B27] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A1F3C] shadow-[0_0_32px_-6px_rgba(197,155,39,0.6)] transition-all duration-700 hover:shadow-[0_0_44px_-4px_rgba(197,155,39,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Parliamo in riservatezza
                <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
              <a
                href="#approccio"
                className="inline-flex items-center justify-center rounded-sm border border-white/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:border-[#C2883A] hover:text-[#C59B27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Il nostro approccio
              </a>
            </div>
          </div>
        </div>

        {/* Didascalie del viaggio */}
        {[
          [c1, '01 · Orientamento', 'Ogni azienda è una stella: una storia, un team, una direzione.'],
          [c2, '02 · Rotta', 'Le uniamo con un percorso chiaro, tracciato insieme a chi l’ha costruita.'],
        ].map(([ref, k, t]) => (
          <div
            key={k}
            ref={ref}
            aria-hidden={false}
            className="pointer-events-none absolute inset-x-0 bottom-[9%] px-5 text-center opacity-0 invisible motion-reduce:hidden md:bottom-[11%]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C2883A]">{k}</p>
            <p className="mx-auto mt-4 max-w-3xl text-2xl font-light leading-snug text-white md:text-4xl">{t}</p>
          </div>
        ))}
        <div
          ref={c3}
          className="pointer-events-none absolute inset-x-0 bottom-[9%] px-5 text-center opacity-0 invisible motion-reduce:hidden md:bottom-[11%]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C2883A]">03 · Arrivo</p>
          <p className="mx-auto mt-4 max-w-4xl text-3xl font-light leading-tight text-white md:text-5xl">
            Ogni azienda ha una <span className={`font-normal ${GOLD_GRADIENT}`}>direzione</span>.
            <br className="hidden md:block" /> Noi aiutiamo a mantenerla.
          </p>
        </div>

        {/* Indicatore di scroll */}
        <div
          ref={hint}
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 motion-reduce:hidden"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">Scorri</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/15">
            <span className="an-scroll absolute inset-x-0 top-0 h-1/2 bg-[#C59B27]" />
          </span>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STELLA GUIDA (rail sticky che accompagna fino al form)
   ───────────────────────────────────────────────────────────── */

function GuideStar() {
  const wrap = useRef(null)
  const star = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const w = wrap.current
      const s = star.current
      const anchor = document.getElementById('chi-siamo')
      if (!w || !s || !anchor) return
      const vh = window.innerHeight
      const startY = anchor.getBoundingClientRect().top + window.scrollY - vh * 0.6
      const endY = document.documentElement.scrollHeight - vh
      const p = clamp((window.scrollY - startY) / Math.max(1, endY - startY))
      w.style.opacity = window.scrollY > startY ? '1' : '0'
      s.style.transform = `translate3d(0,${p * (w.clientHeight - 20)}px,0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-24 right-1 top-24 z-40 w-5 opacity-0 transition-opacity duration-1000 md:right-5"
    >
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#C2883A]/45 to-transparent" />
      <div ref={star} className="absolute left-0 top-0 h-5 w-5 will-change-transform">
        <Spark size={20} className="an-glow text-[#C59B27]" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   HEADER
   ───────────────────────────────────────────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const link =
    'text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition-colors duration-500 hover:text-[#C59B27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-700 ${
          scrolled ? 'border-white/10 bg-[#0A1F3C]/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label="Alpha Nova Capital, torna in alto" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <img src={LOGO_LIGHT} alt="Alpha Nova Capital" width="932" height="332" className="h-11 w-auto md:h-12" />
          </a>
          <nav aria-label="Principale" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={link}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contatti"
              className="hidden items-center gap-2 rounded-sm border border-[#C2883A]/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-[#C59B27] hover:bg-[#C59B27]/10 hover:shadow-[0_0_24px_-6px_rgba(197,155,39,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:inline-flex"
            >
              <Lock size={20} strokeWidth={1.5} className="h-4 w-4" />
              Contatto riservato
            </a>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Apri il menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white transition-colors hover:border-[#C2883A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile a schermo intero */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] flex flex-col bg-[#06142A]/95 backdrop-blur-xl transition-all duration-700 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="an-grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex h-20 items-center justify-between px-5 sm:px-8">
          <img src={LOGO_LIGHT} alt="Alpha Nova Capital" width="932" height="332" className="h-11 w-auto" />
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false)
              burgerRef.current?.focus()
            }}
            aria-label="Chiudi il menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        <nav aria-label="Menu mobile" className="relative flex flex-1 flex-col justify-center gap-2 px-5 sm:px-8">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${150 + i * 80}ms` : '0ms' }}
              className={`flex items-center justify-between border-b border-white/10 py-5 text-3xl font-light text-white transition-all duration-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              {n.label}
              <ArrowRight size={24} strokeWidth={1.5} className="text-[#C2883A]" />
            </a>
          ))}
        </nav>
        <div className="relative px-5 pb-10 sm:px-8">
          <a
            href="#contatti"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-[#C2883A] to-[#C59B27] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A1F3C] shadow-[0_0_32px_-6px_rgba(197,155,39,0.6)]"
          >
            <Lock size={20} strokeWidth={1.5} /> Contatto riservato
          </a>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   CHI SIAMO + APPROCCIO (pilastri + rotta)
   ───────────────────────────────────────────────────────────── */

function Approach() {
  const [tlRef, tlSeen] = useInView(true, 0.35)

  return (
    <>
      <section id="chi-siamo" className="relative scroll-mt-20 overflow-hidden bg-[#0A1F3C] py-24 md:py-36">
        <div className="an-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="an-grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <Eyebrow className="mb-6">Chi siamo</Eyebrow>
              <h2 className="text-4xl font-light leading-[1.1] tracking-tight text-white md:text-6xl">
                Un fondo che compra aziende per <span className={`font-normal ${GOLD_GRADIENT}`}>continuarle</span>, non per smontarle.
              </h2>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-5 lg:pt-4">
              <p className="text-base font-light leading-[1.9] text-white/70 md:text-lg">
                Alpha Nova Capital acquisisce piccole e medie imprese italiane e accompagna gli imprenditori che
                desiderano cedere l’attività, in tutto o in parte, o pianificare il passaggio generazionale.
              </p>
              <p className="mt-5 text-base font-light leading-[1.9] text-white/70 md:text-lg">
                Come una stella polare, non indichiamo una strada uguale per tutti: aiutiamo ogni azienda a mantenere la
                propria direzione.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="approccio" className="relative scroll-mt-20 overflow-hidden bg-[#0A1F3C] pb-24 md:pb-36">
        <div className="an-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow className="mb-6">Il nostro approccio</Eyebrow>
            <h2 className="text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
              Quattro modi per dare <span className={`font-normal ${GOLD_GRADIENT}`}>continuità</span> a ciò che hai costruito
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal as="li" key={p.title} delay={i * 110} className="list-none">
                  <article className="group relative h-full rounded-sm border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-[#C2883A]/50 hover:bg-white/[0.08]">
                    <Spark
                      size={14}
                      className="absolute right-5 top-5 text-white/20 transition-all duration-700 group-hover:scale-150 group-hover:text-[#C59B27] group-hover:drop-shadow-[0_0_8px_rgba(197,155,39,0.9)]"
                    />
                    <Icon size={24} strokeWidth={1.5} className="text-[#C2883A] transition-colors duration-700 group-hover:text-[#C59B27]" />
                    <h3 className="mt-8 text-lg font-semibold leading-snug text-white">{p.title}</h3>
                    <p className="mt-4 text-sm font-light leading-[1.8] text-white/70">{p.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </ul>

          {/* La rotta: processo in step */}
          <div className="mt-24 md:mt-32">
            <Reveal className="max-w-2xl">
              <Eyebrow className="mb-6">La rotta</Eyebrow>
              <h3 className="text-2xl font-light leading-tight text-white md:text-4xl">
                Un percorso in cinque tappe, deciso insieme a te
              </h3>
            </Reveal>

            <div ref={tlRef} className="relative mt-14">
              {/* linea orizzontale (desktop) */}
              <div className="absolute left-[10%] right-[10%] top-[7px] hidden h-px bg-white/10 md:block" aria-hidden="true">
                <div
                  className="h-full bg-gradient-to-r from-[#C2883A] to-[#C59B27] transition-[width] duration-[2400ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ width: tlSeen ? '100%' : '0%' }}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute top-0 hidden -translate-x-1/2 transition-[left] duration-[2400ms] ease-[cubic-bezier(.22,1,.36,1)] md:block"
                style={{ left: tlSeen ? '90%' : '10%' }}
              >
                <Spark size={16} className="an-glow text-[#C59B27]" />
              </div>
              {/* linea verticale (mobile) */}
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10 md:hidden" aria-hidden="true">
                <div
                  className="w-full bg-gradient-to-b from-[#C2883A] to-[#C59B27] transition-[height] duration-[2400ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ height: tlSeen ? '100%' : '0%' }}
                />
              </div>

              <ol className="grid gap-9 md:grid-cols-5 md:gap-4">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="relative pl-10 md:pl-0 md:text-center">
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 transition-all duration-1000 md:static md:mx-auto md:flex md:w-4 md:justify-center ${
                        tlSeen ? 'text-[#C59B27] drop-shadow-[0_0_8px_rgba(197,155,39,0.8)]' : 'text-white/20'
                      }`}
                      style={{ transitionDelay: tlSeen ? `${i * 480}ms` : '0ms' }}
                    >
                      <Spark size={16} />
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C2883A] md:mt-6">
                      Tappa {String(i + 1).padStart(2, '0')}
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-white">{s.title}</h4>
                    <p className="mt-2 text-sm font-light leading-[1.7] text-white/70">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   TRUST / TARGET (fondo bianco)
   ───────────────────────────────────────────────────────────── */

function Trust() {
  return (
    <section id="imprenditori" className="relative scroll-mt-20 overflow-hidden bg-white py-24 text-[#0A1F3C] md:py-36">
      {/* costellazione decorativa */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        className="pointer-events-none absolute -right-10 top-10 hidden w-[520px] text-[#C2883A] opacity-40 lg:block"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="1">
          <path d="M40 240 L120 170 L210 190 L290 110 L360 60" />
          <path d="M120 170 L150 80 L230 40" />
          <path d="M210 190 L270 250" />
        </g>
        {[[40, 240], [120, 170], [210, 190], [290, 110], [360, 60], [150, 80], [230, 40], [270, 250]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-4xl">
          <Eyebrow dark className="mb-6">Per gli imprenditori</Eyebrow>
          <h2 className="text-4xl font-light leading-[1.1] tracking-tight md:text-6xl">
            Hai costruito qualcosa di importante.{' '}
            <span className="font-semibold">Merita la giusta direzione.</span>
          </h2>
          <span className="mt-8 block h-px w-24 bg-gradient-to-r from-[#C2883A] to-[#C59B27]" aria-hidden="true" />
          <p className="mt-8 max-w-2xl text-lg font-normal leading-[1.8] text-[#0A1F3C]/75">
            Cedere un’azienda non è una transazione come le altre: dietro ci sono anni di sacrifici, persone e relazioni.
            Per questo ti proponiamo un confronto onesto, riservato e senza pressioni.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h3 className="text-xl font-semibold">Le aziende che ci interessano</h3>
            <ul className="mt-8 divide-y divide-[#0A1F3C]/10 border-y border-[#0A1F3C]/10">
              {TARGET_PROFILES.map((t) => (
                <li key={t} className="flex items-start gap-4 py-4">
                  <Check size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#C2883A]" aria-hidden="true" />
                  <span className="text-base leading-relaxed text-[#0A1F3C]/85">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div>
            <h3 className="text-xl font-semibold">I nostri valori</h3>
            <ul className="mt-8 grid gap-4">
              {VALUES.map((v, i) => {
                const Icon = v.icon
                return (
                  <Reveal as="li" key={v.title} delay={i * 100} className="list-none">
                    <div className="flex gap-5 rounded-sm border border-[#0A1F3C]/10 p-6 transition-colors duration-700 hover:border-[#C2883A]/60">
                      <Icon size={24} strokeWidth={1.5} className="mt-1 shrink-0 text-[#C2883A]" aria-hidden="true" />
                      <div>
                        <h4 className="text-base font-semibold">{v.title}</h4>
                        <p className="mt-1 text-sm leading-[1.7] text-[#0A1F3C]/75">{v.text}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Perché Alpha Nova */}
        <Reveal className="mt-20 md:mt-28">
          <div className="relative overflow-hidden rounded-sm bg-[#0A1F3C] p-8 md:p-14">
            <div className="an-grain pointer-events-none absolute inset-0" aria-hidden="true" />
            <Spark size={220} className="pointer-events-none absolute -right-12 -top-12 text-[#C59B27]/10" />
            <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Eyebrow className="mb-6">Perché Alpha Nova</Eyebrow>
                <h3 className="text-3xl font-light leading-tight text-white md:text-4xl">
                  Un partner che si <span className={`font-normal ${GOLD_GRADIENT}`}>orienta</span> sulla tua azienda
                </h3>
              </div>
              <ul className="space-y-5 lg:col-span-7">
                {WHY_ALPHA_NOVA.map((w) => (
                  <li key={w} className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <Star size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-[#C59B27]" aria-hidden="true" />
                    <span className="text-base font-light leading-relaxed text-white/80 md:text-lg">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* TODO cliente: loghi partner / testimonianze reali. Nascosti finché gli array sono vuoti. */}
        {PARTNER_LOGOS.length > 0 && (
          <div className="mt-20">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0A1F3C]/70">Con la fiducia di</h3>
            <ul className="mt-8 grid grid-cols-2 items-center gap-8 md:grid-cols-4">
              {PARTNER_LOGOS.map((l) => (
                <li key={l.name}>
                  <img src={l.src} alt={l.alt || l.name} loading="lazy" className="mx-auto h-10 w-auto opacity-70 grayscale" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {TESTIMONIALS.length > 0 && (
          <div className="mt-20 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure key={t.author} className="rounded-sm border border-[#0A1F3C]/10 p-8">
                <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-6 text-sm text-[#0A1F3C]/75">
                  <span className="font-semibold text-[#0A1F3C]">{t.author}</span>, {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   MODULO DI CONTATTO
   ───────────────────────────────────────────────────────────── */

const EMPTY = {
  nome: '', cognome: '', azienda: '', ruolo: '', settore: '', fatturato: '',
  email: '', telefono: '', messaggio: '', privacy: false, website: '',
}

function validate(v) {
  const e = {}
  if (!v.nome.trim()) e.nome = 'Inserisci il tuo nome.'
  if (!v.cognome.trim()) e.cognome = 'Inserisci il tuo cognome.'
  if (!v.azienda.trim()) e.azienda = 'Inserisci il nome dell’azienda.'
  if (!v.ruolo.trim()) e.ruolo = 'Indica il tuo ruolo.'
  if (!v.settore) e.settore = 'Seleziona il settore.'
  if (!v.email.trim()) e.email = 'Inserisci la tua email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Controlla l’indirizzo email.'
  if (v.telefono.trim() && !/^[+()\d\s./-]{6,20}$/.test(v.telefono.trim())) e.telefono = 'Controlla il numero di telefono.'
  if (!v.privacy) e.privacy = 'Per procedere serve il tuo consenso al trattamento dei dati.'
  return e
}

// TODO: collegare endpoint. Vedi FORM_ENDPOINT in cima al file.
async function sendLead(payload) {
  if (!FORM_ENDPOINT) {
    await new Promise((r) => setTimeout(r, 1200)) // simulazione, solo demo
    return
  }
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const formRef = useRef(null)
  const doneRef = useRef(null)
  const errRef = useRef(null)

  const errors = validate(values)
  const show = (n) => (touched[n] || submitted) && errors[n]

  const onChange = useCallback((e) => {
    const { name, type, value, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
  }, [])
  const onBlur = useCallback((e) => setTouched((t) => ({ ...t, [e.target.name]: true })), [])

  useEffect(() => {
    if (status === 'success') doneRef.current?.focus()
    if (status === 'error') errRef.current?.focus()
  }, [status])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    if (values.website) return setStatus('success') // honeypot: i bot non vedono errori
    setStatus('loading')
    try {
      const { website, ...data } = values
      await sendLead({ ...data, consensoPrivacyAt: new Date().toISOString(), source: 'alphanovacapital.it/home' })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const field = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': show(name) ? 'true' : undefined,
    'aria-describedby': show(name) ? `${name}-err` : undefined,
  })
  const input =
    'w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3.5 text-base font-light text-white placeholder:text-white/40 transition-colors duration-500 focus:border-[#C59B27] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]/60 aria-[invalid=true]:border-[#E5A0A0]'
  const label = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75'
  const Err = ({ n }) =>
    show(n) ? (
      <p id={`${n}-err`} role="alert" className="mt-2 text-sm text-[#F2B8B8]">
        {errors[n]}
      </p>
    ) : null

  if (status === 'success') {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[520px] flex-col items-center justify-center rounded-sm border border-[#C2883A]/40 bg-white/5 p-10 text-center backdrop-blur-md focus:outline-none"
      >
        <Spark size={44} className="an-glow text-[#C59B27]" />
        <h3 className="mt-8 text-3xl font-light text-white">
          Grazie{values.nome ? `, ${values.nome.trim()}` : ''}.
        </h3>
        <p className="mt-4 max-w-sm text-base font-light leading-relaxed text-white/75">
          Abbiamo ricevuto la tua richiesta. La leggeremo con attenzione e ti ricontatteremo personalmente, con la
          massima riservatezza. {/* TODO cliente: eventuale tempo di risposta da confermare */}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY)
            setTouched({})
            setSubmitted(false)
            setStatus('idle')
          }}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#C59B27] underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Invia un’altra richiesta
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === 'loading'}
      className="rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-9"
    >
      {status === 'error' && (
        <div
          ref={errRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-sm border border-[#F2B8B8]/40 bg-[#F2B8B8]/10 p-4 text-sm leading-relaxed text-white focus:outline-none"
        >
          Non siamo riusciti a inviare la richiesta. I tuoi dati sono ancora qui: riprova tra un istante
          {/* TODO cliente: email di ripiego */}.
        </div>
      )}

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className={label}>Nome *</label>
          <input {...field('nome')} type="text" autoComplete="given-name" className={input} />
          <Err n="nome" />
        </div>
        <div>
          <label htmlFor="cognome" className={label}>Cognome *</label>
          <input {...field('cognome')} type="text" autoComplete="family-name" className={input} />
          <Err n="cognome" />
        </div>
        <div>
          <label htmlFor="azienda" className={label}>Azienda *</label>
          <input {...field('azienda')} type="text" autoComplete="organization" className={input} />
          <Err n="azienda" />
        </div>
        <div>
          <label htmlFor="ruolo" className={label}>Ruolo *</label>
          <input {...field('ruolo')} type="text" autoComplete="organization-title" placeholder="Es. titolare, socio" className={input} />
          <Err n="ruolo" />
        </div>
        <div>
          <label htmlFor="settore" className={label}>Settore *</label>
          <div className="relative">
            <select {...field('settore')} className={`${input} appearance-none pr-11 [&>option]:bg-[#0A1F3C] [&>option]:text-white`}>
              <option value="">Seleziona</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
          <Err n="settore" />
        </div>
        <div>
          <label htmlFor="fatturato" className={label}>Fatturato indicativo</label>
          <div className="relative">
            <select {...field('fatturato')} className={`${input} appearance-none pr-11 [&>option]:bg-[#0A1F3C] [&>option]:text-white`}>
              <option value="">Seleziona</option>
              {REVENUE_BANDS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className={label}>Email *</label>
          <input {...field('email')} type="email" autoComplete="email" inputMode="email" className={input} />
          <Err n="email" />
        </div>
        <div>
          <label htmlFor="telefono" className={label}>Telefono</label>
          <input {...field('telefono')} type="tel" autoComplete="tel" inputMode="tel" className={input} />
          <Err n="telefono" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="messaggio" className={label}>Messaggio</label>
          <textarea {...field('messaggio')} rows={4} placeholder="Racconta in poche righe la tua situazione. Puoi anche lasciare il campo vuoto." className={`${input} resize-y`} />
        </div>

        {/* Honeypot anti-bot */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Non compilare questo campo</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              {...field('privacy')}
              type="checkbox"
              checked={values.privacy}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-sm accent-[#C59B27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            />
            <label htmlFor="privacy" className="cursor-pointer text-sm font-light leading-relaxed text-white/75">
              Ho letto l’
              <a href={LEGAL_LINKS[0].href} className="text-white underline underline-offset-4 hover:text-[#C59B27]">
                informativa privacy
              </a>{' '}
              e acconsento al trattamento dei miei dati per essere ricontattato. *
            </label>
          </div>
          <Err n="privacy" />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-[#C2883A] to-[#C59B27] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A1F3C] shadow-[0_0_32px_-6px_rgba(197,155,39,0.6)] transition-all duration-700 hover:shadow-[0_0_44px_-4px_rgba(197,155,39,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'loading' ? (
            <>
              <span className="an-spin h-4 w-4 rounded-full border-2 border-[#0A1F3C]/30 border-t-[#0A1F3C]" aria-hidden="true" />
              Invio in corso…
            </>
          ) : (
            <>
              Invia in riservatezza
              <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p className="flex items-center gap-2 text-sm font-light text-white/70">
          <Lock size={20} strokeWidth={1.5} className="h-4 w-4 shrink-0 text-[#C2883A]" aria-hidden="true" />
          Ogni richiesta è trattata con la massima riservatezza.
        </p>
      </div>
    </form>
  )
}

function Contact() {
  return (
    <section id="contatti" className="relative scroll-mt-20 overflow-hidden bg-[#0A1F3C] py-24 md:py-36">
      <div className="an-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="an-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <Eyebrow className="mb-6">Contatto riservato</Eyebrow>
          <h2 className="text-4xl font-light leading-[1.1] tracking-tight text-white md:text-5xl">
            Parliamone, <span className={`font-normal ${GOLD_GRADIENT}`}>a porte chiuse</span>.
          </h2>
          <p className="mt-6 text-base font-light leading-[1.9] text-white/70 md:text-lg">
            Raccontaci in poche righe chi sei e quale direzione immagini per la tua azienda. Nessun impegno: è solo
            l’inizio di una conversazione.
          </p>
          <ul className="mt-10 space-y-5">
            {[
              [Lock, 'Nessuno saprà nulla senza il tuo consenso'],
              [Handshake, 'Un interlocutore diretto, non un intermediario'],
              [Compass, 'Nessuna pressione: decidi tu tempi e modi'],
            ].map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-4 text-base font-light text-white/80">
                <Icon size={24} strokeWidth={1.5} className="shrink-0 text-[#C2883A]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={150} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────── */

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/10 bg-[#06142A] py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={LOGO_LIGHT} alt="Alpha Nova Capital" width="932" height="332" loading="lazy" className="h-14 w-auto" />
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-white/70">
              Ogni azienda ha una direzione. Noi aiutiamo a mantenerla.
            </p>
          </div>
          <div className="md:col-span-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C2883A]">Contatti</h2>
            <ul className="mt-5 space-y-2 text-sm font-light text-white/75">
              {CONTACT.email && <li><a className="hover:text-[#C59B27]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>}
              {CONTACT.phone && <li><a className="hover:text-[#C59B27]" href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a></li>}
              {CONTACT.address && <li>{CONTACT.address}</li>}
              <li>
                <a className="underline underline-offset-4 hover:text-[#C59B27]" href="#contatti">
                  Scrivici in modo riservato
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Link legali" className="md:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C2883A]">Informazioni</h2>
            <ul className="mt-5 space-y-2 text-sm font-light text-white/75">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}><a className="hover:text-[#C59B27]" href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs font-light text-white/60 sm:flex-row sm:justify-between">
          <p>© {year} Alpha Nova Capital. Tutti i diritti riservati.</p>
          {/* TODO cliente: P.IVA / C.F. / REA, ragione sociale completa */}
          {CONTACT.piva && <p>{CONTACT.piva}</p>}
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────
   ROOT
   ───────────────────────────────────────────────────────────── */

export default function AlphaNovaHome() {
  return (
    <div className="min-h-screen bg-[#0A1F3C] font-['Montserrat',system-ui,sans-serif] text-white antialiased selection:bg-[#C59B27] selection:text-[#0A1F3C]">
      {/* Unico blocco <style>: font, keyframe e pochi helper non esprimibili con Tailwind */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
        html{scroll-behavior:smooth}
        .an-grain{opacity:.06;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
        .an-grid{background-image:linear-gradient(to right,rgba(197,155,39,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(197,155,39,.07) 1px,transparent 1px);background-size:calc(100%/6) 120px;-webkit-mask-image:radial-gradient(ellipse at 50% 40%,#000 25%,transparent 78%);mask-image:radial-gradient(ellipse at 50% 40%,#000 25%,transparent 78%)}
        .an-rv{opacity:0;transform:translate3d(0,24px,0);transition:opacity 1000ms cubic-bezier(.22,1,.36,1),transform 1000ms cubic-bezier(.22,1,.36,1);transition-delay:var(--d,0ms)}
        .an-rv.an-in{opacity:1;transform:none}
        .an-glow{filter:drop-shadow(0 0 6px rgba(197,155,39,.85));animation:an-pulse 3.6s ease-in-out infinite}
        .an-scroll{animation:an-scroll 2.2s cubic-bezier(.65,0,.35,1) infinite}
        .an-spin{animation:an-spin .9s linear infinite}
        @keyframes an-pulse{0%,100%{opacity:.8}50%{opacity:1}}
        @keyframes an-scroll{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}
        @keyframes an-spin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          html{scroll-behavior:auto}
          .an-rv{opacity:1;transform:none;transition:none}
          .an-glow,.an-scroll,.an-spin{animation:none}
        }
      `}</style>

      <a
        href="#chi-siamo"
        className="sr-only z-[70] rounded-sm bg-white px-4 py-3 text-sm font-semibold text-[#0A1F3C] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Vai al contenuto
      </a>
      <Header />
      <GuideStar />
      <main>
        <HeroJourney />
        <Approach />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

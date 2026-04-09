import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const TEMPLATE_DESCRIPTIONS = {
  Basica: 'Enfoque simple para empezar rapido: objetivos, tareas principales y fechas clave.',
  Tecnica: 'Enfoque para equipos de desarrollo: requisitos tecnicos, backlog detallado y seguimiento por entregables.',
}

function isMissingTableError(error) {
  const code = String(error?.code || '')
  const message = String(error?.message || '').toLowerCase()

  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('could not find the table')
  )
}

function formatSupabaseError(error) {
  const parts = [
    error?.message,
    error?.details,
    error?.hint,
    error?.code ? `code=${error.code}` : '',
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' | ') : 'error desconocido'
}

// Valid values per DB check constraint: projects_project_type_check
// project_type = ANY (ARRAY['student'::text, 'company'::text])
const PROJECT_TYPE_MAP = {
  Basica: 'student',
  Tecnica: 'company',
}

function isMissingColumnError(error) {
  const code = String(error?.code || '')
  const message = String(error?.message || '').toLowerCase()
  return code === 'PGRST204' || message.includes('schema cache') || message.includes('could not find the')
}

export default function CrearProyecto() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    plantilla: 'Basica',
  })

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    setGuardando(true)

    const formData = new FormData(event.currentTarget)
    const nombre = String(formData.get('nombre') || '').trim()
    const descripcion = String(formData.get('descripcion') || '').trim()
    const plantilla = String(formData.get('plantilla') || 'Basica')

    if (!nombre) {
      setGuardando(false)
      setMensaje('El nombre del proyecto es obligatorio.')
      return
    }

    const envTable = import.meta.env.VITE_PROJECTS_TABLE || 'projects'

    const projectType = PROJECT_TYPE_MAP[plantilla] ?? 'student'
    const nombreCliente = String(formData.get('cliente') || '').trim()

    const basePayload = {
      name: nombre,
      project_type: projectType,
    }

    const dateFields = [{}]

    const clientFields = []
    if (nombreCliente) {
      clientFields.push({ cliente: nombreCliente })
      clientFields.push({ client: nombreCliente })
      clientFields.push({ company: nombreCliente })
    } else {
      clientFields.push({})
    }

    const descriptionFields = []
    if (descripcion) {
      descriptionFields.push({ descripcion: descripcion })
      descriptionFields.push({ description: descripcion })
      descriptionFields.push({ notes: descripcion })
    } else {
      descriptionFields.push({})
    }

    let createError = null
    let created = false

    const payloads = []

    for (const dates of dateFields) {
      for (const client of clientFields) {
        for (const desc of descriptionFields) {
          payloads.push({
            ...basePayload,
            ...dates,
            ...client,
            ...desc,
          })
        }
      }
    }

    for (const payload of payloads) {
      const { error } = await supabase.from(envTable).insert(payload)
      if (!error) {
        created = true
        break
      }
      createError = error
      if (!isMissingColumnError(error)) {
        break
      }
    }

    setGuardando(false)

    if (!created) {
      setMensaje(`No se pudo crear el proyecto: ${formatSupabaseError(createError)}`)
      return
    }

    setMensaje('Proyecto creado exitosamente.')

    setForm({
      nombre: '',
      descripcion: '',
      plantilla: 'Basica',
    })

    setTimeout(() => navigate('/dashboard'), 900)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="h-14 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={iteriaLogo} alt="Iteria" className="h-12 w-auto object-contain" />
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Inicio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        <div className="mb-8">
          <p className="text-slate-500 text-sm mb-2">Crear proyecto</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Nuevo proyecto</h1>
          <p className="text-slate-600 mt-2">Completa la información para registrar un nuevo proyecto en tu panel.</p>
        </div>

        <section className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <p className="text-base font-semibold text-slate-900 mb-2">Tipo de proyecto</p>
              <p className="text-sm text-slate-500 mb-4">Elige el estilo de tu proyecto según su naturaleza.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    key: 'Basica',
                    title: 'Básica',
                    subtitle: 'Proyectos académicos, tareas, tesis',
                    icon: '🎓',
                  },
                  {
                    key: 'Tecnica',
                    title: 'Técnica',
                    subtitle: 'Proyectos laborales, freelance, empresa',
                    icon: '🧰',
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, plantilla: option.key }))}
                    className={`rounded-[1.75rem] border p-6 text-left transition-all ${
                      form.plantilla === option.key
                        ? 'border-[#4CD96A] bg-[#4CD96A]/5 shadow-sm ring-2 ring-[#4CD96A]/20'
                        : 'border-slate-200/90 bg-white hover:border-[#4CD96A]/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f9ef] text-xl">
                        {option.icon}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{option.title}</p>
                        <p className="text-sm text-slate-500 mt-1">{option.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <input type="hidden" name="plantilla" value={form.plantilla} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="nombre">Título del proyecto</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Mi nuevo proyecto"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/30 focus:border-[#4CD96A]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2" htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe tu proyecto..."
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/30 focus:border-[#4CD96A]"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={guardando}
                className="w-full rounded-2xl bg-[#4CD96A] px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-[#4CD96A]/25 transition hover:bg-[#3eb85c] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {guardando ? 'Creando...' : 'Crear proyecto'}
              </button>
              {mensaje && (
                <div className={`rounded-2xl p-4 text-sm font-medium ${
                  mensaje.includes('Error')
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {mensaje}
                </div>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

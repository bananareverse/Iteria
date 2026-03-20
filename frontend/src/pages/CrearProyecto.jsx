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

export default function CrearProyecto() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    cliente: '',
    plantilla: 'Basica',
  })

  async function handleSubmit(event) {
    event.preventDefault()
    setMensaje('')
    setGuardando(true)

    const formData = new FormData(event.currentTarget)
    const nombre = String(formData.get('nombre') || '').trim()
    const plantilla = String(formData.get('plantilla') || 'Basica')

    if (!nombre) {
      setGuardando(false)
      setMensaje('El nombre del proyecto es obligatorio.')
      return
    }

    const envTable = import.meta.env.VITE_PROJECTS_TABLE || 'projects'

    const projectType = PROJECT_TYPE_MAP[plantilla] ?? 'student'

    const payload = {
      name: nombre,
      project_type: projectType,
    }

    const { error } = await supabase.from(envTable).insert(payload)

    setGuardando(false)

    if (error) {
      setMensaje(`No se pudo crear el proyecto: ${formatSupabaseError(error)}`)
      return
    }

    setMensaje('Proyecto creado exitosamente.')

    setForm({
      nombre: '',
      cliente: '',
      plantilla: 'Basica',
    })

    setTimeout(() => navigate('/proyectos'), 900)
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

      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-10">
        <section className="mb-8">
          <p className="text-slate-500 text-sm mb-1">Panel de trabajo</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Crear proyecto</h1>
          <p className="text-slate-600 mt-2">Completa los datos para registrar un nuevo proyecto en Supabase.</p>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="nombre">Nombre del proyecto</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                required
                placeholder="Ej. Implementacion CRM"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="cliente">Cliente</label>
              <input
                id="cliente"
                type="text"
                value={form.cliente}
                onChange={(e) => setForm((prev) => ({ ...prev, cliente: e.target.value }))}
                placeholder="Opcional"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="plantilla">Plantilla</label>
              <select
                id="plantilla"
                name="plantilla"
                value={form.plantilla}
                onChange={(e) => setForm((prev) => ({ ...prev, plantilla: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
              >
                <option value="Basica">Basica</option>
                <option value="Tecnica">Tecnica</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">{TEMPLATE_DESCRIPTIONS[form.plantilla]}</p>
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="px-5 py-2.5 rounded-xl bg-[#4CD96A] text-slate-900 text-sm font-semibold hover:bg-[#3eb85c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {guardando ? 'Guardando...' : 'Crear proyecto'}
              </button>
              {mensaje && <p className="text-sm text-slate-600">{mensaje}</p>}
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

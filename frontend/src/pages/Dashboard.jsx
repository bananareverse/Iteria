import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

function pickValue(obj, keys, fallback = '') {
  for (const key of keys) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }
  return fallback
}

function normalizeStatus(rawStatus) {
  const value = String(rawStatus || '').toLowerCase()
  if (value.includes('progress') || value.includes('progreso') || value.includes('doing') || value.includes('activo')) {
    return 'En progreso'
  }
  if (value.includes('complete') || value.includes('done') || value.includes('final') || value.includes('cerrad')) {
    return 'Completado'
  }
  return 'Pendiente'
}

function normalizePriority(rawPriority) {
  const value = String(rawPriority || '').toLowerCase()
  if (value.includes('high') || value.includes('alta') || value.includes('urgent')) {
    return 'Alta'
  }
  if (value.includes('medium') || value.includes('media') || value.includes('normal')) {
    return 'Media'
  }
  return ''
}

function normalizeProgress(rawProgress, rawStatus) {
  const number = Number(rawProgress)
  if (!Number.isNaN(number)) {
    return Math.min(100, Math.max(0, Math.round(number)))
  }
  return normalizeStatus(rawStatus) === 'Completado' ? 100 : 0
}

function normalizeTemplate(rawType) {
  const value = String(rawType || '').toLowerCase()
  if (value.includes('company') || value.includes('tecnica')) {
    return 'Tecnica'
  }
  return 'Basica'
}

function normalizeProject(row, index) {
  const rawStatus = pickValue(row, ['estado', 'status', 'project_status'])
  const rawPriority = pickValue(row, ['prioridad', 'priority'])
  const rawProgress = pickValue(row, ['progreso', 'progress', 'completion', 'percent_complete'])

  return {
    dbId: pickValue(row, ['id'], null),
    id: String(pickValue(row, ['codigo', 'code', 'project_code', 'id'], `PRJ-${index + 1}`)),
    nombre: String(pickValue(row, ['nombre', 'name', 'title', 'project_name'], 'Proyecto sin nombre')),
    descripcion: String(pickValue(row, ['descripcion', 'description', 'details', 'summary'], '')).trim(),
    cliente: String(pickValue(row, ['cliente', 'client', 'company', 'organization'], 'Sin cliente')),
    plantilla: normalizeTemplate(pickValue(row, ['project_type', 'tipo_proyecto', 'plantilla'])),
    estado: normalizeStatus(rawStatus),
    prioridad: normalizePriority(rawPriority),
    progreso: normalizeProgress(rawProgress, rawStatus),
    fechaEntrega: pickValue(row, ['fecha_entrega', 'due_date', 'deadline', 'end_date', 'fecha_fin', 'end', 'end_at', 'finish_date', 'due_at', 'fecha_final'], null),
  }
}

function readStoredTasks(project) {
  if (typeof window === 'undefined') return []

  const key = `iteria-avances-${project.dbId || project.id}`
  const stored = window.localStorage.getItem(key)

  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mergeProjectWithStoredTasks(project) {
  const tasks = readStoredTasks(project)
  if (tasks.length === 0) return project

  const completedTasks = tasks.filter((task) => task.completed || Number(task.estado) === 4).length
  const activeTasks = tasks.filter((task) => !task.completed && [2, 3].includes(Number(task.estado))).length
  const progress = Math.round((completedTasks / tasks.length) * 100)

  let estado = 'Pendiente'
  if (completedTasks === tasks.length) {
    estado = 'Completado'
  } else if (activeTasks > 0 || progress > 0) {
    estado = 'En progreso'
  }

  return {
    ...project,
    estado,
    progreso: progress,
  }
}

function isMissingTableError(error) {
  const code = String(error?.code || '')
  const message = String(error?.message || '').toLowerCase()

  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('could not find the table') ||
    message.includes('schema cache')
  )
}

function formatStatusClasses(estado) {
  if (estado === 'Completado') return 'bg-emerald-100 text-emerald-700'
  if (estado === 'En progreso') return 'bg-sky-100 text-sky-700'
  return 'bg-amber-100 text-amber-700'
}

function formatPriorityClasses(prioridad) {
  if (prioridad === 'Alta') return 'bg-rose-100 text-rose-700'
  if (prioridad === 'Media') return 'bg-orange-100 text-orange-700'
  return 'bg-slate-200 text-slate-700'
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [tablaFuente, setTablaFuente] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  useEffect(() => {
    async function loadProjects() {
      setCargando(true)
      setErrorCarga('')

      const envTable = import.meta.env.VITE_PROJECTS_TABLE
      const tableCandidates = [
        ...(envTable ? [envTable] : []),
        'proyectos',
        'projects',
        'project',
        'iteria_projects',
      ]

      const uniqueCandidates = [...new Set(tableCandidates)]
      let loaded = false
      let lastError = null

      for (const tableName of uniqueCandidates) {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(200)

        if (error) {
          if (isMissingTableError(error)) {
            lastError = error
            continue
          }

          lastError = error
          break
        }

        const normalized = (data || [])
          .map((row, index) => normalizeProject(row, index))
          .map((project) => mergeProjectWithStoredTasks(project))
        setProyectos(normalized)
        setTablaFuente(tableName)
        loaded = true
        break
      }

      if (!loaded) {
        setProyectos([])
        setTablaFuente('')
        setErrorCarga(
          lastError?.message ||
            'No fue posible cargar los proyectos desde Supabase. Verifica VITE_PROJECTS_TABLE o crea una tabla compatible.'
        )
      }

      setCargando(false)
    }

    loadProjects()
  }, [])

  async function handleSalir() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const iniciales = nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const isCompletedProject = (project) => project.progreso >= 100 || project.estado === 'Completado'
  const isInProgressProject = (project) => {
    if (isCompletedProject(project)) return false
    return project.progreso > 0 || project.estado === 'En progreso'
  }

  // Aplicar filtro
  const proyectosFiltrados = proyectos.filter((p) => {
    if (filtro === 'todos') return true
    if (filtro === 'basica') return p.plantilla === 'Basica'
    if (filtro === 'tecnica') return p.plantilla === 'Tecnica'
    if (filtro === 'en_progreso') return isInProgressProject(p)
    if (filtro === 'completado') return isCompletedProject(p)
    return true
  })

  const emptyMessageByFilter = {
    todos: 'No hay proyectos registrados todavía.',
    basica: 'No hay proyectos de tipo básica.',
    tecnica: 'No hay proyectos de tipo técnica.',
    en_progreso: 'No hay proyectos en progreso en este momento.',
    completado: 'No hay proyectos completados todavía.',
  }

  const filterCounts = {
    todos: proyectos.length,
    basica: proyectos.filter((p) => p.plantilla === 'Basica').length,
    tecnica: proyectos.filter((p) => p.plantilla === 'Tecnica').length,
    en_progreso: proyectos.filter((p) => isInProgressProject(p)).length,
    completado: proyectos.filter((p) => isCompletedProject(p)).length,
  }

  const proyectosVisibles = proyectosFiltrados.slice(0, 9)

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={iteriaLogo} alt="Iteria" className="h-12 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={handleSalir}
            className="w-9 h-9 rounded-full bg-[#4CD96A]/15 text-[#4CD96A] font-bold text-sm flex items-center justify-center hover:bg-[#4CD96A]/25 transition-colors"
            title="Cerrar sesión"
          >
            {iniciales}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <section className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4CD96A]">Panel de control</p>
              <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-slate-900">Hola, {nombre}</h1>
              <p className="mt-2 text-sm text-slate-500">Revisa en un vistazo tus proyectos activos, su avance y lo que sigue por hacer.</p>
            </div>
            <Link
              to="/proyectos/crear"
              className="inline-flex items-center justify-center rounded-2xl bg-[#4CD96A] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#4CD96A]/25 transition hover:bg-[#3eb85c]"
            >
              Crear proyecto
            </Link>
          </div>

        </section>

        {/* Filters */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'todos', label: 'Todos', count: filterCounts.todos },
              { value: 'basica', label: 'Básica', count: filterCounts.basica },
              { value: 'tecnica', label: 'Técnica', count: filterCounts.tecnica },
              { value: 'en_progreso', label: 'En Progreso', count: filterCounts.en_progreso },
              { value: 'completado', label: 'Completados', count: filterCounts.completado },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFiltro(tab.value)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
                  filtro === tab.value
                    ? 'bg-[#4CD96A] text-slate-950 shadow-lg shadow-[#4CD96A]/25'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-[#4CD96A]/40'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm">

          {errorCarga ? (
            <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-700 border border-rose-100">
              Error: {errorCarga}
            </div>
          ) : cargando ? (
            <div className="rounded-3xl bg-slate-100 p-6 text-sm text-slate-600">Cargando proyectos reales...</div>
          ) : proyectosFiltrados.length === 0 ? (
            <div className="rounded-3xl bg-slate-100 p-8 text-center">
              <p className="text-sm text-slate-600">{emptyMessageByFilter[filtro] || 'No hay proyectos para este filtro.'}</p>
              <Link
                to="/proyectos/crear"
                className="inline-flex items-center justify-center mt-4 rounded-2xl bg-[#4CD96A] px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-[#4CD96A]/25 transition hover:bg-[#3eb85c]"
              >
                Crear el primer proyecto
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">Mostrando {proyectosVisibles.length} de {proyectosFiltrados.length} proyectos</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {proyectosVisibles.map((project) => (
                  <Link
                    key={project.id}
                    to={`/proyectos/${encodeURIComponent(project.dbId || project.id)}`}
                    className="group block rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-[#4CD96A] transition-colors">{project.nombre}</h2>
                        {project.descripcion ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{project.descripcion}</p>
                        ) : null}
                      </div>
                      {project.prioridad ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${formatPriorityClasses(project.prioridad)}`}>
                          {project.prioridad}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-slate-600">Entrega: {project.fechaEntrega || '-'}</p>

                    {project.estado !== 'Pendiente' && (
                      <div className="mt-4 rounded-3xl bg-slate-100 p-4">
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-2">
                          <span>{project.estado}</span>
                          <span>{project.progreso}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-[#4CD96A]" style={{ width: `${project.progreso}%` }} />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

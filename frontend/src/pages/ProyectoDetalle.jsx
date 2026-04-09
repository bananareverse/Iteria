import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

function toInputDateValue(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return ''
  }
  const stringValue = String(value)
  const trimmed = stringValue.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }
  const parsed = new Date(stringValue)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }
  return ''
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
    cliente: String(pickValue(row, ['cliente', 'client', 'company', 'organization'], 'Sin cliente')),
    plantilla: normalizeTemplate(pickValue(row, ['project_type', 'tipo_proyecto', 'plantilla'])),
    estado: normalizeStatus(rawStatus),
    prioridad: normalizePriority(rawPriority),
    progreso: normalizeProgress(rawProgress, rawStatus),
    fechaInicio: pickValue(row, ['fecha_inicio', 'start_date', 'start', 'start_at', 'begin_date'], null),
    fechaEntrega: pickValue(row, ['fecha_entrega', 'due_date', 'deadline', 'end_date', 'fecha_fin', 'end', 'end_at', 'finish_date', 'due_at', 'fecha_final'], null),
    descripcion: pickValue(row, ['descripcion', 'description', 'desc', 'notes'], ''),
    raw: row,
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

function isMissingColumnError(error) {
  const code = String(error?.code || '')
  const message = String(error?.message || '').toLowerCase()
  return (
    code === '42703' ||
    message.includes('column') && message.includes('does not exist') ||
    message.includes('undefined column') ||
    message.includes('cannot find column') ||
    (message.includes('could not find') && message.includes('column') && message.includes('schema cache'))
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
export default function ProyectoDetalle() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [statusSelected, setStatusSelected] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editNombre, setEditNombre] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [mensajeEdicion, setMensajeEdicion] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)
  const [avances, setAvances] = useState([])
  const [newAdvance, setNewAdvance] = useState('')
  const [newAdvanceDescription, setNewAdvanceDescription] = useState('')
  const [newAdvancePriority, setNewAdvancePriority] = useState('Media')
  const [newAdvanceTag, setNewAdvanceTag] = useState('')
  const [showAddAdvance, setShowAddAdvance] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [tablaFuente, setTablaFuente] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    if (project) {
      const parsedInicio = toInputDateValue(project.fechaInicio)
      const parsedFin = toInputDateValue(project.fechaEntrega)

      setStatusSelected(project.estado)
      setStartDate(parsedInicio)
      setEndDate(parsedFin)
      setEditNombre(project.nombre)
      setEditDescripcion(project.descripcion || '')
      setEditStartDate(parsedInicio)
      setEditEndDate(parsedFin)

      const key = `iteria-avances-${project.dbId || project.id}`
      const stored = window.localStorage.getItem(key)
      if (stored) {
        try {
          setAvances(JSON.parse(stored))
        } catch {
          setAvances([])
        }
      } else {
        setAvances([])
      }
    }
  }, [project])

  function saveAvances(nextAvances) {
    setAvances(nextAvances)
    if (!project) return
    const key = `iteria-avances-${project.dbId || project.id}`
    window.localStorage.setItem(key, JSON.stringify(nextAvances))
  }

  function handleAddAdvance() {
    const title = newAdvance.trim()
    if (!title || !project) return
    const nextAvances = [
      ...avances,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        description: newAdvanceDescription.trim(),
        completed: false,
        estado: 1,
        priority: newAdvancePriority,
        tag: newAdvanceTag.trim(),
      },
    ]
    saveAvances(nextAvances)
    setNewAdvance('')
    setNewAdvanceDescription('')
    setNewAdvancePriority('Media')
    setNewAdvanceTag('')
    setShowAddAdvance(false)
  }

  function handleToggleAdvance(id) {
    const nextAvances = avances.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    saveAvances(nextAvances)
  }

  function handleDeleteAdvance(id) {
    const nextAvances = avances.filter((item) => item.id !== id)
    saveAvances(nextAvances)
  }

  function handleMoveTask(taskId, newEstado) {
    const nextAvances = avances.map((item) =>
      item.id === taskId ? { ...item, estado: newEstado, completed: newEstado === 4 } : item
    )
    saveAvances(nextAvances)
  }

  const avancesCompletados = avances.filter((item) => item.completed).length
  const avanceProgress = avances.length > 0 ? Math.round((avancesCompletados / avances.length) * 100) : project?.progreso || 0

  useEffect(() => {
    let isActive = true

    async function loadProject() {
      if (!isActive) return

      setCargando(true)
      setErrorCarga('')
      setProject(null)
      setTablaFuente('')

      try {
        const envTable = import.meta.env.VITE_PROJECTS_TABLE
        const tableCandidates = [
          ...(envTable ? [envTable] : []),
          'proyectos',
          'projects',
          'project',
          'iteria_projects',
        ]

        const uniqueCandidates = [...new Set(tableCandidates)]
        let lastError = null
        let foundProject = null

        for (const tableName of uniqueCandidates) {
          const { data, error } = await supabase.from(tableName).select('*').limit(200)

          if (!isActive) return

          if (error) {
            if (isMissingTableError(error)) {
              lastError = error
              continue
            }

            lastError = error
            break
          }

          const normalized = (data || []).map((row, index) => normalizeProject(row, index))
          const decodedId = decodeURIComponent(projectId || '')
          foundProject = normalized.find((item) => String(item.dbId) === decodedId || String(item.id) === decodedId)

          if (foundProject) {
            setProject(foundProject)
            setTablaFuente(tableName)
            break
          }
        }

        if (!foundProject) {
          setErrorCarga(
            lastError?.message ||
            'No se encontró el proyecto o no se pudo cargar la tabla. Revisa el identificador y la configuración de Supabase.'
          )
        }
      } catch (error) {
        if (String(error?.name || '') === 'AbortError') {
          return
        }

        if (isActive) {
          setErrorCarga('No se pudo cargar el proyecto. ' + (error?.message || ''))
        }
      } finally {
        if (isActive) {
          setCargando(false)
        }
      }
    }

    loadProject()

    return () => {
      isActive = false
    }
  }, [projectId])

  async function handleSaveProjectInfo() {
    if (!project) return
    if (!editNombre.trim()) {
      setMensajeEdicion('El nombre del proyecto es obligatorio.')
      return
    }

    setGuardandoEdicion(true)
    setMensajeEdicion('')

    const envTable = import.meta.env.VITE_PROJECTS_TABLE || tablaFuente || 'projects'
    const dateFields = [
      { start: editStartDate || null, end: editEndDate || null },
      { fecha_inicio: editStartDate || null, fecha_entrega: editEndDate || null },
      { fecha_inicio: editStartDate || null, fecha_fin: editEndDate || null },
      { start_date: editStartDate || null, end_date: editEndDate || null },
      { start_date: editStartDate || null, due_date: editEndDate || null },
      { start_date: editStartDate || null, deadline: editEndDate || null },
      { start_at: editStartDate || null, end_at: editEndDate || null },
      { begin_date: editStartDate || null, finish_date: editEndDate || null },
      { start_at: editStartDate || null, due_at: editEndDate || null },
      { fecha_inicio: editStartDate || null, fecha_final: editEndDate || null },
      {},
    ]
    const descFields = [
      { descripcion: editDescripcion || null },
      { description: editDescripcion || null },
      { notes: editDescripcion || null },
      {},
    ]

    let updated = false
    let lastError = null

    for (const dates of dateFields) {
      for (const desc of descFields) {
        const payload = {
          name: editNombre.trim(),
          ...dates,
          ...desc,
        }
        const { error } = await supabase.from(envTable).update(payload).eq('id', project.dbId)
        if (!error) {
          updated = true
          break
        }
        lastError = error
        if (!isMissingColumnError(error)) {
          break
        }
      }
      if (updated || (lastError && !isMissingColumnError(lastError))) {
        break
      }
    }

    setGuardandoEdicion(false)

    if (!updated) {
      setMensajeEdicion(`No se pudo actualizar el proyecto: ${lastError?.message || 'error desconocido'}`)
      return
    }

    setMensajeEdicion('Información actualizada correctamente.')
    setIsEditing(false)
    setProject((current) => current && {
      ...current,
      nombre: editNombre.trim(),
      descripcion: editDescripcion.trim(),
      fechaInicio: editStartDate || current.fechaInicio,
      fechaEntrega: editEndDate || current.fechaEntrega,
    })
  }

  async function handleDelete() {
    if (!project) return
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return

    const envTable = import.meta.env.VITE_PROJECTS_TABLE || tablaFuente || 'projects'
    const { error } = await supabase.from(envTable).delete().eq('id', project.dbId)

    if (!error) {
      window.location.href = '/dashboard'
    } else {
      setErrorCarga('No se pudo eliminar el proyecto. ' + (error.message || ''))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={iteriaLogo} alt="Iteria" className="h-12 w-auto object-contain" />
          </Link>
          <Link
            to="/dashboard"
            className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 lg:py-12">
        {cargando ? (
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-600">Cargando información del proyecto...</p>
          </div>
        ) : errorCarga ? (
          <div className="rounded-[2rem] border border-rose-200/70 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
            {errorCarga}
          </div>
        ) : !project ? (
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-12 text-center text-slate-600 shadow-sm">
            No se encontró el proyecto seleccionado.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3 flex-1">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                    {project.plantilla}
                  </span>
                  <h1 className="text-4xl font-bold text-slate-900">{project.nombre}</h1>
                  {project.descripcion && (
                    <p className="text-slate-600 leading-relaxed">{project.descripcion}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing((current) => !current)
                    setMensajeEdicion('')
                    setEditNombre(project.nombre)
                    setEditDescripcion(project.descripcion || '')
                    setEditStartDate(toInputDateValue(project.fechaInicio))
                    setEditEndDate(toInputDateValue(project.fechaEntrega))
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 min-w-max"
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {mensajeEdicion ? (
                <div className="mb-6 rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
                  {mensajeEdicion}
                </div>
              ) : null}

              {isEditing ? (
                <div className="mt-8 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Editar información</h3>
                  <div className="grid gap-4">
                    <label className="space-y-2 text-sm text-slate-700">
                      <span className="font-medium">Nombre</span>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(event) => setEditNombre(event.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      <span className="font-medium">Descripción</span>
                      <textarea
                        value={editDescripcion}
                        onChange={(event) => setEditDescripcion(event.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                      />
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleSaveProjectInfo}
                        disabled={guardandoEdicion}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#4CD96A] px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-[#3eb85c] disabled:opacity-60"
                      >
                        {guardandoEdicion ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false)
                          setMensajeEdicion('')
                        }}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <section className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Tablero Kanban</h2>
                  <p className="mt-1 text-sm text-slate-500">Arrastra las tarjetas entre columnas para actualizar su estado</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAdvance(!showAddAdvance)}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F46E5]"
                >
                  + Agregar
                </button>
              </div>

              {showAddAdvance ? (
                <div className="mb-6 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-slate-900">Nueva Tarea</p>
                    <p className="mt-2 text-sm text-slate-500">Agrega un título, descripción y prioridad antes de guardar.</p>
                  </div>

                  <div className="grid gap-4">
                    <label className="space-y-2 text-sm text-slate-700">
                      <span className="font-medium">Título</span>
                      <input
                        type="text"
                        value={newAdvance}
                        onChange={(event) => setNewAdvance(event.target.value)}
                        placeholder="Título de la tarea"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      <span className="font-medium">Descripción (opcional)</span>
                      <textarea
                        value={newAdvanceDescription}
                        onChange={(event) => setNewAdvanceDescription(event.target.value)}
                        rows={4}
                        placeholder="Describe la tarea..."
                        className="min-h-[108px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        <span className="font-medium">Prioridad</span>
                        <select
                          value={newAdvancePriority}
                          onChange={(event) => setNewAdvancePriority(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                        >
                          <option>Baja</option>
                          <option>Media</option>
                          <option>Alta</option>
                        </select>
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span className="font-medium">Etiqueta (opcional)</span>
                        <input
                          type="text"
                          value={newAdvanceTag}
                          onChange={(event) => setNewAdvanceTag(event.target.value)}
                          placeholder="ej: Bug, Feature"
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4CD96A] focus:ring-2 focus:ring-[#4CD96A]/20"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handleAddAdvance}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d28d9]"
                      >
                        Agregar Tarea
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAdvance(false)
                          setNewAdvance('')
                          setNewAdvanceDescription('')
                          setNewAdvancePriority('Media')
                          setNewAdvanceTag('')
                        }}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="h-[74vh] min-h-[680px] rounded-[1.5rem] border border-slate-300 bg-[linear-gradient(180deg,#e5e7eb_0%,#dfe3ea_100%)] p-4 shadow-inner">
                <div className="flex h-full gap-3 overflow-x-auto pb-4">
                  {[
                    { status: 'Backlog', estado: 0, tone: 'border-slate-300 bg-white' },
                    { status: 'Por hacer', estado: 1, tone: 'border-slate-300 bg-white' },
                    { status: 'En progreso', estado: 2, tone: 'border-indigo-200 bg-indigo-50/60' },
                    { status: 'En revisión', estado: 3, tone: 'border-violet-200 bg-violet-50/60' },
                    { status: 'Completado', estado: 4, tone: 'border-emerald-200 bg-emerald-50/70' },
                  ].map((column) => {
                    const columnItems = avances.filter((item) => {
                      if (column.estado === 4) return item.completed || item.estado === 4
                      if (item.completed) return false
                      return item.estado === column.estado || (!item.estado && column.estado === 1)
                    })

                    const getPriorityColor = (priority) => {
                      if (priority === 'Alta') return 'border-l-4 border-l-rose-500 bg-rose-50/30'
                      if (priority === 'Media') return 'border-l-4 border-l-amber-500 bg-amber-50/30'
                      return 'border-l-4 border-l-blue-500 bg-blue-50/30'
                    }

                    const getPriorityBadge = (priority) => {
                      if (priority === 'Alta') return 'bg-rose-100 text-rose-700'
                      if (priority === 'Media') return 'bg-amber-100 text-amber-700'
                      return 'bg-blue-100 text-blue-700'
                    }

                    return (
                      <div
                        key={column.status}
                        className={`flex h-full w-[300px] min-w-[300px] flex-col rounded-xl border ${column.tone} p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]`}
                      >
                        <div className="mb-2 flex items-center justify-between rounded-md bg-white/70 px-2 py-2">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                            {column.status}
                          </h3>
                          <span className="inline-flex min-w-6 items-center justify-center rounded bg-slate-300 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                            {columnItems.length}
                          </span>
                        </div>

                        <div
                          className="flex-1 space-y-2 overflow-y-auto rounded-md border border-slate-300/70 bg-slate-200/45 p-1.5"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            if (draggedItem) {
                              handleMoveTask(draggedItem, column.estado)
                              setDraggedItem(null)
                            }
                          }}
                        >
                          {columnItems.length === 0 ? (
                            <div className="flex min-h-[80px] items-center justify-center rounded-md border border-dashed border-slate-400/70 bg-white/80 px-3 text-center">
                              <p className="text-sm text-slate-400">Sin tareas</p>
                            </div>
                          ) : (
                            columnItems.map((item) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={() => setDraggedItem(item.id)}
                                onDragEnd={() => setDraggedItem(null)}
                                className={`group cursor-move rounded-md border ${getPriorityColor(item.priority)} px-3 py-2.5 shadow-[0_1px_0_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2 hover:ring-slate-300`}
                              >
                                <div className="flex items-start gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAdvance(item.id)}
                                    className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border border-sky-500 bg-white text-[10px] text-sky-600"
                                  >
                                    {item.completed ? '✓' : ''}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdvance(item.id)}
                                      className="w-full text-left"
                                    >
                                      <p className={`text-sm font-medium leading-5 ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.title}</p>
                                    </button>

                                    {item.description ? (
                                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>
                                    ) : null}

                                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getPriorityBadge(item.priority)}`}>
                                        {item.priority}
                                      </span>
                                      {item.tag && (
                                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                          {item.tag}
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        handleDeleteAdvance(item.id)
                                      }}
                                      className="mt-2 text-xs font-medium text-slate-400 opacity-0 transition hover:text-rose-600 group-hover:opacity-100"
                                      aria-label="Eliminar tarea"
                                    >
                                      × Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}


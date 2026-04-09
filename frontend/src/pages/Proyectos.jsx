import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const TEMPLATE_TO_TYPE = {
  Basica: 'student',
  Tecnica: 'company',
}

function estadoClasses(estado) {
  if (estado === 'Completado') return 'bg-emerald-100 text-emerald-700'
  if (estado === 'En progreso') return 'bg-sky-100 text-sky-700'
  return 'bg-amber-100 text-amber-700'
}

function prioridadClasses(prioridad) {
  if (prioridad === 'Alta') return 'bg-rose-100 text-rose-700'
  if (prioridad === 'Media') return 'bg-orange-100 text-orange-700'
  return 'bg-slate-200 text-slate-700'
}

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
  return 'Baja'
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
  if (value.includes('company') || value.includes('tecnica') || value.includes('tecnica')) {
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
    fechaEntrega: pickValue(row, ['fecha_entrega', 'due_date', 'deadline', 'end_date', 'fecha_fin', 'end', 'end_at', 'finish_date', 'due_at', 'fecha_final'], null),
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
  return code === 'PGRST204' || message.includes('schema cache') || message.includes('could not find the')
}

export default function Proyectos() {
  const [busqueda, setBusqueda] = useState('')
  const [proyectos, setProyectos] = useState([])
  const [tablaFuente, setTablaFuente] = useState('')
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)
  const [mensajeEdicion, setMensajeEdicion] = useState('')
  const [proyectoEditando, setProyectoEditando] = useState(null)
  const [formEdicion, setFormEdicion] = useState({ nombre: '', cliente: '', plantilla: 'Basica' })

  const loadProjects = useCallback(async () => {
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
        const isMissingTable = isMissingTableError(error)
        if (isMissingTable) {
          lastError = error
          continue
        }

        lastError = error
        break
      }

      const normalized = (data || []).map((row, index) => normalizeProject(row, index))
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
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter((proyecto) => {
      const coincideBusqueda =
        proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        proyecto.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        proyecto.id.toLowerCase().includes(busqueda.toLowerCase())

      return coincideBusqueda
    })
  }, [proyectos, busqueda])

  function abrirEdicion(proyecto) {
    setMensajeExito('')
    setMensajeEdicion('')
    setProyectoEditando(proyecto)
    setFormEdicion({
      nombre: proyecto.nombre || '',
      cliente: proyecto.cliente === 'Sin cliente' ? '' : (proyecto.cliente || ''),
      plantilla: proyecto.plantilla || 'Basica',
    })
  }

  function cerrarEdicion() {
    setProyectoEditando(null)
    setGuardandoEdicion(false)
    setMensajeEdicion('')
  }

  async function guardarEdicion() {
    if (!proyectoEditando?.dbId || !tablaFuente) {
      setMensajeEdicion('No se pudo identificar el proyecto para editar.')
      return
    }

    const nombreLimpio = String(formEdicion.nombre || '').trim()
    if (!nombreLimpio) {
      setMensajeEdicion('El nombre es obligatorio.')
      return
    }

    setGuardandoEdicion(true)
    setMensajeEdicion('')

    const projectType = TEMPLATE_TO_TYPE[formEdicion.plantilla] || 'student'
    const nombreCliente = String(formEdicion.cliente || '').trim()

    const basePayload = {
      name: nombreLimpio,
      project_type: projectType,
    }

    const payloadCandidates = [
      { ...basePayload, client: nombreCliente || null },
      { ...basePayload, cliente: nombreCliente || null },
      { ...basePayload, company: nombreCliente || null },
      basePayload,
    ]

    let updateError = null
    let updated = false

    for (const payload of payloadCandidates) {
      const { data, error } = await supabase
        .from(tablaFuente)
        .update(payload)
        .eq('id', proyectoEditando.dbId)
        .select()

      if (!error) {
        if (!data || data.length === 0) {
          setGuardandoEdicion(false)
          setMensajeEdicion('No se pudo actualizar: el proyecto no fue encontrado o no tienes permisos de edición en Supabase (revisa las políticas RLS de la tabla).')
          return
        }
        updated = true
        break
      }

      updateError = error
      if (!isMissingColumnError(error)) {
        break
      }
    }

    setGuardandoEdicion(false)

    if (!updated) {
      setMensajeEdicion(`No se pudo editar: ${updateError?.message || 'error desconocido'}`)
      return
    }

    const plantillaFinal = formEdicion.plantilla || 'Basica'
    const clienteFinal = nombreCliente || 'Sin cliente'

    setProyectos(prev =>
      prev.map(p =>
        p.dbId === proyectoEditando.dbId
          ? { ...p, nombre: nombreLimpio, cliente: clienteFinal, plantilla: plantillaFinal }
          : p
      )
    )

    cerrarEdicion()
    setMensajeExito('Proyecto actualizado correctamente.')
  }

  async function eliminarProyecto(proyecto) {
    if (!proyecto?.dbId || !tablaFuente) return

    const confirmado = window.confirm(`Eliminar proyecto "${proyecto.nombre}"? Esta accion no se puede deshacer.`)
    if (!confirmado) return

    setMensajeExito('')
    setErrorCarga('')

    const { error } = await supabase
      .from(tablaFuente)
      .delete()
      .eq('id', proyecto.dbId)

    if (error) {
      setErrorCarga(`No se pudo eliminar el proyecto: ${error.message || 'error desconocido'}`)
      return
    }

    await loadProjects()
    setMensajeExito('Proyecto eliminado correctamente.')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="h-14 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={iteriaLogo} alt="Iteria" className="h-12 w-auto object-contain" />
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Volver
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <section className="mb-8">
          <p className="text-slate-500 text-sm mb-1">Panel de trabajo</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Lista de proyectos</h1>
          <p className="text-slate-600 mt-2">Consulta el estado de cada proyecto y encuentra rapido lo que necesitas.</p>
          {tablaFuente && (
            <p className="text-xs text-slate-500 mt-2">Fuente de datos: {tablaFuente}</p>
          )}
        </section>

        <section className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-sm mb-5">
          <div className="grid gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, cliente o codigo"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
            />
          </div>
        </section>

        {errorCarga && (
          <section className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 text-sm text-red-700">
            Error al cargar proyectos: {errorCarga}
          </section>
        )}

        {mensajeExito && (
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 text-sm text-emerald-700">
            {mensajeExito}
          </section>
        )}

        <section className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Proyecto</th>
                  <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold">Plantilla</th>
                  <th className="text-left px-4 py-3 font-semibold">Entrega</th>
                  <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proyectosFiltrados.map((proyecto) => (
                  <tr key={proyecto.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{proyecto.nombre}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{proyecto.id}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{proyecto.cliente}</td>
                    <td className="px-4 py-3.5 text-slate-700">{proyecto.plantilla}</td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {proyecto.fechaEntrega ? new Date(proyecto.fechaEntrega).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(proyecto)}
                          disabled={!proyecto.dbId}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={proyecto.dbId ? 'Editar proyecto' : 'Este proyecto no tiene id editable'}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarProyecto(proyecto)}
                          disabled={!proyecto.dbId}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={proyecto.dbId ? 'Eliminar proyecto' : 'Este proyecto no tiene id editable'}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cargando && (
            <div className="px-4 py-10 text-center text-slate-500">
              Cargando proyectos...
            </div>
          )}

          {!cargando && proyectosFiltrados.length === 0 && (
            <div className="px-4 py-10 text-center text-slate-500">
              No hay proyectos para mostrar con la busqueda actual.
            </div>
          )}
        </section>

        {proyectoEditando && (
          <section className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
              <h2 className="text-lg font-bold text-slate-900">Editar proyecto</h2>
              <p className="text-sm text-slate-500 mt-1">Actualiza nombre, cliente y plantilla del proyecto.</p>

              <div className="mt-4 grid gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formEdicion.nombre}
                    onChange={(e) => setFormEdicion((prev) => ({ ...prev, nombre: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formEdicion.cliente}
                    onChange={(e) => setFormEdicion((prev) => ({ ...prev, cliente: e.target.value }))}
                    placeholder="Opcional"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plantilla</label>
                  <select
                    value={formEdicion.plantilla}
                    onChange={(e) => setFormEdicion((prev) => ({ ...prev, plantilla: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/40 focus:border-[#4CD96A]"
                  >
                    <option value="Basica">Basica</option>
                    <option value="Tecnica">Tecnica</option>
                  </select>
                </div>

                {mensajeEdicion && (
                  <p className="text-sm text-rose-600">{mensajeEdicion}</p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarEdicion}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarEdicion}
                  disabled={guardandoEdicion}
                  className="px-3.5 py-2 rounded-xl bg-[#4CD96A] text-sm font-semibold text-slate-900 hover:bg-[#3eb85c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

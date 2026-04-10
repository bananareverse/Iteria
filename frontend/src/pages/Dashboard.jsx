import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar,
  ChevronRight,
  MoreVertical,
  Target
} from 'lucide-react'

// Funciones de normalización (omito detalles por brevedad, asumo las existentes o ligeramente mejoradas)
function pickValue(obj, keys, fallback = '') {
  for (const key of keys) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') return value
  }
  return fallback
}

function normalizeProject(row, index) {
  return {
    dbId: pickValue(row, ['id'], null),
    id: String(pickValue(row, ['codigo', 'id'], `PRJ-${index + 1}`)),
    nombre: String(pickValue(row, ['nombre', 'name'], 'Proyecto sin nombre')),
    descripcion: String(pickValue(row, ['descripcion', 'description'], '')).trim(),
    cliente: String(pickValue(row, ['cliente', 'client'], 'Sin cliente')),
    estado: row.estado || 'Pendiente',
    prioridad: row.prioridad || 'Media',
    progreso: row.progreso || 0,
    fechaEntrega: row.fecha_entrega || row.due_date || null,
  }
}

import { fetchProjects } from '../lib/dbUtils'

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await fetchProjects()
      if (data) {
        setProyectos(data.map((row, index) => normalizeProject(row, index)))
      }
      setCargando(false)
    }
    loadProjects()
  }, [])

  const filteredProjects = proyectos.filter(p => {
    const matchesFilter = filtro === 'todos' || p.estado.toLowerCase().includes(filtro.toLowerCase().replace('_', ' '))
    const matchesSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.cliente.toLowerCase().includes(busqueda.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4CD96A] mb-2">Workspace</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Tus Proyectos</h1>
          <p className="mt-2 text-slate-400">Gestiona y monitorea el avance de todo tu equipo.</p>
        </div>
        <Link 
          to="/proyectos/crear"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4CD96A] text-slate-950 font-bold rounded-2xl shadow-xl shadow-[#4CD96A]/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Nuevo Proyecto
        </Link>
      </header>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between glass-dark p-4 rounded-3xl border border-white/5">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#4CD96A]/20 text-[#4CD96A]' : 'text-slate-500 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#4CD96A]/20 text-[#4CD96A]' : 'text-slate-500 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>

          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="flex-1 lg:flex-none px-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all"
          >
            <option value="todos" className="bg-slate-900">Todos los estados</option>
            <option value="en_progreso" className="bg-slate-900">En Progreso</option>
            <option value="completado" className="bg-slate-900">Completados</option>
            <option value="pendiente" className="bg-slate-900">Pendientes</option>
          </select>
        </div>
      </div>

      {/* GRID VIEW */}
      {cargando ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-[2.5rem] glass-dark animate-pulse" />)}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center glass-dark rounded-[3rem] border-dashed border-2 border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
            <Filter size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">No se encontraron proyectos</h2>
          <p className="text-slate-500 mt-2 italic">Prueba con otros filtros o crea uno nuevo.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredProjects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link 
        to={`/proyectos/${project.id}`}
        className="group relative block h-full glass-dark rounded-[2.5rem] border border-white/5 p-8 hover:border-[#4CD96A]/30 transition-all shadow-xl hover:shadow-[#4CD96A]/5"
      >
        <div className="flex justify-between items-start mb-6">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            project.prioridad === 'Alta' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
          }`}>
            {project.prioridad}
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <h3 className="text-xl font-black text-white group-hover:text-[#4CD96A] transition-colors leading-tight">
          {project.nombre}
        </h3>
        <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed italic">
          {project.descripcion || 'Sin descripción detallada disponible para este proyecto.'}
        </p>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
             <div className="w-8 h-8 rounded-full bg-white/5 grid place-items-center text-[#4CD96A]">
               <Calendar size={14} />
             </div>
             <span className="text-xs font-bold uppercase tracking-wider">{project.fechaEntrega || 'Sin fecha'}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
              <span className="text-slate-500">{project.estado}</span>
              <span className="text-[#4CD96A]">{project.progreso}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progreso}%` }}
                className="h-full bg-gradient-to-r from-[#4CD96A] to-emerald-400 rounded-full" 
               />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ProjectRow({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        to={`/proyectos/${project.id}`}
        className="group flex items-center justify-between glass-dark rounded-3xl p-5 border border-white/5 hover:border-[#4CD96A]/30 transition-all"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#4CD96A]/10 grid place-items-center text-[#4CD96A] shrink-0">
            <Target size={24} />
          </div>
          <div className="truncate">
            <h3 className="font-bold text-white group-hover:text-[#4CD96A] transition-colors">{project.nombre}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{project.cliente}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12 shrink-0 px-8">
           <div className="text-right w-24">
             <p className="text-[10px] font-black text-slate-500 uppercase">Estado</p>
             <p className="text-xs font-bold text-white mt-1">{project.estado}</p>
           </div>
           <div className="text-right w-24">
             <p className="text-[10px] font-black text-slate-500 uppercase">Prioridad</p>
             <p className={`text-xs font-bold mt-1 ${project.prioridad === 'Alta' ? 'text-rose-500' : 'text-blue-500'}`}>{project.prioridad}</p>
           </div>
           <div className="w-32">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Progreso</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-[#4CD96A] rounded-full" style={{ width: `${project.progreso}%` }} />
              </div>
           </div>
        </div>

        <div className="w-10 h-10 rounded-xl hover:bg-white/5 grid place-items-center text-slate-500 group-hover:text-[#4CD96A] transition-all">
          <ChevronRight size={20} />
        </div>
      </Link>
    </motion.div>
  )
}

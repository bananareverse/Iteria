import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  Trash2, 
  MoreVertical, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  GripVertical,
  BarChart3,
  Zap
} from 'lucide-react'

import { fetchProjects } from '../lib/dbUtils'

export default function ProyectoDetalle() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [avances, setAvances] = useState([])
  const [cargando, setCargando] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  
  // Form states
  const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Media', tag: '' })
  const [draggedTaskId, setDraggedTaskId] = useState(null)

  useEffect(() => {
    async function loadProject() {
      const { data, error } = await fetchProjects()
      if (data) {
        const decodedId = decodeURIComponent(projectId)
        const found = data.find(p => String(p.id) === decodedId || String(p.dbId) === decodedId)
        if (found) {
          setProject(found)
          // Load tasks from localStorage
          const key = `iteria-avances-${found.id}`
          const stored = localStorage.getItem(key)
          if (stored) setAvances(JSON.parse(stored))
        }
      }
      setCargando(false)
    }
    loadProject()
  }, [projectId])

  const saveTasks = (tasks) => {
    setAvances(tasks)
    localStorage.setItem(`iteria-avances-${project.id}`, JSON.stringify(tasks))
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.desc,
      priority: newTask.priority,
      tag: newTask.tag,
      estado: 1, // Por hacer
      completed: false
    }
    saveTasks([...avances, task])
    setNewTask({ title: '', desc: '', priority: 'Media', tag: '' })
    setShowAddTask(false)
  }

  const handleMoveTask = (taskId, newEstado) => {
    const nextAvances = avances.map(t => 
      t.id === taskId ? { ...t, estado: newEstado, completed: newEstado === 4 } : t
    )
    saveTasks(nextAvances)
  }

  const handleDeleteTask = (id) => {
    saveTasks(avances.filter(t => t.id !== id))
  }

  const handleDeleteProject = async () => {
    if (!confirm('¿Seguro que quieres borrar este proyecto "alv"?')) return
    await supabase.from('proyectos').delete().eq('id', project.id)
    navigate('/proyectos')
  }

  if (cargando) return <div className="p-20 text-center text-white font-bold animate-pulse">Cargando proyecto...</div>
  if (!project) return <div className="p-20 text-center text-white">Proyecto no encontrado.</div>

  const columns = [
    { id: 0, label: 'Backlog', icon: Clock },
    { id: 1, label: 'Por Hacer', icon: AlertCircle },
    { id: 2, label: 'En Progreso', icon: Zap },
    { id: 3, label: 'En Revisión', icon: BarChart3 },
    { id: 4, label: 'Completado', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-10 selection:bg-[#4CD96A]/30 pb-20">
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/proyectos" className="inline-flex items-center gap-2 text-[#4CD96A] font-bold text-sm hover:underline">
            <ArrowLeft size={16} /> Volver a Proyectos
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              {project.project_type || 'Standard'}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20`}>
              {project.prioridad || 'Media'}
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">{project.nombre}</h1>
          <p className="text-slate-400 max-w-2xl italic leading-relaxed">{project.descripcion || 'Sin descripción.'}</p>
        </div>

        <div className="flex items-center gap-3">
           <button 
            onClick={() => setShowAddTask(true)}
            className="px-6 py-3.5 bg-[#4CD96A] text-slate-950 font-black rounded-2xl shadow-xl shadow-[#4CD96A]/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
             <Plus size={20} /> Nueva Tarea
           </button>
           <button 
            onClick={handleDeleteProject}
            className="p-3.5 bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl border border-white/5 transition-all"
           >
             <Trash2 size={20} />
           </button>
        </div>
      </header>

      {/* KANBAN BOARD */}
      <section className="relative">
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide min-h-[600px]">
          {columns.map(col => (
            <KanbanColumn 
              key={col.id}
              column={col}
              tasks={avances.filter(t => t.estado === col.id)}
              onDrop={(taskId) => handleMoveTask(taskId, col.id)}
              onDeleteTask={handleDeleteTask}
              setDraggedTaskId={setDraggedTaskId}
            />
          ))}
        </div>
      </section>

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTask(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md glass-dark rounded-[3rem] p-10 border border-white/10 shadow-3xl"
            >
              <h2 className="text-2xl font-black text-white mb-6">Agregar Tarea</h2>
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Título</label>
                  <input 
                    autoFocus
                    value={newTask.title} 
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-semibold" 
                    placeholder="Ej: Fix login bug"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción</label>
                  <textarea 
                    value={newTask.desc} 
                    onChange={e => setNewTask({...newTask, desc: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#4CD96A]/50 transition-all font-semibold resize-none" 
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prioridad</label>
                    <select 
                      value={newTask.priority} 
                      onChange={e => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-sm outline-none"
                    >
                      <option className="bg-slate-900">Baja</option>
                      <option className="bg-slate-900">Media</option>
                      <option className="bg-slate-900">Alta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tag</label>
                    <input 
                      value={newTask.tag} 
                      onChange={e => setNewTask({...newTask, tag: e.target.value})}
                      placeholder="UI, Backend..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-[#4CD96A] text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Crear Tarea</button>
                  <button type="button" onClick={() => setShowAddTask(false)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-2xl border border-white/5 hover:bg-white/10 transition-all">Cancelar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function KanbanColumn({ column, tasks, onDrop, onDeleteTask, setDraggedTaskId }) {
  return (
    <div 
      className="w-80 shrink-0 flex flex-col gap-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('taskId')
        onDrop(taskId)
      }}
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 grid place-items-center text-[#4CD96A]">
            <column.icon size={16} />
          </div>
          <h3 className="font-bold text-white tracking-tight">{column.label}</h3>
        </div>
        <span className="text-xs font-black text-slate-500 bg-white/5 px-2 py-1 rounded-lg">{tasks.length}</span>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-[2.5rem] p-3 space-y-3 min-h-[500px]">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={() => onDeleteTask(task.id)} 
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task.id)
              setDraggedTaskId(task.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function TaskCard({ task, onDelete, onDragStart }) {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      whileHover={{ y: -2 }}
      className="glass-dark p-5 rounded-3xl border border-white/5 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-3">
         <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
           task.priority === 'Alta' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
         }`}>
           {task.priority || 'Media'}
         </div>
         <button onClick={onDelete} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
           <Trash2 size={14} />
         </button>
      </div>
      
      <h4 className="text-sm font-bold text-white leading-snug">{task.title}</h4>
      {task.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic font-medium">{task.description}</p>}
      
      {task.tag && (
        <div className="mt-4 flex items-center gap-1.5">
          <Tag size={10} className="text-[#4CD96A]" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{task.tag}</span>
        </div>
      )}
    </motion.div>
  )
}


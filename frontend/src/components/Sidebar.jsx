import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users2, 
  Settings, 
  LogOut,
  PlusCircle,
  BarChart3
} from 'lucide-react'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const menuItems = [
  { icon: BarChart3, label: 'Resumen', path: '/dashboard' },
  { icon: FolderKanban, label: 'Proyectos', path: '/proyectos' },
  { icon: Users2, label: 'Equipo', path: '/equipo' },
  { icon: Settings, label: 'Ajustes', path: '/ajustes' },
]

export default function Sidebar({ onLogout, userInitiales }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col h-screen sticky top-0 border-r border-white/5">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={iteriaLogo} alt="Iteria" className="h-10 w-auto rounded-lg" />
          <span className="font-bold text-xl tracking-tight">Iteria</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link 
          to="/proyectos/crear" 
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#4CD96A] text-slate-950 font-bold mb-8 hover:bg-[#3eb85c] transition-all shadow-lg shadow-[#4CD96A]/10 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>Nuevo Proyecto</span>
        </Link>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-white/10 text-[#4CD96A]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-[#4CD96A] rounded-r-full"
                />
              )}
              <item.icon size={20} className={isActive ? 'text-[#4CD96A]' : 'group-hover:text-[#4CD96A]'} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-[#4CD96A]/20 flex items-center justify-center text-[#4CD96A] font-bold">
            {userInitiales}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Mi Cuenta</p>
            <button 
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <LogOut size={12} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

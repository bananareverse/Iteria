import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const Accesos_rapidos = [
  { id: 'crear', label: 'Crear proyecto', desc: 'Nuevo proyecto', to: '#' },
  {id: 'proyectos', label: 'Ver proyectos', desc: 'Consultar todos los proyectos', to:'#'},
  {id: 'ajustes', label: 'Configuracion', desc:'Ajustes y preferencias', to: '#'}
]


export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleSalir() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const nombre = user?.user_metadata?.full_name || user?.useremail?.split('@')[0] || 'Usuario'
  const iniciales = nombre.split(' ').map(n => n(0)).join('').toUpperCase().slice(0, 2) || U
  const fecha = new Date().toLocaleDateString('es_ES', {weekday:'long', day:'numeric', month:'long'})

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
    <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src={iteriaLogo} alt="Iteria" className="h-8 w-auto object-contain" />
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

    {/* Columna Main */}




    </div>

  )
}

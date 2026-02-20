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

  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
    <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">
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

    {/* Columna Main */}
    <main className='flex-1 w-full max-w-4xl mx-auto px-4 py-8 lg:py-12'>
    {/* Parte de la bienvienida*/}
    <section className='mb-10'>
      <p className = 'text-slate-500 text-sm capitalize mb-1'>{fecha}</p>
      <h1 className= 'text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight'> Hola, {nombre}</h1>
      <p className='text-slate-500 mt-2'>¿Qué hacemos hoy?</p>
    </section>
    
    {/*Quick links*/}
    <section className='mb-10'>
      <h2 className='text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4'>Accesos rapidos</h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {Accesos_rapidos.map((item) => (
          <Link
          key={item.id}
          to={item.to}
          className="group flex flex-col gap-2 p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-[#4CD96A]/40 hover:shadow-lg hover:shadow-[#4CD96A]/5 transition-all">
            <span className='font-semibold text-slate-900 group-hover:text-[#4CD96A] transition-colors'>
              {item.label}
            </span>
            <span className='text-sm text-slate-500'>{item.desc}</span>
            </Link>
        ))}
      </div>
    </section>

    <section className='p-5 rounded-2xl bg-[#4CD96A]/5 border border-[#4CD96A]/20'>
    <p className='text-slate-700 text-sm'>
      <span className='font-semibold text-[#4CD96A]'>Tip:</span> Crea tu primer proyecto y organiza tareas con metodologias agiles.
    </p>
  </section>
  </main>
</div>

  )
}

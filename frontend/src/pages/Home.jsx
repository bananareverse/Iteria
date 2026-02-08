import { useState } from 'react'
import { Link } from 'react-router-dom'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

const CARDS = [
    {
    tag: 'PPROYECTOS Y TAREAS',
    tagClass: 'bg-[#4CD96A]/10 text-[#2d9f4a]',
    iconClass: 'bg-[#4CD96A]/20 text-[#4CD96A]',
    title: 'Desarrollo',
    items: ['Tareas en progreso', 'Sprints y backlog'],
},
{
    tag: 'CAMPAÑAS',
    tagClass: 'bg-emerald-50 text-emerald-700',
    iconClass: 'bg-emerald-100 text-emerald-600',
    title: 'Marketing',
    items: ['Planificación', 'Calendario editorial'],
},
{
    tag: 'IDEAS',
    tagClass: 'bg-violet-100 text-violet-700',
    iconClass: 'bg-violet-100 text-violet-600',
    title: 'Gestión de proyectos',
    items: ['Roadmaps', 'Seguimiento de entregas'],
},
{
    tag: 'SOLICITUDES',
    tagClass: 'bg-amber-50 text-amber-700',
    iconClass: 'bg-amber-100 text-amber-600',
    title: 'TI / Soporte',
    items: ['Formularios y tickets', 'SLA y prioridades'],
},
]


export default function Home() {
  const [bannerClosed, setBannerClosed] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Añade aquí cada parte siguiendo la guía: frontend/HOME_APRENDER_PASO_A_PASO.md */}
      {/* Paso 1: Header */}
      <header className='sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-sm'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className="flex items-center justify-between h-16 lg:h-18">
        <Link to='/' className='flex items-center gap-3 hover:opacity-70 '>
        <img src={iteriaLogo} alt='Iteria' className='h-15 w-auto object-contain' />
        </Link>

        <nav className='hidden md:flex items-center gap-8'>
            <a href='#' classname='text-slate-600 hover:text-slate-900 text-sm font-medium'>
                Funciones
            </a>
            <a href='#' className='text-slate-600 hover:text-slate-900 text-sm font-medium'>
                Guia
            </a>
        </nav>

        <div className='flex items-center gap-4'>
            <Link to='/register' className="px-4 py-2 bg-[#4CD96A] text-white rounded-xl text-sm font-semibold hover:bg-[#3eb85c] active:scale-[0.98] transition-all shadow-md shadow-[#4CD96A]/25"
            > Registrarse </Link>
            <Link to='/login' className="px-4 py-2.5 text-slate-700 hover:text-[#4CD96A] font-medium text-sm transition-colors"
            > Iniciar sesion </Link>
        </div>
    </div>
    </div>
    </header>

      {/* Paso 2: Banner */}
        {!bannerClosed && (
            <div className='bg-[#4CD96A]/10 border-b border-[#4CD96A]/20'>
                <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4'>
                    <p className='text-slate-700 text-sm flex-1'>
                        <span className='font-semibold text-slate-900'>Iteria</span> - Gestión de proyectos ágil para estudiantes y equipos.
                        <a href='#' className='ml-2 text-[#4CD96A] font-semibold hover:underline'>Más información →</a>
                        <button type='button' onClick={() => setBannerClosed(true)} className='text-slate-900 hover:text-slate-600 p-1 rounded transition-colors px-12 text-lg' aria-label='Cerrar' >   ✕</button>
                    </p>
                </div>
            </div>
        )}

      {/* Paso 3: Hero */}
      <section className='bg-slate-900 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(76,217,106,0.15),transparent)]' />
        <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28'>
            <div className='grid lg:grid-cols-2 gap-14 lg:gap-16 items-center'>
                <div>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6'>
                        Enfocate en los {' '} <span className='text-[#4CD96A]'>resultados</span>, no en el papeleo
                    </h1>
                    <p className='text-slate-300 text-lg lg:text-xl max-w-xl leading-relaxed'>
                        Gestión de proyectos ágil.
                    </p>
                </div>

                <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-2xl border border-slate-700/50 max-w-md mx-auto lg:mx-0 w-full'>
                <p className='text-slate-300 text-sm mb-6'>
                    Regístrate gratis y empieza a organizar tus proyectos.
                </p>
                <Link to='/register' className='block w-full py-3.5 bg-[#4CD96A] text-slate-900 font-semibold rounded-xl text-center hover:bg-[#5ce67a] active:scale-[0.99] transition-all shadow-lg shadow-[#4CD96A]/30'>
                  Registrarse
                </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Paso 4: constante CARDS (arriba, antes de export default) */}

      <section className="py-20 lg:py-24 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Para cada tipo de equipo
          </h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-14">
            Planifica, colabora y entrega sin fricciones.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300"
              >
                <span
                  className={`inline-block px-3 py-1.5 ${card.tagClass} text-xs font-semibold rounded-full mb-4 tracking-wide`}
                >
                  {card.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{card.title}</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${card.iconClass} text-xs font-bold`}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Paso 6: Footer */}
      <footer className='border-t border-slate-200 bg-white py-8'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col items-center gap-4'>
            <div className='flex items-center gap-2'>
                <img src={iteriaLogo} alt='Iteria' className='h-15 w-auto object-contain' />
                <a href='#' className='text-slate-500 hover:text-slate-700 text-sm font-medium'>Terminos y condiciones</a>
            </div>
        </div>
      </footer>



    </div>
  )
}

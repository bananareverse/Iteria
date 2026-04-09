import { Link } from 'react-router-dom'
import iteriaLogo from '../../img/Iteria_Logo.jpeg'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={iteriaLogo} alt="Iteria" className="h-12 w-auto object-contain" />
            <span className="text-slate-900 font-semibold">Iteria</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Funciones</a>
            <a href="#cta" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Comenzar</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/register" className="rounded-2xl bg-[#4CD96A] px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-[#4CD96A]/25 transition hover:bg-[#3eb85c]">
              Registrarse
            </Link>
            <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-[#4CD96A]">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(76,217,106,0.18),_transparent_35%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-[#4CD96A]/15 px-4 py-1 text-sm font-semibold text-[#4CD96A]">
                Gestión rápida · Proyectos visibles · Marca Iteria
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Organiza tus proyectos con claridad desde el primer día.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Iteria te ayuda a convertir ideas en entregas reales con un tablero limpio, acciones directas y la paleta verde de tu equipo.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                  Iniciar sesión
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="text-slate-300">
                <p className="text-sm uppercase tracking-[0.24em]">Iteria en acción</p>
                <h2 className="mt-3 text-2xl font-bold text-white">Pantalla de proyecto y métricas claras</h2>
                <p className="mt-4">Accede rápido a tus proyectos activos, prioridades y progreso sin perder tiempo en menús.</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Proyecto</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Rediseño de landing</h3>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[68%] rounded-full bg-[#4CD96A]" />
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Prioridad</p>
                  <p className="mt-2 text-lg font-semibold text-white">Alta</p>
                  <p className="mt-3 text-sm text-slate-400">Controla lo urgente y entrega a tiempo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4CD96A]">Funciones</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Todo lo que necesitas para avanzar</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Dashboard de proyectos, creación rápida y seguimiento visual con un diseño accesible.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Crear proyectos', subtitle: 'Empieza con un proyecto en segundos.' },
              { title: 'Ver estado', subtitle: 'Monitorea el progreso en tiempo real.' },
              { title: 'Prioridades', subtitle: 'Identifica lo urgente al instante.' },
              { title: 'Colaboración', subtitle: 'Coordina tu equipo con claridad.' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-[#4CD96A] py-20 text-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white/10 p-10 shadow-xl shadow-[#4CD96A]/20 backdrop-blur-xl sm:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#166534]">Listo para empezar</p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Empieza tu primer proyecto hoy.</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

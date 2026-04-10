import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Overview from './pages/Overview'
import Team from './pages/Team'
import Settings from './pages/Settings'
import CrearProyecto from './pages/CrearProyecto'
import ProyectoDetalle from './pages/ProyectoDetalle'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        
        {/* Rutas Protegidas bajo el Sidebar Layout */}
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Overview />} />
          <Route path='/proyectos' element={<Dashboard />} />
          <Route path='/proyectos/crear' element={<CrearProyecto />} />
          <Route path='/proyectos/:projectId' element={<ProyectoDetalle />} />
          <Route path='/equipo' element={<Team />} />
          <Route path='/ajustes' element={<Settings />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App

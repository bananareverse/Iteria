import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CrearProyecto from './pages/CrearProyecto'
import ProyectoDetalle from './pages/ProyectoDetalle'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/proyectos' element={<Navigate to='/dashboard' replace />} />
        <Route path='/proyectos/crear' element={<CrearProyecto />} />
        <Route path='/proyectos/:projectId' element={<ProyectoDetalle />} />
      </Routes>
    </>
  )
}

export default App

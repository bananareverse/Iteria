import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Proyectos from './pages/Proyectos'
import CrearProyecto from './pages/CrearProyecto'
import './App.css'

function App() {
  return (
    <>

    
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/proyectos' element={<Proyectos />} />
        <Route path='/proyectos/crear' element={<CrearProyecto />} />
      </Routes>
    </>
  )
}

export default App

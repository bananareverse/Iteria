import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Registro from './pages/Registro'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <>

    
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Registro />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App

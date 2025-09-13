import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Clientes } from './pages/clientes'
import { Inventario } from './pages/inventario'
import { Sucursales } from './pages/sucursales'
import { Ventas } from './pages/ventas'
import { AnimatePresence } from 'framer-motion'
import Header from './components/header'
import SalesDashboard from './pages/sales-dashboard'

function AnimatedRoutes() {
  return (
    <AnimatePresence mode='wait'>
      <Routes>
        <Route path='/' element={<Ventas />} />
        <Route path='/clientes' element={<Clientes />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/sucursales' element={<Sucursales />} />
        <Route path='/ventas' element={<SalesDashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header /> {/* Añade el Header aquí */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <AnimatedRoutes />
      </main>
    </div>
  )
}

export default App

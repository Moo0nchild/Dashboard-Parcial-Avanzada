import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/home'
import { Clientes } from './pages/clientes'
import { Inventario } from './pages/inventario'
import { Predicciones } from './pages/predicciones'
import { Reportes } from './pages/reportes'
import { Sucursales } from './pages/sucursales'
import { Ventas } from './pages/ventas'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/clientes' element={<Clientes />} />
      <Route path='/inventario' element={<Inventario />} />
      <Route path='/predicciones' element={<Predicciones />} />
      <Route path='/reportes' element={<Reportes />} />
      <Route path='/sucursales' element={<Sucursales />} />
      <Route path='/ventas' element={<Ventas />} />
    </Routes>
  )
}

export default App

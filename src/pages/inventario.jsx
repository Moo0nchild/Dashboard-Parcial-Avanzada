import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)
export function Inventario() {
  // Estado para los datos de inventario
  const [inventoryData, setInventoryData] = useState({
    lowStock: [],
    expiringSoon: [],
    overstock: [],
    categoryRotation: [],
    lossIndicators: {
      expiration: 0,
      shrinkage: 0,
      total: 0,
    },
  })

  // Datos simulados
  const simulatedData = {
    lowStock: [
      {
        id: 'PRD015',
        name: 'Leche Entera',
        currentStock: 12,
        daysOfInventory: 3,
        category: 'Lácteos',
      },
      {
        id: 'PRD023',
        name: 'Yogurt Natural',
        currentStock: 8,
        daysOfInventory: 2,
        category: 'Lácteos',
      },
      {
        id: 'PRD045',
        name: 'Pan Integral',
        currentStock: 10,
        daysOfInventory: 1,
        category: 'Panadería',
      },
      {
        id: 'PRD067',
        name: 'Queso Fresco',
        currentStock: 15,
        daysOfInventory: 4,
        category: 'Lácteos',
      },
      {
        id: 'PRD089',
        name: 'Jamón de Pavo',
        currentStock: 9,
        daysOfInventory: 2,
        category: 'Cárnicos',
      },
    ],
    expiringSoon: [
      {
        id: 'PRD045',
        name: 'Pan Integral',
        expirationDate: '2023-10-20',
        daysUntilExpiration: 1,
        category: 'Panadería',
      },
      {
        id: 'PRD023',
        name: 'Yogurt Natural',
        expirationDate: '2023-10-21',
        daysUntilExpiration: 2,
        category: 'Lácteos',
      },
      {
        id: 'PRD112',
        name: 'Tortillas de Maíz',
        expirationDate: '2023-10-21',
        daysUntilExpiration: 2,
        category: 'Panadería',
      },
      {
        id: 'PRD156',
        name: 'Crema Fresca',
        expirationDate: '2023-10-22',
        daysUntilExpiration: 3,
        category: 'Lácteos',
      },
    ],
    overstock: [
      {
        id: 'PRD201',
        name: 'Arroz Premium',
        currentStock: 450,
        daysOfInventory: 45,
        category: 'Abarrotes',
      },
      {
        id: 'PRD205',
        name: 'Aceite de Oliva',
        currentStock: 120,
        daysOfInventory: 38,
        category: 'Abarrotes',
      },
      {
        id: 'PRD210',
        name: 'Conservas de Atún',
        currentStock: 280,
        daysOfInventory: 42,
        category: 'Abarrotes',
      },
      {
        id: 'PRD215',
        name: 'Detergente Líquido',
        currentStock: 95,
        daysOfInventory: 35,
        category: 'Limpieza',
      },
    ],
    categoryRotation: [
      { category: 'Lácteos', rotationRate: 4.2, idealRate: 3.5 },
      { category: 'Panadería', rotationRate: 6.8, idealRate: 5.0 },
      { category: 'Cárnicos', rotationRate: 3.5, idealRate: 3.0 },
      { category: 'Abarrotes', rotationRate: 1.2, idealRate: 1.5 },
      { category: 'Bebidas', rotationRate: 5.3, idealRate: 4.5 },
      { category: 'Limpieza', rotationRate: 1.8, idealRate: 2.0 },
      { category: 'Frutas y Verduras', rotationRate: 7.2, idealRate: 6.0 },
    ],
    lossIndicators: {
      expiration: 125000,
      shrinkage: 87500,
      total: 212500,
    },
  }

  // Configuración para el mapa de calor de rotación
  const rotationHeatmapOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mapa de Calor - Rotación por Categoría',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tasa de Rotación',
        },
      },
    },
  }

  const rotationHeatmapData = {
    labels: simulatedData.categoryRotation.map((item) => item.category),
    datasets: [
      {
        label: 'Rotación Actual',
        data: simulatedData.categoryRotation.map((item) => item.rotationRate),
        backgroundColor: simulatedData.categoryRotation.map((item) =>
          item.rotationRate >= item.idealRate * 1.2
            ? 'rgba(255, 99, 132, 0.8)'
            : item.rotationRate >= item.idealRate
            ? 'rgba(75, 192, 192, 0.8)'
            : 'rgba(255, 205, 86, 0.8)'
        ),
        borderColor: simulatedData.categoryRotation.map((item) =>
          item.rotationRate >= item.idealRate * 1.2
            ? 'rgb(255, 99, 132)'
            : item.rotationRate >= item.idealRate
            ? 'rgb(75, 192, 192)'
            : 'rgb(255, 205, 86)'
        ),
        borderWidth: 1,
      },
      {
        label: 'Rotación Ideal',
        data: simulatedData.categoryRotation.map((item) => item.idealRate),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 0.8)',
        borderWidth: 1,
        type: 'line',
      },
    ],
  }

  // Simular la obtención de datos
  useEffect(() => {
    // Aquí iría tu llamada a la API
    // fetchInventoryData().then(data => setInventoryData(data));

    // Por ahora usamos datos simulados
    setInventoryData(simulatedData)

    // Simular actualización en tiempo real cada 30 segundos
    const interval = setInterval(() => {
      // En una implementación real, harías fetch a tu API aquí
      console.log('Actualizando datos de inventario...')
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Función para formatear números como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Estado de Inventario Crítico</h1>

      {/* Indicadores de pérdidas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Pérdidas por Vencimiento
          </h3>
          <p className='text-2xl font-bold text-red-600'>
            {formatCurrency(inventoryData.lossIndicators.expiration)}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Pérdidas por Mermas
          </h3>
          <p className='text-2xl font-bold text-yellow-600'>
            {formatCurrency(inventoryData.lossIndicators.shrinkage)}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Pérdidas Totales
          </h3>
          <p className='text-2xl font-bold text-purple-600'>
            {formatCurrency(inventoryData.lossIndicators.total)}
          </p>
        </div>
      </div>

      {/* Mapa de calor de rotación */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <Bar options={rotationHeatmapOptions} data={rotationHeatmapData} />
      </div>

      {/* Productos con stock bajo */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4 flex items-center'>
          <span className='inline-block w-3 h-3 bg-red-500 rounded-full mr-2'></span>
          Productos con Stock Bajo (menos de 5 días de inventario)
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Producto
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Categoría
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock Actual
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Días de Inventario
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {inventoryData.lowStock.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.category}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.currentStock} unidades
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.daysOfInventory} días
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                      Crítico
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos próximos a vencer */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4 flex items-center'>
          <span className='inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2'></span>
          Productos Próximos a Vencer (siguientes 48 horas)
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Producto
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Categoría
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fecha de Vencimiento
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Días Restantes
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {inventoryData.expiringSoon.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.category}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.expirationDate}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.daysUntilExpiration} días
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                      Por Vencer
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos con sobrestock */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4 flex items-center'>
          <span className='inline-block w-3 h-3 bg-blue-500 rounded-full mr-2'></span>
          Productos con Sobrestock (más de 30 días de inventario)
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Producto
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Categoría
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock Actual
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Días de Inventario
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {inventoryData.overstock.map((product, index) => (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.category}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.currentStock} unidades
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.daysOfInventory} días
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      Sobrestock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

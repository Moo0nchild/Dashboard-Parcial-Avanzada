import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

export function Ventas() {
  const [realTimeSales, setRealTimeSales] = useState({
    total_sales: 0,
    total_transactions: 0,
    timestamp: new Date().toISOString(),
  })

  const [trendingProducts, setTrendingProducts] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [salesByHour, setSalesByHour] = useState([])
  const [dailyGoal, setDailyGoal] = useState(10000) // Meta diaria de ventas

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Obtener ventas en tiempo real
      const salesResponse = await fetch(
        'https://api-megamart.onrender.com/api/analytics/ventas/tiempo-real'
      )
      const salesData = await salesResponse.json()
      setRealTimeSales(salesData)

      // Obtener productos más vendidos
      const trendingResponse = await fetch(
        'https://api-megamart.onrender.com/api/analytics/productos/trending'
      )
      const trendingData = await trendingResponse.json()
      setTrendingProducts(trendingData.slice(0, 10)) // Top 10 productos

      // Obtener sucursales
      const branchesResponse = await fetch(
        'https://api-megamart.onrender.com/api/sedes'
      )
      const branchesData = await branchesResponse.json()
      setBranches(branchesData)
      console.log(branchesData)

      // Simular datos de ventas por hora (en un caso real, esto vendría de la API)
      const mockSalesByHour = Array.from({ length: 12 }, (_, i) => ({
        hour: `${i + 8}:00`, // De 8:00 AM a 7:00 PM
        sales: Math.floor(Math.random() * 2000) + 500,
      }))
      setSalesByHour(mockSalesByHour)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar datos iniciales y configurar intervalo de actualización
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 120000) // Actualizar cada 2 minutos

    return () => clearInterval(interval)
  }, [])

  // Configuración del gráfico de ventas por hora
  const salesByHourChart = {
    labels: salesByHour.map((item) => item.hour),
    datasets: [
      {
        label: 'Ventas por hora ($)',
        data: salesByHour.map((item) => item.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas por hora (hoy)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto en pesos ($)',
        },
      },
    },
  }

  // Calcular comparación con el día anterior (simulado)
  const previousDayComparison = {
    sales: realTimeSales.total_sales * 0.85, // 85% de las ventas actuales (simulado)
    transactions: realTimeSales.total_transactions * 0.9, // 90% de las transacciones (simulado)
  }

  const salesDifference =
    realTimeSales.total_sales - previousDayComparison.sales
  const transactionsDifference =
    realTimeSales.total_transactions - previousDayComparison.transactions

  // Verificar si las ventas están por debajo del objetivo
  const isBelowGoal = realTimeSales.total_sales < dailyGoal

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
          Panel de Ventas en Tiempo Real
        </h1>
        <p className='text-gray-600'>
          Última actualización:{' '}
          {new Date(realTimeSales.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Filtros */}
      {/* <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sucursal
            </label>
            <select
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value='all'>Todas las sucursales</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className='w-full md:w-1/3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha inicial
            </label>
            <input
              type='date'
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='w-full md:w-1/3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha final
            </label>
            <input
              type='date'
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>
      </div> */}

      {/* Alertas de rendimiento */}
      {isBelowGoal && (
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-yellow-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-yellow-700'>
                Las ventas están por debajo del objetivo diario de $
                {dailyGoal.toLocaleString()}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de ventas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Ventas Hoy</h3>
          <p className='text-2xl font-bold text-blue-600'>
            ${realTimeSales.total_sales.toLocaleString()}
          </p>
          <div
            className={`flex items-center mt-2 ${
              salesDifference >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {salesDifference >= 0 ? (
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 10l7-7m0 0l7 7m-7-7v18'
                ></path>
              </svg>
            ) : (
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                ></path>
              </svg>
            )}
            <span className='text-sm'>
              {Math.abs(salesDifference).toLocaleString()} (
              {salesDifference >= 0 ? '+' : ''}
              {((salesDifference / previousDayComparison.sales) * 100).toFixed(
                1
              )}
              %) vs. día anterior
            </span>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Transacciones</h3>
          <p className='text-2xl font-bold text-blue-600'>
            {realTimeSales.total_transactions}
          </p>
          <div
            className={`flex items-center mt-2 ${
              transactionsDifference >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {transactionsDifference >= 0 ? (
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 10l7-7m0 0l7 7m-7-7v18'
                ></path>
              </svg>
            ) : (
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                ></path>
              </svg>
            )}
            <span className='text-sm'>
              {/* {Math.abs(transactionsDifference)}  */}
              (
              {transactionsDifference >= 0 ? '+' : ''}
              {(
                (transactionsDifference / previousDayComparison.transactions) *
                100
              ).toFixed(1)}
              %) vs. día anterior
            </span>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Ticket Promedio
          </h3>
          <p className='text-2xl font-bold text-blue-600'>
            $
            {realTimeSales.total_transactions > 0
              ? (
                  realTimeSales.total_sales / realTimeSales.total_transactions
                )
              : '0.00'}
          </p>
          <p className='text-sm text-gray-500 mt-2'>Por transacción</p>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Objetivo Diario
          </h3>
          <p className='text-2xl font-bold text-blue-600'>
            ${dailyGoal.toLocaleString()}
          </p>
          <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
            <div
              className='bg-blue-600 h-2.5 rounded-full'
              style={{
                width: `${Math.min(
                  100,
                  (realTimeSales.total_sales / dailyGoal) * 100
                )}%`,
              }}
            ></div>
          </div>
          <p className='text-sm text-gray-500 mt-1'>
            {((realTimeSales.total_sales / dailyGoal) * 100).toFixed(1)}%
            completado
          </p>
        </div>
      </div>

      {/* Gráficos y tablas */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Gráfico de ventas por hora */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Ventas por Hora
          </h3>
          <div className='h-64'>
            <Bar data={salesByHourChart} options={chartOptions} />
          </div>
        </div>

        {/* Top 10 productos más vendidos */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Top 10 Productos Hoy
          </h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Producto
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Unidades Vendidas
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {trendingProducts.map((product, index) => (
                  <tr key={product.product_id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {index + 1}. {product.name}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {product.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

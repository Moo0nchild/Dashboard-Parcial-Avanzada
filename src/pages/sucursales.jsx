import React, { useState, useEffect, useCallback } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function Sucursales() {
  const [transactions, setTransactions] = useState([])
  const [branches, setBranches] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    branch: 'all',
    dateRange: 'today',
    startDate: '',
    endDate: '',
  })

  // Función para obtener datos de la API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [transactionsRes, branchesRes, summaryRes] = await Promise.all([
        fetch('https://api-megamart.onrender.com/api/transacciones'),
        fetch('https://api-megamart.onrender.com/api/sedes'),
        fetch('https://api-megamart.onrender.com/api/resumen/transacciones'),
      ])

      const transactionsData = await transactionsRes.json()
      const branchesData = await branchesRes.json()
      const summaryData = await summaryRes.json()

      console.log(transactionsData)
      setTransactions(transactionsData)
      setBranches(branchesData)
      setSummary(summaryData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Efecto para cargar datos iniciales y configurar intervalo de actualización
  useEffect(() => {
    fetchData()

    // Configurar intervalo de actualización cada 2 minutos
    const interval = setInterval(fetchData, 120000)

    return () => clearInterval(interval)
  }, [fetchData])

  // Función para filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtrar por sucursal
    if (filters.branch !== 'all' && transaction.branch_id !== filters.branch) {
      return false
    }

    // Filtrar por rango de fechas
    const transactionDate = new Date(transaction.created_at)

    if (filters.dateRange === 'today') {
      const today = new Date()
      return transactionDate.toDateString() === today.toDateString()
    } else if (filters.dateRange === 'week') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return transactionDate >= oneWeekAgo
    } else if (filters.dateRange === 'month') {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return transactionDate >= oneMonthAgo
    } else if (
      filters.dateRange === 'custom' &&
      filters.startDate &&
      filters.endDate
    ) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59) // Hasta el final del día
      return transactionDate >= startDate && transactionDate <= endDate
    }

    return true
  })

  // Calcular ventas por sucursal
  const salesByBranch = branches.map((branch) => {
    console.log(branch)
    const branchSales = filteredTransactions
      .filter(
        (t) => t.branch_id === branch.branch_id && t.status === 'completed'
      )
      .reduce((sum, transaction) => sum + transaction.total, 0)

    return {
      name: branch.name,
      sales: branchSales,
    }
  })

  // Preparar datos para gráficos
  const salesChartData = {
    labels: salesByBranch.map((branch) => branch.name),
    datasets: [
      {
        label: 'Ventas por Sucursal',
        data: salesByBranch.map((branch) => branch.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const timelineData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
      {
        label: 'Ventas por Hora',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 2500],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      {/* Header */}
      <header className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
          Análisis de Sucursales
        </h1>
        <p className='text-gray-600'>
          Monitoreo en tiempo real de las sucursales
        </p>
      </header>

      {/* Filtros */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sucursal
            </label>
            <select
              name='branch'
              value={filters.branch}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='all'>Todas las sucursales</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Rango de fechas
            </label>
            <select
              name='dateRange'
              value={filters.dateRange}
              onChange={handleFilterChange}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='today'>Hoy</option>
              <option value='week'>Esta semana</option>
              <option value='month'>Este mes</option>
              <option value='custom'>Personalizado</option>
            </select>
          </div>

          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha inicio
                </label>
                <input
                  type='date'
                  name='startDate'
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha fin
                </label>
                <input
                  type='date'
                  name='endDate'
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resumen de ventas */}
      {summary && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Total de Transacciones
            </h3>
            <p className='text-3xl font-bold text-blue-600'>
              {summary.total_transactions}
            </p>
          </div>

          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Ventas Totales
            </h3>
            <p className='text-3xl font-bold text-green-600'>
              ${summary.total_sales.toFixed(2)}
            </p>
          </div>

          <div className='bg-white p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Transacciones Completadas
            </h3>
            <p className='text-3xl font-bold text-purple-600'>
              {summary.by_status.completed.count} / {summary.total_transactions}
            </p>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Ventas por Sucursal
          </h3>
          <div className='h-80'>
            <Bar data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Tendencia de Ventas por Hora
          </h3>
          <div className='h-80'>
            <Line data={timelineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Ranking de sucursales */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Ranking de Sucursales por Ventas
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sucursal
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ventas
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {salesByBranch
                .sort((a, b) => b.sales - a.sales)
                .map((branch, index) => {
                  const branchInfo = branches.find(
                    (b) => b.name === branch.name
                  )
                  return (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {branch.name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {branchInfo?.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          ${branch.sales.toFixed(2)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            branchInfo?.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {branchInfo?.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transacciones recientes */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Transacciones Recientes
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sucursal
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {transaction._id.substring(0, 8)}...
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {transaction.branch_id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${transaction.total.toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status === 'completed'
                        ? 'Completado'
                        : 'Pendiente'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(transaction.created_at).toLocaleDateString()}
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

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
import { Bar, Doughnut } from 'react-chartjs-2'

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
export function Sucursales() {
  // Estado para los datos de sucursales
  const [branchData, setBranchData] = useState({
    dailyRanking: [],
    weeklyRanking: [],
    monthlyRanking: [],
    performanceIndicators: [],
    profitabilityComparison: [],
    operationalIssues: [],
  })

  // Estado para el período seleccionado
  const [selectedPeriod, setSelectedPeriod] = useState('daily')

  // Datos simulados
  const simulatedData = {
    dailyRanking: [
      {
        id: 'SUC1',
        name: 'Sucursal Centro',
        sales: 1850000,
        transactions: 125,
        growth: 8.2,
      },
      {
        id: 'SUC2',
        name: 'Sucursal Norte',
        sales: 1620000,
        transactions: 98,
        growth: 5.4,
      },
      {
        id: 'SUC3',
        name: 'Sucursal Sur',
        sales: 1430000,
        transactions: 87,
        growth: 12.7,
      },
      {
        id: 'SUC4',
        name: 'Sucursal Este',
        sales: 1280000,
        transactions: 76,
        growth: -2.1,
      },
      {
        id: 'SUC5',
        name: 'Sucursal Oeste',
        sales: 1150000,
        transactions: 68,
        growth: 3.8,
      },
    ],
    weeklyRanking: [
      {
        id: 'SUC1',
        name: 'Sucursal Centro',
        sales: 9850000,
        transactions: 625,
        growth: 7.5,
      },
      {
        id: 'SUC3',
        name: 'Sucursal Sur',
        sales: 7650000,
        transactions: 485,
        growth: 10.2,
      },
      {
        id: 'SUC2',
        name: 'Sucursal Norte',
        sales: 7450000,
        transactions: 465,
        growth: 4.8,
      },
      {
        id: 'SUC4',
        name: 'Sucursal Este',
        sales: 6250000,
        transactions: 395,
        growth: -1.5,
      },
      {
        id: 'SUC5',
        name: 'Sucursal Oeste',
        sales: 5450000,
        transactions: 325,
        growth: 2.3,
      },
    ],
    monthlyRanking: [
      {
        id: 'SUC1',
        name: 'Sucursal Centro',
        sales: 38500000,
        transactions: 2450,
        growth: 9.1,
      },
      {
        id: 'SUC3',
        name: 'Sucursal Sur',
        sales: 29500000,
        transactions: 1850,
        growth: 12.4,
      },
      {
        id: 'SUC2',
        name: 'Sucursal Norte',
        sales: 28500000,
        transactions: 1750,
        growth: 5.7,
      },
      {
        id: 'SUC4',
        name: 'Sucursal Este',
        sales: 22500000,
        transactions: 1450,
        growth: -0.8,
      },
      {
        id: 'SUC5',
        name: 'Sucursal Oeste',
        sales: 19500000,
        transactions: 1250,
        growth: 3.2,
      },
    ],
    performanceIndicators: [
      {
        id: 'SUC1',
        name: 'Sucursal Centro',
        performance: 95,
        status: 'excellent',
        customers: 1250,
        avgTicket: 14800,
      },
      {
        id: 'SUC2',
        name: 'Sucursal Norte',
        performance: 82,
        status: 'good',
        customers: 980,
        avgTicket: 16530,
      },
      {
        id: 'SUC3',
        name: 'Sucursal Sur',
        performance: 88,
        status: 'good',
        customers: 1120,
        avgTicket: 13160,
      },
      {
        id: 'SUC4',
        name: 'Sucursal Este',
        performance: 65,
        status: 'warning',
        customers: 760,
        avgTicket: 16842,
      },
      {
        id: 'SUC5',
        name: 'Sucursal Oeste',
        performance: 78,
        status: 'average',
        customers: 850,
        avgTicket: 13765,
      },
    ],
    profitabilityComparison: [
      {
        id: 'SUC1',
        name: 'Sucursal Centro',
        revenue: 38500000,
        costs: 27500000,
        profit: 11000000,
        margin: 28.6,
      },
      {
        id: 'SUC3',
        name: 'Sucursal Sur',
        revenue: 29500000,
        costs: 20500000,
        profit: 9000000,
        margin: 30.5,
      },
      {
        id: 'SUC2',
        name: 'Sucursal Norte',
        revenue: 28500000,
        costs: 21000000,
        profit: 7500000,
        margin: 26.3,
      },
      {
        id: 'SUC5',
        name: 'Sucursal Oeste',
        revenue: 19500000,
        costs: 14500000,
        profit: 5000000,
        margin: 25.6,
      },
      {
        id: 'SUC4',
        name: 'Sucursal Este',
        revenue: 22500000,
        costs: 18000000,
        profit: 4500000,
        margin: 20.0,
      },
    ],
    operationalIssues: [
      {
        branch: 'SUC4',
        issue: 'Caja 2 fuera de servicio',
        severity: 'high',
        time: '3 horas',
        reportedBy: 'Jefe de Turno',
      },
      {
        branch: 'SUC2',
        issue: 'Sistema lento en cajas',
        severity: 'medium',
        time: '1 hora',
        reportedBy: 'Supervisor',
      },
      {
        branch: 'SUC5',
        issue: 'Problema con terminal de pago',
        severity: 'medium',
        time: '2 horas',
        reportedBy: 'Cajero',
      },
      {
        branch: 'SUC4',
        issue: 'Error en inventario',
        severity: 'high',
        time: '5 horas',
        reportedBy: 'Almacenista',
      },
      {
        branch: 'SUC1',
        issue: 'Fallo intermitente en red',
        severity: 'low',
        time: '30 min',
        reportedBy: 'Sistemas',
      },
    ],
  }

  // Configuración para el gráfico de ranking
  const rankingChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ranking de Sucursales por Ventas',
      },
    },
  }

  const getRankingChartData = () => {
    const data =
      selectedPeriod === 'daily'
        ? simulatedData.dailyRanking
        : selectedPeriod === 'weekly'
        ? simulatedData.weeklyRanking
        : simulatedData.monthlyRanking

    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: `Ventas ${
            selectedPeriod === 'daily'
              ? 'del día'
              : selectedPeriod === 'weekly'
              ? 'de la semana'
              : 'del mes'
          }`,
          data: data.map((item) => item.sales),
          backgroundColor: 'rgba(53, 162, 235, 0.8)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  // Configuración para el gráfico de márgenes
  const marginChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Margen de Rentabilidad por Sucursal (%)',
      },
    },
  }

  const marginChartData = {
    labels: simulatedData.profitabilityComparison.map((item) => item.name),
    datasets: [
      {
        label: 'Margen de Rentabilidad (%)',
        data: simulatedData.profitabilityComparison.map((item) => item.margin),
        backgroundColor: simulatedData.profitabilityComparison.map((item) =>
          item.margin >= 28
            ? 'rgba(75, 192, 192, 0.8)'
            : item.margin >= 25
            ? 'rgba(255, 205, 86, 0.8)'
            : 'rgba(255, 99, 132, 0.8)'
        ),
        borderColor: simulatedData.profitabilityComparison.map((item) =>
          item.margin >= 28
            ? 'rgba(75, 192, 192, 1)'
            : item.margin >= 25
            ? 'rgba(255, 205, 86, 1)'
            : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      },
    ],
  }

  // Configuración para el gráfico de rendimiento
  const performanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Indicadores de Rendimiento por Sucursal',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Puntuación',
        },
      },
    },
  }

  const performanceChartData = {
    labels: simulatedData.performanceIndicators.map((item) => item.name),
    datasets: [
      {
        label: 'Rendimiento (%)',
        data: simulatedData.performanceIndicators.map(
          (item) => item.performance
        ),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Simular la obtención de datos
  useEffect(() => {
    // Aquí iría tu llamada a la API
    // fetchBranchData().then(data => setBranchData(data));

    // Por ahora usamos datos simulados
    setBranchData(simulatedData)

    // Simular actualización en tiempo real cada 30 segundos
    const interval = setInterval(() => {
      // En una implementación real, harías fetch a tu API aquí
      console.log('Actualizando datos de sucursales...')
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

  // Función para obtener el color según el estado de rendimiento
  const getPerformanceColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'average':
        return 'bg-yellow-100 text-yellow-800'
      case 'warning':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el texto según el estado de rendimiento
  const getPerformanceText = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excelente'
      case 'good':
        return 'Bueno'
      case 'average':
        return 'Regular'
      case 'warning':
        return 'Advertencia'
      case 'critical':
        return 'Crítico'
      default:
        return 'Desconocido'
    }
  }

  // Función para obtener el color según la severidad del problema
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Análisis de Sucursales</h1>

      {/* Selector de período */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Ranking de Sucursales</h2>
          <div className='flex space-x-2'>
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedPeriod('daily')}
            >
              Día
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'weekly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Semana
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos de ranking y márgenes */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <Bar options={rankingChartOptions} data={getRankingChartData()} />
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <Bar options={marginChartOptions} data={marginChartData} />
        </div>
      </div>

      {/* Indicadores de rendimiento */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Indicadores de Rendimiento por Sucursal
        </h2>

        {/* Gráfico de rendimiento */}
        <div className='mb-6'>
          <Bar options={performanceChartOptions} data={performanceChartData} />
        </div>

        {/* Tabla de rendimiento por sucursal */}
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sucursal
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Rendimiento
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Clientes Atendidos
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ticket Promedio
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {branchData.performanceIndicators.map((branch, index) => (
                <tr
                  key={branch.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {branch.name}
                        </div>
                        <div className='text-sm text-gray-500'>{branch.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div
                        className={`h-2.5 rounded-full ${
                          branch.performance >= 90
                            ? 'bg-green-500'
                            : branch.performance >= 80
                            ? 'bg-blue-500'
                            : branch.performance >= 70
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${branch.performance}%` }}
                      ></div>
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {branch.performance}%
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPerformanceColor(
                        branch.status
                      )}`}
                    >
                      {getPerformanceText(branch.status)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {branch.customers}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(branch.avgTicket)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparativa de rentabilidad */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Comparativa de Rentabilidad
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sucursal
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ingresos
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Costos
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Utilidad
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Margen
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {branchData.profitabilityComparison.map((branch, index) => (
                <tr
                  key={branch.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {branch.name}
                        </div>
                        <div className='text-sm text-gray-500'>{branch.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(branch.revenue)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(branch.costs)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(branch.profit)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        branch.margin >= 28
                          ? 'bg-green-100 text-green-800'
                          : branch.margin >= 25
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {branch.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Problemas operativos */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Problemas Operativos</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sucursal
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Problema
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Severidad
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tiempo
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Reportado por
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {branchData.operationalIssues.map((issue, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {issue.branch}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {issue.issue}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity === 'high'
                        ? 'Alta'
                        : issue.severity === 'medium'
                        ? 'Media'
                        : 'Baja'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {issue.time}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {issue.reportedBy}
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

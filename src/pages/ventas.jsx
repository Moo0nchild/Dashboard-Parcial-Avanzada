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
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import PageWrapper from '../components/page-wrapper'

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
export function Ventas() {
  // Estado para los datos
  const [salesData, setSalesData] = useState({
    todaySales: {
      totalAmount: 0,
      transactions: 0,
    },
    previousWeekComparison: {
      amountChange: 0,
      transactionsChange: 0,
    },
    hourlySales: [],
    topProducts: [],
    performanceAlerts: [],
  })

  // Estado para simular datos en tiempo real (luego reemplazarás con tu API)
  const [simulatedData, setSimulatedData] = useState({
    todaySales: {
      totalAmount: 125430,
      transactions: 48,
    },
    previousWeekComparison: {
      amountChange: 12.5, // Porcentaje
      transactionsChange: -3.2, // Porcentaje
    },
    hourlySales: [
      { hour: '9:00', sales: 12000 },
      { hour: '10:00', sales: 18500 },
      { hour: '11:00', sales: 22500 },
      { hour: '12:00', sales: 30500 },
      { hour: '13:00', sales: 28000 },
      { hour: '14:00', sales: 19500 },
      { hour: '15:00', sales: 16500 },
      { hour: '16:00', sales: 14500 },
      { hour: '17:00', sales: 12500 },
      { hour: '18:00', sales: 9500 },
      { hour: '19:00', sales: 7500 },
      { hour: '20:00', sales: 4500 },
    ],
    topProducts: [
      { id: 'PRD001', name: 'Coca-Cola 500ml', sales: 25, revenue: 45000 },
      { id: 'PRD002', name: 'Pepsi 500ml', sales: 18, revenue: 32000 },
      { id: 'PRD003', name: 'Sprite 500ml', sales: 15, revenue: 28000 },
      { id: 'PRD004', name: 'Jugo de Naranja', sales: 12, revenue: 21000 },
      { id: 'PRD005', name: 'Jugo de Manzana', sales: 10, revenue: 18000 },
      { id: 'PRD006', name: 'Leche 1lt', sales: 8, revenue: 15000 },
      { id: 'PRD007', name: 'Yogurt', sales: 7, revenue: 12000 },
      { id: 'PRD008', name: 'Bebida Energizante', sales: 6, revenue: 10000 },
      { id: 'PRD009', name: 'Agua 1lt', sales: 5, revenue: 8500 },
      { id: 'PRD010', name: 'Jugo de Pera', sales: 4, revenue: 7000 },
    ],
    performanceAlerts: [
      {
        type: 'warning',
        message: 'Ventas por debajo del objetivo en la última hora',
      },
      { type: 'info', message: 'Producto PRD002 con stock bajo' },
    ],
  })

  // Configuración para el gráfico de ventas por hora
  const hourlySalesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas por hora',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)',
        },
      },
    },
  }

  const hourlySalesData = {
    labels: simulatedData.hourlySales.map((item) => item.hour),
    datasets: [
      {
        label: 'Ventas por hora',
        data: simulatedData.hourlySales.map((item) => item.sales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  }

  // Configuración para el gráfico de productos más vendidos
  const topProductsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 productos más vendidos',
      },
    },
  }

  const topProductsData = {
    labels: simulatedData.topProducts.map((item) => item.name),
    datasets: [
      {
        label: 'Cantidad vendida',
        data: simulatedData.topProducts.map((item) => item.sales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Simular la obtención de datos (reemplazar con tu API)
  useEffect(() => {
    // Aquí iría tu llamada a la API
    // fetchSalesData().then(data => setSalesData(data));

    // Por ahora usamos datos simulados
    setSalesData(simulatedData)

    // Simular actualización en tiempo real cada 30 segundos
    const interval = setInterval(() => {
      // En una implementación real, harías fetch a tu API aquí
      console.log('Actualizando datos...')
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Función para formatear números como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount)
  }

  return (
    <PageWrapper>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-6'>
          Panel de Ventas en Tiempo Real
        </h1>

        {/* Alertas de rendimiento */}
        {salesData.performanceAlerts.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Alertas</h2>
            <div className='space-y-2'>
              {salesData.performanceAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : alert.type === 'danger'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de ventas del día */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Ventas de Hoy</h2>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-gray-600'>Monto Total</p>
                <p className='text-3xl font-bold text-green-600'>
                  {formatCurrency(salesData.todaySales.totalAmount)}
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Transacciones</p>
                <p className='text-3xl font-bold text-blue-600'>
                  {salesData.todaySales.transactions}
                </p>
              </div>
            </div>
          </div>

          {/* Comparación con semana anterior */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>
              Comparación con semana anterior
            </h2>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-gray-600'>Monto</p>
                <p
                  className={`text-2xl font-bold ${
                    salesData.previousWeekComparison.amountChange >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {salesData.previousWeekComparison.amountChange >= 0
                    ? '+'
                    : ''}
                  {salesData.previousWeekComparison.amountChange}%
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Transacciones</p>
                <p
                  className={`text-2xl font-bold ${
                    salesData.previousWeekComparison.transactionsChange >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {salesData.previousWeekComparison.transactionsChange >= 0
                    ? '+'
                    : ''}
                  {salesData.previousWeekComparison.transactionsChange}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Line options={hourlySalesOptions} data={hourlySalesData} />
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Bar options={topProductsOptions} data={topProductsData} />
          </div>
        </div>

        {/* Tabla de productos más vendidos */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>
            Top 10 Productos Más Vendidos Hoy
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Producto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cantidad Vendida
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {salesData.topProducts.map((product, index) => (
                  <tr key={product.id}>
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
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {product.sales} unidades
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

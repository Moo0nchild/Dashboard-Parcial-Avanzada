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
import { Bar, Doughnut, Line } from 'react-chartjs-2'

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
export function Clientes() {
  // Estado para los datos de clientes
  const [customerData, setCustomerData] = useState({
    purchasePatterns: {
      avgTicket: 0,
      itemsPerTransaction: 0,
      avgTicketHistory: [],
      itemsPerTransactionHistory: [],
    },
    customerSegmentation: {
      newVsRecurring: {
        new: 0,
        recurring: 0,
      },
      valueSegmentation: {
        highValue: 0,
        mediumValue: 0,
        lowValue: 0,
      },
      highValueCustomers: [],
    },
    frequentlyBoughtTogether: [],
    promotionEffectiveness: [],
    netPromoterScore: {
      score: 0,
      promoters: 0,
      passives: 0,
      detractors: 0,
      trend: [],
    },
  })

  const [loading, setLoading] = useState(true)

  // Datos simulados
  const simulatedData = {
    purchasePatterns: {
      avgTicket: 18500,
      itemsPerTransaction: 4.2,
      avgTicketHistory: [
        { month: 'Ene', value: 17200 },
        { month: 'Feb', value: 17800 },
        { month: 'Mar', value: 18100 },
        { month: 'Abr', value: 17900 },
        { month: 'May', value: 18300 },
        { month: 'Jun', value: 18500 },
      ],
      itemsPerTransactionHistory: [
        { month: 'Ene', value: 3.8 },
        { month: 'Feb', value: 4.0 },
        { month: 'Mar', value: 4.1 },
        { month: 'Abr', value: 4.0 },
        { month: 'May', value: 4.2 },
        { month: 'Jun', value: 4.2 },
      ],
    },
    customerSegmentation: {
      newVsRecurring: {
        new: 35,
        recurring: 65,
      },
      valueSegmentation: {
        highValue: 15,
        mediumValue: 45,
        lowValue: 40,
      },
      highValueCustomers: [
        {
          id: 'CLT001',
          name: 'María González',
          totalSpent: 485000,
          visits: 28,
        },
        {
          id: 'CLT005',
          name: 'Carlos Rodríguez',
          totalSpent: 412000,
          visits: 24,
        },
        { id: 'CLT012', name: 'Ana Silva', totalSpent: 398000, visits: 22 },
        { id: 'CLT023', name: 'Jorge Méndez', totalSpent: 365000, visits: 19 },
        {
          id: 'CLT034',
          name: 'Laura Fernández',
          totalSpent: 342000,
          visits: 18,
        },
      ],
    },
    frequentlyBoughtTogether: [
      {
        product1: 'Pan de Molde',
        product2: 'Mantequilla',
        frequency: 78,
        confidence: 0.65,
      },
      { product1: 'Café', product2: 'Leche', frequency: 72, confidence: 0.68 },
      {
        product1: 'Pasta',
        product2: 'Salsa de Tomate',
        frequency: 65,
        confidence: 0.62,
      },
      {
        product1: 'Yogurt',
        product2: 'Cereal',
        frequency: 58,
        confidence: 0.59,
      },
      {
        product1: 'Arroz',
        product2: 'Aceite',
        frequency: 52,
        confidence: 0.55,
      },
      {
        product1: 'Huevos',
        product2: 'Tocino',
        frequency: 47,
        confidence: 0.51,
      },
      { product1: 'Queso', product2: 'Jamón', frequency: 43, confidence: 0.48 },
      {
        product1: 'Papas',
        product2: 'Bebidas',
        frequency: 39,
        confidence: 0.45,
      },
    ],
    promotionEffectiveness: [
      {
        name: '2x1 en Lácteos',
        redemptionRate: 42,
        salesIncrease: 28,
        roi: 3.8,
      },
      {
        name: 'Descuento 30% Panadería',
        redemptionRate: 38,
        salesIncrease: 32,
        roi: 4.2,
      },
      {
        name: '3x2 en Bebidas',
        redemptionRate: 35,
        salesIncrease: 25,
        roi: 3.2,
      },
      {
        name: 'Promo Familiar',
        redemptionRate: 28,
        salesIncrease: 19,
        roi: 2.4,
      },
      {
        name: 'Descuento Nocturno',
        redemptionRate: 22,
        salesIncrease: 15,
        roi: 1.8,
      },
    ],
    netPromoterScore: {
      score: 68,
      promoters: 45,
      passives: 35,
      detractors: 20,
      trend: [
        { month: 'Ene', score: 62 },
        { month: 'Feb', score: 64 },
        { month: 'Mar', score: 65 },
        { month: 'Abr', score: 66 },
        { month: 'May', score: 67 },
        { month: 'Jun', score: 68 },
      ],
    },
  }

  // Configuración para el gráfico de patrones de compra
  const purchasePatternsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución del Ticket Promedio',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Monto ($)',
        },
      },
    },
  }

  const purchasePatternsData = {
    labels: customerData.purchasePatterns.avgTicketHistory.map(
      (item) => item.month
    ),
    datasets: [
      {
        label: 'Ticket Promedio',
        data: customerData.purchasePatterns.avgTicketHistory.map(
          (item) => item.value
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  // Configuración para el gráfico de items por transacción
  const itemsPerTransactionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución de Items por Transacción',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Cantidad',
        },
      },
    },
  }

  const itemsPerTransactionData = {
    labels: customerData.purchasePatterns.itemsPerTransactionHistory.map(
      (item) => item.month
    ),
    datasets: [
      {
        label: 'Items por Transacción',
        data: customerData.purchasePatterns.itemsPerTransactionHistory.map(
          (item) => item.value
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  // Configuración para el gráfico de segmentación
  const segmentationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  const newVsRecurringData = {
    labels: ['Clientes Nuevos', 'Clientes Recurrentes'],
    datasets: [
      {
        label: 'Distribución de Clientes',
        data: [
          customerData.customerSegmentation.newVsRecurring.new,
          customerData.customerSegmentation.newVsRecurring.recurring,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  }

  const valueSegmentationData = {
    labels: ['Alto Valor', 'Valor Medio', 'Bajo Valor'],
    datasets: [
      {
        label: 'Segmentación por Valor',
        data: [
          customerData.customerSegmentation.valueSegmentation.highValue,
          customerData.customerSegmentation.valueSegmentation.mediumValue,
          customerData.customerSegmentation.valueSegmentation.lowValue,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Configuración para el gráfico de efectividad de promociones
  const promotionsOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Efectividad de Promociones',
      },
    },
  }

  const promotionsData = {
    labels: customerData.promotionEffectiveness.map((item) => item.name),
    datasets: [
      {
        label: 'ROI (Return on Investment)',
        data: customerData.promotionEffectiveness.map((item) => item.roi),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Configuración para el gráfico de NPS
  const npsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución del Net Promoter Score',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Puntuación NPS',
        },
      },
    },
  }

  const npsData = {
    labels: customerData.netPromoterScore.trend.map((item) => item.month),
    datasets: [
      {
        label: 'Net Promoter Score',
        data: customerData.netPromoterScore.trend.map((item) => item.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  }

  // Simular la obtención de datos
  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setCustomerData(simulatedData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para formatear números como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  // Función para obtener el color según el valor de NPS
  const getNpsColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800'
    if (score >= 50) return 'bg-yellow-100 text-yellow-800'
    if (score >= 0) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  // Función para obtener la clasificación según el valor de NPS
  const getNpsClassification = (score) => {
    if (score >= 70) return 'Excelente'
    if (score >= 50) return 'Bueno'
    if (score >= 0) return 'Regular'
    return 'Pobre'
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <span className='ml-3 text-gray-600'>
            Cargando datos de clientes...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Insights del Cliente</h1>

      {/* Patrón de compra promedio */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Patrón de Compra Promedio
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h3 className='text-lg font-medium text-blue-800 mb-2'>
              Ticket Promedio
            </h3>
            <p className='text-3xl font-bold text-blue-600'>
              {formatCurrency(customerData.purchasePatterns.avgTicket)}
            </p>
          </div>
          <div className='bg-pink-50 p-4 rounded-lg'>
            <h3 className='text-lg font-medium text-pink-800 mb-2'>
              Items por Transacción
            </h3>
            <p className='text-3xl font-bold text-pink-600'>
              {customerData.purchasePatterns.itemsPerTransaction}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <Line
              options={purchasePatternsOptions}
              data={purchasePatternsData}
            />
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <Line
              options={itemsPerTransactionOptions}
              data={itemsPerTransactionData}
            />
          </div>
        </div>
      </div>

      {/* Segmentación de clientes */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Segmentación de Clientes</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <Doughnut options={segmentationOptions} data={newVsRecurringData} />
            <div className='text-center mt-2'>
              <p className='text-sm text-gray-600'>
                Nuevos: {customerData.customerSegmentation.newVsRecurring.new}%
              </p>
              <p className='text-sm text-gray-600'>
                Recurrentes:{' '}
                {customerData.customerSegmentation.newVsRecurring.recurring}%
              </p>
            </div>
          </div>

          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <Doughnut
              options={segmentationOptions}
              data={valueSegmentationData}
            />
            <div className='text-center mt-2'>
              <p className='text-sm text-gray-600'>
                Alto Valor:{' '}
                {customerData.customerSegmentation.valueSegmentation.highValue}%
              </p>
              <p className='text-sm text-gray-600'>
                Valor Medio:{' '}
                {
                  customerData.customerSegmentation.valueSegmentation
                    .mediumValue
                }
                %
              </p>
              <p className='text-sm text-gray-600'>
                Bajo Valor:{' '}
                {customerData.customerSegmentation.valueSegmentation.lowValue}%
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium mb-3'>Clientes de Alto Valor</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cliente
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Gastado
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Visitas
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Valor Promedio por Visita
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {customerData.customerSegmentation.highValueCustomers.map(
                  (customer, index) => (
                    <tr
                      key={customer.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {customer.name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {customer.visits}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatCurrency(customer.totalSpent / customer.visits)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Productos frecuentemente comprados juntos */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Productos Frecuentemente Comprados Juntos
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Producto 1
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Producto 2
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Frecuencia
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Confianza
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {customerData.frequentlyBoughtTogether.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {item.product1}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {item.product2}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {item.frequency}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {Math.round(item.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Efectividad de promociones activas */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Efectividad de Promociones Activas
        </h2>

        <div className='mb-6'>
          <Bar options={promotionsOptions} data={promotionsData} />
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Promoción
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tasa de Redención
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Incremento en Ventas
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {customerData.promotionEffectiveness.map((promo, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {promo.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {promo.redemptionRate}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    +{promo.salesIncrease}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {promo.roi}:1
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Promoter Score */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Net Promoter Score (NPS)</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center'>
            <div
              className={`text-5xl font-bold mb-2 ${getNpsColor(
                customerData.netPromoterScore.score
              )} p-4 rounded-full`}
            >
              {customerData.netPromoterScore.score}
            </div>
            <p className='text-lg font-medium'>Puntuación NPS</p>
            <p
              className={`text-sm ${getNpsColor(
                customerData.netPromoterScore.score
              )} px-2 py-1 rounded-full mt-2`}
            >
              {getNpsClassification(customerData.netPromoterScore.score)}
            </p>
          </div>

          <div className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='mb-4'>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium text-green-600'>
                  Promotores
                </span>
                <span className='text-sm font-medium text-green-600'>
                  {customerData.netPromoterScore.promoters}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-green-500 h-2.5 rounded-full'
                  style={{
                    width: `${customerData.netPromoterScore.promoters}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className='mb-4'>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium text-yellow-600'>
                  Neutros
                </span>
                <span className='text-sm font-medium text-yellow-600'>
                  {customerData.netPromoterScore.passives}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-yellow-500 h-2.5 rounded-full'
                  style={{
                    width: `${customerData.netPromoterScore.passives}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium text-red-600'>
                  Detractores
                </span>
                <span className='text-sm font-medium text-red-600'>
                  {customerData.netPromoterScore.detractors}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-red-500 h-2.5 rounded-full'
                  style={{
                    width: `${customerData.netPromoterScore.detractors}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg border border-gray-200'>
          <Line options={npsOptions} data={npsData} />
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export function Inventario() {
  const [products, setProducts] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [expiringProducts, setExpiringProducts] = useState([])
  const [overstockProducts, setOverstockProducts] = useState([])
  const [categoryRotation, setCategoryRotation] = useState({})

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Obtener productos
      const productsResponse = await fetch(
        'https://api-megamart.onrender.com/api/productos'
      )
      const productsData = await productsResponse.json()
      setProducts(productsData)

      // Obtener sucursales
      const branchesResponse = await fetch(
        'https://api-megamart.onrender.com/api/sedes'
      )
      const branchesData = await branchesResponse.json()
      setBranches(branchesData)

      // Filtrar productos según criterios
      const now = new Date()
      const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000)

      // Productos con stock bajo (menos de 10 unidades)
      const lowStock = productsData.filter((product) => product.stock < 10)
      setLowStockProducts(lowStock)

      // Productos próximos a vencer (próximas 48 horas)
      const expiring = productsData.filter((product) => {
        if (!product.expiration_date) return false
        const expDate = new Date(product.expiration_date)
        return expDate <= twoDaysFromNow && expDate >= now
      })
      setExpiringProducts(expiring)

      // Productos con sobrestock (más de 100 unidades)
      const overstock = productsData.filter((product) => product.stock > 100)
      setOverstockProducts(overstock)

      // Calcular rotación por categoría (simulado)
      const categories = [...new Set(productsData.map((p) => p.category))]
      const rotationData = {}

      categories.forEach((category) => {
        const categoryProducts = productsData.filter(
          (p) => p.category === category
        )
        const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
        const avgStock = totalStock / categoryProducts.length

        // Simular índice de rotación (0-100)
        rotationData[category] = Math.min(
          100,
          Math.max(0, Math.round(100 - avgStock / 2))
        )
      })

      setCategoryRotation(rotationData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetchData()
  }, [])

  // Configuración del gráfico de rotación por categoría
  const rotationChartData = {
    labels: Object.keys(categoryRotation),
    datasets: [
      {
        label: 'Índice de Rotación (%)',
        data: Object.values(categoryRotation),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const rotationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rotación de Inventario por Categoría',
      },
    },
  }

  // Configuración del gráfico de distribución de stock
  const stockDistributionData = {
    labels: ['Stock Bajo', 'Stock Normal', 'Sobrestock'],
    datasets: [
      {
        label: 'Cantidad de Productos',
        data: [
          lowStockProducts.length,
          products.length - lowStockProducts.length - overstockProducts.length,
          overstockProducts.length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

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
          Estado de Inventario Crítico
        </h1>
        <p className='text-gray-600'>
          Monitoreo de stock y productos próximos a vencer
        </p>
      </div>

      {/* Filtros */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
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
              Categoría
            </label>
            <select className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
              <option value='all'>Todas las categorías</option>
              {[...new Set(products.map((p) => p.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className='w-full md:w-1/3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado de Stock
            </label>
            <select className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'>
              <option value='all'>Todos</option>
              <option value='low'>Stock Bajo</option>
              <option value='expiring'>Próximos a Vencer</option>
              <option value='overstock'>Sobrestock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumen de inventario */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Total Productos
          </h3>
          <p className='text-2xl font-bold text-blue-600'>{products.length}</p>
          <p className='text-sm text-gray-500 mt-2'>En todas las sucursales</p>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Stock Bajo</h3>
          <p className='text-2xl font-bold text-red-600'>
            {lowStockProducts.length}
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Productos con menos de 10 unidades
          </p>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Próximos a Vencer
          </h3>
          <p className='text-2xl font-bold text-yellow-600'>
            {expiringProducts.length}
          </p>
          <p className='text-sm text-gray-500 mt-2'>En las próximas 48 horas</p>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Sobrestock</h3>
          <p className='text-2xl font-bold text-orange-600'>
            {overstockProducts.length}
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Productos con más de 100 unidades
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Mapa de calor de rotación por categoría */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Rotación por Categoría
          </h3>
          <div className='h-64'>
            <Bar data={rotationChartData} options={rotationChartOptions} />
          </div>
        </div>

        {/* Distribución de stock */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Distribución de Stock
          </h3>
          <div className='h-64'>
            <Doughnut
              data={stockDistributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Tablas de productos críticos */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        {/* Productos con stock bajo */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
            <span className='w-3 h-3 bg-red-500 rounded-full mr-2'></span>
            Productos con Stock Bajo
          </h3>
          <div className='overflow-x-auto max-h-80'>
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
                    Stock
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Sucursal
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {lowStockProducts.slice(0, 5).map((product) => (
                  <tr key={product._id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-red-600 font-bold'>
                      {product.stock}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {product.branch_id}
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan='3'
                      className='px-4 py-4 text-sm text-gray-500 text-center'
                    >
                      No hay productos con stock bajo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {lowStockProducts.length > 5 && (
            <p className='text-sm text-blue-600 mt-2'>
              +{lowStockProducts.length - 5} más...
            </p>
          )}
        </div>

        {/* Productos próximos a vencer */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
            <span className='w-3 h-3 bg-yellow-500 rounded-full mr-2'></span>
            Próximos a Vencer (48h)
          </h3>
          <div className='overflow-x-auto max-h-80'>
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
                    Vence
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Sucursal
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {expiringProducts.slice(0, 5).map((product) => (
                  <tr key={product._id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-yellow-600 font-bold'>
                      {product.expiration_date
                        ? new Date(product.expiration_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {product.branch_id}
                    </td>
                  </tr>
                ))}
                {expiringProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan='3'
                      className='px-4 py-4 text-sm text-gray-500 text-center'
                    >
                      No hay productos próximos a vencer
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {expiringProducts.length > 5 && (
            <p className='text-sm text-blue-600 mt-2'>
              +{expiringProducts.length - 5} más...
            </p>
          )}
        </div>

        {/* Productos con sobrestock */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
            <span className='w-3 h-3 bg-orange-500 rounded-full mr-2'></span>
            Productos con Sobrestock
          </h3>
          <div className='overflow-x-auto max-h-80'>
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
                    Stock
                  </th>
                  <th
                    scope='col'
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Sucursal
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {overstockProducts.slice(0, 5).map((product) => (
                  <tr key={product._id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-orange-600 font-bold'>
                      {product.stock}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {product.branch_id}
                    </td>
                  </tr>
                ))}
                {overstockProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan='3'
                      className='px-4 py-4 text-sm text-gray-500 text-center'
                    >
                      No hay productos con sobrestock
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {overstockProducts.length > 5 && (
            <p className='text-sm text-blue-600 mt-2'>
              +{overstockProducts.length - 5} más...
            </p>
          )}
        </div>
      </div>

      {/* Indicadores de pérdidas por mermas/vencimientos */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Indicadores de Pérdidas
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-red-50 p-4 rounded-lg'>
            <h4 className='text-md font-medium text-red-800'>
              Valor Estimado de Pérdidas
            </h4>
            <p className='text-2xl font-bold text-red-600'>$2,450.00</p>
            <p className='text-sm text-red-600 mt-1'>
              Por productos próximos a vencer
            </p>
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h4 className='text-md font-medium text-yellow-800'>
              Productos en Riesgo
            </h4>
            <p className='text-2xl font-bold text-yellow-600'>
              {expiringProducts.length}
            </p>
            <p className='text-sm text-yellow-600 mt-1'>
              Unidades en riesgo de vencimiento
            </p>
          </div>

          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='text-md font-medium text-blue-800'>
              Acciones Recomendadas
            </h4>
            <ul className='text-sm text-blue-600 mt-1 list-disc list-inside'>
              <li>Aplicar descuentos a productos próximos a vencer</li>
              <li>Reabastecer productos con stock bajo</li>
              <li>Transferir stock entre sucursales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

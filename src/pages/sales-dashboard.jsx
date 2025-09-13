import React, { useState, useEffect } from 'react'

const SalesDashboard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [transactionData, setTransactionData] = useState({
    transaction_id: '',
    customer_id: '',
    branch_id: '',
    items: [],
    discounts: [],
    subtotal: 0,
    total: 0,
    payment_method: 'cash',
    amount_paid: 0,
    change: 0,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [clientes, setClientes] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  // Función mejorada para hacer fetch con manejo de errores
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(
          `Respuesta no JSON recibida: ${text.substring(0, 100)}...`
        )
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en fetch:', error)
      throw error
    }
  }

  // Cargar clientes y sucursales al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)

        // Cargar clientes
        const clientesData = await fetchData('/api/clientes')
        setClientes(clientesData)

        // Cargar sucursales
        const sucursalesData = await fetchData('/api/sedes')
        setSucursales(sucursalesData)

        setDataLoaded(true)
        setMessage('Datos cargados correctamente')
      } catch (error) {
        console.error('Error loading data:', error)
        setMessage('Error al cargar datos: ' + error.message)
        setClientes([])
        setSucursales([])
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Función para iniciar transacción
  const iniciarTransaccion = async (customerId, branchId) => {
    setLoading(true)
    setMessage('')
    try {
      const data = await fetchData('/api/ventas/iniciar-transacción', {
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId,
          branch_id: branchId,
        }),
      })

      setTransactionData({
        ...transactionData,
        transaction_id: data.transaction_id,
        customer_id: customerId,
        branch_id: branchId,
        created_at: data.created_at,
      })
      setCurrentStep(2)
      setMessage('Transacción iniciada con éxito')
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar producto
  const agregarProducto = async (productId, quantity) => {
    setLoading(true)
    setMessage('')
    try {
      const data = await fetchData('/api/ventas/agregar-producto', {
        method: 'POST',
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          product_id: productId,
          quantity: quantity,
        }),
      })

      setMessage('Producto agregado: ' + data)
      // Aquí deberías actualizar el estado con los nuevos items
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para aplicar promoción
  const aplicarPromocion = async (promotionCode) => {
    setLoading(true)
    setMessage('')
    try {
      const data = await fetchData('/api/ventas/aplicar-promoción', {
        method: 'POST',
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          promotion_code: promotionCode,
        }),
      })

      setMessage('Promoción aplicada: ' + data)
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para finalizar venta
  const finalizarVenta = async (paymentMethod, amountPaid) => {
    setLoading(true)
    setMessage('')
    try {
      const data = await fetchData('/api/ventas/finalizar', {
        method: 'POST',
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          payment_method: paymentMethod,
          amount_paid: amountPaid,
        }),
      })

      setTransactionData({
        ...data,
        change: data.amount_paid - data.total,
      })
      setCurrentStep(4)
      setMessage('Venta finalizada con éxito')
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Reintentar carga de datos
  const retryLoadData = async () => {
    setMessage('Cargando datos...')
    try {
      setLoading(true)

      // Cargar clientes
      const clientesData = await fetchData('/api/clientes')
      setClientes(clientesData)

      // Cargar sucursales
      const sucursalesData = await fetchData('/api/sedes')
      setSucursales(sucursalesData)

      setDataLoaded(true)
      setMessage('Datos cargados correctamente')
    } catch (error) {
      setMessage('Error al cargar datos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Sistema de Ventas
      </h2>

      {/* Indicador de pasos */}
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className='flex flex-col items-center'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              <span className='mt-2 text-sm text-gray-600'>
                {step === 1 && 'Iniciar'}
                {step === 2 && 'Productos'}
                {step === 3 && 'Pago'}
                {step === 4 && 'Completado'}
              </span>
            </div>
          ))}
        </div>
        <div className='mt-2 h-1 bg-gray-200 rounded-full'>
          <div
            className='h-1 bg-blue-600 rounded-full transition-all duration-300'
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700'
              : message.includes('éxito')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {message}
          {message.includes('Error') && !dataLoaded && (
            <button
              onClick={retryLoadData}
              className='ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3'></div>
              <span>Procesando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Paso 1: Iniciar transacción */}
      {currentStep === 1 && (
        <IniciarTransaccion
          onIniciar={iniciarTransaccion}
          loading={loading}
          clientes={clientes}
          sucursales={sucursales}
          dataLoaded={dataLoaded}
          onRetry={retryLoadData}
        />
      )}

      {/* Paso 2: Agregar productos */}
      {currentStep === 2 && (
        <AgregarProductos
          onAgregar={agregarProducto}
          onAplicarPromocion={aplicarPromocion}
          onFinalizar={() => setCurrentStep(3)}
          transactionData={transactionData}
          loading={loading}
        />
      )}

      {/* Paso 3: Procesar pago */}
      {currentStep === 3 && (
        <ProcesarPago
          onPagar={finalizarVenta}
          transactionData={transactionData}
          loading={loading}
        />
      )}

      {/* Paso 4: Resumen de venta */}
      {currentStep === 4 && (
        <ResumenVenta
          transactionData={transactionData}
          clientes={clientes}
          sucursales={sucursales}
          onNuevaVenta={() => {
            setCurrentStep(1)
            setTransactionData({
              transaction_id: '',
              customer_id: '',
              branch_id: '',
              items: [],
              discounts: [],
              subtotal: 0,
              total: 0,
              payment_method: 'cash',
              amount_paid: 0,
              change: 0,
            })
          }}
        />
      )}
    </div>
  )
}

// Componente para iniciar transacción
const IniciarTransaccion = ({
  onIniciar,
  loading,
  clientes,
  sucursales,
  dataLoaded,
  onRetry,
}) => {
  const [customerId, setCustomerId] = useState('')
  const [branchId, setBranchId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customerId && branchId) {
      onIniciar(customerId, branchId)
    }
  }

  if (!dataLoaded) {
    return (
      <div className='text-center py-8'>
        <div className='text-gray-500 mb-4'>
          No se pudieron cargar los datos
        </div>
        <button
          onClick={onRetry}
          className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
        >
          Reintentar Carga de Datos
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Iniciar Transacción</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Seleccionar Cliente
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            required
            disabled={clientes.length === 0}
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.name} - {cliente.email} (Puntos: {cliente.points})
              </option>
            ))}
          </select>
          {clientes.length === 0 && (
            <p className='text-sm text-red-600 mt-1'>
              No hay clientes disponibles
            </p>
          )}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Seleccionar Sucursal
          </label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            required
            disabled={sucursales.length === 0}
          >
            <option value=''>Seleccione una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal._id} value={sucursal.branch_id}>
                {sucursal.name} - {sucursal.address}, {sucursal.city}
              </option>
            ))}
          </select>
          {sucursales.length === 0 && (
            <p className='text-sm text-red-600 mt-1'>
              No hay sucursales disponibles
            </p>
          )}
        </div>
        <button
          type='submit'
          disabled={
            loading ||
            !customerId ||
            !branchId ||
            clientes.length === 0 ||
            sucursales.length === 0
          }
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Iniciando...' : 'Iniciar Venta'}
        </button>
      </form>
    </div>
  )
}

// Los componentes AgregarProductos, ProcesarPago y ResumenVenta se mantienen igual que antes
// [Aquí irían los mismos componentes de la respuesta anterior...]

export default SalesDashboard

import React, { useState } from 'react'

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

  // Función para iniciar transacción
  const iniciarTransaccion = async (customerId, branchId) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ventas/iniciar-transacción', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          branch_id: branchId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTransactionData({
          ...transactionData,
          transaction_id: data.transaction_id,
          customer_id: customerId,
          branch_id: branchId,
          created_at: data.created_at,
        })
        setCurrentStep(2)
        setMessage('Transacción iniciada con éxito')
      } else {
        throw new Error('Error al iniciar transacción')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar producto
  const agregarProducto = async (productId, quantity) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ventas/agregar-producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          product_id: productId,
          quantity: quantity,
        }),
      })

      if (response.ok) {
        const data = await response.text()
        setMessage('Producto agregado: ' + data)
        // Aquí deberías actualizar el estado con los nuevos items
      } else {
        throw new Error('Error al agregar producto')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para aplicar promoción
  const aplicarPromocion = async (promotionCode) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ventas/aplicar-promoción', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          promotion_code: promotionCode,
        }),
      })

      if (response.ok) {
        const data = await response.text()
        setMessage('Promoción aplicada: ' + data)
        // Aquí deberías actualizar el estado con los descuentos aplicados
      } else {
        throw new Error('Error al aplicar promoción')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para finalizar venta
  const finalizarVenta = async (paymentMethod, amountPaid) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ventas/finalizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionData.transaction_id,
          payment_method: paymentMethod,
          amount_paid: amountPaid,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTransactionData({
          ...data,
          change: data.amount_paid - data.total,
        })
        setCurrentStep(4)
        setMessage('Venta finalizada con éxito')
      } else {
        throw new Error('Error al finalizar venta')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
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
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Paso 1: Iniciar transacción */}
      {currentStep === 1 && (
        <IniciarTransaccion onIniciar={iniciarTransaccion} loading={loading} />
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
const IniciarTransaccion = ({ onIniciar, loading }) => {
  const [customerId, setCustomerId] = useState('')
  const [branchId, setBranchId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onIniciar(customerId, branchId)
  }

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Iniciar Transacción</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Cedula del Cliente
          </label>
          <input
            type='text'
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            ID de Sucursal
          </label>
          <input
            type='text'
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            required
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Iniciando...' : 'Iniciar Venta'}
        </button>
      </form>
    </div>
  )
}

// Componente para agregar productos
const AgregarProductos = ({
  onAgregar,
  onAplicarPromocion,
  onFinalizar,
  transactionData,
  loading,
}) => {
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [promotionCode, setPromotionCode] = useState('')

  const handleAgregarProducto = (e) => {
    e.preventDefault()
    onAgregar(productId, quantity)
    setProductId('')
    setQuantity(1)
  }

  const handleAplicarPromocion = (e) => {
    e.preventDefault()
    onAplicarPromocion(promotionCode)
    setPromotionCode('')
  }

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Agregar Productos</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Formulario para agregar productos */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium mb-3'>Agregar Producto</h4>
          <form onSubmit={handleAgregarProducto} className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                ID del Producto
              </label>
              <input
                type='text'
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cantidad
              </label>
              <input
                type='number'
                min='1'
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
            >
              {loading ? 'Agregando...' : 'Agregar Producto'}
            </button>
          </form>
        </div>

        {/* Formulario para aplicar promoción */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium mb-3'>Aplicar Promoción</h4>
          <form onSubmit={handleAplicarPromocion} className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Código de Promoción
              </label>
              <input
                type='text'
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50'
            >
              {loading ? 'Aplicando...' : 'Aplicar Promoción'}
            </button>
          </form>
        </div>
      </div>

      {/* Resumen actual */}
      <div className='mt-6 p-4 border border-gray-200 rounded-lg'>
        <h4 className='font-medium mb-3'>Resumen de Transacción</h4>
        <p>
          <span className='font-medium'>ID de Transacción:</span>{' '}
          {transactionData.transaction_id}
        </p>
        <p>
          <span className='font-medium'>Cliente:</span>{' '}
          {transactionData.customer_id}
        </p>
        <p>
          <span className='font-medium'>Sucursal:</span>{' '}
          {transactionData.branch_id}
        </p>
        <p>
          <span className='font-medium'>Productos:</span>{' '}
          {transactionData.items.length}
        </p>
        <p>
          <span className='font-medium'>Subtotal:</span> $
          {transactionData.subtotal?.toFixed(2)}
        </p>
        <p>
          <span className='font-medium'>Descuentos:</span> $
          {transactionData.discounts
            .reduce((acc, d) => acc + d.amount, 0)
            ?.toFixed(2)}
        </p>
        <p>
          <span className='font-medium'>Total:</span> $
          {transactionData.total?.toFixed(2)}
        </p>
      </div>

      <button
        onClick={onFinalizar}
        className='mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        Proceder al Pago
      </button>
    </div>
  )
}

// Componente para procesar pago
const ProcesarPago = ({ onPagar, transactionData, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountPaid, setAmountPaid] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onPagar(paymentMethod, parseFloat(amountPaid))
  }

  const calculateChange = () => {
    const total = transactionData.total || 0
    const paid = parseFloat(amountPaid) || 0
    return paid - total
  }

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Procesar Pago</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Resumen de la compra */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium mb-3'>Resumen de Compra</h4>
          <p>
            <span className='font-medium'>ID de Transacción:</span>{' '}
            {transactionData.transaction_id}
          </p>
          <p>
            <span className='font-medium'>Cliente:</span>{' '}
            {transactionData.customer_id}
          </p>
          <p>
            <span className='font-medium'>Total a Pagar:</span> $
            {transactionData.total?.toFixed(2)}
          </p>

          {transactionData.items.length > 0 && (
            <div className='mt-3'>
              <h5 className='font-medium'>Productos:</h5>
              <ul className='list-disc list-inside ml-2'>
                {transactionData.items.map((item, index) => (
                  <li key={index}>
                    {item.product_id} - {item.quantity} x $
                    {item.unit_price?.toFixed(2)} = ${item.subtotal?.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transactionData.discounts.length > 0 && (
            <div className='mt-3'>
              <h5 className='font-medium'>Descuentos:</h5>
              <ul className='list-disc list-inside ml-2'>
                {transactionData.discounts.map((discount, index) => (
                  <li key={index}>
                    {discount.promotion_code} - ${discount.amount?.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Formulario de pago */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium mb-3'>Información de Pago</h4>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='cash'>Efectivo</option>
                <option value='card'>Tarjeta</option>
                <option value='transfer'>Transferencia</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Monto Pagado
              </label>
              <input
                type='number'
                min={transactionData.total || 0}
                step='0.01'
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div className='p-3 bg-blue-50 rounded-md'>
              <p className='font-medium'>
                Cambio: ${calculateChange().toFixed(2)}
              </p>
            </div>

            <button
              type='submit'
              disabled={loading || calculateChange() < 0}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
            >
              {loading ? 'Procesando...' : 'Finalizar Venta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar resumen de venta
const ResumenVenta = ({ transactionData, onNuevaVenta }) => {
  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Venta Completada</h3>

      <div className='bg-green-50 p-4 rounded-lg mb-6'>
        <div className='flex items-center'>
          <svg
            className='w-8 h-8 text-green-600 mr-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
          <div>
            <h4 className='text-lg font-medium text-green-800'>
              ¡Venta completada con éxito!
            </h4>
            <p className='text-green-600'>
              ID de Transacción: {transactionData.transaction_id}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <h4 className='font-medium mb-3'>Detalles de la Venta</h4>

        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <p>
              <span className='font-medium'>Cliente:</span>{' '}
              {transactionData.customer_id}
            </p>
            <p>
              <span className='font-medium'>Sucursal:</span>{' '}
              {transactionData.branch_id}
            </p>
            <p>
              <span className='font-medium'>Fecha:</span>{' '}
              {new Date(transactionData.completed_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p>
              <span className='font-medium'>Método de Pago:</span>{' '}
              {transactionData.payment_method}
            </p>
            <p>
              <span className='font-medium'>Monto Pagado:</span> $
              {transactionData.amount_paid?.toFixed(2)}
            </p>
            <p>
              <span className='font-medium'>Cambio:</span> $
              {transactionData.change?.toFixed(2)}
            </p>
          </div>
        </div>

        <div className='mb-4'>
          <h5 className='font-medium border-b pb-1 mb-2'>Productos</h5>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>Producto</th>
                <th className='text-right py-2'>Cantidad</th>
                <th className='text-right py-2'>Precio Unitario</th>
                <th className='text-right py-2'>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.items.map((item, index) => (
                <tr key={index} className='border-b'>
                  <td className='py-2'>{item.product_id}</td>
                  <td className='text-right py-2'>{item.quantity}</td>
                  <td className='text-right py-2'>
                    ${item.unit_price?.toFixed(2)}
                  </td>
                  <td className='text-right py-2'>
                    ${item.subtotal?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactionData.discounts.length > 0 && (
          <div className='mb-4'>
            <h5 className='font-medium border-b pb-1 mb-2'>
              Descuentos Aplicados
            </h5>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2'>Tipo</th>
                  <th className='text-left py-2'>Código</th>
                  <th className='text-right py-2'>Monto</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.discounts.map((discount, index) => (
                  <tr key={index} className='border-b'>
                    <td className='py-2'>{discount.type}</td>
                    <td className='py-2'>{discount.promotion_code}</td>
                    <td className='text-right py-2'>
                      ${discount.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='flex justify-end'>
          <div className='w-64'>
            <div className='flex justify-between py-2'>
              <span className='font-medium'>Subtotal:</span>
              <span>${transactionData.subtotal?.toFixed(2)}</span>
            </div>
            <div className='flex justify-between py-2 border-b'>
              <span className='font-medium'>Descuentos:</span>
              <span>
                -$
                {transactionData.discounts
                  .reduce((acc, d) => acc + d.amount, 0)
                  ?.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between py-2 font-bold text-lg'>
              <span>Total:</span>
              <span>${transactionData.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNuevaVenta}
        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        Iniciar Nueva Venta
      </button>
    </div>
  )
}

export default SalesDashboard

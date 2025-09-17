import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export function Clientes() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [customerSegments, setCustomerSegments] = useState({});
  const [purchasePatterns, setPurchasePatterns] = useState({});
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);
  const [promotionEffectiveness, setPromotionEffectiveness] = useState({});

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Obtener clientes
      const customersResponse = await fetch('https://api-megamart.onrender.com/api/clientes');
      const customersData = await customersResponse.json();
      setCustomers(customersData);
      
      // Obtener transacciones
      const transactionsResponse = await fetch('https://api-megamart.onrender.com/api/transacciones');
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
      
      // Obtener productos
      const productsResponse = await fetch('https://api-megamart.onrender.com/api/productos');
      const productsData = await productsResponse.json();
      setProducts(productsData);
      
      // Calcular segmentación de clientes
      const segments = calculateCustomerSegments(customersData, transactionsData);
      setCustomerSegments(segments);
      
      // Calcular patrones de compra
      const patterns = calculatePurchasePatterns(transactionsData);
      setPurchasePatterns(patterns);
      
      // Calcular productos comprados juntos (simulado)
      const boughtTogether = calculateFrequentlyBoughtTogether(transactionsData, productsData);
      setFrequentlyBoughtTogether(boughtTogether);
      
      // Calcular efectividad de promociones (simulado)
      const promoEffectiveness = calculatePromotionEffectiveness(transactionsData);
      setPromotionEffectiveness(promoEffectiveness);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular segmentación de clientes
  const calculateCustomerSegments = (customers, transactions) => {
    // Agrupar transacciones por cliente
    const transactionsByCustomer = {};
    transactions.forEach(transaction => {
      if (transaction.customer_id) {
        if (!transactionsByCustomer[transaction.customer_id]) {
          transactionsByCustomer[transaction.customer_id] = [];
        }
        transactionsByCustomer[transaction.customer_id].push(transaction);
      }
    });

    // Segmentar clientes
    const segments = {
      new: [],
      recurring: [],
      highValue: [],
      occasional: []
    };

    customers.forEach(customer => {
      const customerTransactions = transactionsByCustomer[customer.cedula] || [];
      const transactionCount = customerTransactions.length;
      const totalSpent = customerTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      
      if (transactionCount === 0) {
        segments.new.push(customer);
      } else if (transactionCount >= 3) {
        segments.recurring.push(customer);
      }
      
      if (totalSpent > 100000) {
        segments.highValue.push(customer);
      } else if (transactionCount > 0 && totalSpent < 50000) {
        segments.occasional.push(customer);
      }
    });

    return segments;
  };

  // Calcular patrones de compra
  const calculatePurchasePatterns = (transactions) => {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalSales = completedTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalItems = completedTransactions.reduce((sum, t) => {
      return sum + (t.items ? t.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) : 0);
    }, 0);
    
    const avgTicket = completedTransactions.length > 0 ? totalSales / completedTransactions.length : 0;
    const avgItemsPerTransaction = completedTransactions.length > 0 ? totalItems / completedTransactions.length : 0;
    
    return {
      avgTicket,
      avgItemsPerTransaction,
      totalTransactions: completedTransactions.length,
      totalSales
    };
  };

  // Calcular productos comprados juntos (simulado)
  const calculateFrequentlyBoughtTogether = (transactions, products) => {
    // Simular datos de productos comprados juntos
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = product.name;
    });
    
    // En un caso real, se analizarían las transacciones para encontrar patrones
    return [
      { product1: "Coca Cola 500ml", product2: "Pan blanco", frequency: 42 },
      { product1: "Leche 1L", product2: "Pan Integral", frequency: 38 },
      { product1: "Yogurt", product2: "Croissant", frequency: 35 },
      { product1: "Pepsi 500ml", product2: "Galleta", frequency: 31 },
      { product1: "Quesillo", product2: "Mantequilla", frequency: 28 }
    ];
  };

  // Calcular efectividad de promociones (simulado)
  const calculatePromotionEffectiveness = (transactions) => {
    const transactionsWithPromotions = transactions.filter(t => t.discounts && t.discounts.length > 0);
    const transactionsWithoutPromotions = transactions.filter(t => !t.discounts || t.discounts.length === 0);
    
    const avgWithPromo = transactionsWithPromotions.length > 0 ? 
      transactionsWithPromotions.reduce((sum, t) => sum + (t.total || 0), 0) / transactionsWithPromotions.length : 0;
    
    const avgWithoutPromo = transactionsWithoutPromotions.length > 0 ? 
      transactionsWithoutPromotions.reduce((sum, t) => sum + (t.total || 0), 0) / transactionsWithoutPromotions.length : 0;
    
    return {
      withPromotions: transactionsWithPromotions.length,
      withoutPromotions: transactionsWithoutPromotions.length,
      avgWithPromo,
      avgWithoutPromo,
      uplift: avgWithPromo > 0 ? ((avgWithPromo - avgWithoutPromo) / avgWithoutPromo) * 100 : 0
    };
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Configuración del gráfico de segmentación de clientes
  const segmentationChartData = {
    labels: ['Nuevos', 'Recurrentes', 'Alto Valor', 'Ocasionales'],
    datasets: [
      {
        label: 'Cantidad de Clientes',
        data: [
          customerSegments.new?.length || 0,
          customerSegments.recurring?.length || 0,
          customerSegments.highValue?.length || 0,
          customerSegments.occasional?.length || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuración del gráfico de efectividad de promociones
  const promotionChartData = {
    labels: ['Con Promociones', 'Sin Promociones'],
    datasets: [
      {
        label: 'Ticket Promedio ($)',
        data: [
          promotionEffectiveness.avgWithPromo || 0,
          promotionEffectiveness.avgWithoutPromo || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuración del gráfico de productos comprados juntos
  const boughtTogetherChartData = {
    labels: frequentlyBoughtTogether.map(item => `${item.product1} + ${item.product2}`),
    datasets: [
      {
        label: 'Frecuencia de Compra Conjunta',
        data: frequentlyBoughtTogether.map(item => item.frequency),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Insights del Cliente</h1>
        <p className="text-gray-600">Análisis de comportamiento y segmentación de clientes</p>
      </div>

      {/* Filtros */}
      {/* <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Segmento de Cliente</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
            >
              <option value="all">Todos los clientes</option>
              <option value="new">Clientes Nuevos</option>
              <option value="recurring">Clientes Recurrentes</option>
              <option value="highValue">Clientes de Alto Valor</option>
              <option value="occasional">Clientes Ocasionales</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las sucursales</option>
              <option value="Sucursal_1">Supermercado Central</option>
              <option value="Sucursal_2">Supermercado Norte</option>
              <option value="Sucursal_3">Supermercado Sur</option>
              <option value="Sucursal_4">Supermercado Express</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Resumen de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Clientes</h3>
          <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
          <p className="text-sm text-gray-500 mt-2">Registrados en el sistema</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Ticket Promedio</h3>
          <p className="text-2xl font-bold text-green-600">${purchasePatterns.avgTicket?.toFixed(2) || '0.00'}</p>
          <p className="text-sm text-gray-500 mt-2">Por transacción</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Items por Transacción</h3>
          <p className="text-2xl font-bold text-purple-600">{purchasePatterns.avgItemsPerTransaction?.toFixed(1) || '0.0'}</p>
          <p className="text-sm text-gray-500 mt-2">Promedio</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Clientes Recurrentes</h3>
          <p className="text-2xl font-bold text-orange-600">4</p>
          <p className="text-sm text-gray-500 mt-2">+3 compras</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Segmentación de clientes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Segmentación de Clientes</h3>
          <div className="h-64">
            <Doughnut data={segmentationChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Distribución de Segmentos'
                },
              },
            }} />
          </div>
        </div>

        {/* Efectividad de promociones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Efectividad de Promociones</h3>
          <div className="h-64">
            <Bar data={promotionChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Ticket Promedio con/sin Promociones'
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Monto en pesos ($)'
                  }
                }
              }
            }} />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Uplift por promociones: </span>
              {promotionEffectiveness.uplift?.toFixed(1) || '0.0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Productos comprados juntos */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Productos Frecuentemente Comprados Juntos</h3>
        <div className="h-96">
          <Bar data={boughtTogetherChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Frecuencia de Compra Conjunta'
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Número de Transacciones'
                }
              }
            },
            indexAxis: 'y',
          }} />
        </div>
      </div>

      {/* Tablas de segmentos de clientes */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        Clientes de alto valor
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            Clientes de Alto Valor
          </h3>
          <div className="overflow-x-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSegments.highValue?.slice(0, 5).map(customer => (
                  <tr key={customer._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600 font-bold">{customer.points}</td>
                  </tr>
                ))}
                {(!customerSegments.highValue || customerSegments.highValue.length === 0) && (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-sm text-gray-500 text-center">No hay clientes de alto valor</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {customerSegments.highValue?.length > 5 && (
            <p className="text-sm text-blue-600 mt-2">+{customerSegments.highValue.length - 5} más...</p>
          )}
        </div>

        Clientes recurrentes
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Clientes Recurrentes
          </h3>
          <div className="overflow-x-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSegments.recurring?.slice(0, 5).map(customer => (
                  <tr key={customer._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-bold">{customer.points}</td>
                  </tr>
                ))}
                {(!customerSegments.recurring || customerSegments.recurring.length === 0) && (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-sm text-gray-500 text-center">No hay clientes recurrentes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {customerSegments.recurring?.length > 5 && (
            <p className="text-sm text-blue-600 mt-2">+{customerSegments.recurring.length - 5} más...</p>
          )}
        </div>
      </div> */}

      {/* Recomendaciones de marketing */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recomendaciones de Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-blue-800">Para Clientes Nuevos</h4>
            <ul className="text-sm text-blue-600 mt-2 list-disc list-inside">
              <li>Ofrecer cupón de bienvenida de 10% de descuento</li>
              <li>Programa de referidos con beneficios para ambos</li>
              <li>Email de seguimiento después de la primera compra</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-green-800">Para Clientes Recurrentes</h4>
            <ul className="text-sm text-green-600 mt-2 list-disc list-inside">
              <li>Programa de fidelización con puntos extras</li>
              <li>Ofertas exclusivas por cumpleaños</li>
              <li>Acceso prioritario a nuevos productos</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-yellow-800">Para Clientes de Alto Valor</h4>
            <ul className="text-sm text-yellow-600 mt-2 list-disc list-inside">
              <li>Descuentos personalizados basados en historial</li>
              <li>Invitaciones a eventos exclusivos</li>
              <li>Asesor personal de compras</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-purple-800">Basado en Comportamiento</h4>
            <ul className="text-sm text-purple-600 mt-2 list-disc list-inside">
              <li>Promocionar productos complementarios</li>
              <li>Recordatorios de reposición de productos frecuentes</li>
              <li>Ofertas de bundle para productos comprados juntos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

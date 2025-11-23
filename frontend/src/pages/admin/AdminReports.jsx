import { useState, useEffect, useMemo } from 'react';
import { reportService } from '../../services/reportService';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  LuDollarSign,
  LuShoppingCart,
  LuPackage,
  LuTruck,
  LuCalendar,
  LuTrendingUp
} from 'react-icons/lu';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [deliveryReport, setDeliveryReport] = useState(null);
  const [timePeriod, setTimePeriod] = useState('monthly'); // daily, weekly, monthly, yearly

  const [salesDateRange, setSalesDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboard();
    // Fetch all data initially for dashboard charts
    fetchSalesReport();
    fetchInventoryReport();
    fetchDeliveryReport();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await reportService.getDashboardSummary();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard');
    }
  };

  const fetchSalesReport = async () => {
    try {
      const data = await reportService.getSalesReport(salesDateRange.startDate, salesDateRange.endDate);
      setSalesReport(data);
    } catch (error) {
      console.error('Failed to load sales report');
    }
  };

  const fetchInventoryReport = async () => {
    try {
      const data = await reportService.getInventoryReport();
      setInventoryReport(data);
    } catch (error) {
      console.error('Failed to load inventory report');
    }
  };

  const fetchDeliveryReport = async () => {
    try {
      const data = await reportService.getDeliveryReport(deliveryDate);
      setDeliveryReport(data);
    } catch (error) {
      console.error('Failed to load delivery report');
    }
  };

  useEffect(() => {
    if (activeTab === 'sales') fetchSalesReport();
    else if (activeTab === 'inventory') fetchInventoryReport();
    else if (activeTab === 'deliveries') {
      // Fetch deliveries by period when tab is active
      fetchDeliveriesByPeriod();
    }
  }, [activeTab, salesDateRange, deliveryDate]);

  // Fetch data when time period changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardByPeriod();
    } else if (activeTab === 'sales') {
      fetchSalesByPeriod();
    } else if (activeTab === 'deliveries') {
      fetchDeliveriesByPeriod();
    }
  }, [timePeriod]);

  const fetchDashboardByPeriod = async () => {
    try {
      const data = await reportService.getDashboardSummaryByPeriod(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard by period');
    }
  };

  const fetchSalesByPeriod = async () => {
    try {
      const data = await reportService.getSalesReportByPeriod(timePeriod);
      setSalesReport(data);
    } catch (error) {
      console.error('Failed to load sales by period');
    }
  };

  const fetchDeliveriesByPeriod = async () => {
    try {
      const data = await reportService.getDeliveryReportByPeriod(timePeriod);
      setDeliveryReport(data);
    } catch (error) {
      console.error('Failed to load deliveries by period');
    }
  };

  // Chart Data Transformations
  const salesChartData = useMemo(() => {
    if (!salesReport?.orders) return [];

    // Group by date
    const grouped = salesReport.orders.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date] += order.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, amount]) => ({
      date,
      amount
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [salesReport]);

  const orderStatusData = useMemo(() => {
    if (!salesReport?.orders) return [];

    const grouped = salesReport.orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status]) acc[status] = 0;
      acc[status]++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [salesReport]);

  const inventoryChartData = useMemo(() => {
    if (!inventoryReport?.products) return [];
    // Top 10 products by stock (or low stock)
    return inventoryReport.products
      .slice(0, 10)
      .map(p => ({
        name: p.name.substring(0, 15) + '...',
        stock: p.stockQuantity
      }));
  }, [inventoryReport]);

  const deliveryStatusData = useMemo(() => {
    if (!deliveryReport?.deliveries) return [];

    const grouped = deliveryReport.deliveries.reduce((acc, delivery) => {
      const status = delivery.status;
      if (!acc[status]) acc[status] = 0;
      acc[status]++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [deliveryReport]);

  const COLORS = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading && !dashboardData) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {['dashboard', 'sales', 'inventory', 'deliveries'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-all ${activeTab === tab
              ? 'border-b-2 border-pink-600 text-pink-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <LuDollarSign className="w-6 h-6 text-pink-600" />
                </div>
                <LuTrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Sales
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                ${(dashboardData.periodSales || dashboardData.monthlySales || 0).toFixed(2)}
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <LuShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <LuTrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Orders
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.periodOrders || dashboardData.monthlyOrders || 0}
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <LuPackage className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalProducts}
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                {dashboardData.lowStockProducts} low stock
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <LuTruck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {timePeriod === 'daily' ? "Today's" : timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Deliveries
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.periodDeliveries || dashboardData.todayDeliveries || 0}
              </p>
              <p className="text-sm text-yellow-600 mt-2 font-medium">
                {dashboardData.pendingDeliveries} pending
              </p>
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <LuCalendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 mr-3">Time Period:</span>
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timePeriod === period
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#ec4899" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={salesDateRange.startDate}
                  onChange={(e) => setSalesDateRange({ ...salesDateRange, startDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
                <input
                  type="date"
                  value={salesDateRange.endDate}
                  onChange={(e) => setSalesDateRange({ ...salesDateRange, endDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button onClick={fetchSalesReport} className="btn-primary">
                Update Report
              </button>
            </div>
          </div>

          {salesReport && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${salesReport.totalSales?.toFixed(2)}
                  </p>
                </div>
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {salesReport.totalOrders}
                  </p>
                </div>
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Order Value</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    ${salesReport.averageOrderValue?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Sales Performance</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && inventoryReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-gray-900">
                {inventoryReport.totalProducts}
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Low Stock Items</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {inventoryReport.lowStockProducts}
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Out of Stock</h3>
              <p className="text-3xl font-bold text-red-600">
                {inventoryReport.outOfStockProducts}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Overview (First 10 Items)</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && deliveryReport && (
        <div className="space-y-6">
          {/* Delivery Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Total Deliveries</h4>
              <p className="text-2xl font-bold text-gray-900">{deliveryReport.totalDeliveries || 0}</p>
            </div>
            <div className="card p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Pending</h4>
              <p className="text-2xl font-bold text-yellow-600">{deliveryReport.pendingDeliveries || 0}</p>
            </div>
            <div className="card p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Scheduled</h4>
              <p className="text-2xl font-bold text-blue-600">{deliveryReport.scheduledDeliveries || 0}</p>
            </div>
            <div className="card p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Completed</h4>
              <p className="text-2xl font-bold text-green-600">{deliveryReport.completedDeliveries || 0}</p>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Status Distribution</h3>
              <div className="h-80">
                {deliveryStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deliveryStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No delivery data available for the selected period</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery List</h3>
              <div className="overflow-y-auto h-80 space-y-3 pr-2">
                {deliveryReport.deliveries && deliveryReport.deliveries.length > 0 ? (
                  deliveryReport.deliveries.map((delivery) => (
                    <div key={delivery.trackingNumber} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-pink-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-900">{delivery.trackingNumber}</p>
                        <p className="text-sm text-gray-600">
                          {delivery.recipientName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {delivery.timeSlot}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${delivery.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : delivery.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {delivery.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No deliveries found for the selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;

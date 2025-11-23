import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { LuPackage, LuTruck, LuCheckCircle, LuClock, LuXCircle, LuMapPin, LuCreditCard, LuCalendar } from 'react-icons/lu';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      // Ensure data is an array
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: LuClock,
        description: 'Order is being processed'
      },
      PROCESSING: {
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: LuPackage,
        description: 'Order is being prepared'
      },
      SHIPPED: {
        label: 'Shipped',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: LuTruck,
        description: 'Order is on the way'
      },
      DELIVERED: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: LuCheckCircle,
        description: 'Order has been delivered'
      },
      CANCELLED: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: LuXCircle,
        description: 'Order was cancelled'
      }
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const getPaymentStatusInfo = (paymentMethod) => {
    // For now, all orders are marked as paid (mock payment)
    // You can add a paymentStatus field to Order model later
    return {
      label: 'Paid',
      color: 'bg-green-100 text-green-800',
      icon: LuCheckCircle
    };
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-iris-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-iris-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal-900 mb-2">My Orders</h1>
          <p className="text-charcoal-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === status
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-charcoal-700 hover:bg-charcoal-50 border border-charcoal-200'
                }`}
            >
              {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const paymentInfo = getPaymentStatusInfo(order.paymentMethod);
              const StatusIcon = statusInfo.icon;
              const PaymentIcon = paymentInfo.icon;

              return (
                <div key={order.id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-charcoal-100 p-6 hover:shadow-2xl transition-all">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-charcoal-200">
                    <div>
                      <h3 className="text-2xl font-bold text-charcoal-900 mb-2">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-charcoal-600">
                        <LuCalendar className="text-primary-600" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary-600 mb-1">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-charcoal-600">{order.orderItems?.length || 0} items</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {/* Delivery Status */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusInfo.color}`}>
                      <StatusIcon className="text-lg" />
                      <div>
                        <p className="text-xs font-semibold opacity-75">Delivery Status</p>
                        <p className="font-bold">{statusInfo.label}</p>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${paymentInfo.color}`}>
                      <PaymentIcon className="text-lg" />
                      <div>
                        <p className="text-xs font-semibold opacity-75">Payment Status</p>
                        <p className="font-bold">{paymentInfo.label}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-50 text-charcoal-700 border border-charcoal-200">
                      <LuCreditCard className="text-lg" />
                      <div>
                        <p className="text-xs font-semibold opacity-75">Payment Method</p>
                        <p className="font-bold">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-charcoal-50 rounded-2xl border border-charcoal-200">
                    <div className="flex items-start gap-3">
                      <LuMapPin className="text-primary-600 text-xl mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-charcoal-900 mb-1">Shipping Address</p>
                        <p className="text-sm text-charcoal-600">
                          {order.shippingAddress}<br />
                          {order.shippingCity}, {order.shippingState} {order.shippingZipCode}<br />
                          {order.shippingCountry}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
                      <LuPackage className="text-primary-600" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-charcoal-200">
                          <div className="w-16 h-16 bg-charcoal-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                                <LuPackage className="text-2xl" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-charcoal-900 truncate">{item.product?.name || 'Product'}</h5>
                            <p className="text-sm text-charcoal-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-600">${item.subtotal?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/track-delivery?orderNumber=${order.orderNumber}`}
                      className="btn-primary flex items-center gap-2 px-6 py-3"
                    >
                      <LuTruck className="text-xl" />
                      Track Order
                    </Link>
                    <button className="btn-outline px-6 py-3">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-charcoal-100 rounded-full mb-6">
              <LuPackage className="text-5xl text-charcoal-400" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-2">
              {filter === 'ALL' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
            </h3>
            <p className="text-charcoal-600 mb-6">
              {filter === 'ALL'
                ? "Start shopping to see your orders here!"
                : `You don't have any ${filter.toLowerCase()} orders.`}
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <LuPackage />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

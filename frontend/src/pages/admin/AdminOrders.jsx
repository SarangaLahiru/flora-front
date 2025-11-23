import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { deliveryService } from '../../services/deliveryService';
import { toast } from 'react-toastify';
import { LuEye, LuTruck, LuPackage, LuCheckCircle, LuClock, LuAlertCircle } from 'react-icons/lu';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !selectedOrder.deliveries || selectedOrder.deliveries.length === 0) {
      toast.error('No delivery associated with this order');
      return;
    }

    const delivery = selectedOrder.deliveries[0]; // Assuming one delivery per order for now

    try {
      await deliveryService.updateDeliveryStatus(delivery.trackingNumber, newStatus);
      toast.success('Delivery status updated successfully');
      setShowStatusModal(false);
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openStatusModal = (order) => {
    if (!order.deliveries || order.deliveries.length === 0) {
      toast.warning('No delivery created for this order yet');
      return;
    }
    setSelectedOrder(order);
    setNewStatus(order.deliveries[0].status);
    setShowStatusModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      PAID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-orange-100 text-orange-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
      RETURNED: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName}` : order.user?.username}
                  </div>
                  <div className="text-xs text-gray-500">{order.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {order.deliveries && order.deliveries.length > 0 ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.deliveries[0].status)}`}>
                      {order.deliveries[0].status.replace(/_/g, ' ')}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No Delivery</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openStatusModal(order)}
                    className="text-primary-600 hover:text-primary-800 flex items-center gap-1 text-sm font-medium"
                    title="Update Delivery Status"
                  >
                    <LuTruck /> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Delivery Status</h3>
            <p className="text-gray-600 mb-4">
              Order: {selectedOrder?.orderNumber}
              <br />
              Tracking: {selectedOrder?.deliveries[0]?.trackingNumber}
            </p>

            <form onSubmit={handleUpdateStatus}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

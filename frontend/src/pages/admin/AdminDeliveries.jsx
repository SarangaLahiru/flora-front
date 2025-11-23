import { useState, useEffect } from 'react';
import { deliveryService } from '../../services/deliveryService';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [driverInfo, setDriverInfo] = useState({
    driverName: '',
    driverPhone: '',
    vehicleNumber: ''
  });

  useEffect(() => {
    fetchDeliveries();
  }, [selectedDate]);

  const fetchDeliveries = async () => {
    try {
      const data = selectedDate 
        ? await deliveryService.getDeliveriesByDate(selectedDate)
        : await deliveryService.getAllDeliveries();
      setDeliveries(data);
    } catch (error) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (trackingNumber, newStatus) => {
    try {
      await deliveryService.updateDeliveryStatus(trackingNumber, newStatus);
      toast.success('Delivery status updated');
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignDriver = async () => {
    if (!driverInfo.driverName || !driverInfo.driverPhone || !driverInfo.vehicleNumber) {
      toast.error('Please fill all driver information');
      return;
    }

    try {
      await deliveryService.assignDriver(
        selectedDelivery.trackingNumber,
        driverInfo.driverName,
        driverInfo.driverPhone,
        driverInfo.vehicleNumber
      );
      toast.success('Driver assigned successfully');
      setShowAssignModal(false);
      setDriverInfo({ driverName: '', driverPhone: '', vehicleNumber: '' });
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to assign driver');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-orange-100 text-orange-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Delivery Management</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
          />
          <button
            onClick={() => setSelectedDate('')}
            className="px-6 py-3 bg-charcoal-100 text-charcoal-700 rounded-xl hover:bg-charcoal-200 font-medium transition-all"
          >
            All Deliveries
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {delivery.trackingNumber}
                </h3>
                {delivery.orderNumber && (
                  <p className="text-sm text-gray-600">Order: {delivery.orderNumber}</p>
                )}
                {delivery.eventNumber && (
                  <p className="text-sm text-gray-600">Event: {delivery.eventNumber}</p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  {delivery.recipientName} - {delivery.recipientPhone}
                </p>
                <p className="text-sm text-gray-500">
                  {delivery.deliveryAddress}, {delivery.deliveryCity}
                </p>
              </div>
              <div className="text-right">
                <select
                  value={delivery.status}
                  onChange={(e) => handleStatusChange(delivery.trackingNumber, e.target.value)}
                  className="px-4 py-2 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-sm font-semibold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(delivery.scheduledDate).toLocaleDateString()}
                </p>
                {delivery.scheduledTimeSlot && (
                  <p className="text-xs text-gray-500">{delivery.scheduledTimeSlot}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <div>
                {delivery.driverName ? (
                  <div className="text-sm">
                    <p><strong>Driver:</strong> {delivery.driverName}</p>
                    <p><strong>Phone:</strong> {delivery.driverPhone}</p>
                    <p><strong>Vehicle:</strong> {delivery.vehicleNumber}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No driver assigned</p>
                )}
              </div>
              {!delivery.driverName && delivery.status === 'PENDING' && (
                <button
                  onClick={() => {
                    setSelectedDelivery(delivery);
                    setShowAssignModal(true);
                  }}
                  className="btn-primary"
                >
                  Assign Driver
                </button>
              )}
            </div>
          </div>
        ))}

        {deliveries.length === 0 && (
          <div className="text-center py-12 card">
            <p className="text-gray-500">No deliveries found for this date</p>
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Assign Driver</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverInfo.driverName}
                  onChange={(e) => setDriverInfo({...driverInfo, driverName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Driver Phone</label>
                <input
                  type="tel"
                  value={driverInfo.driverPhone}
                  onChange={(e) => setDriverInfo({...driverInfo, driverPhone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                <input
                  type="text"
                  value={driverInfo.vehicleNumber}
                  onChange={(e) => setDriverInfo({...driverInfo, vehicleNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAssignDriver} className="btn-primary flex-1">
                  Assign
                </button>
                <button 
                  onClick={() => {
                    setShowAssignModal(false);
                    setDriverInfo({ driverName: '', driverPhone: '', vehicleNumber: '' });
                  }} 
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveries;

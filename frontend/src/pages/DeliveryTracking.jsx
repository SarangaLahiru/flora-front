import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deliveryService } from '../services/deliveryService';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { LuPackage, LuClipboardList, LuCalendar, LuTruck, LuCheckCircle } from 'react-icons/lu';

const DeliveryTracking = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if orderNumber is in URL params
    const orderNumber = searchParams.get('orderNumber');
    if (orderNumber) {
      fetchDeliveryByOrderNumber(orderNumber);
    }
  }, [searchParams]);

  const fetchDeliveryByOrderNumber = async (orderNumber) => {
    setLoading(true);
    try {
      const data = await deliveryService.trackByOrderNumber(orderNumber);
      setDelivery(data);
      setTrackingNumber(data.trackingNumber || '');
    } catch (error) {
      toast.error('No delivery found for this order. It may not have been scheduled yet.');
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number or order number');
      return;
    }

    setLoading(true);
    try {
      let data;
      // Try tracking number first (format: TRK-YYYYMMDD-XXXXX)
      if (trackingNumber.trim().startsWith('TRK-')) {
        data = await deliveryService.trackDelivery(trackingNumber.trim());
      }
      // Otherwise try as order number (format: ORD-...)
      else if (trackingNumber.trim().startsWith('ORD-')) {
        data = await deliveryService.trackByOrderNumber(trackingNumber.trim());
      }
      // If no prefix, try both
      else {
        try {
          data = await deliveryService.trackDelivery(trackingNumber.trim());
        } catch {
          data = await deliveryService.trackByOrderNumber(trackingNumber.trim());
        }
      }
      setDelivery(data);
      if (data.trackingNumber) {
        setTrackingNumber(data.trackingNumber);
      }
    } catch (error) {
      toast.error('Delivery not found. Please check your tracking number or order number.');
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-300',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-300',
      DELIVERED: 'bg-green-100 text-green-800 border-green-300',
      FAILED: 'bg-red-100 text-red-800 border-red-300',
      RETURNED: 'bg-orange-100 text-orange-800 border-orange-300',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'PENDING', label: 'Order Received', icon: LuClipboardList },
      { name: 'SCHEDULED', label: 'Scheduled', icon: LuCalendar },
      { name: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: LuTruck },
      { name: 'DELIVERED', label: 'Delivered', icon: LuCheckCircle }
    ];

    const statusOrder = ['PENDING', 'SCHEDULED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Track Your Delivery</h1>

      {/* Tracking Form */}
      <div className="card p-6 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number (TRK-...) or order number (ORD-...)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
      </div>

      {loading && <Loading />}

      {/* Delivery Information */}
      {delivery && !loading && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tracking: {delivery.trackingNumber}
                </h2>
                {delivery.orderNumber && (
                  <p className="text-gray-600">Order: {delivery.orderNumber}</p>
                )}
                {delivery.eventNumber && (
                  <p className="text-gray-600">Event: {delivery.eventNumber}</p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-lg text-lg font-semibold border-2 ${getStatusColor(delivery.status)}`}>
                {delivery.status.replace('_', ' ')}
              </span>
            </div>

            {/* Progress Tracker */}
            <div className="relative">
              <div className="flex justify-between items-center">
                {getStatusSteps(delivery.status).map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.name} className="flex flex-col items-center flex-1">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 border-4 ${step.completed
                        ? 'bg-pink-100 border-pink-500 text-pink-600'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                        <Icon className="text-2xl" />
                      </div>
                      <p className={`text-sm font-medium text-center ${step.completed ? 'text-pink-600' : 'text-gray-400'
                        }`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-pink-500 transition-all duration-500"
                  style={{
                    width: `${(getStatusSteps(delivery.status).filter(s => s.completed).length - 1) * 33.33}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="text-lg font-medium">
                    {new Date(delivery.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {delivery.scheduledTimeSlot && (
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="text-lg font-medium">{delivery.scheduledTimeSlot}</p>
                  </div>
                )}
                {delivery.actualDeliveryTime && (
                  <div>
                    <p className="text-sm text-gray-600">Delivered At</p>
                    <p className="text-lg font-medium text-green-600">
                      {new Date(delivery.actualDeliveryTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-2">
                {delivery.recipientName && (
                  <p className="font-medium">{delivery.recipientName}</p>
                )}
                <p className="text-gray-700">{delivery.deliveryAddress}</p>
                <p className="text-gray-700">
                  {delivery.deliveryCity}, {delivery.deliveryState} {delivery.deliveryZipCode}
                </p>
                {delivery.recipientPhone && (
                  <p className="text-gray-600">Phone: {delivery.recipientPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {delivery.driverName && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Driver Name</p>
                  <p className="text-lg font-medium">{delivery.driverName}</p>
                </div>
                {delivery.driverPhone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-medium">{delivery.driverPhone}</p>
                  </div>
                )}
                {delivery.vehicleNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="text-lg font-medium">{delivery.vehicleNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Notes */}
          {delivery.deliveryNotes && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Notes</h3>
              <p className="text-gray-700">{delivery.deliveryNotes}</p>
            </div>
          )}

          {/* Proof of Delivery */}
          {(delivery.signatureUrl || delivery.photoProofUrl) && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proof of Delivery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {delivery.signatureUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Signature</p>
                    <img
                      src={delivery.signatureUrl}
                      alt="Signature"
                      className="border rounded-lg"
                    />
                  </div>
                )}
                {delivery.photoProofUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Photo Proof</p>
                    <img
                      src={delivery.photoProofUrl}
                      alt="Delivery Proof"
                      className="border rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      {!delivery && !loading && (
        <div className="card p-8 text-center">
          <LuPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Track Your Flower Delivery
          </h2>
          <p className="text-gray-600 mb-4">
            Enter your tracking number or order number above to see real-time updates on your delivery status.
          </p>
          <p className="text-sm text-gray-500">
            Your tracking number and order number can be found in your order confirmation email or on your order page.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;

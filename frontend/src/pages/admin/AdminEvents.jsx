import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [statusFilter, events]);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (statusFilter === 'ALL') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.status === statusFilter));
    }
  };

  const handleApprove = async () => {
    try {
      await eventService.approveEvent(selectedEvent.id, adminNotes);
      toast.success('Event approved successfully');
      setShowApprovalModal(false);
      setAdminNotes('');
      fetchEvents();
    } catch (error) {
      toast.error('Error approving event');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await eventService.rejectEvent(selectedEvent.id, rejectionReason, adminNotes);
      toast.success('Event rejected');
      setShowRejectionModal(false);
      setRejectionReason('');
      setAdminNotes('');
      fetchEvents();
    } catch (error) {
      toast.error('Error rejecting event');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-gray-200 text-gray-600'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeIcon = (type) => {
    return type.replace(/_/g, ' ');
  };

  const statusCounts = {
    ALL: events.length,
    PENDING: events.filter(e => e.status === 'PENDING').length,
    APPROVED: events.filter(e => e.status === 'APPROVED').length,
    REJECTED: events.filter(e => e.status === 'REJECTED').length
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="text-sm text-gray-600">
          Total Events: <span className="font-bold">{events.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id} className={event.status === 'PENDING' ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{event.eventNumber}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">
                    {getEventTypeIcon(event.eventType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{event.userName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{event.venueName}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  ${event.totalAmount?.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {event.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowApprovalModal(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Event Details - {selectedEvent.eventNumber}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block">Customer</label>
                    <p className="text-gray-900 font-medium">{selectedEvent.userName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Event Type</label>
                    <p className="text-gray-900 font-medium">
                      {getEventTypeIcon(selectedEvent.eventType)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Date & Time</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedEvent.eventDate).toLocaleDateString()} at {selectedEvent.eventTime}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Guests</label>
                    <p className="text-gray-900 font-medium">{selectedEvent.guestCount}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block">Venue</label>
                  <p className="text-gray-900 font-medium">{selectedEvent.venueName}</p>
                  <p className="text-sm text-gray-600">{selectedEvent.venueAddress}, {selectedEvent.venueCity}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block">Items Ordered</label>
                  <div className="mt-2 space-y-2">
                    {selectedEvent.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-900">${selectedEvent.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {selectedEvent.specialInstructions && (
                  <div>
                    <label className="text-xs text-gray-500 block">Special Instructions</label>
                    <p className="text-gray-900">{selectedEvent.specialInstructions}</p>
                  </div>
                )}

                {selectedEvent.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <label className="text-xs font-semibold text-red-800 block">Rejection Reason</label>
                    <p className="text-red-700 text-sm">{selectedEvent.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Approve Event - {selectedEvent.eventNumber}</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">You are about to approve this event request.</p>
                  <p className="text-green-700 text-sm mt-1">The customer will be notified of the approval.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block">Customer</label>
                    <p className="text-gray-900 font-medium">{selectedEvent.userName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Event Type</label>
                    <p className="text-gray-900 font-medium">{selectedEvent.eventType}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Date</label>
                    <p className="text-gray-900 font-medium">{new Date(selectedEvent.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Total Amount</label>
                    <p className="text-gray-900 font-medium">${selectedEvent.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Admin Notes (Optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Add any internal notes..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
              >
                Approve Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Reject Event</h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">You are about to reject this event request.</p>
                <p className="text-red-700 text-sm mt-1">Please provide a reason for the customer.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Reason (Required)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="3"
                  placeholder="Explain why this event is being rejected..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Internal Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="2"
                  placeholder="Add any internal notes..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;

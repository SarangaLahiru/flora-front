import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { FaEye, FaTimes } from 'react-icons/fa';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getUserEvents();
            setEvents(data);
        } catch (error) {
            toast.error('Error fetching your events');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEvent = async (id) => {
        if (window.confirm('Are you sure you want to cancel this event?')) {
            try {
                await eventService.deleteEvent(id);
                toast.success('Event cancelled successfully');
                fetchEvents();
            } catch (error) {
                toast.error('Error cancelling event');
            }
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
        const icons = {
            WEDDING: '💒',
            BIRTHDAY: '🎂',
            ANNIVERSARY: '💐',
            CORPORATE: '🏢',
            FUNERAL: '🕊️',
            BABY_SHOWER: '👶',
            GRADUATION: '🎓',
            ENGAGEMENT: '💍',
            OTHER: '🎉'
        };
        return icons[type] || '🎉';
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">My Events</h2>

            {events.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-gray-500 text-lg">You haven't booked any events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-4xl mb-2">{getEventTypeIcon(event.eventType)}</div>
                                        <h3 className="font-bold text-lg">{event.eventType.replace('_', ' ')}</h3>
                                        <p className="text-sm opacity-90">{event.eventNumber}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div>
                                    <div className="text-xs text-gray-500">Date & Time</div>
                                    <div className="font-medium text-gray-900">
                                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-600">{event.eventTime}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">Venue</div>
                                    <div className="font-medium text-gray-900">{event.venueName}</div>
                                    <div className="text-sm text-gray-600">{event.venueCity}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">Guests</div>
                                    <div className="font-medium text-gray-900">{event.guestCount} people</div>
                                </div>

                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Amount</span>
                                        <span className="text-xl font-bold text-pink-600">${event.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                {event.status === 'REJECTED' && event.rejectionReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</div>
                                        <div className="text-sm text-red-700">{event.rejectionReason}</div>
                                    </div>
                                )}

                                <div className="flex space-x-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setShowDetailsModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <FaEye />
                                        <span>View Details</span>
                                    </button>
                                    {(event.status === 'PENDING' || event.status === 'APPROVED') && (
                                        <button
                                            onClick={() => handleCancelEvent(event.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            title="Cancel Event"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                            <h3 className="text-xl font-bold">Event Details - {selectedEvent.eventNumber}</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-4xl mb-2">{getEventTypeIcon(selectedEvent.eventType)}</div>
                                        <h4 className="text-2xl font-bold text-gray-900">{selectedEvent.eventType.replace('_', ' ')}</h4>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedEvent.status)}`}>
                                        {selectedEvent.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block">Date</label>
                                        <p className="text-gray-900 font-medium">
                                            {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Time</label>
                                        <p className="text-gray-900 font-medium">{selectedEvent.eventTime}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Guests</label>
                                        <p className="text-gray-900 font-medium">{selectedEvent.guestCount} people</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Budget</label>
                                        <p className="text-gray-900 font-medium">${selectedEvent.budget?.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 block">Venue</label>
                                    <p className="text-gray-900 font-medium">{selectedEvent.venueName}</p>
                                    <p className="text-sm text-gray-600">
                                        {selectedEvent.venueAddress}<br />
                                        {selectedEvent.venueCity}, {selectedEvent.venueState} {selectedEvent.venueZipCode}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 block">Contact Person</label>
                                    <p className="text-gray-900 font-medium">{selectedEvent.contactPerson}</p>
                                    <p className="text-sm text-gray-600">{selectedEvent.contactPhone}</p>
                                    <p className="text-sm text-gray-600">{selectedEvent.contactEmail}</p>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 block mb-2">Items Ordered</label>
                                    <div className="space-y-2">
                                        {selectedEvent.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.productName}</div>
                                                    <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                                    {item.customizationNotes && (
                                                        <div className="text-xs text-gray-500 mt-1">Note: {item.customizationNotes}</div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                                                    <div className="text-xs text-gray-500">${item.price.toFixed(2)} each</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedEvent.specialInstructions && (
                                    <div>
                                        <label className="text-xs text-gray-500 block">Special Instructions</label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedEvent.specialInstructions}</p>
                                    </div>
                                )}

                                {selectedEvent.status === 'REJECTED' && selectedEvent.rejectionReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <label className="text-sm font-semibold text-red-800 block mb-2">Rejection Reason</label>
                                        <p className="text-red-700">{selectedEvent.rejectionReason}</p>
                                    </div>
                                )}

                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 font-medium">Total Amount</span>
                                        <span className="text-3xl font-bold text-pink-600">${selectedEvent.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEvents;

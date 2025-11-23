import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import Loading from '../components/Loading';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getUserEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeLabel = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
        <Link to="/event-booking" className="btn-primary">
          Book New Event
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getEventTypeLabel(event.eventType)} - {event.eventNumber}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Event Date: {new Date(event.eventDate).toLocaleDateString()} 
                    {event.eventTime && ` at ${event.eventTime}`}
                  </p>
                  {event.venueName && (
                    <p className="text-gray-600 text-sm">Venue: {event.venueName}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              {event.items && event.items.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Flower Arrangements:</h4>
                  <div className="space-y-2">
                    {event.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.productName} × {item.quantity}
                          {item.placementLocation && (
                            <span className="text-gray-500"> ({item.placementLocation})</span>
                          )}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.specialInstructions && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Special Instructions:</h4>
                  <p className="text-gray-600 text-sm">{event.specialInstructions}</p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Guest Count: {event.guestCount || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact: {event.contactPerson} ({event.contactPhone})
                  </p>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  ${event.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Events Booked Yet</h2>
          <p className="text-gray-600 mb-6">
            Book flowers for your special events - weddings, birthdays, and more!
          </p>
          <Link to="/event-booking" className="btn-primary inline-block">
            Book Your First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default Events;

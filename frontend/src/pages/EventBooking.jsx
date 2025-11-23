import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { productService } from '../services/productService';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const EventBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    eventType: 'WEDDING',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueZipCode: '',
    guestCount: '',
    budget: '',
    specialInstructions: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    items: []
  });

  const [selectedProduct, setSelectedProduct] = useState({
    productId: '',
    quantity: 1,
    customizationNotes: '',
    placementLocation: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    if (!selectedProduct.productId) {
      toast.error('Please select a product');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct.productId));
    
    setFormData({
      ...formData,
      items: [...formData.items, {
        ...selectedProduct,
        productId: parseInt(selectedProduct.productId),
        productName: product.name,
        price: product.price
      }]
    });

    setSelectedProduct({
      productId: '',
      quantity: 1,
      customizationNotes: '',
      placementLocation: ''
    });

    toast.success('Item added to event');
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventService.createEvent(formData);
      toast.success('Event booking created successfully!');
      navigate('/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Book Event Flowers</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="WEDDING">Wedding</option>
                <option value="BIRTHDAY">Birthday</option>
                <option value="ANNIVERSARY">Anniversary</option>
                <option value="CORPORATE">Corporate Event</option>
                <option value="FUNERAL">Funeral</option>
                <option value="BABY_SHOWER">Baby Shower</option>
                <option value="GRADUATION">Graduation</option>
                <option value="ENGAGEMENT">Engagement</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Count
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Venue Information */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Venue Information</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Address
              </label>
              <textarea
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="venueCity"
                  value={formData.venueCity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="venueState"
                  value={formData.venueState}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="venueZipCode"
                  value={formData.venueZipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Flower Selection */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Flower Arrangements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                name="productId"
                value={selectedProduct.productId}
                onChange={handleProductChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={selectedProduct.quantity}
                onChange={handleProductChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placement Location
              </label>
              <input
                type="text"
                name="placementLocation"
                value={selectedProduct.placementLocation}
                onChange={handleProductChange}
                placeholder="e.g., Reception table, Ceremony arch"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customization Notes
              </label>
              <input
                type="text"
                name="customizationNotes"
                value={selectedProduct.customizationNotes}
                onChange={handleProductChange}
                placeholder="Special requests..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="btn-secondary w-full"
          >
            Add Item to Event
          </button>

          {/* Selected Items */}
          {formData.items.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Selected Items:</h3>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                      </p>
                      {item.placementLocation && (
                        <p className="text-sm text-gray-500">Location: {item.placementLocation}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xl font-bold text-right">
                  Total: ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="4"
            placeholder="Any special requirements, color preferences, or additional details..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || formData.items.length === 0}
          className="btn-primary w-full"
        >
          {loading ? 'Submitting...' : 'Submit Event Booking'}
        </button>
      </form>
    </div>
  );
};

export default EventBooking;

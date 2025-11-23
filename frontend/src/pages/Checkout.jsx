import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { LuMapPin, LuMail, LuPhone, LuCreditCard, LuShoppingBag, LuArrowLeft, LuCheckCircle } from 'react-icons/lu';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    shippingCity: user?.city || '',
    shippingState: user?.state || '',
    shippingZipCode: user?.zipCode || '',
    shippingCountry: user?.country || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    paymentMethod: 'Credit Card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.phone || prev.customerPhone,
        shippingCity: user.city || prev.shippingCity,
        shippingState: user.state || prev.shippingState,
        shippingZipCode: user.zipCode || prev.shippingZipCode,
        shippingCountry: user.country || prev.shippingCountry,
        shippingAddress: user.address || prev.shippingAddress,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingState ||
        !formData.shippingZipCode || !formData.shippingCountry || !formData.customerEmail ||
        !formData.customerPhone) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    if (currentStep === 2 && formData.paymentMethod === 'Credit Card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill in all payment details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      const order = await orderService.createOrder(formData);
      toast.success('Order placed successfully! 🎉');
      await clearCart();
      navigate(`/order-success/${order.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    navigate('/products');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-iris-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-charcoal-600 hover:text-iris-600 transition-colors mb-4"
          >
            <LuArrowLeft className="text-xl" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-charcoal-900 mb-2">Checkout</h1>
          <p className="text-charcoal-600">Complete your order securely</p>
        </div>

        {/* Progress Steps - Improved Design */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { step: 1, label: 'Shipping', icon: LuMapPin },
              { step: 2, label: 'Payment', icon: LuCreditCard },
              { step: 3, label: 'Review', icon: LuShoppingBag }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep > step
                      ? 'bg-green-500 text-white shadow-lg scale-110'
                      : currentStep === step
                        ? 'bg-primary-500 text-white shadow-xl scale-110 ring-4 ring-primary-100'
                        : 'bg-white border-2 border-charcoal-300 text-charcoal-400'
                      }`}
                  >
                    {currentStep > step ? (
                      <LuCheckCircle className="text-3xl" />
                    ) : (
                      <Icon className="text-3xl" />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`mt-3 text-sm font-semibold transition-colors ${currentStep >= step ? 'text-primary-600' : 'text-charcoal-500'
                      }`}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < 2 && (
                  <div className="flex-1 h-1 mx-4 relative">
                    <div className="absolute inset-0 bg-charcoal-200 rounded-full"></div>
                    <div
                      className={`absolute inset-0 bg-primary-500 rounded-full transition-all duration-500 ${currentStep > step + 1 ? 'w-full' : currentStep === step + 1 ? 'w-1/2' : 'w-0'
                        }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-charcoal-100 p-8 space-y-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal-900 mb-1 flex items-center gap-2">
                      <LuMapPin className="text-iris-600" size={24} />
                      Shipping Information
                    </h2>
                    <p className="text-charcoal-600 mb-6">Where should we deliver your order?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        required
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">City *</label>
                        <input
                          type="text"
                          name="shippingCity"
                          required
                          value={formData.shippingCity}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">State *</label>
                        <input
                          type="text"
                          name="shippingState"
                          required
                          value={formData.shippingState}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Zip Code *</label>
                        <input
                          type="text"
                          name="shippingZipCode"
                          required
                          value={formData.shippingZipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Country *</label>
                        <input
                          type="text"
                          name="shippingCountry"
                          required
                          value={formData.shippingCountry}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                      <LuMail className="text-iris-600" size={20} />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Email *</label>
                        <input
                          type="email"
                          name="customerEmail"
                          required
                          value={formData.customerEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="customerPhone"
                          required
                          value={formData.customerPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-charcoal-100">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-8 py-3"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal-900 mb-1 flex items-center gap-2">
                      <LuCreditCard className="text-iris-600" size={24} />
                      Payment Method
                    </h2>
                    <p className="text-charcoal-600 mb-6">Choose your preferred payment method</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-900 mb-3">
                      Payment Type *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>

                  {formData.paymentMethod === 'Credit Card' && (
                    <div className="space-y-4 p-6 bg-charcoal-50 rounded-2xl border border-charcoal-200">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          required
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            required
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            required
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900 resize-none"
                      placeholder="Any special instructions or delivery notes..."
                    />
                  </div>

                  <div className="flex justify-between gap-4 pt-4 border-t border-charcoal-100">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-outline px-8 py-3"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-8 py-3"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal-900 mb-1 flex items-center gap-2">
                      <LuShoppingBag className="text-iris-600" size={24} />
                      Review Your Order
                    </h2>
                    <p className="text-charcoal-600 mb-6">Please review your order before placing it</p>
                  </div>

                  <div className="space-y-6 p-6 bg-charcoal-50 rounded-2xl border border-charcoal-200">
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-3">Shipping Address</h3>
                      <p className="text-charcoal-600 text-sm">
                        {formData.shippingAddress}<br />
                        {formData.shippingCity}, {formData.shippingState} {formData.shippingZipCode}<br />
                        {formData.shippingCountry}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-3">Contact</h3>
                      <p className="text-charcoal-600 text-sm">
                        {formData.customerEmail}<br />
                        {formData.customerPhone}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-3">Payment</h3>
                      <p className="text-charcoal-600 text-sm">{formData.paymentMethod}</p>
                      {formData.paymentMethod === 'Credit Card' && formData.cardNumber && (
                        <p className="text-charcoal-600 text-sm">
                          **** **** **** {formData.cardNumber.slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 pt-4 border-t border-charcoal-100">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-outline px-8 py-3"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-charcoal-100 p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                <LuShoppingBag className="text-iris-600" size={24} />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-charcoal-100 last:border-0">
                    <div className="w-20 h-20 bg-charcoal-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                          <LuShoppingBag className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal-900 mb-1 truncate">{item.productName}</h3>
                      <p className="text-sm text-charcoal-600 mb-2">Qty: {item.quantity}</p>
                      <p className="text-lg font-bold text-iris-600">${item.subtotal?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-charcoal-200">
                <div className="flex justify-between text-charcoal-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-charcoal-900 pt-3 border-t border-charcoal-200">
                  <span>Total</span>
                  <span className="text-iris-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { LuCheckCircle, LuPackage, LuTruck, LuMapPin, LuCalendar, LuArrowRight } from 'react-icons/lu';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            fetchOrder();
        } else {
            navigate('/orders');
        }
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const data = await orderService.getOrderByNumber(orderNumber);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const getEstimatedDelivery = () => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
        return deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
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

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-iris-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-2xl mb-6">
                        <LuCheckCircle className="text-white text-5xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-charcoal-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-lg text-charcoal-600">Thank you for your purchase 🎉</p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-charcoal-100 p-8 mb-6"
                >
                    {/* Order Number */}
                    <div className="text-center pb-6 border-b border-charcoal-200 mb-6">
                        <p className="text-sm text-charcoal-600 mb-1">Order Number</p>
                        <p className="text-2xl font-bold text-primary-600">{order.orderNumber}</p>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Estimated Delivery */}
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blush-50 to-iris-50 rounded-2xl border border-primary-100">
                            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <LuCalendar className="text-white text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal-900 mb-1">Estimated Delivery</p>
                                <p className="text-sm text-charcoal-600">{getEstimatedDelivery()}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blush-50 to-iris-50 rounded-2xl border border-primary-100">
                            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <LuMapPin className="text-white text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal-900 mb-1">Shipping To</p>
                                <p className="text-sm text-charcoal-600">
                                    {order.shippingAddress}<br />
                                    {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                            <LuPackage className="text-primary-600" />
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-charcoal-50 rounded-xl">
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
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
                                        <h4 className="font-semibold text-charcoal-900 truncate">{item.product.name}</h4>
                                        <p className="text-sm text-charcoal-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-600">${item.subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="pt-6 border-t border-charcoal-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-charcoal-900">Total Amount</span>
                            <span className="text-3xl font-bold text-primary-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <Link
                        to="/track-delivery"
                        className="btn-primary flex items-center justify-center gap-2 py-4"
                    >
                        <LuTruck className="text-xl" />
                        Track Your Order
                    </Link>
                    <Link
                        to="/orders"
                        className="btn-outline flex items-center justify-center gap-2 py-4"
                    >
                        <LuPackage className="text-xl" />
                        View All Orders
                    </Link>
                </motion.div>

                {/* Continue Shopping */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-8"
                >
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                        Continue Shopping
                        <LuArrowRight className="text-xl" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;

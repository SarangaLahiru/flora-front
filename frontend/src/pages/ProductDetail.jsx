import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-200 rounded-xl overflow-hidden aspect-square">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-9xl">📦</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {product.category && (
            <p className="text-primary-600 font-medium mb-4">{product.category.name}</p>
          )}

          <div className="flex items-center mb-6">
            <span className="text-4xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-2xl text-gray-500 line-through ml-4">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
                <span className="ml-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stockQuantity > 0 ? (
              <p className="text-green-600 font-medium">
                ✓ In Stock ({product.stockQuantity} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stockQuantity > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <FaMinus />
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>

          {/* Product Info */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>SKU:</strong> {product.sku || 'N/A'}</li>
              <li><strong>Category:</strong> {product.category?.name || 'N/A'}</li>
              <li><strong>Availability:</strong> {product.active ? 'Available' : 'Unavailable'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

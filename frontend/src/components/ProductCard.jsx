import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { LuShoppingBag, LuHeart, LuFlower2 } from 'react-icons/lu';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Unable to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const originalPrice =
    product.discount > 0 ? product.price * (1 + product.discount / 100) : null;

  return (
    <article className="card card-hover overflow-hidden flex flex-col h-full group">
      <div className="relative">
        <Link to={`/products/${product.id}`} className="block">
          <div className="h-72 bg-card-gradient overflow-hidden relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-primary-200">
                <LuFlower2 className="text-5xl mb-2" />
                <p className="font-medium">Awaiting photo</p>
              </div>
            )}
            {product.stockQuantity === 0 && (
              <div className="absolute inset-0 bg-charcoal-900/60 text-white flex flex-col items-center justify-center text-lg font-semibold">
                Out of stock
              </div>
            )}
          </div>
        </Link>
        {product.featured && (
          <span className="chip absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-600">
            Featured
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur flex items-center justify-center shadow-md transition-all ${
            isInWishlist(product.id)
              ? 'bg-blush-500 text-white hover:bg-blush-600'
              : 'bg-white/90 text-charcoal-600 hover:text-blush-600 hover:bg-white'
          }`}
          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <LuHeart className={`text-xl ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-charcoal-900 line-clamp-2 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-charcoal-500 text-sm line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-primary-600">
                ${product.price.toFixed(2)}
              </p>
              {originalPrice && (
                <p className="text-sm text-charcoal-400 line-through">
                  ${originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="btn-primary px-5 py-2 text-sm gap-2 disabled:bg-charcoal-200 disabled:text-charcoal-500 disabled:cursor-not-allowed"
              title={product.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <LuShoppingBag className="text-lg" />
              Add
            </button>
          </div>
          {product.stockQuantity > 0 && product.stockQuantity < 10 && (
            <p className="text-sm text-primary-600 font-medium">
              Only {product.stockQuantity} left this week
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

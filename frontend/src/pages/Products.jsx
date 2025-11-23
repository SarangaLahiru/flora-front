import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { FaSearch } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent UI issues
      setProducts([]);
      setCategories([]);
      // Optionally show user-friendly error message
      if (error.code === 'ERR_INCOMPLETE_CHUNKED_ENCODING' || error.message === 'Network Error') {
        console.warn('Network connection issue. Please check if the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (term.trim()) {
      try {
        const data = await productService.searchProducts(term.trim());
        setProducts(data);
        setSelectedCategory(null);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      fetchData();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounce search
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
    setSearchTimeout(timeout);
  };

  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleCategoryFilter = async (categoryId) => {
    try {
      setSelectedCategory(categoryId);
      if (categoryId) {
        const data = await productService.getProductsByCategory(categoryId);
        setProducts(data);
      } else {
        const data = await productService.getAllProducts();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Products</h1>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-charcoal-600 whitespace-nowrap">Filter:</span>
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              !selectedCategory
                ? 'bg-primary-600 text-white shadow-soft'
                : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Products;

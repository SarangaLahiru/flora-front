import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    sku: '',
    active: true,
    featured: false,
    discount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    try {
      const productData = {
        ...formData,
        category: formData.categoryId ? { id: formData.categoryId } : null
      };

      console.log('Sending product data:', productData);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImagePreview(product.imageUrl || null);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
      sku: product.sku || '',
      active: product.active,
      featured: product.featured,
      discount: product.discount
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
      sku: '',
      active: true,
      featured: false,
      discount: 0
    });
    setEditingProduct(null);
    setImagePreview(null);
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setFormData({ ...formData, imageUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <img
                    src={product.imageUrl || '/placeholder-product.png'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                  />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category?.name || 'N/A'}</td>
                <td className="px-4 py-3">${product.price}</td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-4" id="productForm">

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Column - Image Upload */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-charcoal-900 mb-4">Product Image</h4>

                    {/* Drag and Drop Area */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-3 border-dashed rounded-2xl transition-all ${dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-charcoal-300 bg-charcoal-50'
                        }`}
                    >
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-80 object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-2xl flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeImage}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all font-medium"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <svg className="mx-auto h-24 w-24 text-charcoal-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-lg font-semibold text-charcoal-900 mb-2">
                            Drag and drop your image here
                          </p>
                          <p className="text-sm text-charcoal-600 mb-4">or</p>
                          <label className="cursor-pointer inline-block">
                            <span className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium transition-all shadow-md inline-block">
                              Browse Files
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-charcoal-500 mt-4">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">Or paste Image URL</label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          if (e.target.value) setImagePreview(e.target.value);
                        }}
                        className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Right Column - Product Details */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-charcoal-900 mb-4">Product Details</h4>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                        rows="4"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Price *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="Quantity"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">SKU</label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="Product SKU"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-900 mb-2">Discount %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount}
                          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">Category</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-charcoal-900"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          className="w-5 h-5 text-primary-500 border-charcoal-300 rounded focus:ring-2 focus:ring-primary-300"
                        />
                        <span className="ml-2 text-sm font-medium text-charcoal-900 group-hover:text-primary-500 transition-colors">Active</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 text-primary-500 border-charcoal-300 rounded focus:ring-2 focus:ring-primary-300"
                        />
                        <span className="ml-2 text-sm font-medium text-charcoal-900 group-hover:text-primary-500 transition-colors">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="productForm"
                className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

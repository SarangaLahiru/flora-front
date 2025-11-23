import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategoriesWithCounts();
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      active: category.active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      active: true
    });
    setEditingCategory(null);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <img
                    src={category.imageUrl || '/placeholder-category.png'}
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/placeholder-category.png'; }}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {category.description ? category.description.substring(0, 50) + '...' : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {category.productCount} products
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {category.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-4" id="categoryForm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    rows="3"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Active</label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForm(); }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="categoryForm"
                className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

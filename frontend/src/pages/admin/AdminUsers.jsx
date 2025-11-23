import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { FaEye, FaTrash } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsersWithCounts();
      setUsers(data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await userService.toggleUserStatus(id);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their wishlist and cart.')) {
      try {
        await userService.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error('Error deleting user');
      }
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Avatar component
  const Avatar = ({ user }) => {
    if (user.avatarUrl) {
      return (
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      );
    }

    const initial = (user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase();
    const colors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
    const colorIndex = (user.id || 0) % colors.length;

    return (
      <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold`}>
        {initial}
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-bold">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avatar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <Avatar user={user} />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username}
                    </p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {user.orderCount} orders
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.provider === 'google' ? (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-xs text-gray-600">Google</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">Local</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`px-2 py-1 rounded-full text-xs cursor-pointer ${user.active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="mb-4 transform scale-150">
                  <Avatar user={selectedUser} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser.firstName && selectedUser.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : selectedUser.username}
                </h2>
                <p className="text-gray-500">@{selectedUser.username}</p>
                <div className="flex gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUser.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUser.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {selectedUser.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Contact Info</h4>
                  <div>
                    <label className="text-xs text-gray-500 block">Email</label>
                    <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Phone</label>
                    <p className="text-gray-900 font-medium">{selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Account Info</h4>
                  <div>
                    <label className="text-xs text-gray-500 block">Provider</label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser.provider === 'google' ? (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="text-gray-900 font-medium">Google</span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-medium">Local Email</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Joined Date</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Activity</h4>
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedUser.orderCount}</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
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

export default AdminUsers;

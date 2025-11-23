import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuList, 
  LuShoppingBag, 
  LuCalendar, 
  LuTruck, 
  LuUsers, 
  LuSearch,
  LuFlower2,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminEvents from './AdminEvents';
import AdminDeliveries from './AdminDeliveries';
import AdminReports from './AdminReports';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const menuItems = [
    { path: '/admin/reports', icon: LuLayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: LuPackage, label: 'Products' },
    { path: '/admin/categories', icon: LuList, label: 'Categories' },
    { path: '/admin/orders', icon: LuShoppingBag, label: 'Orders' },
    { path: '/admin/events', icon: LuCalendar, label: 'Events' },
    { path: '/admin/deliveries', icon: LuTruck, label: 'Deliveries' },
    { path: '/admin/users', icon: LuUsers, label: 'Users' },
  ];

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = menuItems.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const getUserInitials = () => {
    if (!user?.username) return 'AD';
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-charcoal-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-charcoal-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="h-16 border-b border-charcoal-200 flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                <LuFlower2 className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-primary-600">Flora</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
              <LuFlower2 className="text-white text-xl" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-primary-50'
                  }`}>
                    <Icon className={`text-xl ${
                      isActive ? 'text-white' : 'text-primary-600'
                    }`} />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-charcoal-200 p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-charcoal-600 hover:bg-charcoal-50 transition-all"
          >
            {sidebarCollapsed ? (
              <LuChevronRight className="text-xl" />
            ) : (
              <>
                <LuChevronLeft className="text-xl mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Navbar */}
        <header className="h-16 bg-white border-b border-charcoal-200 flex items-center justify-between px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Search pages..."
                className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white text-sm text-charcoal-800"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearchResults(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-50 transition-colors border-b border-charcoal-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Icon className="text-lg text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-charcoal-900">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center space-x-4 ml-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-charcoal-900">{user?.username || 'Admin'}</p>
              <p className="text-xs text-charcoal-500">{user?.email}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getUserInitials()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-charcoal-600 hover:bg-charcoal-50 rounded-xl transition-all"
              title="Logout"
            >
              <LuLogOut className="text-xl" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-charcoal-50 p-6">
          <Routes>
            <Route path="reports" element={<AdminReports />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="/" element={<AdminReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

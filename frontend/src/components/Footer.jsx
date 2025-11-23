import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white">Flora</span>
            </div>
            <p className="text-sm">
              Your one-stop shop for quality products. We bring you the best shopping experience online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-400 transition-colors">Orders</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Returns</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl hover:text-primary-400 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 Flora E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

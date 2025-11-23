import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LuMail, LuLock, LuFlower2, LuEye, LuEyeOff } from 'react-icons/lu';
import api from '../services/api';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setError(''); // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(formData);
      toast.success(`Welcome back, ${userData.firstName || userData.username}! 🌸`);

      // Redirect admin users to admin dashboard
      if (userData.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin/reports', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setLoading(false);

      // Debug logging
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;

        if (status === 401) {
          toast.error('Invalid email or password. Please try again.');
        } else if (status === 403) {
          toast.error('Your account has been disabled. Please contact support.');
        } else if (status === 404) {
          toast.error('Account not found. Please check your email or sign up.');
        } else if (message) {
          toast.error(message);
        } else {
          toast.error('Login failed. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error('Unable to connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const userData = await googleLogin(credentialResponse.credential);
      toast.success(`Welcome, ${userData.firstName || userData.username}! 🌸`);

      if (userData.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin/reports', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Google login failed:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Google authentication failed. Please try again.');
      } else {
        toast.error('Unable to sign in with Google. Please try again or use email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
    toast.error('Google sign-in was cancelled or failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-primary-100 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft">
                <LuFlower2 className="text-white text-3xl" />
              </div>
              <span className="text-3xl font-bold text-primary-500">
                Flora
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-charcoal-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-charcoal-600">
              Sign in to continue your floral journey
            </p>
          </div>

          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-charcoal-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <LuMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal-900 mb-2">
                Password
              </label>
              <div className="relative">
                <LuLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-iris-600 border-charcoal-300 rounded focus:ring-iris-500"
                />
                <span className="text-sm text-charcoal-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-iris-600 hover:text-iris-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-charcoal-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-iris-600 hover:text-iris-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

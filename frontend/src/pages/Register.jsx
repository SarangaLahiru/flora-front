import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LuUser, LuMail, LuLock, LuPhone, LuFlower2, LuEye, LuEyeOff } from 'react-icons/lu';
import api from '../services/api';
import { authService } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: '' }); // Clear error for this field
    setFormData({
      ...formData,
      [name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.username || formData.username.trim().length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('🎉 Account created successfully! Please sign in to continue.');

      // Wait a moment before navigating so user can see the success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setLoading(false);

      // Handle different error scenarios
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;

        if (status === 409 || message?.toLowerCase().includes('already exists')) {
          if (message?.toLowerCase().includes('email')) {
            toast.error('This email is already registered. Please use a different email or sign in.');
          } else if (message?.toLowerCase().includes('username')) {
            toast.error('This username is already taken. Please choose a different username.');
          } else {
            toast.error('An account with these credentials already exists.');
          }
        } else if (status === 400) {
          if (message) {
            toast.error(message);
          } else {
            toast.error('Invalid registration data. Please check all fields.');
          }
        } else if (message) {
          toast.error(message);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else if (error.request) {
        toast.error('Unable to connect to server. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

      console.error('Registration error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const userData = await googleLogin(credentialResponse.credential);
      toast.success(`Welcome to Flora, ${userData.firstName || userData.username}! 🌸`);
      navigate('/');
    } catch (error) {
      console.error('Google registration failed:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Google authentication failed. Please try again.');
      } else {
        toast.error('Unable to sign up with Google. Please try again or use email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Google registration failed');
    toast.error('Google sign-up was cancelled or failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
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
              Create Your Account
            </h2>
            <p className="text-charcoal-600">
              Join us and start your floral journey
            </p>
          </div>

          {/* Google Register Button */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-charcoal-500">Or register with email</span>
            </div>
          </div>

          {/* Register Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-charcoal-900 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-charcoal-900 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-charcoal-900 mb-2">
                Username *
              </label>
              <div className="relative">
                <LuUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                  placeholder="Choose a unique username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal-900 mb-2">
                Email Address *
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
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-charcoal-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <LuPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal-900 mb-2">
                  Password *
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
                    placeholder="Min. 6 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-charcoal-900 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <LuLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 border-2 border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                  >
                    {showConfirmPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-iris-600 border-charcoal-300 rounded focus:ring-iris-500"
              />
              <label htmlFor="terms" className="text-sm text-charcoal-600">
                I agree to the{' '}
                <a href="#" className="font-semibold text-iris-600 hover:text-iris-700 transition-colors">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-iris-600 hover:text-iris-700 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-charcoal-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-iris-600 hover:text-iris-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

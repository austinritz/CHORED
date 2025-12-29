import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.js';
import { useNavigate } from 'react-router-dom';
import '../assets/pages/SignupPage.css';

/* SignupPage component
- Shows a form to sign up for a new account
- Form includes name, username, email, phone number, and password
- After signing up, the user is redirected to the login page
*/
const SignupPage = () => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const { register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="SignupPage">
      <div className="SignupPage-container">
        <div className="SignupPage-card">
          <h1 className="SignupPage-title">Create Account</h1>
          <form className="SignupPage-form" onSubmit={handleSignup}>
            <div className="SignupPage-form-group">
              <label htmlFor="name" className="SignupPage-label">
                Name <span className="SignupPage-required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="SignupPage-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="SignupPage-form-group">
              <label htmlFor="username" className="SignupPage-label">
                Username <span className="SignupPage-required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="SignupPage-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="SignupPage-form-group">
              <label htmlFor="email" className="SignupPage-label">
                Email <span className="SignupPage-required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="SignupPage-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="SignupPage-form-group">
              <label htmlFor="phoneNumber" className="SignupPage-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="SignupPage-input"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="SignupPage-form-group">
              <label htmlFor="password" className="SignupPage-label">
                Password <span className="SignupPage-required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="SignupPage-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <div className="SignupPage-error">
                {error}
              </div>
            )}
            <button type="submit" className="SignupPage-button">
              Sign Up
            </button>
          </form>
          <div className="SignupPage-footer">
            <p className="SignupPage-footer-text">
              Already have an account?{' '}
              <button
                className="SignupPage-link"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.js"
import { useNavigate } from 'react-router-dom';
import '../assets/pages/LoginPage.css';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const resetError = () => {
    if (authFailed) {
      setAuthFailed(false);
    }
  };

  useEffect(() => {
    if (authFailed) {
      const timer = setTimeout(() => {
        setAuthFailed(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authFailed]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { isAuthenticated, user } = await login(credentials);
    if (isAuthenticated && user) {
      console.log("user logged in ")
      navigate('/')
    } else {
      console.log("User auth failed")
      setAuthFailed(true);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    resetError();
  }

  return (
    <main className="LoginPage">
      <div className="LoginPage-container">
        <div className="LoginPage-card">
          <h1 className="LoginPage-title">Sign In</h1>
          <form className="LoginPage-form" onSubmit={handleLogin}>
            <div className="LoginPage-form-group">
              <label htmlFor="username" className="LoginPage-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="LoginPage-input"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="LoginPage-form-group">
              <label htmlFor="password" className="LoginPage-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="LoginPage-input"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            {authFailed && (
              <div className="LoginPage-error">
                Invalid username or password
              </div>
            )}
            <button type="submit" className="LoginPage-button">
              Sign In
            </button>
          </form>
          <div className="LoginPage-footer">
            <p className="LoginPage-footer-text">
              Don't have an account?{' '}
              <button
                className="LoginPage-link"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
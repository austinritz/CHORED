import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.js"
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const resetError = () => {
    if (authFailed) {
      setAuthFailed(false);
    }
  };

  useEffect(() => {
    if (authFailed) {
      const timer = setTimeout(() => {
        setAuthFailed(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authFailed]);

  const handleLogin = async () => {
    const { isAuthenticated, user } = await login(credentials);
    if (isAuthenticated && user) {
      console.log("user logged in ")
      navigate('/profile')
    } else {
      console.log("User auth failed")
      setAuthFailed(true);
    }
  }

  return (
    <main className="flex min-h-screen ml-56">
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}
      </style>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[320px]">
          <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
          <form
            className="space-y-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (e.target.checkValidity()) {
                handleLogin();
              }
            }}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors placeholder-gray-400
                    ${authFailed 
                      ? 'border-red-300 bg-red-50 shake focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                      : 'border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'
                    }`}
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  required
                  autoFocus
                  pattern=".{2,}"
                  onChange={(e) => {
                    setCredentials({ ...credentials, username: e.target.value });
                    resetError();
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors placeholder-gray-400
                    ${authFailed 
                      ? 'border-red-300 bg-red-50 shake focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                      : 'border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'
                    }`}
                  name="password"
                  type="password"
                  id="current-password"
                  placeholder="Enter password"
                  required
                  pattern=".{2,}"
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value });
                    resetError();
                  }}
                />
              </div>
              {authFailed && (
                <p className="text-red-500 text-sm text-center animate-fade-in">
                  Invalid username or password
                </p>
              )}
            </div>

            <button
              className="w-full px-3 py-2 mt-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            &copy;2024 Austin. No rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
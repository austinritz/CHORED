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
    <main className="LoginPage">
    </main>
  )
}

export default LoginPage
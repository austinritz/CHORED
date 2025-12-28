import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HouseholdPage from './pages/HouseholdPage';
import Sidebar from './components/Sidebar';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import UserTasksPage from './pages/UserTasksPage';
import SignupPage from './pages/SignupPage';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Sidebar/>
      <div className="App-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/household" element={<HouseholdPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-tasks" element={<UserTasksPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

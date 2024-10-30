import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HouseholdPage from './pages/HouseholdPage';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="flex font-nanumGothic font-bold h-screen w-full">
      <Sidebar/>
      <div className="flex-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="household" element={<HouseholdPage />} />
          {/* <Route path="create" element={<HouseholdPage />} />
          <Route path="create" element={<UserPage />} />
          <Route path="create" element={<ChorePage />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default App;

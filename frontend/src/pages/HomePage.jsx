import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useHouseholdStore } from '../store/household';
import Household from '../components/Household';
import '../assets/pages/HomePage.css';

/*
HomePage component
- If user is logged in, show a list of the users households and a button to create a new household
- If user is not logged in, show a description of the app and a button to login
*/
const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { households, fetchUserHouseholds } = useHouseholdStore();

  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      fetchUserHouseholds(user._id);
    }
  }, [isAuthenticated, user, fetchUserHouseholds]);

  return (
    <main className="HomePage">
      {!isAuthenticated ? (
        <div className="HomePage-marketing">
          <h1 className="HomePage-title">
            Chored: the ultimate household task scheduler
          </h1>
          <ul className="HomePage-features">
            <li>Create and schedule chores that are automatically assigned to household members</li>
            <li>Chored prioritizes task completion and allows users to defer important tasks when they are unavailable</li>
            <li>Track user task activity and completion percentage</li>
          </ul>
        </div>
      ) : (
        <div className="HomePage-households">
          <div className="HomePage-households-list">
            {households.length > 0 ? (
              households.map((household) => (
                <Household key={household._id} household={household} />
              ))
            ) : (
              <p>No households found. Create one to get started!</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useHouseholdStore } from '../store/household';
import { useNavigate } from 'react-router-dom';
import Household from '../components/Household';
import logoImage from '../assets/logo/chored_logo_no_background.png';
import '../assets/pages/HomePage.css';

/*
HomePage component
- If user is logged in, show a list of the users households and a button to create a new household
- If user is not logged in, show a description of the app and a button to login
*/
const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { households, fetchUserHouseholds } = useHouseholdStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      fetchUserHouseholds(user._id);
    }
  }, [isAuthenticated, user, fetchUserHouseholds]);

  return (
    <main className="HomePage">
      {!isAuthenticated ? (
        <>
          <header className="HomePage-header">
            <div className="HomePage-header-content">
              <div className="HomePage-logo">
                <img src={logoImage} alt="Chored logo" className="HomePage-logo-image" />
                <span className="HomePage-logo-text">Chored</span>
              </div>
              <div className="HomePage-header-actions">
                <button 
                  className="HomePage-header-link"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>
                <button 
                  className="HomePage-header-button"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              </div>
            </div>
          </header>
          
          <div className="HomePage-marketing">
            <div className="HomePage-hero">
              <h1 className="HomePage-title">
                Stop nagging. Start organizing.
              </h1>
              <p className="HomePage-subtitle">
                Chored takes the stress out of household management by automatically scheduling and assigning tasks, so you can focus on what matters—living together, not arguing about chores.
              </p>
            </div>
            
            <div className="HomePage-features">
              <div className="HomePage-feature">
                <div className="HomePage-feature-icon">✨</div>
                <div className="HomePage-feature-content">
                  <h3 className="HomePage-feature-title">Smart Scheduling</h3>
                  <p className="HomePage-feature-description">
                    Chores are automatically assigned and scheduled based on availability. No more "whose turn is it?" conversations.
                  </p>
                </div>
              </div>
              
              <div className="HomePage-feature">
                <div className="HomePage-feature-icon">🎯</div>
                <div className="HomePage-feature-content">
                  <h3 className="HomePage-feature-title">Flexible & Fair</h3>
                  <p className="HomePage-feature-description">
                    Defer tasks when life gets busy. Chored prioritizes completion and keeps everyone accountable without the drama.
                  </p>
                </div>
              </div>
              
              <div className="HomePage-feature">
                <div className="HomePage-feature-icon">📊</div>
                <div className="HomePage-feature-content">
                  <h3 className="HomePage-feature-title">Track Progress</h3>
                  <p className="HomePage-feature-description">
                    See who's pulling their weight with transparent activity tracking and completion stats for the whole household.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
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
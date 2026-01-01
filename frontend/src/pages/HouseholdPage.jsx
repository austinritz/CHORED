import React, { useEffect, useMemo } from 'react';
import { useHouseholdStore } from '../store/household';
import { useChoreStore } from '../store/chore';
import Calendar from '../components/Calendar';
import '../assets/pages/HouseholdPage.css';

/* HouseholdPage component
- Top row is a list of household users. 
  - Each user has a card with their profile picture and name, and their task completion %
- Second part of the page is a weekly calendar view of the chores for the household (sun-sat)
- Each day shows the chores for the day, with earliest near the top
*/
const HouseholdPage = () => {
  const { currentHousehold, fetchHousehold } = useHouseholdStore();
  const { chores, populateChoresForHousehold } = useChoreStore();

  useEffect(() => {
    const loadHouseholdData = async () => {
      if (currentHousehold?._id) {
        // Fetch full household data with populated users and chores
        await fetchHousehold(currentHousehold._id);
        // Also populate chores in the chore store
        await populateChoresForHousehold(currentHousehold._id);
      }
    };

    loadHouseholdData();
  }, [currentHousehold?._id, fetchHousehold, populateChoresForHousehold]);

  // Calculate task completion percentage for each user
  const userStats = useMemo(() => {
    if (!currentHousehold?.users || !chores) return [];

    return currentHousehold.users.map((user) => {
      // Count chores assigned to this user
      const assignedChores = chores.filter((chore) => {
        return chore.users?.some(
          (choreUser) => choreUser.user?._id === user._id || choreUser.user === user._id
        );
      });

      // For now, we'll show total assigned chores
      // When completion tracking is added, we can calculate actual completion %
      const totalChores = assignedChores.length;
      const completionPercentage = totalChores > 0 ? 0 : 0; // Placeholder until completion tracking is implemented

      return {
        user,
        totalChores,
        completionPercentage,
      };
    });
  }, [currentHousehold?.users, chores]);

  if (!currentHousehold) {
    return (
      <main className="HouseholdPage">
        <div className="HouseholdPage-empty">
          <p>No household selected. Please select a household from the home page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="HouseholdPage">
      <div className="HouseholdPage-header">
        <h1 className="HouseholdPage-title">{currentHousehold.name}</h1>
        {currentHousehold.description && (
          <p className="HouseholdPage-description">{currentHousehold.description}</p>
        )}
      </div>

      <div className="HouseholdPage-users">
        <h2 className="HouseholdPage-section-title">Household Members</h2>
        <div className="HouseholdPage-users-list">
          {userStats.map(({ user, totalChores, completionPercentage }) => (
            <div key={user._id} className="HouseholdPage-user-card">
              <div className="HouseholdPage-user-avatar">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={user.name}
                    className="HouseholdPage-user-avatar-image"
                  />
                ) : (
                  <div className="HouseholdPage-user-avatar-placeholder">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="HouseholdPage-user-info">
                <div className="HouseholdPage-user-name">{user.name || 'Unnamed User'}</div>
                <div className="HouseholdPage-user-stats">
                  <div className="HouseholdPage-user-stat">
                    <span className="HouseholdPage-user-stat-label">Tasks:</span>
                    <span className="HouseholdPage-user-stat-value">{totalChores}</span>
                  </div>
                  {/* Completion percentage will be shown when completion tracking is implemented */}
                  {/* <div className="HouseholdPage-user-stat">
                    <span className="HouseholdPage-user-stat-label">Completion:</span>
                    <span className="HouseholdPage-user-stat-value">{completionPercentage}%</span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="HouseholdPage-calendar">
        <h2 className="HouseholdPage-section-title">Weekly Schedule</h2>
        <Calendar chores={chores || []} />
      </div>
    </main>
  );
};

export default HouseholdPage;
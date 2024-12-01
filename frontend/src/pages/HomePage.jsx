import React from 'react';
import { User, Home, CheckCircle, Clock, Award, ChevronRight } from 'lucide-react';

const HomePage = () => {
  // Example data - would come from your auth store/API
  const userData = {
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    joinDate: "January 2024",
    households: [
      { id: 1, name: "Smith Residence", role: "Admin", memberCount: 4 },
      { id: 2, name: "Beach House", role: "Member", memberCount: 3 }
    ],
    stats: {
      tasksCompleted: 45,
      completionRate: 98,
      currentStreak: 7,
      bestStreak: 14
    },
    recentTasks: [
      {
        id: 1,
        name: "Water plants",
        household: "Smith Residence",
        completedAt: "Today, 9:30 AM",
        status: "completed"
      },
      {
        id: 2,
        name: "Take out trash",
        household: "Smith Residence",
        completedAt: "Yesterday, 8:00 PM",
        status: "completed"
      },
      {
        id: 3,
        name: "Clean bathroom",
        household: "Beach House",
        completedAt: "2 days ago",
        status: "completed"
      }
    ],
    upcomingTasks: [
      {
        id: 4,
        name: "Vacuum living room",
        household: "Smith Residence",
        dueDate: "Tomorrow",
        status: "upcoming"
      },
      {
        id: 5,
        name: "Clean kitchen",
        household: "Beach House",
        dueDate: "In 3 days",
        status: "upcoming"
      }
    ]
  };

  return (
    <main className="flex min-h-screen ml-56 bg-gray-50">
      <div className="flex-1 p-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">{userData.name}</h1>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-sm text-gray-400">Member since {userData.joinDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-medium mb-4">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-semibold text-red-500">{userData.stats.tasksCompleted}</div>
                  <div className="text-sm text-gray-600">Tasks Done</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-semibold text-green-500">{userData.stats.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-semibold text-yellow-500">{userData.stats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-semibold text-blue-500">{userData.stats.bestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>
            </div>

            {/* Households */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-medium mb-4">My Households</h2>
              <div className="space-y-3">
                {userData.households.map(household => (
                  <div key={household.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Home size={20} className="text-red-500" />
                      <div>
                        <h3 className="font-medium">{household.name}</h3>
                        <p className="text-sm text-gray-500">{household.memberCount} members • {household.role}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-medium mb-4">Upcoming Tasks</h2>
              <div className="space-y-3">
                {userData.upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-yellow-500" />
                      <div>
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-gray-500">
                          {task.household} • Due {task.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {userData.recentTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500" />
                      <div>
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-gray-500">
                          {task.household} • {task.completedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
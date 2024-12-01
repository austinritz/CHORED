import React, { useState } from 'react';
import { Users, Calendar, CheckCircle, PlusCircle, RotateCcw, Clock, User } from 'lucide-react';

const HouseholdPage = () => {
  const [sortType, setSortType] = useState('date'); // 'date' or 'person'

  // Example data - in real app would come from props or store
  const householdData = {
    name: "Smith Residence",
    members: [
      { id: 1, name: "John Smith", tasksCompleted: 12, isActive: true },
      { id: 2, name: "Sarah Smith", tasksCompleted: 15, isActive: true },
      { id: 3, name: "Mike Smith", tasksCompleted: 8, isActive: false },
    ],
    tasks: [
      { 
        id: 1, 
        name: "Take out trash", 
        frequency: "Weekly",
        nextPerson: "Sarah Smith",
        dueDate: "Tomorrow",
        dueDays: 1,
        status: "urgent"
      },
      { 
        id: 2, 
        name: "Clean bathroom", 
        frequency: "Weekly",
        nextPerson: "Mike Smith",
        dueDate: "In 3 days",
        dueDays: 3,
        status: "upcoming"
      },
      { 
        id: 3, 
        name: "Vacuum living room", 
        frequency: "Bi-weekly",
        nextPerson: "John Smith",
        dueDate: "In 5 days",
        dueDays: 5,
        status: "normal"
      },
      { 
        id: 4, 
        name: "Water plants", 
        frequency: "Every 3 days",
        nextPerson: "Sarah Smith",
        dueDate: "Today",
        dueDays: 0,
        status: "urgent"
      }
    ]
  };

  const getTaskStatusStyles = (status) => {
    switch (status) {
      case 'urgent':
        return 'border-red-200 bg-red-50';
      case 'upcoming':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-100 bg-white';
    }
  };

  const sortedTasks = [...householdData.tasks].sort((a, b) => {
    if (sortType === 'date') {
      return a.dueDays - b.dueDays;
    } else {
      return a.nextPerson.localeCompare(b.nextPerson);
    }
  });

  const SortButton = ({ type, currentSort, icon: Icon, label }) => (
    <button 
      onClick={() => setSortType(type)}
      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
        currentSort === type 
          ? 'bg-red-50 text-red-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} className={currentSort === type ? 'text-red-500' : 'text-gray-500'} />
      {label}
    </button>
  );

  return (
    <main className="flex min-h-screen ml-56 bg-gray-50">
      <style>
        {`
          @keyframes moveTask {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .task-item {
            animation: moveTask 0.2s ease-out forwards;
          }
        `}
      </style>
      <div className="flex-1 p-8">
        {/* Household Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">{householdData.name}</h1>
          <p className="text-gray-500">Managing tasks and schedules for your household</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-red-500" />
                  <h2 className="text-lg font-medium">Members</h2>
                </div>
                <button className="p-1 hover:bg-red-50 rounded-full text-red-500">
                  <PlusCircle size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {householdData.members.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          member.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{member.tasksCompleted} tasks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-red-500" />
                  <h2 className="text-lg font-medium">Household Tasks</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <SortButton 
                      type="date" 
                      currentSort={sortType}
                      icon={Clock}
                      label="Due date"
                    />
                    <SortButton 
                      type="person" 
                      currentSort={sortType}
                      icon={User}
                      label="Assigned to"
                    />
                  </div>
                  <button className="p-1 hover:bg-red-50 rounded-full text-red-500">
                    <PlusCircle size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {sortedTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`task-item flex items-center justify-between p-3 hover:bg-white rounded-lg border transition-colors ${getTaskStatusStyles(task.status)}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle 
                        size={20} 
                        className={`${
                          task.status === 'urgent' 
                            ? 'text-red-500' 
                            : task.status === 'upcoming'
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`} 
                      />
                      <div>
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-gray-500">
                          Next: <span className="text-red-500">{task.nextPerson}</span> • Due {task.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{task.frequency}</span>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <RotateCcw size={16} className="text-red-500" />
                      </button>
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

export default HouseholdPage;
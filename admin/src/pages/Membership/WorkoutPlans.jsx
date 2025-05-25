import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const WorkoutPlans = () => {
  const { id: memberId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddPlan, setShowAddPlan] = useState(false);

  // Mock data - replace with actual API call
  const workoutPlans = [
    {
      id: 1,
      memberName: 'John Doe',
      planName: 'Weight Loss Program',
      type: 'Custom',
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      progress: 45,
      exercises: [
        { name: 'Cardio', sets: '30 min', reps: 'N/A' },
        { name: 'Strength Training', sets: '3', reps: '12-15' },
        { name: 'Flexibility', sets: '2', reps: '10-12' }
      ]
    },
    {
      id: 2,
      memberName: 'Jane Smith',
      planName: 'Muscle Gain Program',
      type: 'Standard',
      status: 'Active',
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      progress: 75,
      exercises: [
        { name: 'Weight Training', sets: '4', reps: '8-10' },
        { name: 'HIIT', sets: '3', reps: 'N/A' },
        { name: 'Core Work', sets: '3', reps: '15-20' }
      ]
    }
  ];

  const filteredPlans = workoutPlans.filter(plan => {
    const matchesSearch = plan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Workout Plans for Member ID: {memberId}</h1>
        <button
          onClick={() => setShowAddPlan(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Plan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white font-medium">
                        {plan.memberName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{plan.planName}</h3>
                      <p className="text-sm text-gray-500">{plan.memberName}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>{plan.type} Plan</span>
                    <span>•</span>
                    <span>{plan.startDate} - {plan.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    plan.status === 'Active' ? 'bg-green-100 text-green-800' :
                    plan.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plan.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-rose-600 hover:text-rose-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button className="text-rose-600 hover:text-rose-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Exercises</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plan.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-gray-900">{exercise.name}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        {exercise.sets} sets {exercise.reps !== 'N/A' && `• ${exercise.reps} reps`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddPlan && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Workout Plan</h2>
              <button
                onClick={() => setShowAddPlan(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Member</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500">
                  <option>Select a member</option>
                  {/* Add member options */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Type</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500">
                  <option>Custom</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlan(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/Footer";

const WorkoutPlan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });

  const workoutPlan = {
    name: 'Strength & Endurance',
    type: 'Custom',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'Active',
    progress: 65,
    exercises: [
      {
        id: 1,
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        weight: '135 lbs',
        notes: 'Focus on form, 2 min rest between sets',
        completed: true
      },
      {
        id: 2,
        name: 'Squats',
        sets: 4,
        reps: '10-12',
        weight: '185 lbs',
        notes: 'Keep back straight, 2 min rest between sets',
        completed: true
      },
      {
        id: 3,
        name: 'Deadlifts',
        sets: 3,
        reps: '6-8',
        weight: '225 lbs',
        notes: 'Use lifting belt, 3 min rest between sets',
        completed: false
      },
      {
        id: 4,
        name: 'Pull-ups',
        sets: 3,
        reps: '8-10',
        weight: 'Bodyweight',
        notes: 'Full range of motion',
        completed: false
      }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    // TODO: Implement API call to add exercise
    console.log('Adding exercise:', newExercise);
    setShowAddExercise(false);
    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    });
  };

  const handleExerciseComplete = (exerciseId) => {
    // TODO: Implement API call to mark exercise as complete
    console.log('Marking exercise as complete:', exerciseId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Plan Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{workoutPlan.name}</h1>
                  <p className="text-rose-100">{workoutPlan.type} Plan</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full">
                    {workoutPlan.status}
                  </span>
                  <button
                    onClick={() => navigate('/member-profile')}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Back to Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">{workoutPlan.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">{workoutPlan.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${workoutPlan.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{workoutPlan.progress}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Exercises</h2>
              <button
                onClick={() => setShowAddExercise(true)}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {workoutPlan.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                        <span className="text-sm text-gray-600">
                          {exercise.weight}
                        </span>
                      </div>
                      {exercise.notes && (
                        <p className="text-sm text-gray-600 mt-2">{exercise.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleExerciseComplete(exercise.id)}
                      className={`px-4 py-2 rounded-lg ${
                        exercise.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {exercise.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Exercise</h2>
            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sets</label>
                  <input
                    type="number"
                    name="sets"
                    value={newExercise.sets}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reps</label>
                  <input
                    type="text"
                    name="reps"
                    value={newExercise.reps}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={newExercise.weight}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={newExercise.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExercise(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WorkoutPlan; 
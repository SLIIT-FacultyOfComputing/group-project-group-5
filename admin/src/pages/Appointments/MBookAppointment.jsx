import { useState, useEffect } from "react"
import { getStaff, bookAppointment } from "../../services/api"
import { useNavigate } from "react-router-dom"

const BookAppointment = () => {
  const navigate = useNavigate()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    trainerId: "",
    traineeId: localStorage.getItem('userId') || "", // Auto-fill member ID from localStorage
    status: "PENDING",
    date: "",
    startTime: "",
    endTime: "",
  })
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        const response = await getStaff()
        const trainersOnly = response.data.filter(staff => staff.role === "TRAINER")
        setTrainers(trainersOnly)
      } catch (error) {
        console.error("Error fetching trainers:", error)
        setError("Failed to load trainers. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    // Ensure member ID is always set
    const userId = localStorage.getItem('userId')
    if (userId && !formData.traineeId) {
      setFormData(prev => ({
        ...prev,
        traineeId: userId
      }))
    }

    fetchTrainers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const validateForm = () => {
    if (!formData.trainerId) return "Please select a trainer"
    if (!formData.date) return "Please select a date"
    if (!formData.startTime) return "Please select a start time"
    if (!formData.endTime) return "Please select an end time"
    
    // Validate user ID presence as a safeguard
    if (!formData.traineeId) {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return "Member ID not found. Please log in again."
      }
      // Auto-update the form data with the user ID
      setFormData(prev => ({...prev, traineeId: userId}))
    }
    
    const startTimeParts = formData.startTime.split(':')
    const endTimeParts = formData.endTime.split(':')
    const startTimeMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1])
    const endTimeMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1])
    
    if (startTimeMinutes >= endTimeMinutes) {
      return "End time must be after start time"
    }
    
    if (endTimeMinutes - startTimeMinutes < 20) {
      return "Booking must be at least 20 minutes long"
    }
    
    if (endTimeMinutes - startTimeMinutes > 120) {
      return "Booking cannot exceed 2 hours"
    }
    
    const openingTimeMinutes = 8 * 60 // 8 AM
    const closingTimeMinutes = 21 * 60 // 9 PM
    
    if (startTimeMinutes < openingTimeMinutes) {
      return "Booking cannot start before 8:00 AM"
    }
    
    if (endTimeMinutes > closingTimeMinutes) {
      return "Booking cannot end after 9:00 PM"
    }

    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return "Cannot book appointments in the past"
    }
    
    return null
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    // Ensure member ID is set before submitting
    if (!formData.traineeId) {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError("Member ID not found. Please log in again.")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
        return
      }
      
      setFormData(prev => ({
        ...prev,
        traineeId: userId
      }))
    }
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    try {
      setLoading(true)
      const response = await bookAppointment(formData)
      
      if (typeof response.data === "string" && 
          response.data.includes("already has a booking")) {
        setError(response.data)
      } else {
        setSuccess("Appointment booked successfully!")
        setFormData({
          trainerId: "",
          traineeId: "",
          status: "PENDING",
          date: "",
          startTime: "",
          endTime: "",
        })
        
        setTimeout(() => {
          navigate("/members/my-appointments")
        }, 2000)
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      if (error.response && error.response.data) {
        setError(error.response.data)
      } else {
        setError("Failed to book appointment. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-5 sm:p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-rose-300 bg-opacity-20 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
            
            <div className="relative">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-white bg-opacity-25 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 shadow-inner">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-5 h-5 text-red"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">Book a Trainer</h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Schedule a personal training session with one of our expert trainers
              </p>
            </div>
          </div>          <div className="p-5 sm:p-6 md:p-8 max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-center">
                <div className="rounded-full bg-red-100 p-1.5 sm:p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>{error}</div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-center">
                <div className="rounded-full bg-green-100 p-1.5 sm:p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>{success}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">                <div>
                  <label htmlFor="trainerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Trainer
                  </label>
                  <select
                    id="trainerId"
                    name="trainerId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    value={formData.trainerId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a trainer --</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.nic} value={trainer.nic}>
                        {trainer.name} ({trainer.shift || "No specific shift"})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-xs text-gray-500">(8:00 AM - 9:00 PM)</span>
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.startTime}
                      onChange={handleChange}
                      min="08:00"
                      max="21:00"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time <span className="text-xs text-gray-500">(Min 20 min, Max 2 hrs)</span>
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.endTime}
                      onChange={handleChange}
                      min="08:20"
                      max="21:00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
                    </div>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment

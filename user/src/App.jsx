import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemberDashboard from './components/MemberDashboard';
import SessionLog from './components/SessionLog';
import ViewRoutine from './components/ViewRoutine';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/dashboard/:memberId" element={<MemberDashboard />} />
                    <Route path="/session/:routineId" element={<SessionLog />} />
                    <Route path="/view-routine/:routineId" element={<ViewRoutine />} />
                    <Route path="/" element={<MemberDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
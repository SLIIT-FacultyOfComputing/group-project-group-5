import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchMembers } from './services/api';
import LandingPage from './pages/LandingPage';
import CreateRoutine from './pages/CreateRoutine';
import ViewRoutine from './pages/ViewRoutine';
import Exercises from './pages/Exercises';

function App() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetchMembersData();
    }, []);

    const fetchMembersData = async () => {
        try {
            const response = await fetchMembers();
            setMembers(response);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">GYMSYNC</h1>
                    <Routes>
                        <Route path="/" element={<LandingPage members={members} />} />
                        <Route path="/create-routine/:memberId" element={<CreateRoutine />} />
                        <Route path="/view-routine/:memberId" element={<ViewRoutine />} />
                        <Route path="/exercises" element={<Exercises />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
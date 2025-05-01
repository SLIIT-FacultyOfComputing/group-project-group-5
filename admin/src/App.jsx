import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchMembers } from './services/api';
import LandingPage from './pages/LandingPage';
import CreateRoutine from './pages/CreateRoutine';
import ViewRoutine from './pages/ViewRoutine';
import Exercises from './pages/Exercises';
import './styles.css';

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
            <div className="container">
                <h1>GYMSYNC</h1>
                <Routes>
                    <Route path="/" element={<LandingPage members={members} />} />
                    <Route path="/create-routine/:memberId" element={<CreateRoutine />} />
                    <Route path="/view-routine/:memberId" element={<ViewRoutine />} />
                    <Route path="/exercises" element={<Exercises />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
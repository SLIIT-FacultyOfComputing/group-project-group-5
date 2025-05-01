import React from 'react';
import { Link } from 'react-router-dom';
import MemberList from '../components/MemberList';

const LandingPage = ({ members }) => {
    return (
        <div>
            <div>
                <Link to="/exercises">
                    <button className="create-button">Exercises</button>
                </Link>
            </div>
            <h2>Members</h2>
            <MemberList members={members} />
        </div>
    );
};

export default LandingPage;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewRoutine = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <h2>View Routine for Member ID: {memberId}</h2>
            <div className="button-group">
                <button
                    className="submit-button"
                    onClick={() => navigate(`/create-routine/${memberId}`)}
                >
                    Add Routine
                </button>
                <button
                    className="cancel-button"
                    onClick={() => navigate('/')}
                >
                    Back to Members
                </button>
            </div>
        </div>
    );
};

export default ViewRoutine;
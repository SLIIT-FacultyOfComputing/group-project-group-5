import React from 'react';
import { Link } from 'react-router-dom';

const MemberList = ({ members }) => {
    return (
        <div className="exercise-list">
            {members.length === 0 ? (
                <p>No members found.</p>
            ) : (
                members.map((member) => (
                    <div key={member.id} className="exercise-bar">
                        {member.id} - {member.name}
                        <div>
                            <Link to={`/create-routine/${member.id}`}>
                                <button className="submit-button" style={{ marginLeft: '10px' }}>
                                    Create Routine
                                </button>
                            </Link>
                            <Link to={`/view-routine/${member.id}`}>
                                <button className="submit-button" style={{ marginLeft: '10px' }}>
                                    View Routines
                                </button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MemberList;
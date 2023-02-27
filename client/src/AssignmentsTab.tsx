import { useState } from 'react';
import './AssignmentsTab.css'

type AssignmentsTabProps = {
    onAttemptClick: (therapistEmail: string, assignmentText: string) => void;
    onBackClick: () => void;
    assignments: { assignment: { assignmentTitle: string, assignmentText: string, therapistEmail: string, therapistName: string } }[],
}

function AssignmentsTab({ onAttemptClick, onBackClick, assignments }: AssignmentsTabProps) {
    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    const handleRowClick = (therapistEmail: string) => {
        if (expandedRows.includes(therapistEmail)) {
            setExpandedRows(expandedRows.filter((email) => email !== therapistEmail));
        } else {
            setExpandedRows([...expandedRows, therapistEmail]);
        }
    };

    const tableRows = assignments.map(({ assignment: { assignmentTitle, assignmentText, therapistEmail, therapistName } }) => (
        <>
            <tr key={therapistEmail} onClick={() => handleRowClick(therapistEmail)}>
                <td>{assignmentTitle}</td>
                <td>{therapistName}</td>
                <td>{therapistEmail}</td>
                <td>
                    <button className="assignments-view-btn" onClick={() => onAttemptClick(therapistEmail, assignmentText)}>Attempt</button>
                </td>
            </tr>
            {expandedRows.includes(therapistEmail) && (
                <tr className="assignment-fold" key={therapistEmail + "-fold"}>
                    <td colSpan={4}>
                        <div className="assignment-fold-content">
                            <h3>Assignment Text:</h3>
                            {assignmentText}
                        </div>
                    </td>
                </tr>
            )}
        </>
    ));

    return (
        <div className="assignments-tab">
            <h1>My Assignments</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            {tableRows.length ?
                <>
                    <div className="tbl-header">
                        <table>
                            <thead>
                                <tr>
                                    <th>Assignment Title</th>
                                    <th>Therapist Name</th>
                                    <th>Therapist Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="tbl-content">
                        <table>
                            <tbody>{tableRows}</tbody>
                        </table>
                    </div>
                </>
                : <h3>No Current Assignments.</h3>}
        </div>
    )
}
export default AssignmentsTab
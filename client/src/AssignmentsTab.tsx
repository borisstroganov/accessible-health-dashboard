import { useState } from 'react';
import './AssignmentsTab.css'

type AssignmentsTabProps = {
    onAttemptClick: (assignmentId: string, assignmentText: string) => void;
    onBackClick: () => void;
    assignments: { assignment: { assignmentId: string, therapistName: string, therapistEmail: string, assignmentTitle: string, assignmentText: string, status: string } }[],
}

function AssignmentsTab({ onAttemptClick, onBackClick, assignments }: AssignmentsTabProps) {
    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    const handleRowClick = (assignmentId: string) => {
        if (expandedRows.includes(assignmentId)) {
            setExpandedRows(expandedRows.filter((id) => id !== assignmentId));
        } else {
            setExpandedRows([...expandedRows, assignmentId]);
        }
    };

    const tableRows = assignments.map(({ assignment: { assignmentId, therapistName, therapistEmail,
        assignmentTitle, assignmentText, status } }) => (
        <>
            <tr key={assignmentId} onClick={() => handleRowClick(assignmentId)}>
                <td>{assignmentTitle}</td>
                <td>{therapistName}</td>
                <td>{therapistEmail}</td>
                <td>{status}</td>
                <td>
                    <button disabled={status !== "created"} className="assignments-view-btn" onClick={() => onAttemptClick(assignmentId, assignmentText)}>Attempt</button>
                </td>
            </tr>
            {expandedRows.includes(assignmentId) && (
                <tr className="assignment-fold" key={assignmentId + "-fold"}>
                    <td colSpan={5}>
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
                                    <th>Status</th>
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
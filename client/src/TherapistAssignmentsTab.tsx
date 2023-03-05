import { useState } from 'react';
// import './TherapistAssignmentsTab.css'

type TherapistAssignmentsTabProps = {
    onReviewClick: (assignmentId: string, assignmentText: string, speech: { wpm: number, accuracy: number },
        patient: { name: string, email: string }) => void;
    onBackClick: () => void;
    assignments: {
        assignment: {
            assignmentId: string, userName: string, userEmail: string, assignmentTitle: string,
            assignmentText: string, status: string, speech: {
                wpm: number,
                accuracy: number
            }, feedbackText: string
        }
    }[],
}

function TherapistAssignmentsTab({ onReviewClick, onBackClick, assignments }: TherapistAssignmentsTabProps) {
    const [tableVisibility, setTableVisibility] = useState<{ [key: string]: boolean }>({
        todo: false,
        completed: false,
        reviewed: false
    });

    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    const handleRowClick = (assignmentId: string) => {
        if (expandedRows.includes(assignmentId)) {
            setExpandedRows(expandedRows.filter((id) => id !== assignmentId));
        } else {
            setExpandedRows([...expandedRows, assignmentId]);
        }
    };

    const handleTableToggle = (table: string) => {
        setTableVisibility(prevVisibility => {
            const newVisibility = { ...prevVisibility };
            Object.keys(newVisibility).forEach(key => {
                if (key === table) {
                    newVisibility[key] = !prevVisibility[key];
                } else {
                    newVisibility[key] = false;
                }
            });
            return newVisibility;
        });
    };

    const todoRows: JSX.Element[] = [];
    const completedRows: JSX.Element[] = [];
    const reviewedRows: JSX.Element[] = [];

    assignments.forEach(({ assignment: { assignmentId, userName, userEmail,
        assignmentTitle, assignmentText, status, speech, feedbackText } }) => {
        const row = (
            <>
                <tr key={assignmentId} onClick={() => handleRowClick(assignmentId)}>
                    <td>{assignmentTitle}</td>
                    <td>{userName}</td>
                    <td>{userEmail}</td>
                    <td>
                        <button disabled={status !== "completed"} className="assignments-view-btn"
                            onClick={() => onReviewClick(assignmentId, assignmentText, speech,
                                { name: userName, email: userEmail })}>Review</button>
                    </td>
                </tr>
                {expandedRows.includes(assignmentId) && (
                    <tr className="assignment-fold" key={assignmentId + "-fold"}>
                        <td colSpan={4}>
                            <div className="assignment-fold-content">
                                <h3>Assignment Text:</h3>
                                {assignmentText}
                                {(status === "completed" || status === "reviewed") &&
                                    <h3>Submission: {speech.wpm} WPM, {speech.accuracy} Accuracy</h3>
                                }
                                {status === "reviewed" &&
                                    <>
                                        <h3>Feedback:</h3>
                                        {feedbackText ? feedbackText : "Feedback not available."}
                                    </>
                                }
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
        switch (status) {
            case 'todo':
                todoRows.push(row);
                break;
            case 'completed':
                completedRows.push(row);
                break;
            case 'reviewed':
                reviewedRows.push(row);
                break;
            default:
                break;
        }
    });

    return (
        <div className="assignments-tab">
            <h1>All Assignments</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="assignments-table-label" onClick={() => handleTableToggle("todo")}>Unattempted Assignments
                ({todoRows.length})</div>
            {todoRows.length ?
                <div className={`tbl-full ${tableVisibility.todo ? 'visible' : ''}`}>
                    <div className={`tbl-header ${tableVisibility.todo ? 'visible' : ''}`}>
                        <table>
                            <thead>
                                {tableVisibility.todo && <tr>
                                    <th>Assignment Title</th>
                                    <th>Patient Name</th>
                                    <th>Patient Email</th>
                                    <th>Actions</th>
                                </tr>}
                            </thead>
                        </table>
                    </div>
                    <div className={`tbl-content ${tableVisibility.todo ? 'visible' : ''}`}>
                        <table>
                            <tbody>{todoRows}</tbody>
                        </table>
                    </div>
                </div>
                : <div className={`tbl-empty ${tableVisibility.todo ? 'visible' : ''}`}>No Unattempted Assignments.</div>}
            <div className="assignments-table-label" onClick={() => handleTableToggle("completed")}>Completed Assignments
                ({completedRows.length})</div>
            {completedRows.length ?
                <div className={`tbl-full ${tableVisibility.completed ? 'visible' : ''}`}>
                    <div className={`tbl-header ${tableVisibility.completed ? 'visible' : ''}`}>
                        <table>
                            <thead>
                                {tableVisibility.completed && <tr>
                                    <th>Assignment Title</th>
                                    <th>Patient Name</th>
                                    <th>Patient Email</th>
                                    <th>Actions</th>
                                </tr>}
                            </thead>
                        </table>
                    </div>
                    <div className={`tbl-content ${tableVisibility.completed ? 'visible' : ''}`}>
                        <table>
                            <tbody>{completedRows}</tbody>
                        </table>
                    </div>
                </div>
                : <div className={`tbl-empty ${tableVisibility.completed ? 'visible' : ''}`}>No Completed Assignments.</div>}
            <div className="assignments-table-label" onClick={() => handleTableToggle("reviewed")}>Reviewed Assignments
                ({reviewedRows.length})</div>
            {reviewedRows.length ?
                <div className={`tbl-full ${tableVisibility.reviewed ? 'visible' : ''}`}>
                    <div className={`tbl-header ${tableVisibility.reviewed ? 'visible' : ''}`}>
                        <table>
                            <thead>
                                {tableVisibility.reviewed && <tr>
                                    <th>Assignment Title</th>
                                    <th>Patient Name</th>
                                    <th>Patient Email</th>
                                    <th>Actions</th>
                                </tr>}
                            </thead>
                        </table>
                    </div>
                    <div className={`tbl-content ${tableVisibility.reviewed ? 'visible' : ''}`}>
                        <table>
                            <tbody>{reviewedRows}</tbody>
                        </table>
                    </div>
                </div>
                : <div className={`tbl-empty ${tableVisibility.reviewed ? 'visible' : ''}`}>No Reviewed Assignments.</div>}
        </div>
    )
}
export default TherapistAssignmentsTab
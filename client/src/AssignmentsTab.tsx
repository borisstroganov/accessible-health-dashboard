import './AssignmentsTab.css'

type AssignmentsTabProps = {
    onViewClick: (therapistEmail: string, therapistName: string) => void;
    onBackClick: () => void;
    assignments: { assignment: { assignmentTitle: string, therapistEmail: string, therapistName: string } }[],
}

function AssignmentsTab({ onViewClick, onBackClick, assignments }: AssignmentsTabProps) {

    const tableRows = assignments.map(({ assignment: { assignmentTitle, therapistEmail, therapistName } }) => (
        <tr key={therapistEmail}>
            <td>{assignmentTitle}</td>
            <td>{therapistName}</td>
            <td>{therapistEmail}</td>
            <td>
                <button className="assignments-accept-btn" onClick={() => onViewClick(therapistEmail, therapistName)}>View</button>
            </td>
        </tr>
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
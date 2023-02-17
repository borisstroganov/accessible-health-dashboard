import './InvitationsTab.css'

type InvitationsTabProps = {
    onAcceptClick: (therapistEmail: string, therapistName: string) => void;
    onRejectClick: (therapistEmail: string, therapistName: string) => void;
    onBackClick: () => void;
    invitations: { therapist: { therapistEmail: string, therapistName: string } }[],
}

function InvitationsTab({ onAcceptClick, onRejectClick, onBackClick, invitations }: InvitationsTabProps) {

    const tableRows = invitations.map(({ therapist: { therapistEmail, therapistName } }) => (
        <tr key={therapistEmail}>
            <td>{therapistName}</td>
            <td>{therapistEmail}</td>
            <td>
                <button className="invitation-accept-btn" onClick={() => onAcceptClick(therapistEmail, therapistName)}>Accept</button>
                <button className="invitation-reject-btn" onClick={() => onRejectClick(therapistEmail, therapistName)}>Reject</button>
            </td>
        </tr>
    ));

    return (
        <div className="invitations-tab">
            <h1>Invitations</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            {tableRows.length ?
                <>
                    <div className="tbl-header">
                        <table>
                            <thead>
                                <tr>
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
                : <h3>No Pending Invitations.</h3>}
        </div>
    )
}
export default InvitationsTab
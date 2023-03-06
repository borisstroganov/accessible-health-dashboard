// import './TherapistHomeTab.css'

type TherapistHomeTabProps = {
    onClick: (state: string) => void;
    patientsNumber: number;
    invitationsNumber: number;
    unattemptedNumber: number;
    completedNumber: number;
}

function TherapistHomeTab({ onClick, patientsNumber, invitationsNumber, unattemptedNumber, completedNumber }: TherapistHomeTabProps) {

    return (
        <div className="home-tab">
            <h1>Logoped Therapist Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card" onClick={() => onClick("patients")}>
                    <h2>Patients</h2>
                    <h3>Current Patients: {patientsNumber ? patientsNumber : 0}</h3>
                    <h3>Pending Sent Invitations: {invitationsNumber ? invitationsNumber : 0}</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("assignments")}>
                    <h2>Assignments</h2>
                    <h3>Unattempted: {unattemptedNumber ? unattemptedNumber : 0}</h3>
                    <h3>Completed: {completedNumber ? completedNumber : 0}</h3>
                </div>
            </div>
        </div>
    )
}
export default TherapistHomeTab
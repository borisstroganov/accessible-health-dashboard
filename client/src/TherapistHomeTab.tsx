// import './TherapistHomeTab.css'

type TherapistHomeTabProps = {
    onClick: (state: string) => void;
}

function TherapistHomeTab({ onClick }: TherapistHomeTabProps) {

    return (
        <div className="home-tab">
            <h1>Logoped Therapist Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card" onClick={() => onClick("patients")}>
                    <h2>Patients</h2>
                </div>
                <div className="dashboard-card" onClick={() => onClick("assignments")}>
                    <h2>Assignments</h2>
                </div>
            </div>
        </div>
    )
}
export default TherapistHomeTab
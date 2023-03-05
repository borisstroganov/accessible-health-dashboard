type TherapistNavbarProps = {
    onClick: (state: string) => void;
    onLogOut: () => void;
    name: string;
}

function TherapistNavbar({ onClick, onLogOut, name }: TherapistNavbarProps) {
    return (
        <div className="navbar">
            <div className="dashboard-title">
                <h3 style={{ fontSize: "140%" }} onClick={() => onClick("home")}>Hello {name}!</h3>
            </div>
            <ul>
                <li>
                    <a onClick={() => onClick("patients")}>Patients</a>
                </li>
                <li>
                    <a onClick={() => onClick("assignments")}>Assignments</a>
                </li>
                <li>
                    <a onClick={() => onClick("account")}>Account</a>
                </li>
                <li>
                    <a onClick={onLogOut}>Log Out</a>
                </li>
            </ul>
        </div>
    )
}

export default TherapistNavbar

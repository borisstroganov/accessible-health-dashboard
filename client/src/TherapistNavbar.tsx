import { BsPeopleFill } from 'react-icons/bs'
import { MdFormatListBulleted, MdAccountCircle, MdLogout } from 'react-icons/md'

type TherapistNavbarProps = {
    onClick: (state: string) => void;
    onLogOut: () => void;
    name: string;
}

function TherapistNavbar({ onClick, onLogOut, name }: TherapistNavbarProps) {

    function getGreeting() {
        const hour = new Date().getHours();
        return hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";
    }

    return (
        <div className="navbar">
            <div className="dashboard-title">
                <h3 style={{ fontSize: "140%" }} onClick={() => onClick("home")}>{getGreeting()}, {name}!</h3>
            </div>
            <ul>
                <li>
                    <a onClick={() => onClick("patients")}>Patients &nbsp;<BsPeopleFill /></a>
                </li>
                <li>
                    <a onClick={() => onClick("assignments")}>Assignments&nbsp; <MdFormatListBulleted /></a>
                </li>
                <li>
                    <a onClick={() => onClick("account")}>Account &nbsp;<MdAccountCircle /></a>
                </li>
                <li>
                    <a onClick={onLogOut}>Log Out &nbsp;<MdLogout /></a>
                </li>
            </ul>
        </div>
    )
}

export default TherapistNavbar

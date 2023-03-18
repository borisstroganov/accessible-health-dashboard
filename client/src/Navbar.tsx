import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import { MdAccountCircle, MdLogout } from 'react-icons/md'
import './Navbar.css'

type NavbarProps = {
    onClick: (state: string) => void;
    onLogOut: () => void;
    name: string;
}

function Navbar({ onClick, onLogOut, name }: NavbarProps) {

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
                    <a onClick={() => onClick("hr")}>HR <FaHeartbeat /></a>
                </li>
                <li>
                    <a onClick={() => onClick("bp")}>BP <ImDroplet /></a>
                </li>
                <li>
                    <a onClick={() => onClick("speech")}>Speech <BsSoundwave /></a>
                </li>
                <li>
                    <a onClick={() => onClick("assignments")}>Assignments</a>
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

export default Navbar

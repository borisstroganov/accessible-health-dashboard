import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import './Navbar.css'

type NavbarProps = {
    onClick: (state: string) => void;
}

function Navbar({ onClick }: NavbarProps) {
    return (
        <div className="navbar">
            <div className="dashboard-title">
                <h3 onClick={() => onClick("home")}>Home</h3>
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
            </ul>
        </div>
    )
}

export default Navbar

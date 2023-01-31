import { IoClose } from 'react-icons/io5'
import './Notification.css'

type NotificationProps = {
    onClick: () => void;
    title: string;
    text: string;
    color: string;
}

function Notification({ onClick, title, text, color }: NotificationProps) {
    return (<div className="notification-wrapper">
        <div className="notification" style={{ backgroundColor: color }}>
            <div className="notification-title">
                <h3>{title}</h3>
            </div>
            <div className="notification-text">
                <h5>{text}</h5>
            </div>
        </div>

        <button onClick={onClick} className="notification-button"><IoClose style={{ "color": "black" }} /></button>
    </div>
    )
}

export default Notification
import { useEffect, useState } from 'react'
import Notification from './Notification'
import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import './HomeTab.css'

type HomeTabProps = {
    onClick: (state: string) => void;
    heartRate: number | null;
    bloodPressure: string | null;
    speechRate: number | null;
}

function HomeTab({ onClick, heartRate, bloodPressure, speechRate }: HomeTabProps) {
    const [notification, setNotification] = useState(!heartRate || !bloodPressure || !speechRate);

    useEffect(() => {
        handleNotification()
    }, [heartRate, bloodPressure, speechRate])

    let handleNotification = () => {
        setNotification(!heartRate || !bloodPressure || !speechRate);
    }

    return (
        <div className="home-tab">
            {notification && <Notification onClick={() => setNotification(false)} title="Missing Data" text="You haven't yet captured all the data, please capture the missing data." />}
            <h1>Accessible Health Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card" onClick={() => onClick("hr")}>
                    <h2>Heart Rate <FaHeartbeat /></h2>
                    <h3>{heartRate ? heartRate : "-"} BPM</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("bp")}>
                    <h2>Blood Pressure <ImDroplet /></h2>
                    <h3>{bloodPressure ? bloodPressure : "-"} mmHg</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("speech")}>
                    <h2>Speech Rate <BsSoundwave /></h2>
                    <h3>{speechRate ? Math.round(speechRate) : "-"} WPM</h3>
                </div>
            </div>
        </div>
    )
}
export default HomeTab
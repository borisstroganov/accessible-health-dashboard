import { useEffect, useState } from 'react'
import Notification from './Notification'
import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import './HomeTab.css'

type HomeTabProps = {
    onClick: (state: string) => void;
    heartRate: { hr: number; date: string };
    bloodPressure: { systolicPressure: number; diastolicPressure: number; date: string };
    speechRate: { wpm: number; accuracy: number; date: string };
}

function HomeTab({ onClick, heartRate, bloodPressure, speechRate }: HomeTabProps) {
    const [notification, setNotification] = useState(!heartRate || !bloodPressure || !speechRate);

    useEffect(() => {
        handleNotification()
    }, [heartRate, bloodPressure, speechRate])

    let handleNotification = () => {
        setNotification(!heartRate.hr || !bloodPressure.systolicPressure || !speechRate.wpm);
    }

    return (
        <div className="home-tab">
            {notification && <Notification onClick={() => setNotification(false)} title="Missing Data"
                text="You haven't yet captured all the data, please capture the missing data." color="#4287f5" />}
            <h1>Accessible Health Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card" onClick={() => onClick("hr")}>
                    <h2>Heart Rate <FaHeartbeat /></h2>
                    <h3>{heartRate.hr ? heartRate.hr : "-"} BPM</h3>
                    <h3>{heartRate.date ? new Date(heartRate.date).toLocaleString() : "--/--/--, --:--:--"}</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("bp")}>
                    <h2>Blood Pressure <ImDroplet /></h2>
                    <h3>
                        {bloodPressure.systolicPressure ? bloodPressure.systolicPressure + "/" + bloodPressure.diastolicPressure : "-"} mmHg
                    </h3>
                    <h3>{bloodPressure.date ? new Date(bloodPressure.date).toLocaleString() : "--/--/--, --:--:--"}</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("speech")}>
                    <h2>Speech Rate <BsSoundwave /></h2>
                    <h3>
                        {speechRate.wpm ? Math.round(speechRate.wpm) : "-"} WPM {speechRate.accuracy ? speechRate.accuracy
                            + "% Accuracy" : ""}
                    </h3>
                    <h3>{speechRate.date ? new Date(speechRate.date).toLocaleString() : "--/--/--, --:--:--"}</h3>
                </div>
            </div>
        </div>
    )
}
export default HomeTab
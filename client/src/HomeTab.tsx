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

    return (
        <div className="home-tab">
            <h1>Logoped Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card" onClick={() => onClick("hr")}>
                    <h2>Heart Rate <FaHeartbeat /></h2>
                    <h3>{heartRate.hr ? heartRate.hr : "-"} BPM</h3>
                    <h3>{heartRate.date ? new Date(heartRate.date).toLocaleDateString() == new Date().toLocaleDateString() ?
                        "Today, " + new Date(heartRate.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : new Date(heartRate.date).toLocaleDateString() ==
                            new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString() ?
                            "Yesterday, " + new Date(heartRate.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : new Date(heartRate.date).toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        : "--/--/--, --:--"}</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("bp")}>
                    <h2>Blood Pressure <ImDroplet /></h2>
                    <h3>
                        {bloodPressure.systolicPressure ? bloodPressure.systolicPressure + "/" + bloodPressure.diastolicPressure : "-"} mmHg
                    </h3>
                    <h3>{bloodPressure.date ? new Date(bloodPressure.date).toLocaleDateString() == new Date().toLocaleDateString() ?
                        "Today, " + new Date(bloodPressure.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : new Date(bloodPressure.date).toLocaleDateString() ==
                            new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString() ?
                            "Yesterday, " + new Date(bloodPressure.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : new Date(bloodPressure.date).toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        : "--/--/--, --:--"}</h3>
                </div>
                <div className="dashboard-card" onClick={() => onClick("speech")}>
                    <h2>Speech Rate <BsSoundwave /></h2>
                    <h3>
                        {speechRate.wpm ? Math.round(speechRate.wpm) : "-"} WPM {speechRate.accuracy ? speechRate.accuracy
                            + "% Accuracy" : ""}
                    </h3>
                    <h3>{speechRate.date ? new Date(speechRate.date).toLocaleDateString() == new Date().toLocaleDateString() ?
                        "Today, " + new Date(speechRate.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : new Date(speechRate.date).toLocaleDateString() ==
                            new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString() ?
                            "Yesterday, " + new Date(speechRate.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : new Date(speechRate.date).toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        : "--/--/--, --:--"}</h3>
                </div>
            </div>
        </div>
    )
}
export default HomeTab
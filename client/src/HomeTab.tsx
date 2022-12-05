import { useState } from 'react'
import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import './HomeTab.css'

type HomeTabProps = {
    heartRate: number | null;
    bloodPressure: string | null;
    speechRate: number | null;
}

function HomeTab({ heartRate, bloodPressure, speechRate }: HomeTabProps) {

    return (
        <div className="home-tab">
            <h1>Accessible Health Dashboard</h1>
            <div className="dashboard">
                <div className="dashboard-card">
                    <h2>Heart Rate <FaHeartbeat /></h2>
                    <h3>{heartRate ? heartRate : "-"} BPM</h3>
                </div>
                <div className="dashboard-card">
                    <h2>Blood Pressure <ImDroplet /></h2>
                    <h3>{bloodPressure ? bloodPressure : "-"} mmHg</h3>
                </div>
                <div className="dashboard-card">
                    <h2>Speech Rate <BsSoundwave /></h2>
                    <h3>{speechRate ? speechRate : "-"} WPM</h3>
                </div>
            </div>
        </div>
    )
}
export default HomeTab
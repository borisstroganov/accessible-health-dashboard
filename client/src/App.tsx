import { useState } from 'react'
import Navbar from './Navbar'
import HomeTab from './HomeTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import './App.css'


function App() {
    const [heartRate, setHeartRate] = useState(0);
    const [bloodPressure, setBloodPressure] = useState(null);
    const [speechRate, setSpeechRate] = useState(null);
    const [pageState, setPageState] = useState("home");
    let handleClick = (state: string) => {
        setPageState(state)
    }

    let handleHrSubmit = (hr: number) => {
        setHeartRate(hr);
        setPageState("home");
    }

    return (
        <div className="App">
            <Navbar onClick={handleClick} />
            {pageState === "home" ? <HomeTab heartRate={heartRate} bloodPressure={bloodPressure} speechRate={speechRate} />
                : pageState === "hr" ? <HrTab onClick={handleHrSubmit} />
                    : pageState === "bp" ? <BpTab />
                        : <SpeechTab />}

        </div>
    )
}

export default App
import { useState } from 'react'
import Navbar from './Navbar'
import HomeTab from './HomeTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import './App.css'


function App() {
    const [heartRate, setHeartRate] = useState(null);
    const [bloodPressure, setBloodPressure] = useState(null);
    const [speechRate, setSpeechRate] = useState(null);
    const [pageState, setPageState] = useState("home");
    const handleClick = (state: string) => {
        setPageState(state)
    }

    return (
        <div className="App">
            <Navbar onClick={handleClick} />
            {pageState === "home" ? <HomeTab heartRate={heartRate} bloodPressure={bloodPressure} speechRate={speechRate} />
                : pageState === "hr" ? <HrTab />
                    : pageState === "bp" ? <BpTab />
                        : <SpeechTab />}

        </div>
    )
}

export default App

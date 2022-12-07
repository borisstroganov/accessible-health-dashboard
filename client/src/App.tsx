import { useState } from 'react'
import Navbar from './Navbar'
import HomeTab from './HomeTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import './App.css'


function App() {
    const [heartRate, setHeartRate] = useState<{hr: number; date: Date | undefined}>({
        hr: 0,
        date: undefined,
      });
    const [bloodPressure, setBloodPressure] = useState<{bp: string; date: Date | undefined}>({
        bp: "",
        date: undefined,
      });
    const [speechRate, setSpeechRate] = useState<{wpm: number; date: Date | undefined}>({
        wpm: 0,
        date: undefined,
      });
    const [pageState, setPageState] = useState("home");

    let handleClick = (state: string) => {
        setPageState(state)
    }

    let handleHrSubmit = (hr: number) => {
        setHeartRate({hr: hr, date: new Date});
        setPageState("home");
    }

    let handleBpSubmit = (bp: string) => {
        setBloodPressure({bp: bp, date: new Date});
        setPageState("home");
    }

    let handleSpeechSubmit = (wpm: number) => {
        setSpeechRate({wpm: wpm, date: new Date});
        setPageState("home");
    }

    return (
        <div className="App">
            <Navbar onClick={handleClick} />
            {pageState === "home" ? <HomeTab onClick={handleClick} heartRate={heartRate} bloodPressure={bloodPressure} speechRate={speechRate} />
                : pageState === "hr" ? <HrTab onClick={handleHrSubmit} />
                    : pageState === "bp" ? <BpTab onClick={handleBpSubmit} />
                        : <SpeechTab onSubmit={handleSpeechSubmit} />}

        </div>
    )
}

export default App

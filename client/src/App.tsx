import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import Navbar from './Navbar'
import HomeTab from './HomeTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import './App.css'


function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [signUp, setSignUp] = useState<boolean>(false)

    const [heartRate, setHeartRate] = useState<{ hr: number; date: Date | undefined }>({
        hr: 0,
        date: undefined,
    });
    const [bloodPressure, setBloodPressure] = useState<{ bp: string; date: Date | undefined }>({
        bp: "",
        date: undefined,
    });
    const [speechRate, setSpeechRate] = useState<{ wpm: number; date: Date | undefined }>({
        wpm: 0,
        date: undefined,
    });
    const [pageState, setPageState] = useState("home");

    let handleLogin = (email: string, password: string) => {
        console.log("Login", email, password);
        setLoggedIn(true);
    }

    let handleSignUpClick = () => {
        setSignUp(true);
    }

    let handleSignUp = (email: string, name: string, password: string) => {
        console.log("Sign Up", email, name, password);
        setSignUp(false);
    }

    let handleClick = (state: string) => {
        setPageState(state)
    }

    let handleHrSubmit = (hr: number) => {
        setHeartRate({ hr: hr, date: new Date });
        setPageState("home");
    }

    let handleBpSubmit = (bp: string) => {
        setBloodPressure({ bp: bp, date: new Date });
        setPageState("home");
    }

    let handleSpeechSubmit = (wpm: number) => {
        setSpeechRate({ wpm: wpm, date: new Date });
        setPageState("home");
    }

    return (
        <>
            {loggedIn ?
                <div className="App">
                    <Navbar onClick={handleClick} />
                    {pageState === "home" ? <HomeTab onClick={handleClick} heartRate={heartRate} bloodPressure={bloodPressure} speechRate={speechRate} />
                        : pageState === "hr" ? <HrTab onClick={handleHrSubmit} />
                            : pageState === "bp" ? <BpTab onClick={handleBpSubmit} />
                                : <SpeechTab onSubmit={handleSpeechSubmit} />}

                </div>
                : signUp ? <SignUp onClick={handleSignUp} />
                    : <Login onClick={handleLogin} onSignUpClick={handleSignUpClick} />}
        </>
    )
}

export default App

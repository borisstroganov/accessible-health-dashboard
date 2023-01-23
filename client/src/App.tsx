import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import Navbar from './Navbar'
import Notification from './Notification'
import HomeTab from './HomeTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import './App.css'

import { signUp } from './services/signUp'

function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [signedUp, setSignedUp] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [user, setUser] = useState()

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

    let handleSignUp = async (email: string, name: string, password: string) => {
        const response = await signUp(email, name, password);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            handleBackClick()
        }
        console.log(response);
    }

    let handleBackClick = () => {
        setErrorMessage("")
        setSignedUp(false);
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
            {errorMessage && <Notification onClick={() => setErrorMessage("")} title="Invalid Input" text={"One or more fields are invalid."} color="grey" />}
            {loggedIn ?
                <div className="App">
                    <Navbar onClick={handleClick} />
                    {pageState === "home" ? <HomeTab onClick={handleClick} heartRate={heartRate} bloodPressure={bloodPressure} speechRate={speechRate} />
                        : pageState === "hr" ? <HrTab onClick={handleHrSubmit} />
                            : pageState === "bp" ? <BpTab onClick={handleBpSubmit} />
                                : <SpeechTab onSubmit={handleSpeechSubmit} />}

                </div>
                : signedUp ? <SignUp onClick={handleSignUp} onBackClick={handleBackClick} />
                    : <Login onClick={handleLogin} onSignUpClick={() => setSignedUp(true)} />}
        </>
    )
}

export default App

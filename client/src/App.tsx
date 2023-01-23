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
import { login } from './services/login'

type User = {
    name: string | null;
    email: string | null;
};

function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [signedUp, setSignedUp] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [user, setUser] = useState<User>()

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

    let handleLogin = async (email: string, password: string) => {
        const response = await login(email, password);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setErrorMessage("")
            setLoggedIn(true);
            setUser({ email: response.email, name: response.name })
        }
        console.log(response);
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

    let handleLogOut = () => {
        setUser({ email: null, name: null })
        setLoggedIn(false);
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
                    <Navbar onClick={handleClick} onLogOut={handleLogOut} name={user?.name || ""}/>
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

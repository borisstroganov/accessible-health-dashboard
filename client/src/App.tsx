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
import { captureBp } from './services/captureBp'
import { captureHr } from './services/captureHr'
import { captureSpeech } from './services/captureSpeech'


type User = {
    name: string | null;
    email: string | null;
};

function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [signedUp, setSignedUp] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [user, setUser] = useState<User>()

    const [heartRate, setHeartRate] = useState<{ hr: number; date: string }>({
        hr: 0,
        date: "",
    });
    const [bloodPressure, setBloodPressure] = useState<{ systolicPressure: number; diastolicPressure: number; date: string }>({
        systolicPressure: 0,
        diastolicPressure: 0,
        date: "",
    });
    const [speechRate, setSpeechRate] = useState<{ wpm: number; accuracy: number; date: string }>({
        wpm: 0,
        accuracy: 0,
        date: "",
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

    let handleHrSubmit = async (hr: number) => {
        const response = await captureHr(user?.email || "", hr);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setHeartRate({ hr: response.hr, date: response.date });
        }
        setPageState("home");
    }

    let handleBpSubmit = async (systolicPressure: number, diastolicPressure: number) => {
        const response = await captureBp(user?.email || "", systolicPressure, diastolicPressure);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setBloodPressure({ systolicPressure: response.systolicPressure, diastolicPressure: response.diastolicPressure, date: response.date });
        }
        setPageState("home");
    }

    let handleSpeechSubmit = async (wpm: number, accuracy: number) => {
        const response = await captureSpeech(user?.email || "", wpm, accuracy);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSpeechRate({ wpm: response.wpm, accuracy: response.accuracy, date: response.date });
        }
        setPageState("home");
    }

    return (
        <>
            {errorMessage && <Notification onClick={() => setErrorMessage("")} title="Invalid Input" text={"One or more fields are invalid."} color="grey" />}
            {loggedIn ?
                <div className="App">
                    <Navbar onClick={handleClick} onLogOut={handleLogOut} name={user?.name || ""} />
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

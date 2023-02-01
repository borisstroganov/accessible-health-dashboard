import { useEffect, useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import Navbar from './Navbar'
import Notification from './Notification'
import HomeTab from './HomeTab'
import AccountTab from './AccountTab'
import HrTab from './HrTab'
import BpTab from './BpTab'
import SpeechTab from './SpeechTab'
import Modal from './Modal'
import './App.css'

import { signUp } from './services/signUp'
import { login } from './services/login'
import { captureBp } from './services/captureBp'
import { captureHr } from './services/captureHr'
import { captureSpeech } from './services/captureSpeech'
import { latestBp } from './services/latestBp'
import { latestHr } from './services/latestHr'
import { latestSpeech } from './services/latestSpeech'
import { changePassword } from './services/changePassword'


type User = {
    name: string;
    email: string;
};

function App() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [signedUp, setSignedUp] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");

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

    useEffect(() => {
        retrieveBp(user?.email || "")
        retrieveHr(user?.email || "")
        retrieveSpeech(user?.email || "")
    }, [user])

    let retrieveBp = async (email: string) => {
        let response = await latestBp(email);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setBloodPressure(response)
        }
    }

    let retrieveHr = async (email: string) => {
        let response = await latestHr(email);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setHeartRate(response)
        }
    }

    let retrieveSpeech = async (email: string) => {
        let response = await latestSpeech(email);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSpeechRate(response)
        }
    }

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
            setSuccessMessage("Successfully signed up.")
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

    let handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        const response = await changePassword(user?.email || "", currentPassword, newPassword, confirmPassword)
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Password changed.");
            setErrorMessage("");
        }
        console.log(response);
    }

    let handleLogOut = () => {
        setUser({ email: "", name: "" })
        setBloodPressure({
            systolicPressure: 0,
            diastolicPressure: 0,
            date: "",
        });
        setHeartRate({
            hr: 0,
            date: "",
        });
        setSpeechRate({
            wpm: 0,
            accuracy: 0,
            date: "",
        });
        setLoggedIn(false);
        setToggleModal(false);
        setPageState("home");
        setErrorMessage("")
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
        if (response.hr >= 120) {
            setWarningMessage("Your recent heart rate capture is higher than the expected range. \
            If your heart rate remains consistently high, please contact your GP.")
        } else if (response.hr <= 40) {
            setWarningMessage("Your recent heart rate capture is lower than the expected range. \
            If your heart rate remains consistently low, please contact your GP.")
        }
    }

    let handleBpSubmit = async (systolicPressure: number, diastolicPressure: number) => {
        const response = await captureBp(user?.email || "", systolicPressure, diastolicPressure);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setBloodPressure({
                systolicPressure: response.systolicPressure,
                diastolicPressure: response.diastolicPressure,
                date: response.date
            });
        }
        setPageState("home");
        if ((response.systolicPressure >= 140 && response.diastolicPressure >= 90)) {
            setWarningMessage("Your recent blood pressure capture is higher than the expected range. \
            If your blood pressure remains high, please contact your GP.")
        } else if (response.systolicPressure <= 90 && response.diastolicPressure <= 60) {
            setWarningMessage("Your recent blood pressure capture is lower than the expected range. \
            If your blood pressure remains low, please contact your GP.")
        }
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
            {errorMessage ? <Notification onClick={() => setErrorMessage("")} title="Invalid Input"
                text={"One or more fields are invalid."} color="grey" /> :
                warningMessage ? <Notification onClick={() => setWarningMessage("")} title="Warning"
                    text={warningMessage} color="coral" /> :
                    successMessage ? <Notification onClick={() => setSuccessMessage("")} title="Success"
                        text={successMessage} color="limegreen" /> : ""}
            {loggedIn ?
                <div className="App">
                    <Navbar onClick={handleClick} onLogOut={() => setToggleModal(true)} name={user?.name || ""} />
                    {toggleModal && <Modal onClick={handleLogOut} onCancel={() => setToggleModal(false)} headerText="Logout"
                        bodyText="Are you sure you want to logout?" buttonText="Logout" buttonTextColor="orangered" />}
                    {pageState === "home" ? <HomeTab onClick={handleClick} heartRate={heartRate} bloodPressure={bloodPressure}
                        speechRate={speechRate} />
                        : pageState === "account" ? <AccountTab onClick={handleChangePassword} email={user?.email || ""}
                            name={user?.name || ""} />
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

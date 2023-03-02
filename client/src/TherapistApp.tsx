import { useEffect, useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import Notification from './Notification'
import Modal from './Modal'
import './TherapistApp.css'

import { therapistSignUp } from './services/therapistSignUp'
import { therapistLogin } from './services/therapistLogin'

type User = {
    name: string;
    email: string;
    password: string;
};

type TherapistAppProps = {
    onBackClick: () => void;
}

function TherapistApp({ onBackClick }: TherapistAppProps) {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [signedUp, setSignedUp] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const [user, setUser] = useState<User>()
    const [pageState, setPageState] = useState("home");

    let resetMessages = () => {
        setErrorMessage("");
        setInfoMessage("");
        setSuccessMessage("");
        setWarningMessage("");
    }

    let handleLogin = async (email: string, password: string) => {
        const response = await therapistLogin(email, password);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setErrorMessage("");
            setSuccessMessage("");
            setLoggedIn(true);
            setUser({ email: response.email, name: response.name, password: password });
        }
    }

    let handleSignUp = async (email: string, name: string, password: string) => {
        const response = await therapistSignUp(email, name, password);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            handleBackClick()
            setSuccessMessage("Successfully signed up.")
        }
    }

    let handleBackClick = () => {
        setErrorMessage("")
        setSignedUp(false);
    }

    let handleLogOut = () => {
        setUser({ email: "", name: "", password: "" })
        setLoggedIn(false);
        setToggleModal(false);
        setPageState("home");
        resetMessages();
        onBackClick();
    }

    return (
        <>
            {errorMessage ? <Notification onClick={() => setErrorMessage("")} title="Invalid Input"
                text={errorMessage} color="rgba(128, 128, 128, 0.95)" />
                : successMessage ? <Notification onClick={() => setSuccessMessage("")} title="Success"
                    text={successMessage} color="rgba(50, 205, 50, 0.95)" />
                    : pageState === "home" && (warningMessage ? <Notification onClick={() => setWarningMessage("")} title="Warning"
                        text={warningMessage} color="rgba(255, 127, 80, 0.95)" />
                        : infoMessage ? <Notification onClick={() => setInfoMessage("")} title="Information"
                            text={infoMessage} color="rgba(0, 128, 128, 0.95)" />
                            : "")}
            {loggedIn ?
                <div className="TherapistApp">
                    {toggleModal && <Modal onClick={handleLogOut} onCancel={() => setToggleModal(false)} headerText="Logout"
                        bodyText="Are you sure you want to logout?" buttonText="Logout" buttonTextColor="orangered" />}
                </div>
                : <>
                    <button className="landing-page-button" onClick={onBackClick}>Logoped</button>
                    {signedUp ? <SignUp onClick={handleSignUp} onBackClick={handleBackClick} />
                        : <Login onClick={handleLogin} onSignUpClick={() => setSignedUp(true)} role="therapist" />}
                </>}
        </>
    )
}

export default TherapistApp

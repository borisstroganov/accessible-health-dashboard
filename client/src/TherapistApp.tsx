import { useEffect, useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import TherapistNavbar from './TherapistNavbar'
import Notification from './Notification'
import Modal from './Modal'
import './TherapistApp.css'

import { therapistSignUp } from './services/therapistSignUp'
import { therapistLogin } from './services/therapistLogin'
import TherapistHomeTab from './TherapistHomeTab'
import PatientsTab from './PatientsTab'
import { getTherapistInvitations } from './services/getTherapistInvitations'
import { getTherapistAssignments } from './services/getTherapistAssignments'
import TherapistAssignmentsTab from './TherapistAssignmentsTab'
import ReviewTab from './ReviewTab'
import { reviewAssignment } from './services/reviewAssignment'

type User = {
    name: string;
    email: string;
    password: string;
};

type Patient = {
    name: string;
    email: string;
}

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
    const [patient, setPatient] = useState<Patient>({
        name: "",
        email: "",
    })
    const [assignmentText, setAssignmentText] = useState<string>("")
    const [assignmentId, setAssignmentId] = useState<string>("")
    const [speech, setSpeech] = useState<{ wpm: number, accuracy: number }>(
        { wpm: 0, accuracy: 0 }
    );
    const [pageState, setPageState] = useState("home");

    const [invitations, setInvitations] = useState<{ user: { userEmail: string, userName: string } }[]>(
        [{ user: { userEmail: "", userName: "" } }]
    );
    const [assignments, setAssignments] = useState<{
        assignment: {
            assignmentId: string, userName: string, userEmail: string, assignmentTitle: string,
            assignmentText: string, status: string, speech: {
                wpm: number,
                accuracy: number
            }, feedbackText: string
        }
    }[]>([{
        assignment: {
            assignmentId: "", userName: "", userEmail: "", assignmentTitle: "", assignmentText: "", status: "",
            speech: { wpm: 0, accuracy: 0 }, feedbackText: ""
        }
    }]);

    useEffect(() => {
        if (loggedIn) {
            retrieveInvitations()
            retrieveAssignments()
        }
    }, [user]);

    useEffect(() => {
        if (pageState === "account" || pageState === "invitations") {
            retrieveInvitations();
        } else if (pageState === "assignments") {
            retrieveAssignments();
        } else if (pageState !== "review") {
            setAssignmentText("");
            setAssignmentId("");
            setPatient({ name: "", email: "", });
            setSpeech({ wpm: 0, accuracy: 0 })
        }
    }, [pageState]);

    let retrieveInvitations = async () => {
        let response = await getTherapistInvitations(user?.email || "", user?.password || "")

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setInvitations(response.users);
        }
    }

    let retrieveAssignments = async () => {
        let response = await getTherapistAssignments(user?.email || "", user?.password || "")

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setAssignments(response.assignments);
        }
    }

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

    let handleClick = (state: string) => {
        setPageState(state)
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

    let handleReviewClick = (assignmentId: string, assignmentText: string, speech: { wpm: number, accuracy: number },
        patient: { name: string, email: string }) => {
        setAssignmentId(assignmentId);
        setAssignmentText(assignmentText);
        setSpeech(speech);
        setPatient(patient);
        setPageState("review");
    }

    let handleFeedbackSubmit = async (assignmentId: string, feedbackText: string) => {
        const response = await reviewAssignment(user?.email || "", user?.password || "", assignmentId, feedbackText);

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Feedback submitted");
        }
        setPageState("assignments");
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
                    <TherapistNavbar onClick={handleClick} onLogOut={() => setToggleModal(true)} name={user?.name || ""} />
                    {toggleModal && <Modal onClick={handleLogOut} onCancel={() => setToggleModal(false)} headerText="Logout"
                        bodyText="Are you sure you want to logout?" buttonText="Logout" buttonTextColor="orangered" />}
                    {pageState === "home" ? <TherapistHomeTab onClick={handleClick} />
                        : pageState === "patients" ? <PatientsTab onSubmit={() => { }} onBackClick={() => setPageState("home")} />
                            : pageState === "assignments" ? <TherapistAssignmentsTab onReviewClick={handleReviewClick}
                                onBackClick={() => setPageState("home")} assignments={assignments} />
                                : pageState === "review" ? <ReviewTab onClick={handleFeedbackSubmit}
                                    onBackClick={() => setPageState("home")} assignmentId={assignmentId} assignmentText={assignmentText}
                                    speech={speech} userName={patient?.name} userEmail={patient?.email} />
                                    : ""}
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

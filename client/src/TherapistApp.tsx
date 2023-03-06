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
import TherapistAccountTab from './TherapistAccountTab'
import { therapistChangePassword } from './services/therapistChangePassword'
import { getTherapistPatients } from './services/getTherapistPatients'
import { sendInvitation } from './services/sendInvitation'
import CreateAssignmentTab from './CreateAssignmentTab'
import { sendAssignment } from './services/sendAssignment'
import { removePatient } from './services/removePatient'

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

    const [patients, setPatients] = useState<{
        patient: {
            userEmail: string, userName: string, speech: {
                speechId: string,
                wpm: number,
                accuracy: number,
                date: string,
            }
        }
    }[]>([{ patient: { userEmail: "", userName: "", speech: { speechId: "", wpm: 0, accuracy: 0, date: "" } } }])

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
            retrievePatients()
        }
    }, [user]);

    useEffect(() => {
        if (pageState === "account" || pageState === "invitations") {
            retrieveInvitations();
        } else if (pageState === "assignments") {
            retrieveAssignments();
        } else if (pageState === "patients") {
            retrievePatients();
        }
        else if (pageState !== "review") {
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

    let retrievePatients = async () => {
        let response = await getTherapistPatients(user?.email || "", user?.password || "")

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setPatients(response.patients);
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

    let handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("The confirmation password must match the new password.")
            return
        }
        const response = await therapistChangePassword(user?.email || "", currentPassword, newPassword, confirmPassword)
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Password changed.");
            setErrorMessage("");
        }
    }

    let handleLogOut = () => {
        setUser({ email: "", name: "", password: "" })
        setLoggedIn(false);
        setToggleModal(false);
        setPageState("home");
        resetMessages();
        onBackClick();
    }

    let handleRemove = async (userEmail: string) => {
        const response = await removePatient(user?.email || "", user?.password || "", userEmail)

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Patient removed.");
        }
        retrievePatients();
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
            setSuccessMessage("Feedback submitted.");
        }
        setPageState("assignments");
    }

    let handleSendInvitation = async (userEmail: string) => {
        const response = await sendInvitation(user?.email || "", user?.password || "", userEmail)
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Invitation sent.");
        }
        setPageState("patients");
        retrieveInvitations();
    }

    let handleCreateAssignment = async (userEmail: string, assignmentTitle: string, assignmentText: string) => {
        const response = await sendAssignment(user?.email || "", user?.password || "", userEmail, assignmentTitle, assignmentText);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Assignment sent.");
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
                    {pageState === "home" ? <TherapistHomeTab onClick={handleClick} patientsNumber={patients.length}
                        invitationsNumber={invitations.length} unattemptedNumber={assignments.filter((item) =>
                            item.assignment.status === "todo").length} completedNumber={assignments.filter((item) =>
                                item.assignment.status === "completed").length} />
                        : pageState === "account" ? <TherapistAccountTab onClick={handleChangePassword}
                            onBackClick={() => setPageState("home")} email={user?.email || ""} name={user?.name || ""}
                            onInvitationsClick={() => { setPageState("invitations") }} />
                            : pageState === "patients" ? <PatientsTab onSubmit={handleSendInvitation}
                                onBackClick={() => setPageState("home")} onRemove={handleRemove} patients={patients} />
                                : pageState === "assignments" ? <TherapistAssignmentsTab onReviewClick={handleReviewClick}
                                    onBackClick={() => setPageState("home")} onNewClick={() => setPageState("create")}
                                    assignments={assignments} />
                                    : pageState === "review" ? <ReviewTab onClick={handleFeedbackSubmit}
                                        onBackClick={() => setPageState("home")} assignmentId={assignmentId} assignmentText={assignmentText}
                                        speech={speech} userName={patient?.name} userEmail={patient?.email} />
                                        : pageState === "create" ? <CreateAssignmentTab onClick={handleCreateAssignment}
                                            onBackClick={() => setPageState("home")} patients={patients} />
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

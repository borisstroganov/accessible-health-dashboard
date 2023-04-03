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
import InvitationsTab from './InvitationsTab'
import AssignmentsTab from './AssignmentsTab'
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
import { retrieveUserTherapist } from './services/retrieveUserTherapist'
import { removeTherapist } from './services/removeTherapist'
import { acceptInvitation } from './services/acceptInvitation'
import { getUserInvitations } from './services/getUserInvitations'
import { rejectInvitation } from './services/rejectInvitation'
import { getUserAssignments } from './services/getUserAssignments'
import { submitAssignment } from './services/submitAssignment'
import { retrieveHrs } from './services/retrieveHrs'
import { retrieveBps } from './services/retrieveBps'
import { retrieveSpeeches } from './services/retrieveSpeeches'

type User = {
    name: string;
    email: string;
    password: string;
};

type Therapist = {
    name: string;
    email: string;
}

type AppProps = {
    onBackClick: () => void;
}

function App({ onBackClick }: AppProps) {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [signedUp, setSignedUp] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    const [user, setUser] = useState<User>()
    const [therapist, setTherapist] = useState<Therapist>()
    const [invitations, setInvitations] = useState<{ therapist: { therapistEmail: string, therapistName: string } }[]>(
        [{ therapist: { therapistEmail: "", therapistName: "" } }]
    );
    const [assignments, setAssignments] = useState<{
        assignment: {
            assignmentId: string, therapistName: string, therapistEmail: string, assignmentTitle: string,
            assignmentText: string, status: string, speech: {
                wpm: number,
                accuracy: number
            }, feedbackText: string
        }
    }[]>([{
        assignment: {
            assignmentId: "", therapistName: "", therapistEmail: "", assignmentTitle: "", assignmentText: "", status: "",
            speech: { wpm: 0, accuracy: 0 }, feedbackText: ""
        }
    }]);

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
    const [pastHrs, setPastHrs] = useState<{ hrCapture: { hr: number, date: string, } }[]>([{ hrCapture: { hr: 0, date: "" } }]);
    const [pastBps, setPastBps] = useState<{ bpCapture: { systolicPressure: number, diastolicPressure: number, date: string, } }[]>
        ([{ bpCapture: { systolicPressure: 0, diastolicPressure: 0, date: "" } }]);
    const [pastSpeeches, setPastSpeeches] = useState<{ speechCapture: { wpm: number, accuracy: number, date: string, } }[]>
        ([{ speechCapture: { wpm: 0, accuracy: 0, date: "" } }]);

    const [assignmentText, setAssignmentText] = useState<string>("")
    const [assignmentId, setAssignmentId] = useState<string>("")

    const [pageState, setPageState] = useState("home");

    useEffect(() => {
        if (loggedIn) {
            retrieveBp()
            retrieveHr()
            retrieveSpeech()
            retrieveTherapist()
            retrieveInvitations()
            retrieveAssignments()
            retrievePastHrs()
            retrievePastBps()
            retrievePastSpeeches()
        }
    }, [user]);

    useEffect(() => {
        if (pageState === "account" || pageState === "invitations") {
            retrieveTherapist()
            retrieveInvitations();
        } else if (pageState === "assignments") {
            retrieveAssignments();
        } else if (pageState !== "speech") {
            setAssignmentText("");
            setAssignmentId("");
        }
    }, [pageState]);

    useEffect(() => {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 2);

        if (loggedIn) {
            const missingReadings = [];
            const notRecentlyCapturedReadings = [];

            if (!heartRate.hr) {
                missingReadings.push("Heart Rate");
            } else if (new Date(heartRate.date) < checkDate) {
                notRecentlyCapturedReadings.push("Heart Rate");
            }
            if (!bloodPressure.systolicPressure) {
                missingReadings.push("Blood Pressure");
            } else if (new Date(bloodPressure.date) < checkDate) {
                notRecentlyCapturedReadings.push("Blood Pressure");
            }
            if (!speechRate.wpm) {
                missingReadings.push("Speech Rate");
            } else if (new Date(speechRate.date) < checkDate) {
                notRecentlyCapturedReadings.push("Speech Rate");
            }
            let message = "";

            if (missingReadings.length > 0) {
                message = `You haven't yet captured your ${missingReadings.join(' and ')}, please capture it.`;
            } else if (notRecentlyCapturedReadings.length > 0) {
                message = `You haven't recently captured your ${notRecentlyCapturedReadings.join(' and ')}, consider capturing it soon.`;
            }
            setInfoMessage(message);
        } else {
            setInfoMessage("")
        }
    }, [heartRate, bloodPressure, speechRate]);

    let retrieveBp = async () => {
        let response = await latestBp(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setBloodPressure(response)
        }
    }

    let retrievePastBps = async () => {
        let response = await retrieveBps(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setPastBps(response.bps);
        }
    }

    let retrieveHr = async () => {
        let response = await latestHr(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setHeartRate(response)
        }
    }

    let retrievePastHrs = async () => {
        let response = await retrieveHrs(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setPastHrs(response.hrs);
        }
    }

    let retrieveSpeech = async () => {
        let response = await latestSpeech(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSpeechRate(response)
        }
    }

    let retrievePastSpeeches = async () => {
        let response = await retrieveSpeeches(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setPastSpeeches(response.speeches);
        }
    }

    let retrieveTherapist = async () => {
        let response = await retrieveUserTherapist(user?.email || "", user?.password || "");

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setTherapist({
                email: response.therapistEmail,
                name: response.therapistName
            })
        }
    }

    let retrieveInvitations = async () => {
        let response = await getUserInvitations(user?.email || "", user?.password || "")

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setInvitations(response.therapists);
        }
    }

    let retrieveAssignments = async () => {
        let response = await getUserAssignments(user?.email || "", user?.password || "")

        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setAssignments(response.assignments);
            const todoAssignment = response.assignments.find((assignment) => {
                return assignment.assignment.status === "todo";
            });

            if (todoAssignment) {
                console.log(todoAssignment.assignment);
                setInfoMessage("You have uncompleted assignments, please visit the assignments page.")
            }
        }
    }

    let resetMessages = () => {
        setErrorMessage("");
        setInfoMessage("");
        setSuccessMessage("");
        setWarningMessage("");
        setUpdateMessage("");
    }

    let handleLogin = async (email: string, password: string) => {
        const response = await login(email, password);

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
        const response = await signUp(email, name, password);
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

    let handleClick = (state: string) => {
        setPageState(state)
    }

    let handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("The confirmation password must match the new password.")
            return
        }
        const response = await changePassword(user?.email || "", currentPassword, newPassword, confirmPassword)
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
        setTherapist({ email: "", name: "" })
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
        setInvitations([{ therapist: { therapistEmail: "", therapistName: "" } }]);
        resetMessages();
        onBackClick();
    }

    let handleHrSubmit = async (hr: number) => {
        const response = await captureHr(user?.email || "", user?.password || "", hr);
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setHeartRate({ hr: response.hr, date: response.date });
            retrievePastHrs();
        }
        setPageState("home");
        if (response.hr >= 120) {
            setWarningMessage("Your recent heart rate capture is higher than the expected range. \
            If your heart rate remains consistently high, please consult a healthcare professional.")
        } else if (response.hr <= 40) {
            setWarningMessage("Your recent heart rate capture is lower than the expected range. \
            If your heart rate remains consistently low, please consult a healthcare professional.")
        }
    }

    let handleBpSubmit = async (systolicPressure: number, diastolicPressure: number) => {
        const response = await captureBp(user?.email || "", user?.password || "", systolicPressure, diastolicPressure);
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
            retrievePastBps();
        }
        setPageState("home");
        if ((response.systolicPressure >= 140 || response.diastolicPressure >= 90)) {
            setWarningMessage("Your recent blood pressure capture is higher than the expected range. \
            High blood pressure is often related to unhealthy lifestyle habits, such as smoking, drinking too much alcohol, \
            being overweight and not exercising enough. \
            If your blood pressure remains consistently high, please consult a healthcare professional.")
        } else if (response.systolicPressure <= 90 || response.diastolicPressure <= 60) {
            setWarningMessage("Your recent blood pressure capture is lower than the expected range. \
            Low blood pressure may be caused by some medicines as a side effect. \
            It can also be caused by a number of underlying conditions. \
            If your blood pressure remains consistently low, please consult a healthcare professional.")
        }
    }

    let handleSpeechSubmit = async (wpm: number, accuracy: number, type: string, assignmentId: string) => {
        let message = ""

        const response = type === "default"
            ? await captureSpeech(user?.email || "", user?.password || "", wpm, accuracy)
            : await submitAssignment(user?.email || "", user?.password || "", assignmentId, wpm, accuracy);


        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            if (response.accuracy > speechRate.accuracy) {
                message += `Your accuracy for the recent speech capture has increased by 
                ${parseFloat((response.accuracy - speechRate.accuracy).toFixed(1))}%.`
            } else if (response.accuracy < speechRate.accuracy) {
                message += `Your accuracy for the recent speech capture has decreased by 
                ${parseFloat((speechRate.accuracy - response.accuracy).toFixed(1))}%.`
            }
            if (response.wpm > speechRate.wpm) {
                message += ` Your WPM for the recent speech capture has increased by 
                ${Math.round(response.wpm - speechRate.wpm)}.`
            } else if (response.wpm < speechRate.wpm) {
                message += ` Your WPM for the recent speech capture has decreased by 
                ${Math.round(speechRate.wpm - response.wpm)}.`
            }

            setUpdateMessage(message);
            setSpeechRate({ wpm: response.wpm, accuracy: response.accuracy, date: response.date });
            retrievePastSpeeches();
        }
        retrieveAssignments();
        setPageState("home");
    }

    let handleRemoveTherapist = async () => {
        const response = await removeTherapist(user?.email || "", user?.password || "");
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Therapist successfully removed");
            setTherapist({ email: "", name: "" });
        }
        setPageState("home");
    }

    let handleAcceptClick = async (therapistEmail: string, therapistName: string) => {
        const response = await acceptInvitation(user?.email || "", user?.password || "", therapistEmail)
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        } else {
            setSuccessMessage("Therapist successfully assigned");
            setTherapist({ email: therapistEmail, name: therapistName });
        }
        retrieveInvitations();
        setPageState("home");
    }

    let handleRejectClick = async (therapistEmail: string,) => {
        const response = await rejectInvitation(user?.email || "", user?.password || "", therapistEmail)
        if ('message' in response) {
            console.log(response);
            setErrorMessage(response.message);
            return;
        }
        retrieveInvitations();
    }

    let handleAttemptClick = (assignmentId: string, assignmentText: string) => {
        setAssignmentId(assignmentId);
        setAssignmentText(assignmentText);
        setPageState("speech");
    }

    return (
        <>
            {errorMessage ? <Notification onClick={() => setErrorMessage("")} title="Invalid Input"
                text={errorMessage} color="rgba(128, 128, 128, 1)" />
                : successMessage ? <Notification onClick={() => setSuccessMessage("")} title="Success"
                    text={successMessage} color="rgba(50, 205, 50, 1)" />
                    : pageState === "home" && (warningMessage ? <Notification onClick={() => setWarningMessage("")} title="Warning"
                        text={warningMessage} color="rgba(255, 127, 80, 1)" />
                        : updateMessage ? <Notification onClick={() => setUpdateMessage("")} title="Update"
                            text={updateMessage} color="rgba(207, 159, 255, 1)" />
                            : infoMessage ? <Notification onClick={() => setInfoMessage("")} title="Information"
                                text={infoMessage} color="rgba(0, 128, 128, 1)" />
                                : "")}
            {loggedIn ?
                <div className="App">
                    <Navbar onClick={handleClick} onLogOut={() => setToggleModal(true)} name={user?.name || ""} />
                    {toggleModal && <Modal onClick={handleLogOut} onCancel={() => setToggleModal(false)} headerText="Logout"
                        bodyText="Are you sure you want to logout?" buttonText="Logout" buttonTextColor="orangered" />}
                    {pageState === "home" ? <HomeTab onClick={handleClick} heartRate={heartRate} bloodPressure={bloodPressure}
                        speechRate={speechRate} />
                        : pageState === "account" ? <AccountTab onClick={handleChangePassword}
                            onBackClick={() => setPageState("home")} email={user?.email || ""} name={user?.name || ""}
                            therapistEmail={therapist?.email || ""} therapistName={therapist?.name || ""}
                            onRemoveClick={handleRemoveTherapist} onInvitationsClick={() => { setPageState("invitations") }}
                            invitationsNumber={invitations.length} />
                            : pageState === "hr" ? <HrTab onClick={handleHrSubmit} onBackClick={() => setPageState("home")}
                                previousCaptures={pastHrs} />
                                : pageState === "bp" ? <BpTab onClick={handleBpSubmit} onBackClick={() => setPageState("home")}
                                    previousCaptures={pastBps} />
                                    : pageState === "speech" ? <SpeechTab onSubmit={handleSpeechSubmit}
                                        onBackClick={() => setPageState("home")} assignmentText={assignmentText}
                                        assignmentId={assignmentId} previousCaptures={pastSpeeches} />
                                        : pageState === "invitations" ? <InvitationsTab onAcceptClick={handleAcceptClick} onRejectClick={handleRejectClick} onBackClick={() => setPageState("home")} invitations={invitations} />
                                            : <AssignmentsTab onAttemptClick={handleAttemptClick}
                                                onBackClick={() => setPageState("home")} assignments={assignments} />}
                </div>
                : <>
                    <button className="landing-page-button" onClick={onBackClick}>Logoped</button>
                    {signedUp ? <SignUp onClick={handleSignUp} onBackClick={handleBackClick} />
                        : <Login onClick={handleLogin} onSignUpClick={() => setSignedUp(true)} role="patient" />}
                </>}
        </>
    )
}

export default App

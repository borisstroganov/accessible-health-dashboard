import { useState } from "react";
import Modal from './Modal';
import './CreateAssignmentTab.css';

type CreateAssignmentProps = {
    onClick: (userEmail: string, assignmentTitle: string, assignmentText: string) => void;
    onBackClick: () => void;
    patients: {
        patient: { userEmail: string, userName: string }
    }[];
}

function CreateAssignmentTab({ onClick, onBackClick, patients }: CreateAssignmentProps) {
    const [assignmentTitle, setAssignmentTitle] = useState<string>("");
    const [assignmentText, setAssignmentText] = useState<string>("");
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const [selectedPatient, setSelectedPatient] = useState<{ userEmail: string, userName: string } | null>(null);

    let handleClick = (assignmentText: string) => {
        onClick(userEmail, assignmentTitle, assignmentText);
    }

    let handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedUserEmail = e.target.value;
        let selectedPatient = patients.find(({ patient }) => patient.userEmail === selectedUserEmail)?.patient;
        setSelectedPatient(selectedPatient || null);
        setUserEmail(selectedUserEmail);
    }

    return (
        <div className="create-tab">
            {toggleModal && <Modal onClick={() => handleClick(assignmentText)} onCancel={() => setToggleModal(false)} headerText="Confirmation"
                bodyText={`Are you sure you want to submit?`} buttonText="Submit" buttonTextColor="limegreen" />}
            <h1>Create Assignment</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="create-wrapper">
                <div className="patient-section">
                    <div className="patient-wrapper">
                        <div className="create-label">Select Patient:</div>
                        {selectedPatient &&
                            <div className="create-text">Name: {selectedPatient.userName}, Email: {selectedPatient.userEmail}</div>
                        }
                        <div className="select">
                            <select name="patients" id="patients" onChange={handlePatientSelect}>
                                <option selected disabled>Patient Name</option>
                                {patients.map(({ patient }) =>
                                    <option value={patient.userEmail} key={patient.userEmail}>{patient.userName}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="create-label">Assignment Title:</div>
                        <input type="text" className="assignment-title" value={assignmentTitle} onChange={(e) =>
                            setAssignmentTitle(e.target.value)} />
                    </div>
                </div>
                <div>
                    <div className="form-wrapper">
                        <div className="create-label">Assignment Text:</div>
                        <div className="input-wrapper">
                            <textarea className="textarea-input" value={assignmentText} onChange={(e) => setAssignmentText(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" className="submit" style={{ fontSize: "120%" }} onClick={() => setToggleModal(true)}
                disabled={!assignmentText || !assignmentTitle || !selectedPatient}>Submit</button>
        </div>
    )
}
export default CreateAssignmentTab
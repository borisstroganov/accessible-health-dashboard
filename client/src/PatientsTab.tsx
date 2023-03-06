import { useState } from 'react'
import Modal from './Modal'
import './PatientsTab.css'

type PatientsTabProps = {
    onSubmit: (userEmail: string) => void;
    onBackClick: () => void;
    onRemove: (userEmail: string) => void;
    patients: {
        patient: {
            userEmail: string;
            userName: string;
            speech: {
                speechId: string;
                wpm: number;
                accuracy: number;
                date: string;
            }
        }
    }[]
}

function PatientsTab({ onSubmit, onBackClick, onRemove, patients }: PatientsTabProps) {
    const [formValue, setFormValue] = useState("");
    const [toggleModal, setToggleModal] = useState<boolean>(false);

    const tableRows = patients.map(({ patient: { userEmail, userName, speech } }) => (
        <tr key={userEmail}>
            <td>{userName}</td>
            <td>{userEmail}</td>
            <td>WPM:{Math.round(speech.wpm)}, Accuracy:{Math.round(speech.accuracy)}</td>
            <td>
                <button className="invitation-accept-btn" onClick={() => onRemove(userEmail)}>Remove</button>
            </td>
        </tr>
    ));

    let handleSubmit = () => {
        setToggleModal(false);
        setFormValue("");
        onSubmit(formValue);
    }

    return (
        <div className="patients-tab">
            {toggleModal && <Modal onClick={handleSubmit} onCancel={() => setToggleModal(false)}
                headerText="Confirmation" bodyText={`Are you sure you want to send an invitation to - ${formValue}?`}
                buttonText="Send" buttonTextColor="limegreen" />}
            <h1>Patients</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="invite-section">
                <div className="landing-page-description">Patient Email:</div>
                <input className="text-input" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button className="" onClick={() => setToggleModal(true)}>Send Invite</button>
            </div>
            {tableRows.length ?
                <>
                    <div className="tbl-header visible">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Patient Email</th>
                                    <th>Latest Capture</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="tbl-content visible">
                        <table>
                            <tbody>{tableRows}</tbody>
                        </table>
                    </div>
                </>
                : <h3>No Patients Assigned.</h3>}
        </div>
    )
}
export default PatientsTab
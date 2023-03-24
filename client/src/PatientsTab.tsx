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
    }[];
    onViewClick: (userEmail: string, userName: string) => void;
}

function PatientsTab({ onSubmit, onBackClick, onRemove, patients, onViewClick }: PatientsTabProps) {
    const [formValue, setFormValue] = useState("");
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [removeEmail, setRemoveEmail] = useState<string>("")

    const tableRows = patients.map(({ patient: { userEmail, userName, speech } }) => (
        <tr key={userEmail}>
            <td>{userName}</td>
            <td>{userEmail}</td>
            <td>WPM:{speech ? Math.round(speech.wpm) : " --"}, Accuracy:{speech ? Math.round(speech.accuracy) : "--"}</td>
            <td>
                <button className="invitation-accept-btn" onClick={() => onViewClick(userEmail, userName)}>View</button>
                <button className="invitation-accept-btn" style={{ color: "orangered" }} onClick={() => {
                    setRemoveEmail(userEmail)
                    setToggleModal(true)
                }}>Remove</button>
            </td>
        </tr>
    ));

    let handleSubmit = () => {
        setFormValue("");
        onSubmit(formValue);
    }

    return (
        <div className="patients-tab">
            {toggleModal && <Modal onClick={() => {
                setRemoveEmail("")
                onRemove(removeEmail)
                setToggleModal(false)
            }} onCancel={() => {
                setRemoveEmail("")
                setToggleModal(false)
            }}
                headerText="Confirmation" bodyText={`Are you sure you want to remove this patient?`}
                buttonText="Remove" buttonTextColor="orangered" />}
            <h1>Patients</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="invite-section">
                <div className="landing-page-description">Patient Email:</div>
                <input className="text-input" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button className="" onClick={handleSubmit}>Send Invite</button>
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
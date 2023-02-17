import { useState } from 'react';
import Modal from './Modal'
import './AccountTab.css'

type AccountTabProps = {
    onClick: (currentPassword: string, newPassword: string, confirmNewPassword: string) => void;
    onBackClick: () => void;
    onRemoveClick: () => void;
    onInvitationsClick: () => void;
    email: string;
    name: string;
    therapistEmail: string;
    therapistName: string;
    invitationsNumber: number;
}

function AccountTab({ onClick, onBackClick, onRemoveClick, onInvitationsClick, email, name,
    therapistEmail, therapistName, invitationsNumber }: AccountTabProps) {
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const lengthRegex = /^.{8,}$/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numbersRegex = /^(?=.*\d)/;
    const [toggleModal, setToggleModal] = useState<boolean>(false);

    let handleClick = () => {
        if (newPassword !== confirmPassword) {
            return
        }
        onClick(currentPassword, newPassword, confirmPassword);
    }

    return (
        <>
            {toggleModal && <Modal onClick={onRemoveClick} onCancel={() => setToggleModal(false)}
                headerText="Confirmation" bodyText={`Are you sure you want to remove your assigned therapist?`}
                buttonText="Remove" buttonTextColor="orangered" />}
            <div className="account-tab">
                <h1>Account</h1>
                <button className="home-button" onClick={onBackClick}>Home</button>
                <div className="account-content">
                    <div className="account-details">
                        <h3>Email: </h3>
                        <div className="account-details-div">{email}</div>
                        <h3>Name: </h3>
                        <div className="account-details-div">{name}</div>
                        <h3>Therapist: </h3>
                        <div className="account-details-div">
                            {therapistEmail ? `${therapistName} ${therapistEmail}` : "Unassigned"}
                        </div>
                        {therapistEmail ?
                            <button type="button" className="account-remove-btn" onClick={() => setToggleModal(true)}>
                                Remove Therapist
                            </button> :
                            <button type="button" className="account-invitations-btn" onClick={onInvitationsClick}>
                                {`Invitations (${invitationsNumber})`}
                            </button>}
                    </div>
                    <div className="account-password">
                        <div className="account-password-title">Change Password</div>
                        <div className="account-password-label">Current Password: </div>
                        <input type="text" className="text-input" value={currentPassword} onChange={(e) =>
                            setCurrentPassword(e.target.value)} />
                        <div className="account-password-label">New Password: </div>
                        <input type="text" className="text-input" value={newPassword} onChange={(e) =>
                            setNewPassword(e.target.value)} />
                        <div className="regex" style={{ "color": lengthRegex.test(newPassword) ? "limegreen" : "" }}>
                            Must be at least 8 characters.
                        </div>
                        <div className="regex" style={{ "color": uppercaseRegex.test(newPassword) ? "limegreen" : "" }}>
                            Must contain an uppercase letter.
                        </div>
                        <div className="regex" style={{ "color": lowercaseRegex.test(newPassword) ? "limegreen" : "" }}>
                            Must contain an lowercase letter.
                        </div>
                        <div className="regex" style={{ "color": numbersRegex.test(newPassword) ? "limegreen" : "" }}>
                            Must contain a number.
                        </div>
                        <div className="account-password-label">Confirm New Password: </div>
                        <input type="text" className="text-input" value={confirmPassword} onChange={(e) =>
                            setConfirmPassword(e.target.value)} />
                        <div className="regex" style={{ "color": newPassword !== "" && newPassword == confirmPassword ? "limegreen" : "" }}>
                            Ensure the passwords match.
                        </div>
                        <button className="account-btn" onClick={handleClick}>Change Password</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AccountTab
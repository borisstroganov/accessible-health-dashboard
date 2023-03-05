import { useState } from 'react';
import './AccountTab.css'

type AccountTabProps = {
    onClick: (currentPassword: string, newPassword: string, confirmNewPassword: string) => void;
    onBackClick: () => void;
    onInvitationsClick: () => void;
    email: string;
    name: string;
}

function AccountTab({ onClick, onBackClick, onInvitationsClick, email, name }: AccountTabProps) {
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const lengthRegex = /^.{8,}$/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numbersRegex = /^(?=.*\d)/;

    let handleClick = () => {
        onClick(currentPassword, newPassword, confirmPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <>
            <div className="account-tab">
                <h1>Account</h1>
                <button className="home-button" onClick={onBackClick}>Home</button>
                <div className="account-content">
                    <div className="account-details">
                        <h3>Name: </h3>
                        <div className="account-details-div">{name}</div>
                        <h3>Email: </h3>
                        <div className="account-details-div">{email}</div>
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
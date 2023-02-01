import { useState } from 'react';
import './AccountTab.css'

type AccountTabProps = {
    onClick: (currentPassword: string, newPassword: string, confirmNewPassword: string) => void;
    onBackClick: () => void;
    email: string;
    name: string;
}

function AccountTab({ onClick, onBackClick, email, name }: AccountTabProps) {
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const lengthRegex = /^.{8,}$/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numbersRegex = /^(?=.*\d)/;

    let handleClick = () => {
        if (newPassword !== confirmPassword) {
            return
        }
        onClick(currentPassword, newPassword, confirmPassword);
    }

    return (
        <div className="account-tab">
            <h1>Account</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="account-content">
                <div className="account-details">
                    <h3>Email: <code>{email}</code></h3>
                    <h3>Name: <code>{name}</code></h3>
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
    )
}
export default AccountTab
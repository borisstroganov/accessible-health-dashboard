import { useState } from 'react'
import './SignUp.css'

type SignUpProps = {
    onClick: (email: string, name: string, password: string) => void;
    onBackClick: () => void;
}

function SignUp({ onClick, onBackClick }: SignUpProps) {
    const [emailValue, setEmailValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    return (
        <div className="SignUp">
            <div className="sign-up-card">
                <div className="sign-up-input-container">
                    <div className="sign-up-input">
                        <label htmlFor="email">Email:</label>
                        <input autoFocus type="email" name="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}></input>
                    </div>
                    <div className="sign-up-input">
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}></input>
                    </div>
                    <div className="sign-up-input">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)}></input>
                    </div>

                    <button className="sign-up-button" onClick={() => onClick(emailValue, nameValue, passwordValue)}>Register</button>
                    <button className="sign-up-back-button" onClick={onBackClick}>Back</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp
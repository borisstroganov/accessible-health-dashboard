import { useState } from 'react'
import './Login.css'

type LoginProps = {
    onClick: (email: string, password: string) => void;
    onSignUpClick: () => void;
    role: string;
}

function Login({ onClick, onSignUpClick, role }: LoginProps) {
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    return (
        <div className="Login">
            <div className="login-title">{role === "patient"? "Login" : "Therapist Login"}</div>
            <div className="login-card">
                <div className="login-input-container">
                    <div className="login-input">
                        <label htmlFor="email">Email:</label>
                        <input autoFocus type="email" name="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
                    </div>
                    <div className="login-input">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} />
                    </div>
                    <button className="login-button" onClick={() => onClick(emailValue, passwordValue)}>Login</button>
                </div>
                <div className="login-sign-up">
                    Don't have an account yet? <a href="#" className="" onClick={onSignUpClick}>Sign-Up</a>
                </div>
            </div>
        </div>
    )
}

export default Login
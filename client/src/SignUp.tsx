import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import './SignUp.css'

type SignUpProps = {
    onClick: (email: string, name: string, password: string) => void;
    onBackClick: () => void;
}

function SignUp({ onClick, onBackClick }: SignUpProps) {
    const [emailValue, setEmailValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [togglePasswordValue, setTogglePasswordValue] = useState<boolean>(true);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    const lengthRegex = /^.{8,}$/;
    const nameLengthRegex = /^.{5,}$/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numbersRegex = /^(?=.*\d)/;

    return (
        <div className="SignUp">
            <div className="sign-up-card">
                <div className="sign-up-input-container">
                    <div className="sign-up-input">
                        <label htmlFor="email">Email:</label>
                        <input autoFocus type="email" name="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
                        <div className="regex" style={{ "color": emailRegex.test(emailValue) ? "limegreen" : "" }}>
                            Please enter a valid email address.
                        </div>
                    </div>
                    <div className="sign-up-input">
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}></input>
                        <div className="regex" style={{ "color": nameLengthRegex.test(nameValue) ? "limegreen" : "" }}>
                            Must be at least 5 characters.
                        </div>
                    </div>
                    <div className="sign-up-input">
                        <label htmlFor="password">Password:</label>
                        <div className="password-input">
                            <input type={togglePasswordValue ? "password" : "text"} className="text-input" value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)} />
                            {togglePasswordValue ? <AiOutlineEye style={{ position: "absolute", right: "10px", top: "5px" }}
                                onClick={() => setTogglePasswordValue(!togglePasswordValue)} />
                                : <AiOutlineEyeInvisible style={{ position: "absolute", right: "10px", top: "5px" }}
                                    onClick={() => setTogglePasswordValue(!togglePasswordValue)} />}
                        </div>
                        <div className="regex" style={{ "color": lengthRegex.test(passwordValue) ? "limegreen" : "" }}>
                            Must be at least 8 characters.
                        </div>
                        <div className="regex" style={{ "color": uppercaseRegex.test(passwordValue) ? "limegreen" : "" }}>
                            Must contain an uppercase letter.
                        </div>
                        <div className="regex" style={{ "color": lowercaseRegex.test(passwordValue) ? "limegreen" : "" }}>
                            Must contain an lowercase letter.
                        </div>
                        <div className="regex" style={{ "color": numbersRegex.test(passwordValue) ? "limegreen" : "" }}>
                            Must contain a number.
                        </div>
                    </div>

                    <button className="sign-up-button" onClick={() => onClick(emailValue, nameValue, passwordValue)}>Register</button>
                    <button className="sign-up-back-button" onClick={onBackClick}>Back</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp
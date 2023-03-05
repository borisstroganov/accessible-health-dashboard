import { useState } from 'react'
import Modal from './Modal'
import './TextInput.css'

type TextInputProps = {
    onClick: (text: string) => void;
    title: string;
    label: string;
}

function TextInput({ onClick, title, label }: TextInputProps) {
    const [formValue, setFormValue] = useState("");
    const [toggleModal, setToggleModal] = useState<boolean>(false);

    return (
        <>
            {toggleModal && <Modal onClick={() => onClick(formValue)} onCancel={() => setToggleModal(false)} headerText="Confirmation"
                bodyText={`Are you sure you want to submit?`} buttonText="Submit" buttonTextColor="limegreen" />}
            <div className="form-wrapper">
                <h3>{title}</h3>
                <div className="input-wrapper">
                    {label}
                    <textarea className="text-input" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                </div>
                <button type="button" className="submit" onClick={() => setToggleModal(true)} disabled={!formValue}>Submit</button>
            </div>
        </>
    )
}
export default TextInput
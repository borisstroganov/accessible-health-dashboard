import { useState } from 'react'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
import './NumberInput.css'

type NumberInputProps = {
    onClick: (val: number) => void;
    title: string;
    label: string;
}

function NumberInput({ onClick, title, label }: NumberInputProps) {
    const [formValue, setFormValue] = useState(0);
    let handleMinus = () => {
        formValue ? setFormValue(formValue - 1) : setFormValue(0);
    }
    let handlePlus = () => {
        !formValue ? setFormValue(1)
            : formValue < 999 ? setFormValue(formValue + 1) : setFormValue(999);
    }

    return (
        <div className="form-wrapper">
            <h3>{title}</h3>
            <div className="input-wrapper">
                <button type="button" className="minus" onClick={handleMinus}><AiOutlineMinusCircle /></button>
                <input type="number" className="number-input" min="0" max="999" value={formValue} onChange={(e) => parseInt(e.target.value) < 1000 || e.target.value == "" ? setFormValue(parseInt(e.target.value)) : ""} />
                <h4>{label}</h4>
                <button type="button" className="plus" onClick={handlePlus}><AiOutlinePlusCircle /></button>
            </div>
            <button type="button" className="submit" onClick={() => onClick(formValue)} disabled={!formValue}>Submit</button>
        </div>
    )
}
export default NumberInput
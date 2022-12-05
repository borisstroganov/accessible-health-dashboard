import { useState } from 'react'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
import './HrTab.css'

type HrTabProps = {
    onClick: (bp: number) => void;
}

function HrTab({ onClick }: HrTabProps) {
    const [formValue, setFormValue] = useState(0);
    let handleMinus = () => {
        formValue ? setFormValue(formValue - 1) : setFormValue(0);
    }
    let handlePlus = () => {
        !formValue ? setFormValue(1)
            : formValue < 999 ? setFormValue(formValue + 1) : setFormValue(999);
    }

    return (
        <div className="hr-tab">
            <h1>Heart Rate Capture</h1>
            <div className="form-wrapper">
                <h3>Please Enter Your Heart Rate</h3>
                <div className="input-wrapper">
                    <button type="button" className="minus" onClick={handleMinus}><AiOutlineMinusCircle /></button>
                    <input type="number" className="number-input" min="0" max="999" value={formValue} onChange={(e) => parseInt(e.target.value) < 1000 || e.target.value == "" ? setFormValue(parseInt(e.target.value)) : ""} />
                    <h4>BPM</h4>
                    <button type="button" className="plus" onClick={handlePlus}><AiOutlinePlusCircle /></button>
                </div>
                <button type="button" className="submit" onClick={() => onClick(formValue)} disabled={!formValue}>Submit</button>
            </div>
        </div>
    )
}
export default HrTab
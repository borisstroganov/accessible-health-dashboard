import { useState } from 'react'
import Modal from './Modal'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
import './DoubleNumberInput.css'

type DoubleNumberInputProps = {
    onClick: (val1: number, val2: number) => void;
    title: string;
    subTitle: string;
    labelOne: string;
    labelTwo: string;
}

function DoubleNumberInput({ onClick, title, subTitle, labelOne, labelTwo }: DoubleNumberInputProps) {
    const [formValueOne, setFormValueOne] = useState(0);
    const [formValueTwo, setFormValueTwo] = useState(0);
    const [toggleModal, setToggleModal] = useState<boolean>(false);

    let handleMinusOne = () => {
        formValueOne ? setFormValueOne(formValueOne - 1) : setFormValueOne(0);
    }
    let handlePlusOne = () => {
        !formValueOne ? setFormValueOne(1)
            : formValueOne < 999 ? setFormValueOne(formValueOne + 1) : setFormValueOne(999);
    }

    let handleMinusTwo = () => {
        formValueTwo ? setFormValueTwo(formValueTwo - 1) : setFormValueTwo(0);
    }
    let handlePlusTwo = () => {
        !formValueTwo ? setFormValueTwo(1)
            : formValueTwo < 999 ? setFormValueTwo(formValueTwo + 1) : setFormValueTwo(999);
    }

    return (
        <>
            {toggleModal && <Modal onClick={() => onClick(formValueOne, formValueTwo)} onCancel={() => setToggleModal(false)}
                headerText="Confirmation" bodyText={`Are you sure you want to submit - ${formValueOne} and ${formValueTwo}?`}
                buttonText="Submit" buttonTextColor="limegreen" />}
            <div className="form-wrapper">
                <h3>{title}</h3>
                <div className="double-input-wrapper">
                    <div className="input-wrapper">
                        <button type="button" className="minus" onClick={handleMinusOne}><AiOutlineMinusCircle /></button>
                        <input type="number" className="number-input" min="0" max="999" value={formValueOne} onChange={(e) =>
                            parseInt(e.target.value) < 1000 || e.target.value == "" ? setFormValueOne(parseInt(e.target.value)) : ""} />
                        <h4>{labelOne}</h4>
                        <button type="button" className="plus" onClick={handlePlusOne}><AiOutlinePlusCircle /></button>
                    </div>
                    <h3>{subTitle}</h3>
                    <div className="input-wrapper">
                        <button type="button" className="minus" onClick={handleMinusTwo}><AiOutlineMinusCircle /></button>
                        <input type="number" className="number-input" min="0" max="999" value={formValueTwo} onChange={(e) =>
                            parseInt(e.target.value) < 1000 || e.target.value == "" ? setFormValueTwo(parseInt(e.target.value)) : ""} />
                        <h4>{labelTwo}</h4>
                        <button type="button" className="plus" onClick={handlePlusTwo}><AiOutlinePlusCircle /></button>
                    </div>
                </div>
                <button type="button" className="submit" onClick={() => setToggleModal(true)}
                    disabled={!formValueOne || !formValueTwo}>Submit</button>
            </div>
        </>
    )
}
export default DoubleNumberInput
import DoubleNumberInput from './DoubleNumberInput'
import './BpTab.css'

type BpTabProps = {
    onClick: (systolicPressure: number, diastolicPressure: number) => void;
}

function BpTab({ onClick }: BpTabProps) {
    let handleClick = (val1: number, val2: number) => {
        onClick(val1, val2);
    }

    return (
        <div className="bp-tab">
            <h1>Blood Pressure Capture</h1>
            <DoubleNumberInput onClick={handleClick} title="Please Enter your Blood Pressure" subTitle="over" labelOne="" labelTwo="" />
        </div>
    )
}
export default BpTab
import NumberInput from './NumberInput'
import './HrTab.css'

type HrTabProps = {
    onClick: (hr: number) => void;
    onBackClick: () => void;
}

function HrTab({ onClick, onBackClick }: HrTabProps) {

    return (
        <div className="hr-tab">
            <h1>Heart Rate Capture</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <NumberInput onClick={onClick} title="Please Enter Your Heart Rate" label="BPM" />
        </div>
    )
}
export default HrTab
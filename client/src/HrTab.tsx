import NumberInput from './NumberInput'
import './HrTab.css'

type HrTabProps = {
    onClick: (hr: number) => void;
}

function HrTab({ onClick }: HrTabProps) {

    return (
        <div className="hr-tab">
            <h1>Heart Rate Capture</h1>
            <NumberInput onClick={onClick} title="Please Enter Your Heart Rate" label="BPM" />
        </div>
    )
}
export default HrTab
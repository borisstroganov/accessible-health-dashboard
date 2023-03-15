import DoubleNumberInput from './DoubleNumberInput';
import LineChart from './LineChart';
import './BpTab.css';

type BpTabProps = {
    onClick: (systolicPressure: number, diastolicPressure: number) => void;
    onBackClick: () => void;
    previousCaptures: {
        bpCapture: {
            systolicPressure: number,
            diastolicPressure: number,
            date: string,
        }
    }[];
}

function BpTab({ onClick, onBackClick, previousCaptures }: BpTabProps) {

    const labels: string[] = [];
    const dataSystolic: number[] = [];
    const dataDiastolic: number[] = [];

    previousCaptures.forEach(({ bpCapture: { date, systolicPressure, diastolicPressure } }) => {
        labels.push(new Date(date).toLocaleDateString());
        dataSystolic.push(systolicPressure);
        dataDiastolic.push(diastolicPressure);
    });

    const datasets = [{
        label: "Systolic Pressure",
        data: dataSystolic,
        backgroundColor: "#7B1FA2",
        borderColor: "#9C27B0",
    }, {
        label: "Diastolic Pressure",
        data: dataDiastolic,
        backgroundColor: "#00B2A9",
        borderColor: "#008C84",
    }]

    let handleClick = (val1: number, val2: number) => {
        onClick(val1, val2);
    }

    return (
        <div className="bp-tab">
            <h1>Blood Pressure Capture</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="hr-content">
                <div style={{ marginRight: "100px" }}>
                    <LineChart chartData={{ labels, datasets }} titleText="Previous Captures" />
                </div>
                <DoubleNumberInput onClick={handleClick} title="Please Enter your Blood Pressure" subTitle="over" labelOne="" labelTwo="" />
            </div>
        </div>
    )
}
export default BpTab
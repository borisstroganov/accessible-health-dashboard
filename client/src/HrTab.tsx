import NumberInput from './NumberInput';
import LineChart from './LineChart';
import './HrTab.css';

type HrTabProps = {
    onClick: (hr: number) => void;
    onBackClick: () => void;
    previousCaptures: {
        hrCapture: {
            hr: number,
            date: string,
        }
    }[];
}

function HrTab({ onClick, onBackClick, previousCaptures }: HrTabProps) {

    const labels: string[] = [];
    const data: number[] = [];

    previousCaptures.forEach(({ hrCapture: { date, hr } }) => {
        labels.push(new Date(date).toLocaleDateString());
        data.push(hr);
    });

    const datasets = [{
        label: "Heart Rate",
        data: data,
        backgroundColor: "#7B1FA2",
        borderColor: "#9C27B0",
    }]

    return (
        <div className="hr-tab">
            <h1>Heart Rate Capture</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="hr-content">
                <div style={{ marginRight: "100px" }}>
                    <LineChart chartData={{ labels, datasets }} titleText="Previous Captures" />
                </div>
                <NumberInput onClick={onClick} title="Please Enter Your Heart Rate" label="BPM" />
            </div>
        </div>
    )
}
export default HrTab
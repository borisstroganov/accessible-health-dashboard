import './PatientTab.css'
import LineChart from './LineChart';

type PatientTabProps = {
    onBackClick: () => void;
    userEmail: string;
    userName: string;
    previousCaptures: {
        speechCapture: {
            wpm: number,
            accuracy: number,
            date: string,
        }
    }[];
}

function PatientTab({ onBackClick, userEmail, userName, previousCaptures }: PatientTabProps) {

    const labels: string[] = [];
    const dataAccuracy: number[] = [];
    const dataWpm: number[] = [];

    previousCaptures.forEach(({ speechCapture: { date, wpm, accuracy } }) => {
        labels.push(new Date(date).toLocaleDateString());
        dataAccuracy.push(accuracy);
        dataWpm.push(wpm);
    });

    const datasets = [{
        label: "Speech Accuracy",
        data: dataAccuracy,
        backgroundColor: "#7B1FA2",
        borderColor: "#9C27B0",
    },
    {
        label: "Speech Rate (WPM)",
        data: dataWpm,
        backgroundColor: "#00B2A9",
        borderColor: "#008C84",
    }]

    return (
        <div className="patient-tab">
            <button className="home-button" onClick={onBackClick}>Home</button>
            <h1>Patient - {userName}</h1>
            <h2>Email: {userEmail}</h2>
            <LineChart chartData={{ labels, datasets }} titleText="Previous Captures" />
        </div>
    )
}
export default PatientTab
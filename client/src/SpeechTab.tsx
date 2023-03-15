import { useState } from 'react';
import TextToSpeech from './TextToSpeech';
import SpeechToText from './SpeechToText';
import LineChart from './LineChart';
import './SpeechTab.css';

type SpeechTabProps = {
    onSubmit: (wpm: number, accuracy: number, type: string, assignmentId: string) => void;
    onBackClick: () => void;
    assignmentText?: string;
    assignmentId?: string;
    previousCaptures: {
        speechCapture: {
            wpm: number,
            accuracy: number,
            date: string,
        }
    }[];
}

function SpeechTab({ onSubmit, onBackClick, assignmentText, assignmentId, previousCaptures }: SpeechTabProps) {
    const [text, setText] = useState(assignmentText || "Once upon a time, there lived a dragon. He lived in a cave deep in the forest \
    and was very proud of his home. One day, the dragon decided to explore the world outside of his cave. He flew high into the sky \
    and saw many wonderful things. He saw mountains, rivers, and forests. He even saw a castle in the distance. \
    He was so excited that he decided to fly closer to the castle. As he got closer, \
    he noticed that the castle was surrounded by a large wall. He flew around the wall and noticed a small opening. \
    He flew through the opening and landed in the castle courtyard.");
    const [transcription, setTranscription] = useState('')

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

    let handleSubmit = (wpm: number, accuracy: number) => {
        onSubmit(wpm, accuracy, assignmentText ? "assignment" : "default", assignmentId ? assignmentId : "")
    }

    return (
        <div className="speech-tab">
            <h1>Speech Capture</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="speech-wrapper">
                <div className="speech-text-wrapper">
                    <h3 className="title">Please Read / Listen to the Following Text:</h3>
                    <div className="speech-text">
                        {text}
                    </div>
                    <TextToSpeech text={text} />
                </div>
                <div className="speech-capture-wrapper">
                    <div>
                        <h3 className="title">Press the Record Button to Start the Capture</h3>
                        <div className="speech-text">
                            {transcription}
                        </div>
                    </div>
                    <SpeechToText onClick={setTranscription} onSubmit={handleSubmit} text={text} />
                </div>
            </div>
            <div style={{ marginTop: "40px" }}>
                <LineChart chartData={{ labels, datasets }} titleText="Previous Captures" />
            </div>
        </div>
    )
}
export default SpeechTab
import './ReviewTab.css'
import TextInput from './TextInput';

type ReviewTabProps = {
    onClick: (assignmentId: string, feedbackText: string) => void;
    onBackClick: () => void;
    assignmentId: string;
    assignmentText: string;
    speech: { wpm: number, accuracy: number };
    userName: string;
    userEmail: string;
}

function ReviewTab({ onClick, onBackClick, assignmentId, assignmentText, speech, userName, userEmail }: ReviewTabProps) {
    let handleClick = (feedbackText: string) => {
        onClick(assignmentId, feedbackText);
    }

    return (
        <div className="review-tab">
            <h1>Review Assignment</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            <div className="review-wrapper">
                <div className="assignment-section">
                    <div>
                        <h3>Patient:</h3>
                        {`${userName} (${userEmail})`}
                    </div>
                    <div>
                        <h3>Assignment Text:</h3>
                        {assignmentText}
                    </div>
                    <h3>Submission: {Math.round(speech.wpm)} WPM, {Math.round(speech.accuracy)} Accuracy</h3>
                </div>
                <TextInput onClick={handleClick} title="Feedback:" label="Please type your feedback here." />
            </div>
        </div>
    )
}
export default ReviewTab
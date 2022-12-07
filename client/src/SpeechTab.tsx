import { useState } from 'react'
import TextToSpeech from './TextToSpeech'
import SpeechToText from './SpeechToText'
import './SpeechTab.css'

type SpeechTabProps = {
    onSubmit: (wpm: number) => void;
}

function SpeechTab({ onSubmit }: SpeechTabProps) {
    const [text, setText] = useState("Once upon a time, there lived a dragon. He lived in a cave deep in the forest and was very proud of his home. \
    One day, the dragon decided to explore the world outside of his cave. He flew high into the sky and \
    saw many wonderful things. He saw mountains, rivers, and forests. He even saw a castle in the distance. \
    He was so excited that he decided to fly closer to the castle. As he got closer, \
    he noticed that the castle was surrounded by a large wall. He flew around the wall and noticed a small opening. \
    He flew through the opening and landed in the castle courtyard.");
    const [transcription, setTranscription] = useState('')

    return (
        <div className="speech-tab">
            <h1>Speech Capture</h1>
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
                    <SpeechToText onClick={setTranscription} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    )
}
export default SpeechTab
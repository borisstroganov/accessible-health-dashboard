import { useState } from 'react'
import './SpeechToText.css'

type SpeechToTextProps = {
    onClick: (transcription: string) => void;
    onSubmit: (wpm: number) => void;
}

function SpeechToText({ onClick, onSubmit }: SpeechToTextProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [fullText, setFullText] = useState('')
    const [startTime, setStartTime] = useState(0)
    const [time, setTime] = useState(0)

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.continuos = true;
    recognition.interimResults = true;
    recognition.lang = 'en-UK';

    recognition.addEventListener('audioend', () => {
        console.log('Audio capturing ended');
    });


    const handleListen = () => {
        setIsListening(true);
        setStartTime(performance.now())

        recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
            const transcript = event.results[0][0].transcript;
            onClick(transcript);
            setTranscription(transcript)
        }
        recognition.onend = () => {
            recognition.start();
        }
        recognition.start();
    }

    const stopListen = () => {
        setIsListening(false);
        recognition.stop();
        recognition.onend = () => { };
        let elapsedTime = performance.now() - startTime;
        setTime(elapsedTime / 1000 / 60);
    }

    return (<div>
        {isListening ? (
            <button className="stt-button" onClick={stopListen}>
                Stop
            </button>
        ) : (
            <button className="stt-button" onClick={handleListen}>
                Record
            </button>
        )}
        <button className="stt-button" onClick={() => { onSubmit(transcription.split(" ").length / time) }} disabled={!time}>
            Submit
        </button>
    </div>
    )
}
export default SpeechToText
import { useEffect, useState } from 'react'
import Modal from './Modal'
import './SpeechToText.css'

type SpeechToTextProps = {
    onClick: (transcription: string) => void;
    onSubmit: (wpm: number, accuracy: number) => void;
    text: string;
}

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition();
recognition.continuos = true;
recognition.interimResults = true;
recognition.lang = 'en-UK';

function SpeechToText({ onClick, onSubmit, text }: SpeechToTextProps) {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [startTime, setStartTime] = useState(0)
    const [time, setTime] = useState(0)
    const [speech, setSpeech] = useState("")
    var fullSpeech = ""
    var currentSpeech = ""

    useEffect(() => {
        handleListen()
    }, [isListening])


    const handleListen = () => {
        !startTime ? setStartTime(performance.now()) : ""

        if (isListening) {
            recognition.start()
            recognition.onend = () => {
                fullSpeech += currentSpeech
                recognition.start()
            }
        } else {
            recognition.stop()
            recognition.onend = () => { }
            setStartTime(0)
        }

        recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
            const script = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')

            onClick(fullSpeech + " " + script)
            setSpeech(fullSpeech + " " + script)
            currentSpeech = script
            recognition.onerror = (event: { error: any; }) => {
                console.log(event.error)
            }
        }

    }

    const stopListen = () => {
        setIsListening(false);
        let elapsedTime = performance.now() - startTime;
        setTime(elapsedTime / 1000 / 60);
    }

    const checkAccuracy = () => {
        const punctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;

        let speechWords = speech.replace(punctuation, '').split(" ");
        let textWords = text.replace(punctuation, '').split(" ");
        let accuracy = 0;

        speechWords.forEach(word => {
            if (textWords.includes(word)) {
                accuracy++;
            }
        });
        return parseFloat(((accuracy / speechWords.length) * 100).toFixed(1));
    }

    return (
        <>
            {toggleModal && <Modal onClick={() => onSubmit(speech.split(" ").length / time, checkAccuracy())}
                onCancel={() => setToggleModal(false)} headerText="Confirmation" bodyText={`Are you sure you want to submit?`}
                buttonText="Submit" buttonTextColor="limegreen" />}
            <div>
                {isListening ? (
                    <button className="stt-button" onClick={stopListen}>
                        Stop
                    </button>
                ) : (
                    <button className="stt-button" onClick={() => setIsListening(true)}>
                        Record
                    </button>
                )}
                <button className="stt-button" onClick={() => { setToggleModal(true) }} disabled={!time}>
                    Submit
                </button>
            </div>
        </>
    )
}
export default SpeechToText
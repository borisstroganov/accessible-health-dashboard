import { useState } from 'react'
import { GiSpeaker, GiPauseButton, GiPlayButton, GiCancel } from "react-icons/gi"
import "./TextToSpeech.css";

type TextToSpeechProps = {
    text: string;
}

function TextToSpeech({ text }: TextToSpeechProps) {
    const [playing, setPlaying] = useState(false);
    const [resume, setResume] = useState(false);

    if (window['speechSynthesis'] === undefined) {
        return null;
    }

    const msg = new SpeechSynthesisUtterance()
    const speech = (msg: SpeechSynthesisUtterance) => {
        msg.text = text;
        window.speechSynthesis.speaking ? setResume(false) : ""
        window.speechSynthesis.speaking ? window.speechSynthesis.cancel()
            : window.speechSynthesis.speak(msg)
        setPlaying(!playing);
    }
    const pause = () => {
        window.speechSynthesis.paused ? window.speechSynthesis.resume()
            : window.speechSynthesis.speaking ? window.speechSynthesis.pause() : ""
        setResume(!resume);
    }
    msg.onend = () => {
        setPlaying(false);
    };

    return (<div>
        <button className="tts-button" onClick={() => speech(msg)}>{playing ? <GiCancel /> : <GiSpeaker />}</button>
        <button className="tts-button" onClick={pause} disabled={!playing}>{resume ? <GiPlayButton /> : <GiPauseButton />}</button>
    </div>
    )
}
export default TextToSpeech;
import { useState } from 'react'
// import './PatientsTab.css'

type PatientsTabProps = {
    onSubmit: () => void;
    onBackClick: () => void;
}

function PatientsTab({ onSubmit, onBackClick }: PatientsTabProps) {
    const [text, setText] = useState("");
    const [transcription, setTranscription] = useState('')

    let handleSubmit = () => {
        // onSubmit()
    }

    return (
        <div className="speech-tab">
            <h1>Patients</h1>
            <button className="home-button" onClick={onBackClick}>Home</button>
            
        </div>
    )
}
export default PatientsTab
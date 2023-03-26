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

type Difficulty = "easy" | "medium" | "hard";

function SpeechTab({ onSubmit, onBackClick, assignmentText, assignmentId, previousCaptures }: SpeechTabProps) {

    const [text, setText] = useState(assignmentText || "After years of hard work, John finally achieved his dream of becoming a successful writer. He published his first book and it was a hit, leading to more opportunities and recognition.")
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    function generateSpeechPrompt(difficulty: Difficulty): void {
        if (difficulty === "easy") {
            const easyPrompts = [
                "The sun was shining and the birds were chirping as Emily walked to the park.",
                "Tommy loved to play football with his friends at recess. He was the best player on the team.",
                "Samantha's favorite food was pizza. She could eat it every day for every meal if she could.",
                "The cat slept by the window while the rain poured outside. It was cozy inside the house.",
                "Jenny loved to read books about magic and adventure. She wished she could go on her own magical journey."
            ];
            setText(easyPrompts[Math.floor(Math.random() * easyPrompts.length)]);
            setDifficulty("easy")
        } else if (difficulty === "medium") {
            const mediumPrompts = [
                "After years of hard work, John finally achieved his dream of becoming a successful writer. He published his first book and it was a hit, leading to more opportunities and recognition.",
                "Mary had always loved cooking, and after taking a few classes and experimenting in the kitchen, she decided to start her own restaurant. It was tough at first, but soon her food became known for its unique flavors and creative twists.",
                "Growing up, Michael was always interested in science and technology. He pursued a degree in engineering and eventually landed a job at a top technology company, where he worked on developing exciting products that would change the world.",
                "Sarah was a talented musician who had played the violin since she was a child. She joined an orchestra and toured the world, performing in some of the most beautiful concert halls and earning critical acclaim.",
                "As a child, David had a fascination with airplanes and dreamed of one day becoming a pilot. He worked hard, got his pilot's license, and eventually became a commercial airline pilot, flying planes all over the world."
            ];
            setText(mediumPrompts[Math.floor(Math.random() * mediumPrompts.length)]);
            setDifficulty("medium")
        } else {
            const hardPrompts = [
                "Once upon a time, there was a little girl named Rosemary. One day, she wandered into the forest and came across a house where three bears lived. She tried their porridge, chairs, and beds, and eventually fell asleep in the baby bear's bed. When the bears returned home and found her, she was so scared that she ran away as fast as she could!",
                "In the heart of Africa, there is a vast savannah where lions, elephants, and giraffes roam free. The grass is tall and the sun is hot, but life thrives here. One day, a group of tourists came to explore the savannah and witness the incredible wildlife. They saw a lioness hunting, a herd of elephants bathing in a river, and a giraffe reaching for leaves on a tall tree.",
                "After months of preparation, the day had finally arrived for Emily's expedition to the uncharted island. As she and her crew landed on the shore, they were greeted by a dense jungle and an eerie silence. They discovered ancient ruins and strange artifacts unlike anything they had ever seen before. But as night fell, they realized they were not alone on the island, and something was watching them from the shadows.",
                "Deep in the ocean, there are creatures that we have never seen before. There is a fish that has a light on its head to attract prey, the octopus can change colors and shapes to blend in with its surroundings, and the jellyfish can glow in the dark. Scientists study these creatures to learn more about our planet and the amazing life that exists here.",
                "In the ancient city of Athens, there was a temple. It was dedicated to the goddess Athena and was considered one of the most beautiful buildings in the world. It had massive columns, beautiful sculptures, and a stunning view of the city. People would come from all over Greece to see it and pay their respects to the goddess."
            ];
            setText(hardPrompts[Math.floor(Math.random() * hardPrompts.length)]);
            setDifficulty("hard")
        }
    }

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
            {!assignmentText && <div className="difficulty-buttons-wrapper">
                <button className="difficulty-button" onClick={() => generateSpeechPrompt("easy")}
                    disabled={difficulty === "easy"}>Easy</button>
                <button className="difficulty-button" onClick={() => generateSpeechPrompt("medium")}
                    disabled={difficulty === "medium"}>Medium</button>
                <button className="difficulty-button" onClick={() => generateSpeechPrompt("hard")}
                    disabled={difficulty === "hard"}>Hard</button>
            </div>}
            <div style={{ marginTop: "40px" }}>
                <LineChart chartData={{ labels, datasets }} titleText="Previous Captures" />
            </div>
        </div>
    )
}
export default SpeechTab
import { useState } from 'react'
import { ImDroplet } from 'react-icons/im'
import { FaHeartbeat } from 'react-icons/fa'
import { BsSoundwave } from 'react-icons/bs'
import './App.css'


function App() {
  const [heartRate, setHeartRate] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [speechRate, setSpeechRate] = useState(null);
  const [pageState, setPageState] = useState("home");

  return (
    <div className="App">
      <div className="navbar">
        <div className="dashboard-title">
          <h3 onClick={() => setPageState("home")}>Home</h3>
        </div>
        <ul>
          <li>
            <a onClick={() => setPageState("hr")}>HR <FaHeartbeat /></a>
          </li>
          <li>
            <a onClick={() => setPageState("bp")}>BP <ImDroplet /></a>
          </li>
          <li>
            <a onClick={() => setPageState("speech")}>Speech <BsSoundwave /></a>
          </li>
        </ul>
      </div>
      <h1>Accessible Health Dashboard</h1>
      <h2>Current State: {pageState}</h2>
      <div className="dashboard">
        <div className="dashboard-card">
          <h2>Heart Rate <FaHeartbeat /></h2>
          <h3>{heartRate ? heartRate : "-"} BPM</h3>
        </div>
        <div className="dashboard-card">
          <h2>Blood Pressure <ImDroplet /></h2>
          <h3>{bloodPressure ? bloodPressure : "-"} mmHg</h3>
        </div>
        <div className="dashboard-card">
          <h2>Speech Rate <BsSoundwave /></h2>
          <h3>{speechRate ? speechRate : "-"} WPM</h3>
        </div>
      </div>
    </div>
  )
}

export default App

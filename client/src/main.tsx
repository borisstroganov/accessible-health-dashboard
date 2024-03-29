import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import TherapistApp from './TherapistApp'
import LandingPage from './LandingPage'
import './index.css'

function Root() {
  const [role, setRole] = useState<string>("");

  return (
    <React.StrictMode>
      {role === "" ? <LandingPage onRoleClick={setRole} /> : role === "patient" ? <App onBackClick={() => setRole("")} />
        : <TherapistApp onBackClick={() => setRole("")} />}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);


import './LandingPage.css'

type LandingPageProps = {
    onRoleClick: (role: string) => void;
}

function LandingPage({ onRoleClick }: LandingPageProps) {

    return (
        <div className="landing-page">
            <div className="landing-page-title">Logoped</div>
            <div className="landing-page-content">
                <div className="information-section">
                    <div className="landing-page-subtitle">Online Speech Therapy Platform</div>
                    <div className="landing-page-description">
                        Logoped aims to provide a platform for people to complete speech therapy remotely from the
                        comfort of their homes. Practice by yourself or connect with your Speech and Language Therapist
                        and complete their assignments online.
                    </div>
                </div>
                <div className="login-section">
                    <div className="landing-page-subtitle">Choose your role to continue to the platform.</div>
                    <button className="login-selection" onClick={() => onRoleClick("patient")}>I am a patient.</button>
                    <div className="landing-page-description">Or</div>
                    <button className="login-selection" onClick={() => onRoleClick("therapist")}>I am a therapist.</button>
                </div>
            </div>
        </div>
    )
}
export default LandingPage
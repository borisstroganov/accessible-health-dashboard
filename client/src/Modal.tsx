import './Modal.css'

type ModalProps = {
    onClick: () => void;
    onCancel: () => void;
    headerText: string;
    bodyText: string;
    buttonText: string;
    buttonTextColor: string;
}

function Modal({ onClick, onCancel, headerText, bodyText, buttonText, buttonTextColor }: ModalProps) {

    return (
        <div className="modal">
            <div className="modal-content">
                {headerText && <div className="modal-header">
                    {headerText}
                </div>}
                <div className="modal-body">
                    {bodyText}
                </div>
                <button className="modal-button" onClick={onClick} style={{color: buttonTextColor}}>{buttonText}</button>
                <button className="modal-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default Modal
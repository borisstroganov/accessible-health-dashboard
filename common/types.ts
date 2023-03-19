export type ServerError = {
    message: string;
}

export type SignUpResponse = {
    email: string;
    name: string;
}

export type SignUpRequest = {
    email: string;
    name: string;
    password: string;
}

export type LoginResponse = {
    email: string;
    name: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type User = {
    id: string,
    email: string,
    name: string,
    password: string,
    therapistEmail: string
}

export type CaptureHrResponse = {
    email: string,
    hr: number,
    date: string,
}

export type CaptureHrRequest = {
    hr: number,
}

export type CaptureBpResponse = {
    email: string,
    systolicPressure: number,
    diastolicPressure: number,
    date: string,
}

export type CaptureBpRequest = {
    systolicPressure: number,
    diastolicPressure: number,
}

export type CaptureSpeechResponse = {
    email: string,
    wpm: number,
    accuracy: number,
    date: string,
}

export type CaptureSpeechRequest = {
    wpm: number,
    accuracy: number,
}

export type LatestBpResponse = {
    email: string,
    systolicPressure: number,
    diastolicPressure: number,
    date: string,
}

export type LatestHrResponse = {
    email: string,
    hr: number,
    date: string,
}

export type LatestSpeechResponse = {
    speechId: string,
    wpm: number,
    accuracy: number,
    date: string,
}

export type RetrieveHrsResponse = {
    hrs: { hrCapture: { hr: number, date: string, } }[]
}

export type RetrieveBpsResponse = {
    bps: { bpCapture: { systolicPressure: number, diastolicPressure: number, date: string, } }[]
}

export type RetrieveSpeechesResponse = {
    speeches: { speechCapture: { wpm: number, accuracy: number, date: string, } }[]
}

export type TherapistRetrieveSpeechesRequest = {
    userEmail: string,
}

export type TherapistRetrieveSpeechesResponse = {
    speeches: { speechCapture: { wpm: number, accuracy: number, date: string, } }[]
}

export type ChangePasswordRequest = {
    password: string,
    newPassword: string,
    confirmPassword: string,
}

export type ChangePasswordResponse = {
    email: string,
}

export type TherapistSignUpResponse = {
    email: string;
    name: string;
}

export type TherapistSignUpRequest = {
    email: string;
    name: string;
    password: string;
}

export type TherapistLoginResponse = {
    email: string;
    name: string;
}

export type TherapistLoginRequest = {
    email: string;
    password: string;
}

export type AddTherapistRequest = {
    therapistEmail: string,
}

export type AddTherapistResponse = {
    email: string,
    therapistEmail: string,
}

export type RemoveTherapistResponse = {
    email: string,
}

export type RemovePatientRequest = {
    userEmail: string,
}

export type RemovePatientResponse = {
    email: string,
}

export type TherapistChangePasswordRequest = {
    password: string,
    newPassword: string,
    confirmPassword: string,
}

export type TherapistChangePasswordResponse = {
    email: string,
}

export type RetrieveUserTherapistResponse = {
    therapistEmail: string,
    therapistName: string
}

export type GetTherapistPatientsResponse = {
    patients: {
        patient: {
            userEmail: string, userName: string, speech: {
                speechId: string,
                wpm: number,
                accuracy: number,
                date: string,
            }
        }
    }[]
}

export type SendInvitationRequest = {
    userEmail: string
}

export type SendInvitationResponse = {
    userEmail: string,
    therapistEmail: string
}

export type AcceptInvitationRequest = {
    therapistEmail: string
}

export type AcceptInvitationResponse = {
    therapistEmail: string,
    therapistName: string
}

export type RejectInvitationRequest = {
    therapistEmail: string
}

export type RejectInvitationResponse = {
    therapistEmail: string,
}

export type GetUserInvitationsResponse = {
    therapists: { therapist: { therapistEmail: string, therapistName: string } }[],
}

export type GetTherapistInvitationsResponse = {
    users: { user: { userEmail: string, userName: string } }[],
}

export type SendAssignmentRequest = {
    userEmail: string,
    assignmentTitle: string,
    assignmentText: string
}

export type SendAssignmentResponse = {
    userEmail: string,
    therapistEmail: string,
    assignmentTitle: string,
    assignmentText: string
}

export type GetUserAssignmentsResponse = {
    assignments: {
        assignment: {
            assignmentId: string, therapistName: string, therapistEmail: string, assignmentTitle: string, assignmentText: string,
            status: string, speech: {
                wpm: number,
                accuracy: number
            },
            feedbackText: string,
        }
    }[],
}

export type GetTherapistAssignmentsResponse = {
    assignments: {
        assignment: {
            assignmentId: string, userName: string, userEmail: string, assignmentTitle: string, assignmentText: string,
            status: string, speech: {
                wpm: number,
                accuracy: number
            },
            feedbackText: string,
        }
    }[],
}

export type SubmitAssignmentRequest = {
    assignmentId: string,
    wpm: number,
    accuracy: number
}

export type SubmitAssignmentResponse = {
    email: string,
    assignmentId: string,
    wpm: number,
    accuracy: number,
    date: string,
}

export type ReviewAssignmentRequest = {
    assignmentId: string,
    feedbackText: string,
}

export type ReviewAssignmentResponse = {
    assignmentId: string,
    feedbackText: string,
    status: string,
}

export type DeleteAssignmentRequest = {
    assignmentId: string,
}

export type DeleteAssignmentResponse = {
    email: string,
}
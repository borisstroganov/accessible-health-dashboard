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
    email: string,
    wpm: number,
    accuracy: number,
    date: string,
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
            assignmentId: string, therapistName: string, therapistEmail: string, assignmentTitle: string, assignmentText: string
        }
    }[],
}
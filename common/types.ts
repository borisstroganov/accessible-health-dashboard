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
    password: string
}

export type CaptureHrResponse = {
    email: string,
    hr: number,
    date: string,
}

export type CaptureHrRequest = {
    email: string,
    hr: number,
}

export type CaptureBpResponse = {
    email: string,
    systolicPressure: number,
    diastolicPressure: number,
    date: string,
}

export type CaptureBpRequest = {
    email: string,
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
    email: string,
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
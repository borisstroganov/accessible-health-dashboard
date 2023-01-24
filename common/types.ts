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

export type captureHrResponse = {
    email: string,
    hr: number,
    date: string,
}

export type captureHrRequest = {
    email: string,
    hr: number,
}

export type captureBpResponse = {
    email: string,
    systolicPressure: number,
    diastolicPressure: number,
    date: string,
}

export type captureBpRequest = {
    email: string,
    systolicPressure: number,
    diastolicPressure: number,
}

export type captureSpeechResponse = {
    email: string,
    wpm: number,
    accuracy: number,
    date: string,
}

export type captureSpeechRequest = {
    email: string,
    wpm: number,
    accuracy: number,
}
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
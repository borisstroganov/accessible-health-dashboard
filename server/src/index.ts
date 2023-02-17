import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import cors from "cors";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import bAuth from "basic-auth";
import crypto from "crypto";

// import { query, exec, createTables } from './db';

import {
    SignUpRequest, SignUpResponse, LoginRequest, LoginResponse, CaptureHrRequest, CaptureHrResponse, CaptureBpRequest,
    CaptureBpResponse, CaptureSpeechResponse, CaptureSpeechRequest, ChangePasswordRequest, ChangePasswordResponse, AddTherapistRequest,
    AddTherapistResponse, TherapistSignUpRequest, TherapistSignUpResponse, TherapistLoginRequest, TherapistLoginResponse,
    TherapistChangePasswordRequest, TherapistChangePasswordResponse, SendInvitationRequest, SendInvitationResponse,
    AcceptInvitationRequest, AcceptInvitationResponse, RejectInvitationRequest, RejectInvitationResponse, RemoveTherapistResponse,
    GetUserInvitationsResponse, GetTherapistInvitationsResponse, User
} from "../../common/types";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

const app = express();
app.use(bodyParser.json());
app.use(cors());

declare global {
    namespace Express {
        interface Request {
            auth: { email: string }
        }
    }
}

function hash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const result = bAuth(req);
    if (!result) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const { name: email, pass } = result;
    if (!loginUser(email, pass) && !loginTherapist(email, pass)) {
        return res.status(403).json({
            message: "Invalid credentials."
        });
    }

    req.auth = {
        email: email,
    };
    next();
}

const db = new Database("./src/db/data.db", { verbose: console.log });
db.pragma("foreign_keys = ON");

function query<T>(sql: string, params: Array<any>): Array<T> {
    return db.prepare(sql).all(params);
}
function exec(sql: string, params: Array<any>): void {
    db.prepare(sql).run(params);
}

function createTables(): void {
    const schema = fs.readFileSync("./src/db/schema.sql", {
        encoding: 'utf8',
        flag: 'r',
    });
    db.exec(schema);
}

function createUser(email: string, name: string, password: string): void {
    exec(`
        INSERT INTO user (id, email, name, password)
        VALUES (?, ?, ?, ?);
    `, [uuidv4(), email, name, hash(password)]);
}

function loginUser(email: string, password: string): boolean {
    const user = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ? AND password = ?;
    `, [email, hash(password)]);

    return user.length > 0;
}

function checkUserExists(email: string): boolean {
    const user = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ?;
    `, [email]);

    return user.length > 0;
}

function captureHr(email: string, hr: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO heartRate (hrId, hr, date, userEmail)
        VALUES (?, ?, DATETIME(?), ?);
    `, [uuidv4(), hr, currentDate, email]);
    return currentDate;
}

function captureBp(email: string, systolicPressure: number, diastolicPressure: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO bloodPressure (bpId, systolicPressure, diastolicPressure, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), systolicPressure, diastolicPressure, currentDate, email]);
    return currentDate;
}

function captureSpeech(email: string, wpm: number, accuracy: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO speechRate (speechId, wpm, accuracy, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), wpm, accuracy, currentDate, email]);
    return currentDate;
}

function getUserName(email: string): string {
    const user = query<User>(`
        SELECT name
        FROM user
        WHERE email = ?;
    `, [email]);

    return user[0].name;
}

function retrieveBp(email: string): { systolicPressure: number; diastolicPressure: number; date: string } {
    const bps = query<{ systolicPressure: number; diastolicPressure: number; date: string }>(`
        SELECT systolicPressure, diastolicPressure, date
        FROM bloodPressure
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return bps[0];
}

function retrieveHr(email: string): { hr: number; date: string } {
    const hrs = query<{ hr: number; date: string }>(`
        SELECT hr, date
        FROM heartRate
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return hrs[0];
}

function retrieveSpeech(email: string): { hr: number; date: string } {
    const speeches = query<{ hr: number; date: string }>(`
        SELECT wpm, accuracy, date
        FROM speechRate
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return speeches[0];
}

function changeUserPassword(email: string, password: string): void {
    exec(`
    UPDATE user 
    SET password = ? 
    WHERE email = ?;
    `, [hash(password), email]);
}

function addTherapist(email: string, therapistEmail: string): void {
    exec(`
    UPDATE user 
    SET therapistEmail = ? 
    WHERE email = ?;
    `, [therapistEmail, email]);
}

function removeTherapist(email: string): void {
    exec(`
    UPDATE user 
    SET therapistEmail = NULL 
    WHERE email = ?;
    `, [email]);
}

function getUserTherapistEmail(email: string): string {
    const user = query<User>(`
        SELECT therapistEmail
        FROM user
        WHERE email = ?;
    `, [email]);

    return user[0].therapistEmail;
}

function createTherapist(email: string, name: string, password: string): void {
    exec(`
        INSERT INTO therapist (id, email, name, password)
        VALUES (?, ?, ?, ?);
    `, [uuidv4(), email, name, hash(password)]);
}

function loginTherapist(email: string, password: string): boolean {
    const user = query<User>(`
        SELECT *
        FROM therapist
        WHERE email = ? AND password = ?;
    `, [email, hash(password)]);

    return user.length > 0;
}

function checkTherapistExists(email: string): boolean {
    const therapist = query<User>(`
        SELECT *
        FROM therapist
        WHERE email = ?;
    `, [email]);

    return therapist.length > 0;
}

function changeTherapistPassword(email: string, password: string): void {
    exec(`
    UPDATE therapist 
    SET password = ? 
    WHERE email = ?;
    `, [hash(password), email]);
}

function getTherapistName(email: string): string {
    const therapist = query<User>(`
        SELECT name
        FROM therapist
        WHERE email = ?;
    `, [email]);

    return therapist[0].name;
}

function createInvitation(userEmail: string, therapistEmail: string): void {
    exec(`
        INSERT INTO invitation (userEmail, therapistEmail)
        VALUES (?, ?);
    `, [userEmail, therapistEmail]);
}

function getUserInvitations(userEmail: string): { therapistEmail: string }[] {
    const userInvitations = query<{ therapistEmail: string; }>(`
        SELECT therapistEmail
        FROM invitation
        WHERE userEmail = ?
    `, [userEmail]);
    return userInvitations;
}

function getTherapistInvitations(therapistEmail: string): { userEmail: string }[] {
    const therapistInvitations = query<{ userEmail: string; }>(`
        SELECT userEmail
        FROM invitation
        WHERE therapistEmail = ?
    `, [therapistEmail]);
    return therapistInvitations;
}

export function checkInvitation(userEmail: string, therapistEmail: string): boolean {
    const invitations = query<{ userEmail: string, therapistEmail: string }>(`
        SELECT *
        FROM invitation
        WHERE userEmail = ? AND therapistEmail = ?
    `, [userEmail, therapistEmail])
    return invitations.length > 0;
}

function deleteInvitation(userEmail: string, therapistEmail: string): void {
    exec(`
        DELETE FROM invitation
        WHERE userEmail = ? AND therapistEmail = ?
    `, [userEmail, therapistEmail]);
}

app.post("/signup", (req: Request, res: Response) => {
    const schema: JSONSchemaType<SignUpRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string", minLength: 5 },
            password: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
        },
        required: ["email", "name", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)

    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { email, name, password } = req.body as SignUpRequest;

    if (checkUserExists(email) || checkTherapistExists(email)) {
        return res.status(400).json({
            message: "Account with this email already exists."
        })
    }

    createUser(email, name, password);
    res.json({
        email: email,
        name: name
    } as SignUpResponse)
});

app.post("/changePassword", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<ChangePasswordRequest> = {
        type: "object",
        properties: {
            password: { type: "string" },
            newPassword: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
            confirmPassword: { type: "string" },
        },
        required: ["password", "newPassword", "confirmPassword"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { password, newPassword, confirmPassword } = req.body as ChangePasswordRequest;

    if (!loginUser(req.auth.email, password)) {
        return res.status(400).json({
            message: "Invalid password."
        })
    } else if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New passwords do not match."
        })
    } else if (newPassword === password) {
        return res.status(400).json({
            message: "New password cannot be the same as the old password."
        })
    } else {
        changeUserPassword(req.auth.email, newPassword);
        res.json({
            email: req.auth.email
        } as ChangePasswordResponse)
    }
});

app.post("/login", (req: Request, res: Response) => {
    const schema: JSONSchemaType<LoginRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
        },
        required: ["email", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        email,
        password,
    } = req.body as LoginRequest;
    if (loginUser(email, password)) {

        res.json({
            email: email,
            name: getUserName(email)
        } as LoginResponse)
    } else {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    };
});

app.post("/captureHr", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureHrRequest> = {
        type: "object",
        properties: {
            hr: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["hr"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        hr,
    } = req.body as CaptureHrRequest;
    let date = captureHr(req.auth.email, hr);
    res.json({
        email: req.auth.email,
        hr: hr,
        date: date
    } as CaptureHrResponse)
});

app.post("/captureBp", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureBpRequest> = {
        type: "object",
        properties: {
            systolicPressure: { type: "number", minimum: 0, maximum: 999 },
            diastolicPressure: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["systolicPressure", "diastolicPressure"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        systolicPressure,
        diastolicPressure,
    } = req.body as CaptureBpRequest;
    let date = captureBp(req.auth.email, systolicPressure, diastolicPressure);
    res.json({
        email: req.auth.email,
        systolicPressure: systolicPressure,
        diastolicPressure: diastolicPressure,
        date: date
    } as CaptureBpResponse)
});

app.post("/captureSpeech", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureSpeechRequest> = {
        type: "object",
        properties: {
            wpm: { type: "number", minimum: 0, maximum: 999 },
            accuracy: { type: "number", minimum: 0, maximum: 100 },
        },
        required: ["wpm", "accuracy"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        wpm,
        accuracy,
    } = req.body as CaptureSpeechRequest;
    let date = captureSpeech(req.auth.email, wpm, accuracy);
    res.json({
        email: req.auth.email,
        wpm: wpm,
        accuracy: accuracy,
        date: date
    } as CaptureSpeechResponse)
});

app.get("/latestBp", isLoggedIn, (req: Request, res: Response) => {
    const bp = retrieveBp(req.auth.email as string);
    if (bp) {
        res.json(bp);
    } else {
        res.json({
            systolicPressure: 0,
            diastolicPressure: 0,
            date: ""
        });
    }
});

app.get("/latestHr", isLoggedIn, (req: Request, res: Response) => {
    const hr = retrieveHr(req.auth.email as string);
    if (hr) {
        res.json(hr);
    } else {
        res.json({
            hr: 0,
            date: ""
        });
    }
});

app.get("/latestSpeech", isLoggedIn, (req: Request, res: Response) => {
    const speech = retrieveSpeech(req.auth.email as string);
    if (speech) {
        res.json(speech);
    } else {
        res.json({
            wpm: 0,
            accuracy: 0,
            date: ""
        });
    }
});

app.post("/therapistSignup", (req: Request, res: Response) => {
    const schema: JSONSchemaType<TherapistSignUpRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string", minLength: 5 },
            password: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
        },
        required: ["email", "name", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)

    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { email, name, password } = req.body as TherapistSignUpRequest;

    if (checkTherapistExists(email) || checkUserExists(email)) {
        return res.status(400).json({
            message: "Account with this email already exists."
        })
    }

    createTherapist(email, name, password);
    res.json({
        email: email,
        name: name
    } as TherapistSignUpResponse)
})

app.post("/therapistLogin", (req: Request, res: Response) => {
    const schema: JSONSchemaType<TherapistLoginRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
        },
        required: ["email", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        email,
        password,
    } = req.body as TherapistLoginRequest;
    if (loginTherapist(email, password)) {

        res.json({
            email: email,
            name: getTherapistName(email)
        } as TherapistLoginResponse)
    } else {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    };
});

app.post("/therapistChangePassword", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<TherapistChangePasswordRequest> = {
        type: "object",
        properties: {
            password: { type: "string" },
            newPassword: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
            confirmPassword: { type: "string" },
        },
        required: ["password", "newPassword", "confirmPassword"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { password, newPassword, confirmPassword } = req.body as TherapistChangePasswordRequest;

    if (!loginTherapist(req.auth.email, password)) {
        return res.status(400).json({
            message: "Invalid password."
        })
    } else if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New passwords do not match."
        })
    } else if (newPassword === password) {
        return res.status(400).json({
            message: "New password cannot be the same as the old password."
        })
    } else {
        changeTherapistPassword(req.auth.email, newPassword);
        res.json({
            email: req.auth.email
        } as TherapistChangePasswordResponse)
    }
});

app.post("/addTherapist", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<AddTherapistRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as AddTherapistRequest;

    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (getUserTherapistEmail(req.auth.email) !== null) {
        return res.status(400).json({
            message: "Therapist already assigned."
        })
    } else {
        addTherapist(req.auth.email, therapistEmail);
        res.json({
            email: req.auth.email,
            therapistEmail: therapistEmail,
        } as AddTherapistResponse)
    }
});

app.patch("/removeTherapist", isLoggedIn, (req, res) => {
    if (getUserTherapistEmail(req.auth.email) === null) {
        return res.status(400).json({
            message: "Therapist has not yet been assigned to this account."
        })
    } else {
        removeTherapist(req.auth.email)
        return res.json({
            email: req.auth.email,
        } as RemoveTherapistResponse)
    }
});

app.get("/retrieveUserTherapist", isLoggedIn, (req: Request, res: Response) => {
    const therapistEmail = getUserTherapistEmail(req.auth.email as string);
    if (therapistEmail) {
        res.json({
            therapistEmail: therapistEmail,
            therapistName: getTherapistName(therapistEmail)
        });
    } else {
        res.json({
            therapistEmail: "",
            therapistName: ""
        });
    }
});

app.post("/sendInvitation", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<SendInvitationRequest> = {
        type: "object",
        properties: {
            userEmail: { type: "string", format: "email" },
        },
        required: ["userEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { userEmail } = req.body as SendInvitationRequest;
    if (!checkUserExists(userEmail)) {
        return res.status(400).json({
            message: "Patient with this email does not exist."
        })
    } else if (getUserTherapistEmail(userEmail) !== null) {
        return res.status(400).json({
            message: "A therapist is already assigned to this patient."
        })
    } else {
        createInvitation(userEmail, req.auth.email)
        res.json({
            userEmail: userEmail,
            therapistEmail: req.auth.email,
        } as SendInvitationResponse)
    }
});

app.get("/getUserInvitations", isLoggedIn, (req, res) => {
    const invitations = getUserInvitations(req.auth.email as string);
    if (invitations) {
        res.json({
            therapistEmails: invitations
        } as GetUserInvitationsResponse)
    } else {
        res.json({
            therapistEmails: [
                { therapistEmail: "" }
            ]
        } as GetUserInvitationsResponse);
    }
});

app.get("/getTherapistInvitations", isLoggedIn, (req, res) => {
    const invitations = getTherapistInvitations(req.auth.email as string);
    if (invitations) {
        res.json({
            userEmails: invitations
        } as GetTherapistInvitationsResponse)
    } else {
        res.json({
            userEmails: [
                { userEmail: "" }
            ]
        } as GetTherapistInvitationsResponse);
    }
});

app.post("/acceptInvitation", isLoggedIn, (req, res) => {
    const schema: JSONSchemaType<AcceptInvitationRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as AcceptInvitationRequest;
    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (!checkInvitation(req.auth.email, therapistEmail)) {
        return res.status(400).json({
            message: "No invitation pending from this therapist."
        })
    } else if (getUserTherapistEmail(req.auth.email) !== null) {
        return res.status(400).json({
            message: "A therapist has already been assigned to this account."
        })
    } else {
        deleteInvitation(req.auth.email, therapistEmail)
        addTherapist(req.auth.email, therapistEmail)
        res.json({
            therapistEmail: therapistEmail,
            therapistName: getTherapistName(therapistEmail)
        } as AcceptInvitationResponse)
    }
});

app.post("/rejectInvitation", isLoggedIn, (req, res) => {
    const schema: JSONSchemaType<RejectInvitationRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as RejectInvitationRequest;
    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (!checkInvitation(req.auth.email, therapistEmail)) {
        return res.status(400).json({
            message: "No invitation pending from this therapist."
        })
    } else {
        deleteInvitation(req.auth.email, therapistEmail)
        res.json({
            therapistEmail: therapistEmail,
        } as RejectInvitationResponse)
    }
});

createTables();
app.listen(5000);

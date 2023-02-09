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

import {
    SignUpRequest, SignUpResponse, LoginRequest, LoginResponse, CaptureHrRequest, CaptureHrResponse, CaptureBpRequest,
    CaptureBpResponse, CaptureSpeechResponse, CaptureSpeechRequest, ChangePasswordRequest, ChangePasswordResponse, User
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
    if (!loginUser(email, pass)) {
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

function captureUserHr(email: string, hr: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO heartRate (hrId, hr, date, userEmail)
        VALUES (?, ?, DATETIME(?), ?);
    `, [uuidv4(), hr, currentDate, email]);
    return currentDate;
}

function captureUserBp(email: string, systolicPressure: number, diastolicPressure: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO bloodPressure (bpId, systolicPressure, diastolicPressure, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), systolicPressure, diastolicPressure, currentDate, email]);
    return currentDate;
}

function captureUserSpeech(email: string, wpm: number, accuracy: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO speechRate (speechId, wpm, accuracy, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), wpm, accuracy, currentDate, email]);
    return currentDate;
}

function listUsers(email: string): Array<string> {
    const users = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ?;
    `, [email]);
    return users.map(user => user.name);
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

function changePassword(email: string, password: string): void {
    exec(`
    UPDATE user 
    SET password = ? 
    WHERE email = ?;
    `, [hash(password), email]);
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

    const user = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ?;
    `, [email]);

    if (user.length > 0) {
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
        changePassword(req.auth.email, newPassword);
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
        const user = query<User>(`
            SELECT name
            FROM user
            WHERE email = ?;
        `, [email]);

        res.json({
            email: email,
            name: user[0].name
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
    let date = captureUserHr(req.auth.email, hr);
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
    let date = captureUserBp(req.auth.email, systolicPressure, diastolicPressure);
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
    let date = captureUserSpeech(req.auth.email, wpm, accuracy);
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

createTables();

app.listen(5000);

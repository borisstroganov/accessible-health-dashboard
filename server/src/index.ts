import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import cors from "cors";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

import { SignUpRequest, SignUpResponse, LoginRequest, LoginResponse, CaptureHrRequest, CaptureHrResponse, CaptureBpRequest, CaptureBpResponse, CaptureSpeechResponse, CaptureSpeechRequest, User } from "../../common/types";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
    `, [uuidv4(), email, name, password]);
}

function loginUser(email: string, password: string): boolean {
    const user = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ? AND password = ?;
    `, [email, password]);

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

app.post("/captureHr", (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureHrRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            hr: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["email", "hr"],
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
        hr,
    } = req.body as CaptureHrRequest;
    let date = captureUserHr(email, hr);
    res.json({
        email: email,
        hr: hr,
        date: date
    } as CaptureHrResponse)
});

app.post("/captureBp", (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureBpRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            systolicPressure: { type: "number", minimum: 0, maximum: 999 },
            diastolicPressure: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["email", "systolicPressure", "diastolicPressure"],
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
        systolicPressure,
        diastolicPressure,
    } = req.body as CaptureBpRequest;
    let date = captureUserBp(email, systolicPressure, diastolicPressure);
    res.json({
        email: email,
        systolicPressure: systolicPressure,
        diastolicPressure: diastolicPressure,
        date: date
    } as CaptureBpResponse)
});

app.post("/captureSpeech", (req: Request, res: Response) => {
    const schema: JSONSchemaType<CaptureSpeechRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            wpm: { type: "number", minimum: 0, maximum: 999 },
            accuracy: { type: "number", minimum: 0, maximum: 100 },
        },
        required: ["email", "wpm", "accuracy"],
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
        wpm,
        accuracy,
    } = req.body as CaptureSpeechRequest;
    let date = captureUserSpeech(email, wpm, accuracy);
    res.json({
        email: email,
        wpm: wpm,
        accuracy: accuracy,
        date: date
    } as CaptureSpeechResponse)
});

app.get("/latestBp", (req: Request, res: Response) => {
    const {
        email
    } = req.query;
    const bp = retrieveBp(email as string);
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

app.get("/latestHr", (req: Request, res: Response) => {
    const {
        email
    } = req.query;
    const hr = retrieveHr(email as string);
    if (hr) {
        res.json(hr);
    } else {
        res.json({
            hr: 0,
            date: ""
        });
    }
});

app.get("/latestSpeech", (req: Request, res: Response) => {
    const {
        email
    } = req.query;
    const speech = retrieveSpeech(email as string);
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

app.get("/list", (req: Request, res: Response) => {
    const {
        email
    } = req.query;
    const users = listUsers(email as string);
    res.json(users);
});

createTables();

app.listen(5000);

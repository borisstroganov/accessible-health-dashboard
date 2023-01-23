import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import cors from "cors";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

import { SignUpRequest, SignUpResponse, LoginRequest, LoginResponse, User } from "../../common/types";

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
    exec(schema, []);
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

function listUsers(email: string): Array<string> {
    const users = query<{ id: string, email: string, name: string, password: string }>(`
        SELECT *
        FROM user
        WHERE email = ?;
    `, [email]);
    return users.map(user => user.name);
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
    };
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

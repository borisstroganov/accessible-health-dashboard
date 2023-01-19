import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";

const app = express();
app.use(bodyParser.json());

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

function createUser(name: string, age: number): void {
    exec(`
        INSERT INTO user (id, name, age)
        VALUES (?, ?, ?);
    `, [uuidv4(), name, age]);
}

function listUsers(age: number): Array<string> {
    const users = query<{id: string, name: string, age: number}>(`
        SELECT *
        FROM user
        WHERE age > ?;
    `, [age]);
    return users.map(user => user.name);
}

app.post("/signup", (req: Request, res: Response) => {
    const {
        name,
        age
    } = req.body;
    createUser(name, parseInt(age));
    res.send("created: " + name);
});

app.get("/list", (req: Request, res: Response) => {
    const {
        age
    } = req.query;
    const users = listUsers(parseInt(age as string));
    res.json(users);
});

createTables();

app.listen(5000);

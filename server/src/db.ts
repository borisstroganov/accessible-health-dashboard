import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("./src/db/data.db", { verbose: console.log });
db.pragma("foreign_keys = ON");

export function query<T>(sql: string, params: Array<any>): Array<T> {
    return db.prepare(sql).all(params);
}
export function exec(sql: string, params: Array<any>): void {
    db.prepare(sql).run(params);
}

export function createTables(): void {
    const schema = fs.readFileSync("./src/db/schema.sql", {
        encoding: 'utf8',
        flag: 'r',
    });
    db.exec(schema);
}
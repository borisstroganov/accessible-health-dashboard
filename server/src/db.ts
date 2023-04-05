import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database(path.join(__dirname, "db", "data.db"), { 
    // For debugging
    // verbose: console.log 
});
db.pragma("foreign_keys = ON");

export function query<T>(sql: string, params: Array<any>): Array<T> {
    return db.prepare(sql).all(params);
}
export function exec(sql: string, params: Array<any>): void {
    db.prepare(sql).run(params);
}

export function createTables(): void {
    const schema = fs.readFileSync(path.join(__dirname, "db", "schema.sql"), {
        encoding: 'utf8',
        flag: 'r',
    });
    db.exec(schema);
}

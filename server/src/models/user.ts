import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";

import { User } from "../../../common/types";
import { query, exec } from '../db';

function hash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

export function createUser(email: string, name: string, password: string): void {
    exec(`
        INSERT INTO user (id, email, name, password)
        VALUES (?, ?, ?, ?);
    `, [uuidv4(), email, name, hash(password)]);
}

export function loginUser(email: string, password: string): boolean {
    const user = query<User>(`
        SELECT *
        FROM user
        WHERE email = ? AND password = ?;
    `, [email, hash(password)]);

    return user.length > 0;
}

export function checkUserExists(email: string): boolean {
    const user = query<User>(`
        SELECT *
        FROM user
        WHERE email = ?;
    `, [email]);

    return user.length > 0;
}

export function changeUserPassword(email: string, password: string): void {
    exec(`
    UPDATE user 
    SET password = ? 
    WHERE email = ?;
    `, [hash(password), email]);
}

export function getUserName(email: string): string {
    const user = query<User>(`
        SELECT name
        FROM user
        WHERE email = ?;
    `, [email]);

    return user[0].name;
}
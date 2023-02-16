import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";

import { User } from "../../../common/types";
import { query, exec } from '../db';

function hash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

export function createTherapist(email: string, name: string, password: string): void {
    exec(`
        INSERT INTO therapist (id, email, name, password)
        VALUES (?, ?, ?, ?);
    `, [uuidv4(), email, name, hash(password)]);
}

export function loginTherapist(email: string, password: string): boolean {
    const user = query<User>(`
        SELECT *
        FROM therapist
        WHERE email = ? AND password = ?;
    `, [email, hash(password)]);

    return user.length > 0;
}

export function checkTherapistExists(email: string): boolean {
    const therapist = query<User>(`
        SELECT *
        FROM therapist
        WHERE email = ?;
    `, [email]);

    return therapist.length > 0;
}

export function changeTherapistPassword(email: string, password: string): void {
    exec(`
    UPDATE therapist 
    SET password = ? 
    WHERE email = ?;
    `, [hash(password), email]);
}

export function getTherapistName(email: string): string {
    const therapist = query<User>(`
        SELECT name
        FROM therapist
        WHERE email = ?;
    `, [email]);

    return therapist[0].name;
}
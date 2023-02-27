import { v4 as uuidv4 } from 'uuid';

import { query, exec } from '../db';

export function captureSpeech(email: string, wpm: number, accuracy: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO speechRate (speechId, wpm, accuracy, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), wpm, accuracy, currentDate, email]);
    return currentDate;
}

export function retrieveSpeech(email: string): { speechId: string; wpm: number; accuracy: number; date: string } {
    const speeches = query<{ speechId: string; wpm: number; accuracy: number; date: string }>(`
        SELECT speechId, wpm, accuracy, date
        FROM speechRate
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return speeches[0];
}
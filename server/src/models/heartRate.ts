import { v4 as uuidv4 } from 'uuid';

import { query, exec } from '../db';

export function captureHr(email: string, hr: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO heartRate (hrId, hr, date, userEmail)
        VALUES (?, ?, DATETIME(?), ?);
    `, [uuidv4(), hr, currentDate, email]);
    return currentDate;
}

export function retrieveHr(email: string): { hr: number; date: string } | undefined {
    const hrs = query<{ hr: number; date: string }>(`
        SELECT hr, date
        FROM heartRate
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return hrs[0];
}

export function retrieveAllHr(email: string): { hr: number; date: string }[] | undefined {
    const hrs = query<{ hr: number; date: string }>(`
        SELECT hr, date
        FROM (
            SELECT hr, date
            FROM heartRate
            WHERE userEmail = ?
            ORDER BY date DESC
            LIMIT 15
        ) recent_heart_rates
        ORDER BY date ASC;
    `, [email])
    return hrs;
}
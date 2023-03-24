import { v4 as uuidv4 } from 'uuid';

import { query, exec } from '../db';

export function captureBp(email: string, systolicPressure: number, diastolicPressure: number): string {
    let currentDate = new Date().toISOString();
    exec(`
        INSERT INTO bloodPressure (bpId, systolicPressure, diastolicPressure, date, userEmail)
        VALUES (?, ?, ?, DATETIME(?), ?);
    `, [uuidv4(), systolicPressure, diastolicPressure, currentDate, email]);
    return currentDate;
}

export function retrieveBp(email: string): { systolicPressure: number; diastolicPressure: number; date: string } | undefined {
    const bps = query<{ systolicPressure: number; diastolicPressure: number; date: string }>(`
        SELECT systolicPressure, diastolicPressure, date
        FROM bloodPressure
        WHERE userEmail = ?
        ORDER BY date DESC 
        LIMIT 1;
    `, [email]);
    return bps[0];
}

export function retrieveAllBp(email: string): { systolicPressure: number; diastolicPressure: number; date: string }[] | undefined {
    const bps = query<{ systolicPressure: number; diastolicPressure: number; date: string }>(`
        SELECT systolicPressure, diastolicPressure, date
        FROM (
            SELECT systolicPressure, diastolicPressure, date
            FROM bloodPressure
            WHERE userEmail = ?
            ORDER BY date DESC
            LIMIT 15
        ) recent_blood_pressure
        ORDER BY date ASC;
    `, [email])
    return bps;
}
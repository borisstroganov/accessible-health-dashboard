import { query, exec } from '../db';

export function createInvitation(userEmail: string, therapistEmail: string): void {
    exec(`
        INSERT INTO invitation (userEmail, therapistEmail)
        VALUES (?, ?);
    `, [userEmail, therapistEmail]);
}

export function getUserInvitations(userEmail: string): { therapistEmail: string }[] {
    const userInvitations = query<{ therapistEmail: string; }>(`
        SELECT therapistEmail
        FROM invitation
        WHERE userEmail = ?
    `, [userEmail]);
    return userInvitations;
}

export function getTherapistInvitations(therapistEmail: string): { userEmail: string }[] {
    const therapistInvitations = query<{ userEmail: string; }>(`
        SELECT userEmail
        FROM invitation
        WHERE therapistEmail = ?
    `, [therapistEmail]);
    return therapistInvitations;
}

export function checkInvitation(userEmail: string, therapistEmail: string): boolean {
    const invitations = query<{ userEmail: string, therapistEmail: string }>(`
        SELECT *
        FROM invitation
        WHERE userEmail = ? AND therapistEmail = ?
    `, [userEmail, therapistEmail])
    return invitations.length > 0;
}

export function deleteInvitation(userEmail: string, therapistEmail: string): void {
    exec(`
        DELETE FROM invitation
        WHERE userEmail = ? AND therapistEmail = ?
    `, [userEmail, therapistEmail]);
}
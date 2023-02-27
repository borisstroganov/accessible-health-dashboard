import { v4 as uuidv4 } from 'uuid';

import { query, exec } from '../db';

export function createAssignment(userEmail: string, therapistEmail: string, assignmentTitle: string, assignmentText: string): void {
    exec(`
        INSERT INTO assignment (assignmentId, userEmail, therapistEmail, assignmentTitle, assignmentText, status)
        VALUES (?, ?, ?, ?, ?, ?);
    `, [uuidv4(), userEmail, therapistEmail, assignmentTitle, assignmentText, "created"]);
}

export function getUserAssignments(userEmail: string): { assignmentId: string }[] {
    const userAssignmentIds = query<{ assignmentId: string; }>(`
        SELECT assignmentId
        FROM assignment
        WHERE userEmail = ?
    `, [userEmail]);
    return userAssignmentIds;
}

export function getTherapistAssignments(therapistEmail: string): { assignmentId: string }[] {
    const therapistAssignmentIds = query<{ assignmentId: string; }>(`
        SELECT assignmentId
        FROM assignment
        WHERE therapistEmail = ?
    `, [therapistEmail]);
    return therapistAssignmentIds;
}

export function getAssignmentTitle(assignmentId: string): string {
    const assignments = query<{assignmentTitle: string; }>(`
        SELECT assignmentTitle
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].assignmentTitle;
}

export function getAssignmentText(assignmentId: string): string {
    const assignments = query<{assignmentText: string; }>(`
        SELECT assignmentText
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].assignmentText;
}

export function getAssignmentUserEmail(assignmentId: string): string {
    const assignments = query<{userEmail: string; }>(`
        SELECT userEmail
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].userEmail;
}

export function getAssignmentTherapistEmail(assignmentId: string): string {
    const assignments = query<{therapistEmail: string; }>(`
        SELECT therapistEmail
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].therapistEmail;
}
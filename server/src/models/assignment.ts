import { v4 as uuidv4 } from 'uuid';

import { query, exec } from '../db';

export function createAssignment(userEmail: string, therapistEmail: string, assignmentTitle: string, assignmentText: string): void {
    exec(`
        INSERT INTO assignment (assignmentId, userEmail, therapistEmail, assignmentTitle, assignmentText, status)
        VALUES (?, ?, ?, ?, ?, ?);
    `, [uuidv4(), userEmail, therapistEmail, assignmentTitle, assignmentText, "todo"]);
}

export function getUserAssignments(userEmail: string): { assignmentId: string }[] | undefined {
    const userAssignmentIds = query<{ assignmentId: string; }>(`
        SELECT assignmentId
        FROM assignment
        WHERE userEmail = ?
    `, [userEmail]);
    return userAssignmentIds;
}

export function getTherapistAssignments(therapistEmail: string): { assignmentId: string }[] | undefined {
    const therapistAssignmentIds = query<{ assignmentId: string; }>(`
        SELECT assignmentId
        FROM assignment
        WHERE therapistEmail = ?
    `, [therapistEmail]);
    return therapistAssignmentIds;
}

export function getAssignmentTitle(assignmentId: string): string {
    const assignments = query<{ assignmentTitle: string; }>(`
        SELECT assignmentTitle
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].assignmentTitle;
}

export function getAssignmentText(assignmentId: string): string {
    const assignments = query<{ assignmentText: string; }>(`
        SELECT assignmentText
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].assignmentText;
}

export function getAssignmentUserEmail(assignmentId: string): string {
    const assignments = query<{ userEmail: string; }>(`
        SELECT userEmail
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].userEmail;
}

export function getAssignmentTherapistEmail(assignmentId: string): string {
    const assignments = query<{ therapistEmail: string; }>(`
        SELECT therapistEmail
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].therapistEmail;
}

export function getAssignmentStatus(assignmentId: string): string {
    const assignments = query<{ status: string; }>(`
        SELECT status
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return assignments[0].status;
}

export function checkAssignment(assignmentId: string): boolean {
    const assignment = query<{}>(`
        SELECT *
        from assignment
        WHERE assignmentId = ?
    `, [assignmentId])
    return assignment.length > 0;
}

export function setAssignmentSpeech(assignmentId: string, speechId: string): void {
    exec(`
        UPDATE assignment 
        SET speechId = ?, status = ?
        WHERE assignmentId = ?;
    `, [speechId, "completed", assignmentId]);
}

export function getAssignmentSpeechId(assignmentId: string): string {
    const speechId = query<{ speechId: string }>(`
        SELECT speechId
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return speechId[0].speechId;
}

export function getAssignmentFeedback(assignmentId: string): string {
    const feedback = query<{ feedbackText: string }>(`
        SELECT feedbackText
        FROM assignment
        WHERE assignmentId = ?
    `, [assignmentId]);
    return feedback[0].feedbackText;
}

export function setAssignmentFeedback(assignmentId: string, feedbackText: string): void {
    exec(`
        UPDATE assignment 
        SET feedbackText = ?, status = ?
        WHERE assignmentId = ?;
    `, [feedbackText, "reviewed", assignmentId]);
}

export function deleteAssignment(assignmentId: string): void {
    exec(`
        DELETE FROM assignment
        WHERE assignmentId = ? 
    `, [assignmentId]);
}
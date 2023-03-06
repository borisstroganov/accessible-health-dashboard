import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import bAuth from "basic-auth";

import { createTables } from './db';
import { captureBp, retrieveBp } from './models/bloodPressure';
import { captureHr, retrieveHr } from './models/heartRate';
import { captureSpeech, retrieveSpeech, retrieveSpeechById } from './models/speechRate';
import {
    createUser, loginUser, checkUserExists, getUserName, changeUserPassword, addTherapist, removeTherapist,
    getUserTherapistEmail,
    getTherapistUsers
} from './models/user';
import { createTherapist, loginTherapist, checkTherapistExists, changeTherapistPassword, getTherapistName } from './models/therapist';
import { createInvitation, getUserInvitations, getTherapistInvitations, checkInvitation, deleteInvitation } from './models/invitation';
import {
    createAssignment, getUserAssignments, getTherapistAssignments, getAssignmentTitle, getAssignmentText,
    getAssignmentUserEmail, getAssignmentTherapistEmail, getAssignmentStatus, checkAssignment, setAssignmentSpeech,
    getAssignmentSpeechId,
    getAssignmentFeedback,
    setAssignmentFeedback,
    deleteAssignment
} from './models/assignment';

import * as types from "../../common/types";

const ajv = new Ajv();
addFormats(ajv, ["email", "password"]);

const app = express();
app.use(bodyParser.json());
app.use(cors());

declare global {
    namespace Express {
        interface Request {
            auth: { email: string }
        }
    }
}

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const result = bAuth(req);
    if (!result) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const { name: email, pass } = result;
    if (!loginUser(email, pass) && !loginTherapist(email, pass)) {
        return res.status(403).json({
            message: "Invalid credentials."
        });
    }

    req.auth = {
        email: email,
    };
    next();
}

const isTherapist = (req: Request, res: Response, next: NextFunction) => {
    const result = bAuth(req);
    if (!result) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const { name: email, pass } = result;
    if (!loginTherapist(email, pass)) {
        return res.status(403).json({
            message: "Therapist permissions required."
        });
    }

    req.auth = {
        email: email,
    };
    next();
}

app.post("/signup", (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.SignUpRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string", minLength: 5 },
            password: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
        },
        required: ["email", "name", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)

    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { email, name, password } = req.body as types.SignUpRequest;

    if (checkUserExists(email) || checkTherapistExists(email)) {
        return res.status(400).json({
            message: "Account with this email already exists."
        })
    }

    createUser(email, name, password);
    res.json({
        email: email,
        name: name
    } as types.SignUpResponse)
});

app.post("/changePassword", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.ChangePasswordRequest> = {
        type: "object",
        properties: {
            password: { type: "string" },
            newPassword: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
            confirmPassword: { type: "string" },
        },
        required: ["password", "newPassword", "confirmPassword"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { password, newPassword, confirmPassword } = req.body as types.ChangePasswordRequest;

    if (!loginUser(req.auth.email, password)) {
        return res.status(400).json({
            message: "Invalid password."
        })
    } else if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New passwords do not match."
        })
    } else if (newPassword === password) {
        return res.status(400).json({
            message: "New password cannot be the same as the old password."
        })
    } else {
        changeUserPassword(req.auth.email, newPassword);
        res.json({
            email: req.auth.email
        } as types.ChangePasswordResponse)
    }
});

app.post("/login", (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.LoginRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
        },
        required: ["email", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        email,
        password,
    } = req.body as types.LoginRequest;
    if (loginUser(email, password)) {

        res.json({
            email: email,
            name: getUserName(email)
        } as types.LoginResponse)
    } else {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    };
});

app.post("/captureHr", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.CaptureHrRequest> = {
        type: "object",
        properties: {
            hr: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["hr"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        hr,
    } = req.body as types.CaptureHrRequest;
    let date = captureHr(req.auth.email, hr);
    res.json({
        email: req.auth.email,
        hr: hr,
        date: date
    } as types.CaptureHrResponse)
});

app.post("/captureBp", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.CaptureBpRequest> = {
        type: "object",
        properties: {
            systolicPressure: { type: "number", minimum: 0, maximum: 999 },
            diastolicPressure: { type: "number", minimum: 0, maximum: 999 },
        },
        required: ["systolicPressure", "diastolicPressure"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        systolicPressure,
        diastolicPressure,
    } = req.body as types.CaptureBpRequest;
    let date = captureBp(req.auth.email, systolicPressure, diastolicPressure);
    res.json({
        email: req.auth.email,
        systolicPressure: systolicPressure,
        diastolicPressure: diastolicPressure,
        date: date
    } as types.CaptureBpResponse)
});

app.post("/captureSpeech", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.CaptureSpeechRequest> = {
        type: "object",
        properties: {
            wpm: { type: "number", minimum: 0, maximum: 999 },
            accuracy: { type: "number", minimum: 0, maximum: 100 },
        },
        required: ["wpm", "accuracy"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        wpm,
        accuracy,
    } = req.body as types.CaptureSpeechRequest;
    let date = captureSpeech(req.auth.email, wpm, accuracy);
    res.json({
        email: req.auth.email,
        wpm: wpm,
        accuracy: accuracy,
        date: date
    } as types.CaptureSpeechResponse)
});

app.get("/latestBp", isLoggedIn, (req: Request, res: Response) => {
    const bp = retrieveBp(req.auth.email as string);
    if (bp) {
        res.json(bp);
    } else {
        res.json({
            systolicPressure: 0,
            diastolicPressure: 0,
            date: ""
        });
    }
});

app.get("/latestHr", isLoggedIn, (req: Request, res: Response) => {
    const hr = retrieveHr(req.auth.email as string);
    if (hr) {
        res.json(hr);
    } else {
        res.json({
            hr: 0,
            date: ""
        });
    }
});

app.get("/latestSpeech", isLoggedIn, (req: Request, res: Response) => {
    const speech = retrieveSpeech(req.auth.email as string);
    if (speech) {
        res.json(speech);
    } else {
        res.json({
            wpm: 0,
            accuracy: 0,
            date: ""
        });
    }
});

app.post("/therapistSignup", (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.TherapistSignUpRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string", minLength: 5 },
            password: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
        },
        required: ["email", "name", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)

    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { email, name, password } = req.body as types.TherapistSignUpRequest;

    if (checkTherapistExists(email) || checkUserExists(email)) {
        return res.status(400).json({
            message: "Account with this email already exists."
        })
    }

    createTherapist(email, name, password);
    res.json({
        email: email,
        name: name
    } as types.TherapistSignUpResponse)
})

app.post("/therapistLogin", (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.TherapistLoginRequest> = {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
        },
        required: ["email", "password"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        email,
        password,
    } = req.body as types.TherapistLoginRequest;
    if (loginTherapist(email, password)) {

        res.json({
            email: email,
            name: getTherapistName(email)
        } as types.TherapistLoginResponse)
    } else {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    };
});

app.post("/therapistChangePassword", isTherapist, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.TherapistChangePasswordRequest> = {
        type: "object",
        properties: {
            password: { type: "string" },
            newPassword: { type: "string", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$" },
            confirmPassword: { type: "string" },
        },
        required: ["password", "newPassword", "confirmPassword"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { password, newPassword, confirmPassword } = req.body as types.TherapistChangePasswordRequest;

    if (!loginTherapist(req.auth.email, password)) {
        return res.status(400).json({
            message: "Invalid password."
        })
    } else if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New passwords do not match."
        })
    } else if (newPassword === password) {
        return res.status(400).json({
            message: "New password cannot be the same as the old password."
        })
    } else {
        changeTherapistPassword(req.auth.email, newPassword);
        res.json({
            email: req.auth.email
        } as types.TherapistChangePasswordResponse)
    }
});

app.post("/addTherapist", isLoggedIn, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.AddTherapistRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as types.AddTherapistRequest;

    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (getUserTherapistEmail(req.auth.email) !== null) {
        return res.status(400).json({
            message: "Therapist already assigned."
        })
    } else {
        addTherapist(req.auth.email, therapistEmail);
        res.json({
            email: req.auth.email,
            therapistEmail: therapistEmail,
        } as types.AddTherapistResponse)
    }
});

app.patch("/removeTherapist", isLoggedIn, (req, res) => {
    if (getUserTherapistEmail(req.auth.email) === null) {
        return res.status(400).json({
            message: "Therapist has not yet been assigned to this account."
        })
    } else {
        removeTherapist(req.auth.email)
        return res.json({
            email: req.auth.email,
        } as types.RemoveTherapistResponse)
    }
});

app.patch("/removePatient", isTherapist, (req, res) => {
    const schema: JSONSchemaType<types.RemovePatientRequest> = {
        type: "object",
        properties: {
            userEmail: { type: "string", format: "email" },
        },
        required: ["userEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { userEmail } = req.body as types.RemovePatientRequest;

    if (getUserTherapistEmail(userEmail) !== req.auth.email) {
        return res.status(400).json({
            message: "Patient has not been assigned to you."
        })
    } else {
        removeTherapist(userEmail)
        return res.json({
            email: req.auth.email,
        } as types.RemovePatientResponse)
    }

});

app.get("/retrieveUserTherapist", isLoggedIn, (req: Request, res: Response) => {
    const therapistEmail = getUserTherapistEmail(req.auth.email as string);
    if (therapistEmail) {
        res.json({
            therapistEmail: therapistEmail,
            therapistName: getTherapistName(therapistEmail)
        });
    } else {
        res.json({
            therapistEmail: "",
            therapistName: ""
        });
    }
});

app.get("/getTherapistPatients", isTherapist, (req: Request, res: Response) => {
    const patientEmails = getTherapistUsers(req.auth.email as string);
    if (patientEmails) {
        const patients = patientEmails.map((patient) => {
            const patientName = getUserName(patient.email);
            const speech = retrieveSpeech(patient.email);
            return {
                patient: {
                    userEmail: patient.email, userName: patientName, speech: speech
                }
            }
        })
        res.json(
            { patients: patients } as types.GetTherapistPatientsResponse
        );
    } else {

    }
});

app.post("/sendInvitation", isTherapist, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.SendInvitationRequest> = {
        type: "object",
        properties: {
            userEmail: { type: "string", format: "email" },
        },
        required: ["userEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { userEmail } = req.body as types.SendInvitationRequest;
    if (!checkUserExists(userEmail)) {
        return res.status(400).json({
            message: "Patient with this email does not exist."
        })
    } else if (checkInvitation(userEmail, req.auth.email)) {
        return res.status(400).json({
            message: "An invitation has already been sent to this patient."
        })
    } else if (getUserTherapistEmail(userEmail) !== null) {
        return res.status(400).json({
            message: "A therapist is already assigned to this patient."
        })
    } else {
        createInvitation(userEmail, req.auth.email)
        res.json({
            userEmail: userEmail,
            therapistEmail: req.auth.email,
        } as types.SendInvitationResponse)
    }
});

app.get("/getUserInvitations", isLoggedIn, (req, res) => {
    const invitations = getUserInvitations(req.auth.email as string);
    if (invitations) {
        const therapists = invitations.map(therapist => {
            const therapistName = getTherapistName(therapist.therapistEmail);
            return { therapist: { therapistEmail: therapist.therapistEmail, therapistName: therapistName } };
        });

        res.json({ therapists: therapists } as types.GetUserInvitationsResponse);
    } else {
        res.json({
            therapists: [
                {
                    therapist: {
                        therapistEmail: "",
                        therapistName: "",
                    }
                }
            ]
        } as types.GetUserInvitationsResponse);
    }
});

app.get("/getTherapistInvitations", isTherapist, (req, res) => {
    const invitations = getTherapistInvitations(req.auth.email as string);
    if (invitations) {
        const users = invitations.map(user => {
            const userName = getUserName(user.userEmail);
            return { user: { userEmail: user.userEmail, userName: userName } };
        });

        res.json({ users: users } as types.GetTherapistInvitationsResponse);
    } else {
        res.json({
            users: [
                {
                    user: {
                        userEmail: "",
                        userName: "",
                    }
                }
            ]
        } as types.GetTherapistInvitationsResponse);
    }
});

app.post("/acceptInvitation", isLoggedIn, (req, res) => {
    const schema: JSONSchemaType<types.AcceptInvitationRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as types.AcceptInvitationRequest;
    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (!checkInvitation(req.auth.email, therapistEmail)) {
        return res.status(400).json({
            message: "No invitation pending from this therapist."
        })
    } else if (getUserTherapistEmail(req.auth.email) !== null) {
        return res.status(400).json({
            message: "A therapist has already been assigned to this account."
        })
    } else {
        deleteInvitation(req.auth.email, therapistEmail)
        addTherapist(req.auth.email, therapistEmail)
        res.json({
            therapistEmail: therapistEmail,
            therapistName: getTherapistName(therapistEmail)
        } as types.AcceptInvitationResponse)
    }
});

app.post("/rejectInvitation", isLoggedIn, (req, res) => {
    const schema: JSONSchemaType<types.RejectInvitationRequest> = {
        type: "object",
        properties: {
            therapistEmail: { type: "string", format: "email" },
        },
        required: ["therapistEmail"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { therapistEmail } = req.body as types.RejectInvitationRequest;
    if (!checkTherapistExists(therapistEmail)) {
        return res.status(400).json({
            message: "Therapist with this email does not exist."
        })
    } else if (!checkInvitation(req.auth.email, therapistEmail)) {
        return res.status(400).json({
            message: "No invitation pending from this therapist."
        })
    } else {
        deleteInvitation(req.auth.email, therapistEmail)
        res.json({
            therapistEmail: therapistEmail,
        } as types.RejectInvitationResponse)
    }
});

app.post("/sendAssignment", isTherapist, (req: Request, res: Response) => {
    const schema: JSONSchemaType<types.SendAssignmentRequest> = {
        type: "object",
        properties: {
            userEmail: { type: "string", format: "email" },
            assignmentTitle: { type: "string" },
            assignmentText: { type: "string" },
        },
        required: ["userEmail", "assignmentTitle", "assignmentText"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { userEmail, assignmentTitle, assignmentText } = req.body as types.SendAssignmentRequest;
    if (!checkUserExists(userEmail)) {
        return res.status(400).json({
            message: "Patient with this email does not exist."
        })
    } else if (getUserTherapistEmail(userEmail) !== req.auth.email) {
        return res.status(400).json({
            message: "Patient assigned to a different therapist."
        })
    } else {
        createAssignment(userEmail, req.auth.email, assignmentTitle, assignmentText)
        res.json({
            userEmail: userEmail,
            therapistEmail: req.auth.email,
            assignmentTitle: assignmentTitle,
            assignmentText: assignmentText
        } as types.SendAssignmentResponse)
    }
});

app.get("/getUserAssignments", isLoggedIn, (req, res) => {
    const assignmentIds = getUserAssignments(req.auth.email as string);
    if (assignmentIds) {
        const assignments = assignmentIds.map(assignment => {
            const therapistEmail = getAssignmentTherapistEmail(assignment.assignmentId);
            const therapistName = getTherapistName(therapistEmail);
            const assignmentTitle = getAssignmentTitle(assignment.assignmentId);
            const assignmentText = getAssignmentText(assignment.assignmentId);
            const status = getAssignmentStatus(assignment.assignmentId);
            let speech: { wpm: number, accuracy: number } = { wpm: 0, accuracy: 0 };
            if (status !== "todo") {
                speech = retrieveSpeechById(getAssignmentSpeechId(assignment.assignmentId));
            }
            let feedbackText: string = ""
            if (status === "reviewed") {
                feedbackText = getAssignmentFeedback(assignment.assignmentId);
            }
            return {
                assignment: {
                    assignmentId: assignment.assignmentId,
                    therapistName: therapistName,
                    therapistEmail: therapistEmail,
                    assignmentTitle: assignmentTitle,
                    assignmentText: assignmentText,
                    status: status, speech: speech,
                    feedbackText: feedbackText
                }
            };
        });

        res.json({ assignments: assignments } as types.GetUserAssignmentsResponse);
    } else {
        res.json({
            assignments: [
                {
                    assignment: {
                        assignmentId: "",
                        therapistName: "",
                        therapistEmail: "",
                        assignmentTitle: "",
                        assignmentText: "",
                        status: ""
                    }
                }
            ]
        } as types.GetUserAssignmentsResponse);
    }
});

app.get("/getTherapistAssignments", isTherapist, (req, res) => {
    const assignmentIds = getTherapistAssignments(req.auth.email as string);
    if (assignmentIds) {
        const assignments = assignmentIds.map(assignment => {
            const userEmail = getAssignmentUserEmail(assignment.assignmentId);
            const userName = getUserName(userEmail);
            const assignmentTitle = getAssignmentTitle(assignment.assignmentId);
            const assignmentText = getAssignmentText(assignment.assignmentId);
            const status = getAssignmentStatus(assignment.assignmentId);
            let speech: { wpm: number, accuracy: number } = { wpm: 0, accuracy: 0 };
            if (status !== "todo") {
                speech = retrieveSpeechById(getAssignmentSpeechId(assignment.assignmentId));
            }
            let feedbackText: string = ""
            if (status === "reviewed") {
                feedbackText = getAssignmentFeedback(assignment.assignmentId);
            }
            return {
                assignment: {
                    assignmentId: assignment.assignmentId,
                    userName: userName,
                    userEmail: userEmail,
                    assignmentTitle: assignmentTitle,
                    assignmentText: assignmentText,
                    status: status, speech: speech,
                    feedbackText: feedbackText
                }
            };
        });

        res.json({ assignments: assignments } as types.GetTherapistAssignmentsResponse);
    } else {
        res.json({
            assignments: [
                {
                    assignment: {
                        assignmentId: "",
                        userName: "",
                        userEmail: "",
                        assignmentTitle: "",
                        assignmentText: "",
                        status: ""
                    }
                }
            ]
        } as types.GetTherapistAssignmentsResponse);
    }
});

app.post("/submitAssignment", isLoggedIn, (req, res) => {
    const schema: JSONSchemaType<types.SubmitAssignmentRequest> = {
        type: "object",
        properties: {
            assignmentId: { type: "string" },
            wpm: { type: "number", minimum: 0, maximum: 999 },
            accuracy: { type: "number", minimum: 0, maximum: 100 },
        },
        required: ["assignmentId", "wpm", "accuracy"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        assignmentId,
        wpm,
        accuracy,
    } = req.body as types.SubmitAssignmentRequest;

    if (!checkAssignment(assignmentId)) {
        return res.status(400).json({
            message: "Assignment with the following ID does not exist."
        })
    } else if (getAssignmentUserEmail(assignmentId) !== req.auth.email) {
        return res.status(400).json({
            message: "Assignment assigned to a different user."
        })
    } else if (getAssignmentStatus(assignmentId) !== "created") {
        return res.status(400).json({
            message: "Assignment has already been completed."
        })
    }

    let date = captureSpeech(req.auth.email, wpm, accuracy);
    let speech = retrieveSpeech(req.auth.email);
    setAssignmentSpeech(assignmentId, speech.speechId);
    res.json({
        email: req.auth.email,
        wpm: wpm,
        accuracy: accuracy,
        date: date
    } as types.SubmitAssignmentResponse)
});

app.post("/reviewAssignment", isTherapist, (req, res) => {
    const schema: JSONSchemaType<types.ReviewAssignmentRequest> = {
        type: "object",
        properties: {
            assignmentId: { type: "string" },
            feedbackText: { type: "string" },
        },
        required: ["assignmentId", "feedbackText"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const {
        assignmentId,
        feedbackText
    } = req.body as types.ReviewAssignmentRequest;

    if (!checkAssignment(assignmentId)) {
        return res.status(400).json({
            message: "Assignment with the following ID does not exist."
        })
    } else if (getAssignmentTherapistEmail(assignmentId) !== req.auth.email) {
        return res.status(400).json({
            message: "Assignment assigned to a different therapist."
        })
    } else if (getAssignmentStatus(assignmentId) === "reviewed") {
        return res.status(400).json({
            message: "Assignment has already been reviewed."
        })
    } else if (getAssignmentStatus(assignmentId) === "created") {
        return res.status(400).json({
            message: "Assignment has not yet been completed."
        })
    }

    setAssignmentFeedback(assignmentId, feedbackText)
    res.json({
        assignmentId: assignmentId,
        feedbackText: feedbackText,
        status: getAssignmentStatus(assignmentId),
    })
});

app.delete("/deleteAssignment", isTherapist, (req, res) => {
    const schema: JSONSchemaType<types.DeleteAssignmentRequest> = {
        type: "object",
        properties: {
            assignmentId: { type: "string" },
        },
        required: ["assignmentId"],
        additionalProperties: false
    }

    const validate = ajv.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            message: validate.errors?.map(err => err.message)
        })
    }

    const { assignmentId } = req.body as types.DeleteAssignmentRequest;

    if (!checkAssignment(assignmentId)) {
        return res.status(400).json({
            message: "Assignment with the following ID does not exist."
        })
    } else if (getAssignmentTherapistEmail(assignmentId) !== req.auth.email) {
        return res.status(400).json({
            message: "Assignment assigned to a different therapist."
        })
    }

    deleteAssignment(assignmentId);
    res.json({
        message: "Assignment deleted.",
    } as types.DeleteAssignmentResponse)
});

createTables();
app.listen(5000);

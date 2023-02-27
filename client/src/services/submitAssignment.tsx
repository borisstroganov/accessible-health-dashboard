import axios from 'axios';
import constants from '../static/static.json'
import { SubmitAssignmentResponse, ServerError } from "../../../common/types";

export const submitAssignment = async (email: string, password: string, assignmentId: string, wpm: number, accuracy: number): Promise<SubmitAssignmentResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/submitAssignment",
        auth: {
            username: email,
            password: password
        },
        data: {
            assignmentId: assignmentId,
            wpm: wpm,
            accuracy: accuracy,
        }
    })
        .then(r => r.data as SubmitAssignmentResponse)
        .catch((error) => {
            if (error.response) {
                return error.response.data as ServerError;
            } else if (error.request) {
                return { message: "No response" };
            }
            console.log('Error', error.message);
            return { message: error.message }
        });

    return response;
}
import axios from 'axios';
import constants from '../static/static.json'
import { ReviewAssignmentResponse, ServerError } from "../../../common/types";

export const reviewAssignment = async (email: string, password: string, assignmentId: string, feedbackText: string): Promise<ReviewAssignmentResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/reviewAssignment",
        auth: {
            username: email,
            password: password
        },
        data: {
            assignmentId: assignmentId,
            feedbackText: feedbackText,
        }
    })
        .then(r => r.data as ReviewAssignmentResponse)
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
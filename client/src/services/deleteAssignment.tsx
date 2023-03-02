import axios from 'axios';
import constants from '../static/static.json'
import { DeleteAssignmentResponse, ServerError } from "../../../common/types";

export const deleteAssignment = async (email: string, password: string, assignmentId: string):
    Promise<DeleteAssignmentResponse | ServerError> => {
    const response = await axios({
        method: 'delete',
        url: constants.URL + "/deleteAssignment",
        auth: {
            username: email,
            password: password
        },
        data: {
            assignmentId: assignmentId,
        }
    })
        .then(r => r.data as DeleteAssignmentResponse)
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
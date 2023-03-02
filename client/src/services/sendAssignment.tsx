import axios from 'axios';
import constants from '../static/static.json'
import { SendAssignmentResponse, ServerError } from "../../../common/types";

export const sendAssignment = async (email: string, password: string, userEmail: string, assignmentTitle: string, assignmentText: string):
    Promise<SendAssignmentResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/sendAssignment",
        auth: {
            username: email,
            password: password
        },
        data: {
            userEmail: userEmail,
            assignmentTitle: assignmentTitle,
            assignmentText: assignmentText,
        }
    })
        .then(r => r.data as SendAssignmentResponse)
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
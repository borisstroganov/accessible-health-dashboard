import axios from 'axios';
import constants from '../static/static.json'
import { GetUserAssignmentsResponse, ServerError } from "../../../common/types";

export const getUserAssignments = async (email: string, password: string): Promise<GetUserAssignmentsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/getUserAssignments",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as GetUserAssignmentsResponse)
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
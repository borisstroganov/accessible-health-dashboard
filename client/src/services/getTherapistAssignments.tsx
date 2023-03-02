import axios from 'axios';
import constants from '../static/static.json'
import { GetTherapistAssignmentsResponse, ServerError } from "../../../common/types";

export const getTherapistAssignments = async (email: string, password: string): Promise<GetTherapistAssignmentsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/getTherapistAssignments",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as GetTherapistAssignmentsResponse)
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
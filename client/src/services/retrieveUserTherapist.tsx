import axios from 'axios';
import constants from '../static/static.json'
import { RetrieveUserTherapistResponse, ServerError } from "../../../common/types";

export const retrieveUserTherapist = async (email: string, password: string): Promise<RetrieveUserTherapistResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/retrieveUserTherapist",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as RetrieveUserTherapistResponse)
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
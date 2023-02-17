import axios from 'axios';
import constants from '../static/static.json'
import { RemoveTherapistResponse, ServerError } from "../../../common/types";

export const removeTherapist = async (email: string, password: string): Promise<RemoveTherapistResponse | ServerError> => {
    const response = await axios({
        method: 'patch',
        url: constants.URL + "/removeTherapist",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as RemoveTherapistResponse)
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
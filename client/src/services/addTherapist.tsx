import axios from 'axios';
import constants from '../static/static.json'
import { AddTherapistResponse, ServerError } from "../../../common/types";

export const addTherapist = async (email: string, password: string, therapistEmail: string):
    Promise<AddTherapistResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/addTherapist",
        auth: {
            username: email,
            password: password
        },
        data: {
            therapistEmail: therapistEmail,
        }
    })
        .then(r => r.data as AddTherapistResponse)
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
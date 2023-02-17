import axios from 'axios';
import constants from '../static/static.json'
import { TherapistLoginResponse, ServerError } from "../../../common/types";

export const therapistLogin = async (email: string, password: string): Promise<TherapistLoginResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/therapistLogin",
        data: {
            email: email,
            password: password
        }
    })
        .then(r => r.data as TherapistLoginResponse)
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
import axios from 'axios';
import constants from '../static/static.json'
import { TherapistRetrieveSpeechesResponse, ServerError } from "../../../common/types";

export const therapistRetrieveSpeeches = async (email: string, password: string, userEmail: string):
    Promise<TherapistRetrieveSpeechesResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/therapistRetrieveSpeeches",
        auth: {
            username: email,
            password: password
        },
        params: {
            userEmail: userEmail,
        }
    })
        .then(r => r.data as TherapistRetrieveSpeechesResponse)
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
import axios from 'axios';
import constants from '../static/static.json'
import { RetrieveSpeechesResponse, ServerError } from "../../../common/types";

export const retrieveSpeeches = async (email: string, password: string): Promise<RetrieveSpeechesResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/retrieveSpeeches",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as RetrieveSpeechesResponse)
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
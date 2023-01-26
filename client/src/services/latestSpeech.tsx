import axios from 'axios';
import constants from '../static/static.json'
import { LatestSpeechResponse, ServerError } from "../../../common/types";

export const latestSpeech = async (email: string): Promise<LatestSpeechResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/latestSpeech",
        params: {
            email: email
        }
    })
        .then(r => r.data as LatestSpeechResponse)
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
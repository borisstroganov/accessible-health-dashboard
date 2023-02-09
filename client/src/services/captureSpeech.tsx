import axios from 'axios';
import constants from '../static/static.json'
import { CaptureSpeechResponse, ServerError } from "../../../common/types";

export const captureSpeech = async (email: string, password: string, wpm: number, accuracy: number): Promise<CaptureSpeechResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/captureSpeech",
        auth: {
            username: email,
            password: password
        },
        data: {
            wpm: wpm,
            accuracy: accuracy,
        }
    })
        .then(r => r.data as CaptureSpeechResponse)
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
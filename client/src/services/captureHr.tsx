import axios from 'axios';
import constants from '../static/static.json'
import { CaptureHrResponse, ServerError } from "../../../common/types";

export const captureHr = async (email: string, password: string, hr: number): Promise<CaptureHrResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/captureHr",
        auth: {
            username: email,
            password: password
        },
        data: {
            hr: hr,
        }
    })
        .then(r => r.data as CaptureHrResponse)
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
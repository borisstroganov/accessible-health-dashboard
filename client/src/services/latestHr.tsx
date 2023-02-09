import axios from 'axios';
import constants from '../static/static.json'
import { LatestHrResponse, ServerError } from "../../../common/types";

export const latestHr = async (email: string, password: string): Promise<LatestHrResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/latestHr",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as LatestHrResponse)
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
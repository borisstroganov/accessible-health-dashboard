import axios from 'axios';
import constants from '../static/static.json'
import { LatestBpResponse, ServerError } from "../../../common/types";

export const latestBp = async (email: string): Promise<LatestBpResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/latestBp",
        params: {
            email: email
        }
    })
        .then(r => r.data as LatestBpResponse)
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
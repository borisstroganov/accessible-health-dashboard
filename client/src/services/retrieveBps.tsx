import axios from 'axios';
import constants from '../static/static.json'
import { RetrieveBpsResponse, ServerError } from "../../../common/types";

export const retrieveBps = async (email: string, password: string): Promise<RetrieveBpsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/retrieveBps",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as RetrieveBpsResponse)
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
import axios from 'axios';
import constants from '../static/static.json'
import { RetrieveHrsResponse, ServerError } from "../../../common/types";

export const retrieveHrs = async (email: string, password: string): Promise<RetrieveHrsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/retrieveHrs",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as RetrieveHrsResponse)
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
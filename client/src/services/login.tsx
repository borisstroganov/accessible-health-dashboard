import axios from 'axios';
import constants from '../static/static.json'
import { LoginResponse, ServerError } from "../../../common/types";

export const login = async (email: string, password: string): Promise<LoginResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/login",
        data: {
            email: email,
            password: password
        }
    })
        .then(r => r.data as LoginResponse)
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
import axios from 'axios';
import constants from '../static/static.json'
import { SignUpResponse, ServerError } from "../../../common/types";

export const signUp = async (email: string, name: string, password: string): Promise<SignUpResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/signup",
        data: {
            email: email,
            name: name,
            password: password
        }
    })
        .then(r => r.data as SignUpResponse)
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
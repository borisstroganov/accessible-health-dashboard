import axios from 'axios';
import constants from '../static/static.json'
import { TherapistSignUpResponse, ServerError } from "../../../common/types";

export const therapistSignUp = async (email: string, name: string, password: string): Promise<TherapistSignUpResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/therapistSignup",
        data: {
            email: email,
            name: name,
            password: password
        }
    })
        .then(r => r.data as TherapistSignUpResponse)
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
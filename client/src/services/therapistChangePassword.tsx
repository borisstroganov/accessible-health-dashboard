import axios from 'axios';
import constants from '../static/static.json'
import { TherapistChangePasswordResponse, ServerError } from "../../../common/types";

export const therapistChangePassword = async (email: string, currentPassword: string, newPassword: string, confirmPassword: string):
    Promise<TherapistChangePasswordResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/therapistChangePassword",
        auth: {
            username: email,
            password: currentPassword
        },
        data: {
            password: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }
    })
        .then(r => r.data as TherapistChangePasswordResponse)
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
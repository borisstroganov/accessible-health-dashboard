import axios from 'axios';
import constants from '../static/static.json'
import { ChangePasswordResponse, ServerError } from "../../../common/types";

export const changePassword = async (email: string, currentPassword: string, newPassword: string, confirmPassword: string):
    Promise<ChangePasswordResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/changePassword",
        data: {
            email: email,
            password: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }
    })
        .then(r => r.data as ChangePasswordResponse)
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
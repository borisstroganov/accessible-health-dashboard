import axios from 'axios';
import constants from '../static/static.json'
import { SendInvitationResponse, ServerError } from "../../../common/types";

export const sendInvitation = async (email: string, password: string, userEmail: string):
    Promise<SendInvitationResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/sendInvitation",
        auth: {
            username: email,
            password: password
        },
        data: {
            userEmail: userEmail,
        }
    })
        .then(r => r.data as SendInvitationResponse)
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
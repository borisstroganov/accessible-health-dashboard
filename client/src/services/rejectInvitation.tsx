import axios from 'axios';
import constants from '../static/static.json'
import { RejectInvitationResponse, ServerError } from "../../../common/types";

export const rejectInvitation = async (email: string, password: string, therapistEmail: string):
    Promise<RejectInvitationResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/rejectInvitation",
        auth: {
            username: email,
            password: password
        },
        data: {
            therapistEmail: therapistEmail,
        }
    })
        .then(r => r.data as RejectInvitationResponse)
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
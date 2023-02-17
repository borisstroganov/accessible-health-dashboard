import axios from 'axios';
import constants from '../static/static.json'
import { GetUserInvitationsResponse, ServerError } from "../../../common/types";

export const getUserInvitations = async (email: string, password: string): Promise<GetUserInvitationsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/getUserInvitations",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as GetUserInvitationsResponse)
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
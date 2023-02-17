import axios from 'axios';
import constants from '../static/static.json'
import { GetTherapistInvitationsResponse, ServerError } from "../../../common/types";

export const getTherapistInvitations = async (email: string, password: string): Promise<GetTherapistInvitationsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/getTherapistInvitations",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as GetTherapistInvitationsResponse)
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
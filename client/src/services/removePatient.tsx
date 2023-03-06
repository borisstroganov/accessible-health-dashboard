import axios from 'axios';
import constants from '../static/static.json'
import { RemovePatientResponse, ServerError } from "../../../common/types";

export const removePatient = async (email: string, password: string, userEmail: string): Promise<RemovePatientResponse | ServerError> => {
    const response = await axios({
        method: 'patch',
        url: constants.URL + "/removePatient",
        auth: {
            username: email,
            password: password
        },
        data: {
            userEmail: userEmail,
        }
    })
        .then(r => r.data as RemovePatientResponse)
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
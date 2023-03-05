import axios from 'axios';
import constants from '../static/static.json'
import { GetTherapistPatientsResponse, ServerError } from "../../../common/types";

export const getTherapistPatients = async (email: string, password: string): Promise<GetTherapistPatientsResponse | ServerError> => {
    const response = await axios({
        method: 'get',
        url: constants.URL + "/getTherapistPatients",
        auth: {
            username: email,
            password: password
        }
    })
        .then(r => r.data as GetTherapistPatientsResponse)
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
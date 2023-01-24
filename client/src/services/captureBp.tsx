import axios from 'axios';
import constants from '../static/static.json'
import { CaptureBpResponse, ServerError } from "../../../common/types";

export const captureBp = async (email: string, systolicPressure: number, diastolicPressure: number): Promise<CaptureBpResponse | ServerError> => {
    const response = await axios({
        method: 'post',
        url: constants.URL + "/captureBp",
        data: {
            email: email,
            systolicPressure: systolicPressure,
            diastolicPressure: diastolicPressure,
        }
    })
        .then(r => r.data as CaptureBpResponse)
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
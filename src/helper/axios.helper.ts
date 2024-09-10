import axios, { AxiosResponse } from 'axios';
import configureEnvironment from '../config/dotenv.config';

const { SV_REAL_ALARM } = configureEnvironment();
const axiosAlarm = axios.create({
    baseURL: SV_REAL_ALARM,
});

const handleRes = (response: AxiosResponse) => {
    if (response && response.data) {
        return response.data;
    }

    return response;
};

const handleError = (error: any) => {
    // console.log("error", error);
    // Handle errors
    throw error?.response?.data || error;
};

axiosAlarm.interceptors.response.use(handleRes, handleError);

export default axiosAlarm;

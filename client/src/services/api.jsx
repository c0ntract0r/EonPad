import axios from 'axios';

const options = {
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
}

const API = axios.create(options);


API.interceptors.response.use(
    // every time we get a response, get data immediately
    (response) => response.data,
    (error) => {
        const {status, data} = error.response;
        return Promise.reject({ status, ...data });
    }
)


export default API;
import axios from 'axios';

export const BASE_API_URL = 'http://localhost:8080/api';

const axiosConfig = {
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(axiosConfig);

export default axiosInstance;

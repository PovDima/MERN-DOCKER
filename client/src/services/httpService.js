import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true
});

instance.interceptors.response.use(null, error => Promise.reject(error));

export default instance

import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8080' //your api URL HTTP
    baseURL: 'https://localhost:8443' //your api URL HTTPS
});

export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' //your api URL
});

export default api;

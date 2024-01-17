import axios from 'axios';
import './environment.js';

const api = axios.create({
	baseURL: process.env.RESOURCE_API_URL,
	timeout: 15000,
});

export default api;

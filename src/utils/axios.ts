import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://serveur.mc/gitlab/'
});

axiosInstance.interceptors.request.use((config) => {
	if (config.headers) config.headers.authorization = 'Bearer GP8JgWPiqdHDSmAn9vM7';
	return config
})

export default axiosInstance;
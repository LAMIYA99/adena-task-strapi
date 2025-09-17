import axios from 'axios';

export default class AxiosCall {
    constructor(baseurl) {
        this.axiosInstance = axios.create({
            baseURL: baseurl,
            timeout: 10000
        });

    }
    async getProducts(url) {
        try {
            const response = await this.axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
}
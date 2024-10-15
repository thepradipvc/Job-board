import axios from "axios";

const apiInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export default apiInstance;
import axios from "axios"
//axios is used to communicate frontend with backend
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true //browser will send the cookies to server automatically on every single request 
    // by adding this field

})

export default axiosInstance;
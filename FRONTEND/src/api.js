

import axios from "axios"

const APIinstance = axios.create({
    baseURL : "https://ai-chatbot-7xot.onrender.com",
    withCredentials : true
})

export default APIinstance
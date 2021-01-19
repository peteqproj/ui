import axios from "axios";

const instance = axios.create({
    baseURL: process.env.APP_API,
    headers: {
      "content-type": "application/json",
    },
    responseType: "json"
});

export default instance
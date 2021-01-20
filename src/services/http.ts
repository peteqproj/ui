import axios from "axios";

let baseURL = process.env.REACT_APP_API;

const instance = axios.create({
    baseURL,
    headers: {
      "content-type": "application/json",
    },
    responseType: "json"
});

export default instance
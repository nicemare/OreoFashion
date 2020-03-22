import axios from 'axios';
import globalConfig from 'src/utils/global';

import configApi from 'src/config/api';
import demoConfig from "./demo";

const request = axios.create();

const jwtRequiredList = ['rnlab-app-control', 'dokan'];

request.interceptors.request.use(
  config => {
    config.baseURL = configApi.API_ENDPOINT + '/wp-json';

    const url = config.url;
    const checkJwt = jwtRequiredList.findIndex(jwt => url.includes(jwt));

    if (checkJwt >= 0 && globalConfig.getToken()) {
      config.headers = {
        Authorization: `Bearer ${globalConfig.getToken()}`,
      }
    } else {
      config.params = {
        consumer_key: configApi.CONSUMER_KEY,
        consumer_secret: configApi.CONSUMER_SECRET,
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return Promise.reject(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  },
);

// request.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

export default request;

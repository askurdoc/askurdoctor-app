import { BASE_URL } from '../config/constants';
import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('accessToken');

      if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest);
    const refreshTokenUrl = `${BASE_URL()}/api/v1/users/auth/refreshToken`;

    if (originalRequest.url === refreshTokenUrl) {
      // Already tried to refresh, but request has an error
      console.log('UNABLE TO REFRESH');
      return Promise.reject(error);
    } else if (error.response.status === 401 && !originalRequest._retry) {
      console.log('TRYING TO REFRESH');
      originalRequest._retry = true;
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      return axios
        .post(refreshTokenUrl, {
          accessToken,
          refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + localStorage.getItem('accessToken');
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  },
);

const helpers = {
  callApi: function (method, path, data, headers, url = BASE_URL()) {
    const callUrl = url + path;
    console.log('CALLING', callUrl);
    return axios({
      method: method,
      url: callUrl,
      data: data,
      headers: headers,
    })
  },
};

export default helpers;

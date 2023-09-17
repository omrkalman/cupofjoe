import axios, {AxiosRequestConfig} from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

axios.defaults.baseURL = import.meta.env.VITE_HOST + '/api';

class API {
  route: string;
  constructor(route: string) {
    this.route = route
  }

  get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return axios.get(this.route + url, config);
  } 

  post(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.post(this.route + url, data, config);
  } 

  patch(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.patch(this.route + url, data, config);
  } 

  put(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return axios.put(this.route + url, data, config);
  } 

  delete(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return axios.delete(this.route + url, config);
  } 
};


export default API;
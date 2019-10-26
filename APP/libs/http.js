import uniRequest from 'uni-request'
import store from '@/store'
let Ajax = Object.create(uniRequest);
Ajax.interceptors.request.use(
	config => {
		config.baseURL = store.state.BaseUrl;
		let token = uni.getStorageSync('estateToken') || store.state.estateToken;
		token && (config.headers.Authorization = token);
		return config;
	},
	err => {
		return Promise.reject(err);
	});
Ajax.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return Promise.reject(err) // 返回接口返回的错误信息
  });
	
export default Ajax

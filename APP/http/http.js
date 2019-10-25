import uniRequest from 'uni-request'
import store from '@/store/index'
let Ajax = Object.create(uniRequest);
Ajax.defaults.baseURL = "https://levy.chidict.com";
Ajax.interceptors.request.use(
	config => {
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

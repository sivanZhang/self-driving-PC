import store from '@/store'
import Request from './request'
const http = new Request()
/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
// 有默认，非必写
http.validateStatus = (statusCode) => {
	return statusCode === 200
}
let token = uni.getStorageSync('estateToken') || store.state.estateToken;
http.interceptor.request((config, cancel) => {
	/* 请求之前拦截器 */
	config.header = {
		...config.header,
		baseUrl: store.state.BaseUrl,
		Authorization: token,
	}
	return config
})

// 必须使用异步函数，注意
http.interceptor.response((response) => {
	/* 请求之后拦截器 */
	if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
		return Promise.reject(response)
	}
	return response
}, (response) => { // 请求错误做点什么
	return response
})

export default http
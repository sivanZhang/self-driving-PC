import Ajax from '../http/http'
//获取通知列表
export const GET_Notice = async (data = "") => {
	return await Ajax.get('/notice/notice/?json', {
		data
	})
}
//已读未读信息
export const POST_Notice = async (data = {}) => {
	return await Ajax.post('/notice/notice/?json', data)
}
/**
 * @description 删除或添加评论
 * @param {Object} data 传给接口的参数对象
 */
export const POST_Reply = async (payload) => {
	return await Ajax.post('/reply/replies/?json', payload)
}
//获取评论
export const GET_Reply = async (data = "") => {
	return await Ajax.get('/reply/replies/?json', {
		data
	})
}
//获取news或者根据id获取detaile
export const GET_News = async () => {
	return await Ajax.get('/annoucement/annoucement/?json')
}
export const GET_NewsDtail = async (data = "") => {
	return await Ajax.get('/annoucement/annoucement/?json', {
		data
	})
}

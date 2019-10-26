import Ajax from '../libs/http'
//获取通知列表
export function GET_Notice(params) {
	return Ajax.get('/notice/notice/?json', {
		params
	})
}
//已读未读信息
export function POST_Notice(data) {
	return Ajax.post('/notice/notice/?json', data)
}
//获取news或者根据id获取detaile
export const GET_News = params => {
	return Ajax.get('/annoucement/annoucement/?json', {
		params
	})
}
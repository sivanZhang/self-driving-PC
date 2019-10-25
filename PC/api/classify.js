import Ajax from '../http/http'
//获取分类列表
export function Get_Category(payload){
	 return Ajax.get('/reqcategory/reqcategory/?json', payload);
}
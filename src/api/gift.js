import AXIOS from '@/libs/request'
//查看礼品
export function viewGifts(){
    return AXIOS.get('/product/product/')
}
//查看礼品分类
export function viewGiftsClass(){
  return AXIOS.get('/product/category/')
}
//查看礼品规格
export function viewGiftsSpecs(){
  return AXIOS.get('/product/specifications/')
}
//上传附件
export function uploadAttachment(data) {
    return AXIOS.post('/appfile/appfile/',data)
  }
  //添加礼品
  export function addGifts(data) {
    return AXIOS.post('/product/product/', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: [params => {
        return JSON.stringify(params)
      }]
    })
  }  
  //删除礼品
export function deleteGift(data) {
  return AXIOS.post('/product/product/?delete', data)
}
//添加礼品规格
export function addGiftSpecs(data) {
  return AXIOS.post('/product/specifications/', data)
}  



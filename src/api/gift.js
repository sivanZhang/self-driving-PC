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
export function uploadAttachment(params) {
    return AXIOS.post('/appfile/appfile/', params)
  }
  //添加礼品
  export function addGifts(params) {
    return AXIOS.post('/product/product/', params)
  }  
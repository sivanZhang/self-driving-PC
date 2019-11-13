import AXIOS from '@/libs/request'
//查看礼品
export function viewGifts(){
    return AXIOS.get('/product/product/')
}
//上传附件
export function uploadAttachment(params) {
    return AXIOS.post('/appfile/appfile/', params)
  }
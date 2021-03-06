import AXIOS from '@/libs/request'
//查看礼品
export function viewGifts(params){
    return AXIOS.get('/product/product/',{params})
}
//查看礼品分类
export function viewGiftsClass(){
  return AXIOS.get('/product/category/')
}
//查看礼品规格
export function viewGiftsSpecs(params){
  return AXIOS.get('/product/specifications/',{params})
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
  //修改礼品
  export function alterGift(data) {
    return AXIOS.post('/product/product/?put', data,{
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
//修改礼品规格

export function alterGiftSpecs(data) {
  return AXIOS.post('/product/specifications/?put', data)
}  


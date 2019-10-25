import AXIOS from '@/libs/request'
export function getMaterial(params) {
  return AXIOS.get('/material/material/', { params })
}
export function addMaterial(data) {
  return AXIOS.post('/material/material/', data)
}
export function delMaterial(data) {
  return AXIOS.post('/material/material/?delete', data)
}
export function putMaterial(data) {
  return AXIOS.post('/material/material/?put', data)
}

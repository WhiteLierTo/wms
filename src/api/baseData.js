import request from '@/utils/request'

// 获取库房列表
export function getWarehouseList(params) {
  return request({
    url: 'bdWarehouse/list',
    method: 'get',
    params
  })
}
// 修改库房信息
export function putWarehouse(params) {
  return request({
    url: 'bdWarehouse',
    method: 'put',
    params
  })
}
// 获取库位列表
export function getLocationList(params) {
  return request({
    url: 'bdLocation/list',
    method: 'get',
    params
  })
}

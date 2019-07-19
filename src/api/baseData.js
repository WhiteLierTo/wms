import request from '@/utils/request'

// 获取库房列表
export function getWarehouseList(params) {
  return request({
    url: 'bdWarehouse/mine/list',
    method: 'get',
    params
  })
}
// 获取库房列表
export function getWarehouseAll(params) {
  return request({
    url: 'bdWarehouse/all',
    method: 'get',
    params
  })
}
// 修改库房信息
export function putWarehouse(data) {
  return request({
    url: 'bdWarehouse',
    method: 'put',
    data
  })
}
// 新增库房信息
export function postWarehouse(data) {
  return request({
    url: 'bdWarehouse',
    method: 'post',
    data
  })
}
// 获取库位列表
export function getLocationList(params) {
  return request({
    url: 'bdLocation/mine/list',
    method: 'get',
    params
  })
}
// 获取库位全部列表
export function getLocationAll(params) {
  return request({
    url: 'bdLocation/all',
    method: 'get',
    params
  })
}
// 修改库房信息
export function putLocation(data) {
  return request({
    url: 'bdLocation',
    method: 'put',
    data
  })
}
// 新增库房信息
export function postLocation(data) {
  return request({
    url: 'bdLocation',
    method: 'post',
    data
  })
}

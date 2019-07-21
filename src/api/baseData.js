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
// 新增库房信息
export function postLocation(data) {
  return request({
    url: 'bdLocation',
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
// 分页获取批次列表
export function getinvBatchList(params) {
  return request({
    url: 'invBatch/list',
    method: 'get',
    params
  })
}

// 获取全部批次列表
export function getAllinvBatchList(params) {
  return request({
    url: 'invBatch/all',
    method: 'get',
    params
  })
}

// 更新批次列表
export function updateinvBatchList(data) {
  return request({
    url: 'invBatch',
    method: 'put',
    data
  })
}

// 增加批次列表
export function addinvBatchList(data) {
  return request({
    url: 'invBatch',
    method: 'post',
    data
  })
}

// 分页获取库存列表
export function getInvControlList(params) {
  return request({
    url: 'invControl/list',
    method: 'get',
    params
  })
}

// 获取全部库存列表
export function getAllInvControlList(params) {
  return request({
    url: 'invControl/all',
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
// 更新库存列表
export function updateInvControlList(data) {
  return request({
    url: 'invControl',
    method: 'put',
    data
  })
}

// 增加库存列表
export function addInvControlList(data) {
  return request({
    url: 'invControl',
    method: 'post',
    data
  })
}

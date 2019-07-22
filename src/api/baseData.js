import request from '@/utils/request'
const baseURL = 'http://116.62.212.169:8100/wms/'

// 获取库房列表
export function getWarehouseList(params) {
    return request({
        baseURL,
        url: 'bdWarehouse/mine/list',
        method: 'get',
        params
    })
}
// 获取库房列表
export function getWarehouseAll(params) {
    return request({
        baseURL,
        url: 'bdWarehouse/all',
        method: 'get',
        params
    })
}
// 修改库房信息
export function putWarehouse(data) {
    return request({
        baseURL,
        url: 'bdWarehouse',
        method: 'put',
        data
    })
}
// 新增库房信息
export function postWarehouse(data) {
    return request({
        baseURL,
        url: 'bdWarehouse',
        method: 'post',
        data
    })
}
// 新增库房信息
export function postLocation(data) {
    return request({
        baseURL,
        url: 'bdLocation',
        method: 'post',
        data
    })
}
// 修改库房信息
export function putLocation(data) {
    return request({
        baseURL,
        url: 'bdLocation',
        method: 'put',
        data
    })
}
// 获取库位列表
export function getLocationList(params) {
    return request({
        baseURL,
        url: 'bdLocation/mine/list',
        method: 'get',
        params
    })
}
// 获取库位全部列表
export function getLocationAll(params) {
    return request({
        baseURL,
        url: 'bdLocation/all',
        method: 'get',
        params
    })
}
// 分页获取批次列表
export function getinvBatchList(params) {
    return request({
        baseURL,
        url: 'bdBatch/list',
        method: 'get',
        params
    })
}

// 获取全部批次列表
export function getAllinvBatchList(params) {
    return request({
        baseURL,
        url: 'bdBatch/all',
        method: 'get',
        params
    })
}

// 更新批次列表
export function updateinvBatchList(data) {
    return request({
        baseURL,
        url: 'bdBatch',
        method: 'put',
        data
    })
}

// 增加批次列表
export function addinvBatchList(data) {
    return request({
        baseURL,
        url: 'bdBatch',
        method: 'post',
        data
    })
}

// 分页获取库存列表
export function getInvControlList(params) {
    return request({
        baseURL,
        url: 'invInventory/list',
        method: 'get',
        params
    })
}

// 获取全部库存列表
export function getAllInvControlList(params) {
    return request({
        baseURL,
        url: 'invInventory/all',
        method: 'get',
        params
    })
}

// 更新库存列表
export function updateInvControlList(data) {
    return request({
        baseURL,
        url: 'invInventory',
        method: 'put',
        data
    })
}

// 增加库存列表
export function addInvControlList(data) {
    return request({
        baseURL,
        url: 'invInventory',
        method: 'post',
        data
    })
}
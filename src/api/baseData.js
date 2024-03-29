// 基础数据接口
import request from '@/utils/request'
export const baseURL = 'http://116.62.212.169:8100/wms-main/'
// export const baseURL = 'http://192.18.1.149:8100/wms-main/'

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
// 获取单个库房信息
export function getWarehouseOne(params) {
  return request({
    baseURL,
    url: 'bdWarehouse/one',
    method: 'get',
    params
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
    url: 'bdBatch/mine/addBatch',
    method: 'post',
    data
  })
}

// 分页获取库存列表
export function getInvControlList(params) {
  return request({
    baseURL,
    url: 'invInventory/mine/list',
    method: 'get',
    params
  })
}

// 分页获取库存列表
export function getInvControl(params) {
  return request({
    baseURL,
    url: 'invInventory/list',
    method: 'get',
    params
  })
}
// 获取单个库存列表
export function getInvControlOne(params) {
  return request({
    baseURL,
    url: 'invInventory/one',
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
// 获取单位列表
export function getUnit(params) {
  return request({
    baseURL,
    url: 'bdUnit/mine/list',
    method: 'get',
    params
  })
}

// 获取单位所有数据
export function getUnitAll(params) {
  return request({
    baseURL,
    url: 'bdUnit/all',
    method: 'get',
    params
  })
}
// 增加单位
export function postUnit(data) {
  return request({
    baseURL,
    url: 'bdUnit',
    method: 'post',
    data
  })
}

// 更新单位
export function putUnit(data) {
  return request({
    baseURL,
    url: 'bdUnit',
    method: 'put',
    data
  })
}
// 删除单位
export function deleteUnit(id) {
  return request({
    baseURL,
    url: `bdUnit/${id}`,
    method: 'delete'
  })
}
// 获取单位换算列表
export function getUnitConversion(params) {
  return request({
    baseURL,
    url: 'bdUnitConverter/list',
    method: 'get',
    params
  })
}
// 获取全部物料
export function getItemAllFnc(params) {
  return request({
    baseURL,
    url: 'bdItem/all',
    method: 'get',
    params
  })
}
// 新增单位换算
export function postUnitConversion(data) {
  return request({
    baseURL,
    url: 'bdUnitConverter',
    method: 'post',
    data
  })
}
// 新增单位换算
export function putUnitConversion(data) {
  return request({
    baseURL,
    url: 'bdUnitConverter',
    method: 'put',
    data
  })
}
// 删除单位换算
export function deleteUnitConversion(id) {
  return request({
    baseURL,
    url: `bdUnitConverter/${id}`,
    method: 'delete'
  })
}

// 分页获取物料
export function getItemList(params) {
  return request({
    baseURL,
    url: 'bdItem/mine/list',
    method: 'get',
    params
  })
}

// 获取所有物料
export function getAllItemList(params) {
  return request({
    baseURL,
    url: 'bdItem/all',
    method: 'get',
    params
  })
}

// 增加物料列表
export function addBdItemList(data) {
  return request({
    baseURL,
    url: 'bdItem',
    method: 'post',
    data
  })
}

// 更新物料列表
export function updateItemList(data) {
  return request({
    baseURL,
    url: 'bdItem',
    method: 'put',
    data
  })
}
// 获取单个物料
export function getOneItemList(params) {
  return request({
    baseURL,
    url: 'bdItem/one',
    method: 'get',
    params
  })
}

// 外部单据分页列表
export function getbdExternalBillTypeList(params) {
  return request({
    baseURL,
    url: 'bdExternalBillType/list',
    method: 'get',
    params
  })
}

// 外部单据全部列表
export function getAllbdExternalBillTypeList(params) {
  return request({
    baseURL,
    url: 'bdExternalBillType/all',
    method: 'get',
    params
  })
}

// 删除外部单据
export function deleteBdExternalBillTypeList(id) {
  return request({
    baseURL,
    url: `bdExternalBillType/${id}`,
    method: 'delete'
  })
}

// 增加物料列表
export function addBdExternalBillTypeList(data) {
  return request({
    baseURL,
    url: 'bdExternalBillType',
    method: 'post',
    data
  })
}

// 更新物料列表
export function updateBdExternalBillTypeList(data) {
  return request({
    baseURL,
    url: 'bdExternalBillType',
    method: 'put',
    data
  })
}
// 分页获取出入库历史
export function getHistoricalRecordList(params) {
  return request({
    baseURL,
    url: 'invInOutHistory/mine/list',
    method: 'get',
    params
  })
}
// 删除出入库历史
export function deleteHistoricalRecord(id) {
  return request({
    baseURL,
    url: `invInOutHistory/${id}`,
    method: 'delete'
  })
}
// 获取单个物料
export function getItemOne(params) {
  return request({
    baseURL,
    url: 'bdItem/one',
    method: 'get',
    params
  })
}
// 获取单个批次
export function getBatchOne(params) {
  return request({
    baseURL,
    url: 'bdBatch/one',
    method: 'get',
    params
  })
}
// 获取通用字典列表
export function getDictionaryList(params) {
  return request({
    baseURL,
    url: 'syDictionary/list',
    method: 'get',
    params
  })
}
// 修改通用字典
export function putDictionary(data) {
  return request({
    baseURL,
    url: 'syDictionary',
    method: 'put',
    data
  })
}
// 新增通用字典列表
export function postDictionary(data) {
  return request({
    baseURL,
    url: 'syDictionary',
    method: 'post',
    data
  })
}
// 获取所有通用字典数据
export function getDictionaryAll(params) {
  return request({
    baseURL,
    url: 'syDictionary/all',
    method: 'get',
    params
  })
}
// 删除字典
export function deleteDictionary(id) {
  return request({
    baseURL,
    url: `syDictionary/${id}`,
    method: 'delete'
  })
}
// 获取单个库位信息
export function getLocationOne(params) {
  return request({
    baseURL,
    url: 'bdLocation/one',
    method: 'get',
    params
  })
}
// 获取所有供应商
export function getSupplier(params) {
  return request({
    baseURL,
    url: 'bdSupplier/all',
    method: 'get',
    params
  })
}
// 获取单个供应商
export function getSupplierOne(params) {
  return request({
    baseURL,
    url: 'bdSupplier/one',
    method: 'get',
    params
  })
}

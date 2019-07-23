import request from '@/utils/request'
const baseURL = 'http://116.62.212.169:8100/wms/'

// 获取单头列表
export function getStockInHeader(params) {
  return request({
    baseURL,
    url: 'invStockInHeader/list',
    method: 'get',
    params
  })
}// 获取单个单头
export function getStockInHeaderOne(params) {
  return request({
    baseURL,
    url: 'invStockInHeader/one',
    method: 'get',
    params
  })
}
// 获取单行列表
export function getStockInLine(params) {
  return request({
    baseURL,
    url: 'invStockInLine/list',
    method: 'get',
    params
  })
}
// 获取外部单据类型列表
export function getTypeAllFnc(params) {
  return request({
    baseURL,
    url: 'bdExternalBillType/all',
    method: 'get',
    params
  })
}
// 获取入库明细
export function getStockDetailFnc(params) {
  return request({
    baseURL,
    url: 'invStockInDetail/list',
    method: 'get',
    params
  })
}

// 获取单个单行
export function getStockInLineOne(params) {
  return request({
    baseURL,
    url: 'invStockInLine/one',
    method: 'get',
    params
  })
}

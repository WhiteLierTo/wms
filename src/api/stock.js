// 出入库接口
import request from '@/utils/request'
const baseURL = 'http://116.62.212.169:8100/wms/'
// const baseURL = 'http://172.16.28.17:8100/wms/'

// 入库
// 获取单头列表
export function getStockInHeader(params) {
  return request({
    baseURL,
    url: 'invStockInHeader/list',
    method: 'get',
    params
  })
} // 获取单个单头
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
// 入库新增点收明细
export function postStockInDetail(data) {
  return request({
    baseURL,
    url: 'invStockInDetail',
    method: 'post',
    data
  })
}
// 入库修改明细
export function putStockInDetail(data) {
  return request({
    baseURL,
    url: 'invStockInDetail',
    method: 'put',
    data
  })
}
// 点收明细新增
export function postCounting(data) {
  return request({
    baseURL,
    url: 'invStockInDetail/mine/register',
    method: 'post',
    data
  })
}
// 点收明细修改
export function putCounting(data) {
  return request({
    baseURL,
    url: 'invStockInDetail/mine/unRegister',
    method: 'put',
    data
  })
}
// 上架明细新增
export function postShelves(data) {
  return request({
    baseURL,
    url: 'invStockInDetail/mine/stockIn',
    method: 'post',
    data
  })
}
// 上架明细取消
export function putShelves(data) {
  return request({
    baseURL,
    url: 'invStockInDetail/mine/unStockIn',
    method: 'put',
    data
  })
}
// 单头新增
export function postHeader(data) {
  return request({
    baseURL,
    url: 'invStockInHeader',
    method: 'post',
    data
  })
}
// 单头修改
export function putHeader(data) {
  return request({
    baseURL,
    url: 'invStockInHeader',
    method: 'put',
    data
  })
}
// 单头删除
export function deleteHeader(id) {
  return request({
    baseURL,
    url: `invStockInHeader/${id}`,
    method: 'delete'
  })
}
// 单头状态修改
export function putHeaderStatus(data) {
  return request({
    baseURL,
    url: 'invStockInHeader',
    method: 'put',
    data
  })
}
// 获取单头状态
export function getHeaderStatus(params) {
  return request({
    baseURL,
    url: 'invStockInHeader/one',
    method: 'get',
    params
  })
}
// 添加单行
export function postLine(data) {
  return request({
    baseURL,
    url: 'invStockInLine',
    method: 'post',
    data
  })
}
// 单行编辑
export function putLine(data) {
  return request({
    baseURL,
    url: 'invStockInLine',
    method: 'put',
    data
  })
}
// 单行删除
export function deleteLine(id) {
  return request({
    baseURL,
    url: `invStockInLine/${id}`,
    method: 'delete'
  })
}

// 入库END

// 出库

// 获取出库单头
export function getStockOutHeaderList(params) {
  return request({
    baseURL,
    url: 'invStockOutHeader/list',
    method: 'get',
    params
  })
}
// 出库单头修改
export function putStockOutHeader(data) {
  return request({
    baseURL,
    url: 'invStockOutHeader',
    method: 'put',
    data
  })
}

// 出库单头新增
export function postStockOutHeader(data) {
  return request({
    baseURL,
    url: 'invStockOutHeader',
    method: 'post',
    data
  })
}
// 出库单头删除
export function deleteStockOutHeader(id) {
  return request({
    baseURL,
    url: `invStockOutHeader/${id}`,
    method: 'delete'
  })
}

// 获取出库单行
export function getStockOutLineList(params) {
  return request({
    baseURL,
    url: 'invStockOutLine/list',
    method: 'get',
    params
  })
}
// 出库单行修改
export function putStockOutLine(data) {
  return request({
    baseURL,
    url: 'invStockOutLine',
    method: 'put',
    data
  })
}

// 出库单行新增
export function postStockOutLine(data) {
  return request({
    baseURL,
    url: 'invStockOutLine/mine/add',
    method: 'post',
    data
  })
}
// 出库单行删除
export function deleteStockOutLine(id) {
  return request({
    baseURL,
    url: `invStockOutLine/${id}`,
    method: 'delete'
  })
}
// 出库单头状态修改
export function putStockOutHeaderStatus(data) {
  return request({
    baseURL,
    url: 'invStockOutHeader',
    method: 'put',
    data
  })
}
// 捡获明细新增
export function postStockOutCounting(data) {
  return request({
    baseURL,
    url: 'invStockOutDetail/mine/pick',
    method: 'post',
    data
  })
}
// 出库明细
export function getStockOutDetail(params) {
  return request({
    baseURL,
    url: 'invStockOutDetail/list',
    method: 'get',
    params
  })
}
// 获取单个出库单行
export function getStockOutLineOne(params) {
  return request({
    baseURL,
    url: 'invStockOutLine/one',
    method: 'get',
    params
  })
}
// 获取出库单头状态
export function getStockOutHeaderStatus(params) {
  return request({
    baseURL,
    url: 'invStockOutHeader/one',
    method: 'get',
    params
  })
}
// 取消拣货
export function putStockOutCounting(data) {
  return request({
    baseURL,
    url: 'invStockOutDetail/mine/unPick',
    method: 'put',
    data
  })
}
// 出库明细新增
export function postStockout(data) {
  return request({
    baseURL,
    url: 'invStockOutDetail/mine/stockOut',
    method: 'post',
    data
  })
}
// 上架明细取消
export function putStockout(data) {
  return request({
    baseURL,
    url: 'invStockOutDetail/mine/unStockOut',
    method: 'put',
    data
  })
}

// 标签接口
import request from '@/utils/request'
const baseURL = 'http://116.62.212.169:8101/wms-label/'

// 分页获取标签
export function getLabelTemplateList(params) {
    return request({
        baseURL,
        url: 'labelTemplate/list',
        method: 'get',
        params
    })
}
// 获取所有标签
export function getAllLabelTemplateList(params) {
    return request({
        baseURL,
        url: 'labelTemplate/all',
        method: 'get',
        params
    })
}
// 删除标签列表
export function deleteTemplate(id) {
    return request({
        baseURL,
        url: `labelTemplate/${id}`,
        method: 'delete'
    })
}
// 新增标签列表
export function addTemplate(data) {
    return request({
        baseURL,
        url: 'labelTemplate',
        method: 'post',
        data
    })
}
// 修改标签列表
export function updateTemplate(data) {
    return request({
        baseURL,
        url: 'labelTemplate',
        method: 'put',
        data
    })
}
// 分页获取打印机列表
export function getPrinterList(params) {
    return request({
        baseURL,
        url: 'sysPrinter/list',
        method: 'get',
        params
    })
}
// 修改打印机
export function putPrinter(data) {
    return request({
        baseURL,
        url: 'sysPrinter',
        method: 'put',
        data
    })
}
// 新增打印机
export function postPrinter(data) {
    return request({
        baseURL,
        url: 'sysPrinter',
        method: 'post',
        data
    })
}
// 删除打印机
export function deletePrinter(id) {
    return request({
        baseURL,
        url: `sysPrinter/${id}`,
        method: 'delete'
    })
}
// 获取全部打印机
export function getPrinterAll(params) {
    return request({
        baseURL,
        url: 'sysPrinter/all',
        method: 'get',
        params
    })
}
// 分页获取标签操作日志列表
export function getLabelOperationLogList(params) {
    return request({
        baseURL,
        url: 'labelOperationLog/list',
        method: 'get',
        params
    })
}
// 获取全部标签操作日志
export function getOperationAll(params) {
    return request({
        baseURL,
        url: 'labelOperationLog/all',
        method: 'get',
        params
    })
}
// 分页获取标签打印数据接口列表
export function getLabelDataList(params) {
    return request({
        baseURL,
        url: 'labelData/list',
        method: 'get',
        params
    })
}
// 修改标签打印数据
export function putLabelData(data) {
    return request({
        baseURL,
        url: 'labelData',
        method: 'put',
        data
    })
}
// 新增标签打印数据
export function postLabelData(data) {
    return request({
        baseURL,
        url: 'labelData',
        method: 'post',
        data
    })
}
// 删除标签打印数据
export function deleteLabelData(id) {
    return request({
        baseURL,
        url: `labelData/${id}`,
        method: 'delete'
    })
}
// 获取标签打印数据
export function getLabelDataAll(params) {
    return request({
        baseURL,
        url: 'labelData/all',
        method: 'get',
        params
    })
}
// 分页获取标签列表
export function getLabelList(params) {
    return request({
        baseURL,
        url: 'label/list',
        method: 'get',
        params
    })
}
// 获取全部标签
export function getLabelAll(params) {
    return request({
        baseURL,
        url: 'label/all',
        method: 'get',
        params
    })
}
// 分页获取模板控件列表
export function getTemplateWidgetList(params) {
    return request({
        baseURL,
        url: 'labelTemplateWidget/list',
        method: 'get',
        params
    })
}
// 修改模板控件
export function putTemplateWidget(data) {
    return request({
        baseURL,
        url: 'labelTemplateWidget',
        method: 'put',
        data
    })
}
// 新增模板控件
export function postTemplateWidget(data) {
    return request({
        baseURL,
        url: 'labelTemplateWidget',
        method: 'post',
        data
    })
}
// 删除模板控件
export function deleteTemplateWidget(id) {
    return request({
        baseURL,
        url: `labelTemplateWidget/${id}`,
        method: 'delete'
    })
}
// 获取全部模板控件
export function getTemplateWidgetAll(params) {
    return request({
        baseURL,
        url: 'labelTemplateWidget/all',
        method: 'get',
        params
    })
}

// 新增元素
export function addlabelTemplateEle(data) {
    return request({
        baseURL,
        url: 'labelTemplateElement',
        method: 'post',
        data
    })
}
// 获取所有元素
export function getAllLabelTemplate(params) {
    return request({
        baseURL,
        url: 'labelTemplateElement/all',
        method: 'get',
        params
    })
}
// 删除元素
export function deleteLabelTemplate(id) {
    return request({
        baseURL,
        url: `labelTemplateElement/${id}`,
        method: 'delete'
    })
}
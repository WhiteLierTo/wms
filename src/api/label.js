// 标签接口
import request from '@/utils/request'
const baseURL = 'http://116.62.212.169:8100/wms-main/'

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
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'srvServiceDetail/mine/list',
    method: 'get',
    params
  })
}

export function addList(data) {
  return request({
    url: 'srvServiceDetail',
    method: 'post',
    data
  })
}

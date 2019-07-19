import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bdWarehouse/list',
    method: 'get',
    params
  })
}

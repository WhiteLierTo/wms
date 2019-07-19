import request from '@/utils/request'

export function getWarehouseList(params) {
  return request({
    url: '/bdWarehouse/list',
    method: 'get',
    params
  })
}

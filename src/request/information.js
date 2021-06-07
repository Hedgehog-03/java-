import http from '@/utils/httpInstance';

export function getInfo(pageNum, pageSize) {
  return http.get(`/staff/${pageNum}/${pageSize}`)
}
export function putInfo(param) {
  return http.put(`/staff`, param)
}


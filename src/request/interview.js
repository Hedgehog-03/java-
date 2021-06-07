import http from '@/utils/httpInstance';

export function getInterview(pageNum, pageSize) {
  return http.get(`/employeeInterview/${pageNum}/${pageSize}`)
}
export function postInterview(params) {
  return http.post('/employeeInterview', params)
}
export function putInterview(params) {
  return http.put('/employeeInterview', params)
}
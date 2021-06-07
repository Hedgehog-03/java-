import http from '@/utils/httpInstance';

export function listApi(page = 1) {
    return http.get("/attendance/0/10",{page})
}
export function getVacate(pageNum,pageSize) {
  return http.get(`/leaveRecord/${pageNum}/${pageSize}`)
}
// export function getUser() {
//   return http.get("/attendance/0/10")
// }

export function postVacate(params) {
    return http.post('/leaveRecord', params)
  }
  export function putVacate(params) {
    return http.put('/leaveRecord', params)
  }

import http from '@/utils/httpInstance';

export function listApi(page = 1) {
    return http.get("/attendance/0/10",{page})
}
export function getCheck(pageNum,pageSize) {
  return http.get(`/attendance/${pageNum}/${pageSize}`)
}
// export function getUser() {
//   return http.get("/attendance/0/10")
// }

export function postCheck(params) {
    return http.post('/attendance', params)
  }
  export function putCheck(params) {
    return http.put('/attendance', params)
  }

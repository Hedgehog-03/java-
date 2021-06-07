import http from '@/utils/httpInstance';

export function getUser(pageNum, pageSize) {
  return http.get(`/user/${pageNum}/${pageSize}`)
}
export function postUser(params) {
  return http.post('/user', params);
}
export function deleteUser(id) {
  return http.delete(`/user/${id}`);
}
export function putUser(params) {
  return http.put('/user', params);
}
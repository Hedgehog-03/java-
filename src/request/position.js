import http from '@/utils/httpInstance';

export function getPosition(pageNum, pageSize) {
  return http.get(`/position/${pageNum}/${pageSize}`)
}
export function postPosition(params) {
  return http.post("/position", params);
}
export function delPosition(id) {
  return http.delete(`/position/${id}`);
}
export function putPosition(params) {
  return http.put("/position", params);
}
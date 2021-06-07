import http from '@/utils/httpInstance';

export function getTrain(pageNum, pageSize) {
  return http.get(`/training/${pageNum}/${pageSize}`)
}
export function deleteTrain(id) {
  return http.delete(`/training/${id}`)
}
export function postTrain(params) {
  return http.post("/training", params);
}

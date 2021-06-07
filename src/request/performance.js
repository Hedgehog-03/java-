import http from '@/utils/httpInstance';

export function getPerformance(pageNum, pageSize) {
  return http.get(`/performance/${pageNum}/${pageSize}`)
}
export function postPerformance(params) {
  return http.post("/performance", params);
}


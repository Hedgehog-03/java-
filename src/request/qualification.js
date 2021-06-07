import http from '@/utils/httpInstance';

export function getQualification(pageNum, pageSize) {
  return http.get(`/qualification/${pageNum}/${pageSize}`)
}
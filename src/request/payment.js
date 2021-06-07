import http from '@/utils/httpInstance';
export function getPay(pageNum,pageSize) {
    return http.get(`/payRoll/${pageNum}/${pageSize}`)
}
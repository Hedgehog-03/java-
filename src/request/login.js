import http from '@/utils/httpInstance';

export function login(data) {
  return http.get('/login', {
    params: data
  })
}
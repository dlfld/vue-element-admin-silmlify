import request from '@/utils/request'

//加载全部
export function getList() {
  return request({
    url: '/relations_v2',
    method: 'get'
  })
}

//关注用户
export function attendsUser(userId, attendedId) {
  return request({
    url: '/attention/' + userId + '/' + attendedId,
    method: 'get'
  })
}

//取关用户
export function disAttendsUser(userId, attendedId) {
  return request({
    url: '/dis_attention/' + userId + '/' + attendedId,
    method: 'get'
  })
}

//获取用户关注了哪些用户
export function getAttendsUsers(userId) {
  return request({
    url: '/user_attends/' + userId,
    method: 'get'
  })
}

//获取用户关注了哪些用户
export function getUsersFans(userId) {
  return request({
    url: '/fans/' + userId,
    method: 'get'
  })
}

//获取一个用户是否关注另一个用户
export function auditIsAttendsAnotherUser(userId, otherUserId) {
  return request({
    url: '/audit_user_is_attends/' + userId + '/' + otherUserId,
    method: 'get'
  })
}

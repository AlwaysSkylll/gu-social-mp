var commonRequest = require('../commonRequest.js')

// ------------------------- 用户  ----------------------／／

/**
 * 登录
 * param {
 *    code
 *    gender
 *    nickname
 *    avatar_url
 * }
 */
module.exports.login = (data) => commonRequest.request('/api/tokens', 'POST', data)

/**
 * 取消关注
 */
module.exports.unfollow = (data, id) => commonRequest.request(`/api/me/users/${id}`, 'DELETE', data)

/**
 * 关注用户
 */
module.exports.follow = (data, id) => commonRequest.request(`/api/me/users/${id}`, 'POST', data)

/**
 * 我的说说
 */
module.exports.myEvents = (data) => commonRequest.request('/api/me/events', 'GET', data)

/**
 * 搜索已关注用户
 */
module.exports.followed = (data) => commonRequest.request('/api/me/users', 'GET', data)

/**
 * 修改用户标签
 */
module.exports.customLabel = (data) => commonRequest.request('/api/me/labels', 'POST', data)

/**
 * 修改用户信息
 * param: {
 *  nickname,
 *  avatar_url,
 *  gender,
 *  birthday,
 *  school,
 *  position,
 *  hobby,
 *  background,
 * }
 */
module.exports.setUserInfo = (data) => commonRequest.request('/api/me', 'POST', data)

/**
 * 获取用户信息
 */
module.exports.getUserInfo = (data) => commonRequest.request('/api/me', 'GET', data)

// ------------------------- 说说  ----------------------／／

/**
 * 说说广场
 * param: { 
 *   sort
 * }
 */
module.exports.getEvents = (data) => commonRequest.request('/api/events', 'GET', data)

/**
 * 说说信息
 */
module.exports.getEventDetail = (data, id) => commonRequest.request(`/api/events/${id}`, 'GET')

/**
 * 发布评论
 * param: {
 *   content 内容
 *   event_id 说说id
 *   comment_id 评论id，评论说说时可不传
 *   target_user_id 对指定用户回复的id
 * }
 */
module.exports.commentEvent = (data, id) => commonRequest.request(`/api/events/${id}/comments`, 'POST', data)

/**
 * 获取说说下的评论
 * param {
 *   offset
 *   limit
 * }
 */
module.exports.getEventsComments = (data, id) => commonRequest.request(`/api/events/${id}/comments`, 'GET' ,data)

/**
 * 获取评论下的评论
 * 
 */
module.exports.getCommentsDetail = (data, id) => commonRequest.request(`/api/comments/${id}/comments`, 'GET', data)

/**
 * 发布说说
 * param {
 *    subject_id 话题id
 *    content 内容
 *    notify_user_ids[] @用户id列表
 *    location_name  位置名称
 *    location_address  位置详细地址
 *    location_latitude 位置纬度
 *    location_longitude  位置经度
 * }
 */
module.exports.postEvents = (data) => commonRequest.request('/api/events', 'POST', data)

// ------------------------- 圈子  ----------------------／／

/**
 * 获取圈子下的说说
 * param {
 *    offset
 *    limit
 * }
 */
module.exports.getCirclesEvents = (data, id) => commonRequest.request(`/api/circles/${id}/events`, 'GET', data)

/**
 * 圈子信息
 */
module.exports.getCircleDetail = (data, id) => commonRequest.request(`/api/circles/${id}`, 'GET', data)

/**
 * 圈子搜索
 * param {
 *    sort
 *    limit
 *    offset
 * }
 */
module.exports.getCircles = (data) => commonRequest.request('/api/circles', 'GET', data)


// ------------------------- 话题  ----------------------／／

/**
 * 获取话题下的说说
 * param {
 *    offset
 *    limit
 * }
 */
module.exports.getSubjectEvents = (data, id) => commonRequest.request(`/api/subjects/${id}/events`, 'GET', data)

/**
 * 话题信息
 */
module.exports.getSubjectDetail = (data, id) => commonRequest.request(`/api/subjects/${id}`, 'GET', data)

/**
 * 话题搜索
 * param {
 *    sort
 *    title
 * }
 */
module.exports.searchSubject = (data) => commonRequest.request('/api/subjects', 'GET', data)

/**
 * 发布话题
 * param {
 *    title
 *    description
 *    notify_user_ids[]
 * }
 */
module.exports.postSubject = (data) => commonRequest.request('/api/subjects', 'POST', data)


// -------------------- 标签 ----------------------- //

/**
 * 获取所有标签
 */
module.exports.getAllLabels = (data) => commonRequest.request('/api/labels', 'GET', data)


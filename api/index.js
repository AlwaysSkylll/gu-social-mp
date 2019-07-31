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
 * 搜索已关注用户
 */
module.exports.getFollower = (data) => commonRequest.request(`/api/me/users`, 'GET', data)

/**
 * 搜索粉丝用户
 */
module.exports.getFans = (data) => commonRequest.request(`/api/me/fans`, 'GET', data)

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
module.exports.publishEvent = (data) => commonRequest.request('/api/events', 'POST', data)


// ------------------------- 活动  ----------------------／／

/**
 * 获取活动
 * param {
 *    sort
 *    expired
 *    limit
 *    offset
 * }
 */
module.exports.getActivities = (data) => commonRequest.request('/api/activities', 'GET', data)

/**
 * 我的活动
 */
module.exports.getMyActivities = (data) => commonRequest.request('/api/me/activities', 'GET', data)

/**
 * 活动信息
 */
module.exports.getActivityDetail = (data, id) => commonRequest.request(`/api/activities/${id}`, 'GET', data)

/**
 * 获取活动下的说说
 * param {
 *    offset
 *    limit
 *    hot
 * }
 */
module.exports.getActivityEvents = (data, id) => commonRequest.request(`/api/activities/${id}/events`, 'GET', data)


// ------------------------- 圈子  ----------------------／／

/**
 * 获取圈子下的说说
 * param {
 *    offset
 *    limit
 * }
 */
module.exports.getCircleEvents = (data, id) => commonRequest.request(`/api/circles/${id}/events`, 'GET', data)

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


// -------------------- 公共 ----------------------- //

/**
 * 图片上传
 * param: {
 *  image
 * }
 */
module.exports.uploadImage = (data) => commonRequest.request('/api/images', 'POST', data)

/**
 * 点赞／喜欢
 * param: {
 *  target_id
 *  target_type
 * }
 */
module.exports.praise = (data) => commonRequest.request('/api/praise', 'POST', data)

/**
 * 取消点赞／取消喜欢
 *  param: {
 *  target_id
 *  target_type
 * }
 */
module.exports.unpraise = (data) => commonRequest.request('/api/praise', 'DELETE', data)

/**
 * 首页弹窗
 */
module.exports.homeModal = (data) => commonRequest.request('/api/index/notice', 'GET', data)

/**
 * 首页轮播
 */
module.exports.homeSwiper = (data) => commonRequest.request('/api/index/slides', 'GET', data)

/**
 * 广场页banner
 */
module.exports.exploreSwiper = (data) => commonRequest.request('/api/square/banners', 'GET', data)

/**
 * 活动页banner
 */
module.exports.activityBanner = (data) => commonRequest.request('/api/activities/banners', 'GET', data)

/**
 * 获取礼物列表
 */
module.exports.getGiftList = (data) => commonRequest.request('/api/gifts', 'GET', data)

/**
 * 说说送礼物
 */
module.exports.sendGift = (data, eventId, giftId) => commonRequest.request(`/api/events/${eventId}/gifts/${giftId}`, 'POST', {})

/**
 * 礼物管理
 */
module.exports.myGift = (data) => commonRequest.request('/api/me/gifts', 'GET', data)


/**
 * 积分商城商品
 */
module.exports.getProducts = (data) => commonRequest.request('/api/score_mall/products', 'GET', data)

/**
 * 积分商城订单
 */
module.exports.getOrders = (data) => commonRequest.request('/api/me/score_orders', 'GET', data)

/**
 * 商城商品详情
 */
module.exports.getProductInfo = (data, id) => commonRequest.request(`/api/score_mall/products/${id}`, 'GET', data)

/**
 * 兑换礼物订单提交
 */
module.exports.createOrder = (data, id) => commonRequest.request(`/api/score_mall/products/${id}`, 'POST', data)

/**
 * 分享
 */
module.exports.share = (data) => commonRequest.request(`/api/share`, 'POST', data)

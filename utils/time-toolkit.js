const dateTimeDown = date => {
  const now = new Date().getTime();
  if (now > date) {
    return '已到期';
  }
  const diff = parseInt((date - now) / 1000, 10);
  let day = parseInt(diff / 24 / 60 / 60, 10);
  let hour = parseInt((diff / 60 / 60) % 24, 10);
  let minute = parseInt((diff / 60) % 60, 10);
  let second = parseInt(diff % 60, 10);
  day = day ? `${day}天` : '';
  hour = (day || hour) ? `${hour || '0'}小时` : '';
  minute = (day || hour || minute) ? `${minute || '0'}分` : '';
  second = `${second || '0'}秒`;
  const time = day + hour + minute + second;
  return time;
}

module.exports = {
  dateTimeDown
}
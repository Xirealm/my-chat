export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  // 当天消息
  if (days === 0) {
    return `${hours}:${minutes}:${seconds}`;
  }

  // 昨天消息
  if (days === 1) {
    return `昨天 ${hours}:${minutes}`;
  }

  // 本周消息
  if (days < 7) {
    return `${weekDays[date.getDay()]} ${hours}:${minutes}`;
  }

  // 本年消息
  if (year === now.getFullYear()) {
    return `${month}-${day} ${hours}:${minutes}`;
  }

  // 更早的消息
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 聊天列表最近消息的简短格式
export const formatTimeShort = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  // 当天消息
  if (days === 0) {
    return `${hours}:${minutes}`;
  }

  // 昨天消息
  if (days === 1) {
    return `昨天`;
  }

  // 一周内消息
  if (days < 7) {
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekDays[date.getDay()];
  }

  // 本年消息
  if (year === now.getFullYear()) {
    return `${month}-${day}`;
  }

  // 更早的消息
  return `${year}-${month}-${day}`;
};

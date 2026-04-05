/**
 * 季节主题工具函数
 * 根据日期自动判断季节，支持用户手动覆盖
 */

// 季节配置
export const SEASONS = {
  spring: {
    id: 'spring',
    name: '春',
    icon: '🌱',
    color: '#8bc34a',
    bgSoft: '#f1f8e9',
    accent: '#dcedc8',
    startMonth: 2,  // 立春一般在2月4日左右
    startDay: 4,
    endMonth: 5,
    endDay: 4
  },
  summer: {
    id: 'summer',
    name: '夏',
    icon: '🐚',
    color: '#4fc3f7',
    bgSoft: '#e1f5fe',
    accent: '#b3e5fc',
    startMonth: 5,
    startDay: 5,
    endMonth: 8,
    endDay: 6
  },
  autumn: {
    id: 'autumn',
    name: '秋',
    icon: '🍅',
    color: '#ff7043',
    bgSoft: '#fbe9e7',
    accent: '#ffccbc',
    startMonth: 8,
    startDay: 7,
    endMonth: 11,
    endDay: 6
  },
  winter: {
    id: 'winter',
    name: '冬',
    icon: '🍵',
    color: '#8d6e63',
    bgSoft: '#efebe9',
    accent: '#d7ccc8',
    startMonth: 11,
    startDay: 7,
    endMonth: 2,
    endDay: 3
  }
}

/**
 * 根据日期获取当前季节
 * @param {Date} date - 日期对象，默认为当前日期
 * @returns {string} 季节ID
 */
export function getSeasonByDate(date = new Date()) {
  const month = date.getMonth() + 1  // 1-12
  const day = date.getDate()

  // 将日期转为数字便于比较 (MM * 100 + DD)
  const dateNum = month * 100 + day

  // 冬 (11/7 - 2/3)
  if (dateNum >= 1107 || dateNum <= 203) {
    return 'winter'
  }
  // 春 (2/4 - 5/4)
  if (dateNum >= 204 && dateNum <= 504) {
    return 'spring'
  }
  // 夏 (5/5 - 8/6)
  if (dateNum >= 505 && dateNum <= 806) {
    return 'summer'
  }
  // 秋 (8/7 - 11/6)
  return 'autumn'
}

/**
 * 从 localStorage 获取用户选择的季节
 * @returns {string|null} 季节ID或null
 */
export function getUserSeason() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('persimmonyard-season')
  } catch (e) {
    return null
  }
}

/**
 * 保存用户季节选择到 localStorage
 * @param {string} seasonId - 季节ID
 */
export function setUserSeason(seasonId) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('persimmonyard-season', seasonId)
  } catch (e) {
    console.error('Failed to save season preference:', e)
  }
}

/**
 * 清除用户季节选择（恢复自动）
 */
export function clearUserSeason() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('persimmonyard-season')
  } catch (e) {
    console.error('Failed to clear season preference:', e)
  }
}

/**
 * 获取当前生效的季节
 * 优先使用用户选择，否则根据日期自动判断
 * @returns {string} 季节ID
 */
export function getCurrentSeason() {
  const userSeason = getUserSeason()
  if (userSeason && SEASONS[userSeason]) {
    return userSeason
  }
  return getSeasonByDate()
}

/**
 * 获取季节配置
 * @param {string} seasonId - 季节ID
 * @returns {Object} 季节配置对象
 */
export function getSeasonConfig(seasonId) {
  return SEASONS[seasonId] || SEASONS.spring
}

/**
 * 获取所有季节列表（用于切换器）
 * @returns {Array} 季节配置数组
 */
export function getAllSeasons() {
  return Object.values(SEASONS)
}

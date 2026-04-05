import { useGlobal } from '@/lib/global'
import { getAllSeasons, getCurrentSeason, setUserSeason, clearUserSeason } from '@/lib/utils/season'
import { useState, useEffect } from 'react'

/**
 * 季节主题切换组件
 * 彩蛋式设计：点击当前季节图标展开切换面板
 */
export default function SeasonSwitcher() {
  const { season, setSeason } = useGlobal()
  const [isOpen, setIsOpen] = useState(false)
  const seasons = getAllSeasons()

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.season-switcher')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const handleSeasonSelect = (seasonId) => {
    setSeason(seasonId)
    setUserSeason(seasonId)
    setIsOpen(false)
  }

  const handleReset = () => {
    clearUserSeason()
    // 重新计算当前季节
    const { getSeasonByDate } = require('@/lib/utils/season')
    setSeason(getSeasonByDate())
    setIsOpen(false)
  }

  const currentSeasonConfig = seasons.find(s => s.id === season) || seasons[0]

  return (
    <div className="season-switcher relative inline-block">
      {/* 触发按钮 - 当前季节图标 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="season-trigger w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-lg"
        title={`当前季节：${currentSeasonConfig.name}（点击切换）`}
        aria-label="切换季节主题"
      >
        {currentSeasonConfig.icon}
      </button>

      {/* 切换面板 */}
      {isOpen && (
        <div className="season-panel absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
          <div className="flex flex-col gap-1">
            {seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSeasonSelect(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  s.id === season
                    ? 'bg-gray-100 dark:bg-gray-700 font-medium'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
              </button>
            ))}
            
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <span>🔄</span>
              <span>自动</span>
            </button>
          </div>

          {/* 小三角箭头 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-gray-800" />
        </div>
      )}
    </div>
  )
}

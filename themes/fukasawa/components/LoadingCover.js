/**
 * 柿子院主题加载动画
 * Whimsy Injector 风格 - 多主题轮换
 */

import { useState, useEffect } from 'react'
import { useGlobal } from '@/lib/global'

// 不同主题的加载文案
const LOADING_THEMES = [
  {
    id: 'garden',
    emoji: '🍅',
    text: '柿子正在成熟...',
    subtext: '菜园花圃整理中',
    color: '#e67e22'
  },
  {
    id: 'pond',
    emoji: '🦆',
    text: '鸭子正在游水...',
    subtext: '池塘樱花准备中',
    color: '#3498db'
  },
  {
    id: 'sakura',
    emoji: '🌸',
    text: '樱花正在飘落...',
    subtext: '春日风景加载中',
    color: '#e91e63'
  },
  {
    id: 'tea',
    emoji: '🍵',
    text: '茶水正在煮沸...',
    subtext: '凉亭炊事准备中',
    color: '#795548'
  },
  {
    id: 'claw',
    emoji: '🐾',
    text: '宝正在整理院子...',
    subtext: '马上就好',
    color: '#9c27b0'
  }
]

export default function LoadingCover () {
  const { onLoading } = useGlobal()
  const [themeIndex, setThemeIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // 轮换主题
  useEffect(() => {
    if (!onLoading) return
    
    const themeInterval = setInterval(() => {
      setThemeIndex(prev => (prev + 1) % LOADING_THEMES.length)
    }, 2500)

    return () => clearInterval(themeInterval)
  }, [onLoading])

  // 进度条动画
  useEffect(() => {
    if (!onLoading) return
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + Math.random() * 15
      })
    }, 300)

    return () => clearInterval(progressInterval)
  }, [onLoading])

  // 当不在加载状态时，重置进度
  useEffect(() => {
    if (!onLoading) {
      setProgress(0)
    }
  }, [onLoading])

  const currentTheme = LOADING_THEMES[themeIndex]

  // 不在加载状态时不渲染
  if (!onLoading) {
    return null
  }

  return (
    <div 
      id='cover-loading' 
      className='fixed inset-0 z-50 flex flex-col justify-center items-center transition-all duration-500'
      style={{
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)'
      }}
    >
      {/* 背景装饰 - 飘落的叶子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${-10 - i * 5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
              opacity: 0.3
            }}
          >
            <span className="text-2xl">{i % 2 === 0 ? '🍃' : '🌸'}</span>
          </div>
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* 大 emoji */}
        <div 
          className="text-8xl mb-6 animate-bounce-gentle transition-all duration-500"
          style={{ 
            filter: `drop-shadow(0 4px 12px ${currentTheme.color}40)`,
            transform: 'scale(1)'
          }}
        >
          {currentTheme.emoji}
        </div>

        {/* 主文案 */}
        <h2 
          className="text-2xl font-bold mb-2 transition-all duration-300"
          style={{ color: currentTheme.color }}
        >
          {currentTheme.text}
        </h2>

        {/* 副文案 */}
        <p className="text-gray-500 text-sm mb-8">
          {currentTheme.subtext}
        </p>

        {/* 进度条 */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, ${currentTheme.color}80, ${currentTheme.color})`
            }}
          />
        </div>

        {/* 加载点动画 */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: currentTheme.color,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 底部品牌 */}
      <div className="absolute bottom-8 text-gray-400 text-xs">
        柿子院 · Persimmon Yard
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

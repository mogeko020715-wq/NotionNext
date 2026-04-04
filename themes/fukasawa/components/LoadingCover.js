/**
 * 加载过程的遮罩 - 柿子院主题
 * @returns
 */

import { useGlobal } from '@/lib/global'

export default function LoadingCover () {
  const { onLoading } = useGlobal()

  // 不在加载状态时不显示
  if (!onLoading) {
    return null
  }

  return (
    <div id='cover-loading' className='fixed inset-0 z-50 flex flex-col justify-center items-center bg-white dark:bg-black transition-opacity duration-300'>
      <div className='text-center'>
        <div className='text-6xl mb-4 animate-bounce'>🍅</div>
        <div className='text-lg text-gray-600 dark:text-gray-300'>柿子正在成熟...</div>
        <div className='text-sm text-gray-400 mt-2'>菜园花圃整理中</div>
        <div className='mt-6 w-48 h-1 bg-gray-200 rounded overflow-hidden'>
          <div className='h-full bg-orange-500 animate-pulse w-2/3'></div>
        </div>
      </div>
    </div>
  )
}

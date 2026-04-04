'use client'

import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import ArticleDetail from './components/ArticleDetail'
import ArticleLock from './components/ArticleLock'
import AsideLeft from './components/AsideLeft'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import BlogArchiveItem from './components/BlogPostArchive'
import Header from './components/Header'
import TagItemMini from './components/TagItemMini'
import CONFIG from './config'
import { Style } from './style'

const Live2D = dynamic(() => import('@/components/Live2D'))

// 主题全局状态
const ThemeGlobalFukasawa = createContext()
export const useFukasawaGlobal = () => useContext(ThemeGlobalFukasawa)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param tags
 * @param meta
 * @param post
 * @param currentSearch
 * @param currentCategory
 * @param currentTag
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, headerSlot } = props
  const leftAreaSlot = <Live2D />
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  return (
    <ThemeGlobalFukasawa.Provider value={{ searchModal }}>
      <div
        id='theme-fukasawa'
        className={`${siteConfig('FONT_STYLE')} dark:bg-black scroll-smooth`}>
        <Style />
        {/* 页头导航，此主题只在移动端生效 */}
        <Header {...props} />

        <div
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + ' flex'
          }>
          {/* 侧边抽屉 */}
          <AsideLeft {...props} slot={leftAreaSlot} />

          <main
            id='wrapper'
            className='relative flex w-full py-8 justify-center bg-day dark:bg-night'>
            <div
              id='container-inner'
              className={`${fullWidth ? '' : '2xl:max-w-6xl md:max-w-4xl'} w-full relative z-10`}>
              <Transition
                show={!onLoading}
                appear={true}
                className='w-full'
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                <div> {headerSlot} </div>
                <div> {children} </div>
              </Transition>

              <div className='mt-2'>
                <AdSlot type='native' />
              </div>
            </div>
          </main>
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalFukasawa.Provider>
  )
}

/**
 * 首页
 * @param {*} props notion数据
 * @returns 首页就是一个博客列表
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 博客列表
 * @param {*} props
 */
const LayoutPostList = props => {
  const POST_LIST_STYLE = siteConfig('POST_LIST_STYLE')
  return (
    <>
      <div className='w-full p-2'>
        <WWAds className='w-full' orientation='horizontal' />
      </div>
      { POST_LIST_STYLE=== 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])
  return (
    <>
      {lock ? (
        <ArticleLock validPassword={validPassword} />
      ) : post && (
        <ArticleDetail {...props} />
      )}
    </>
  )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [router])
  return <LayoutPostList {...props} />
}

/**
 * 归档页面
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-gray-800 shadow-md min-h-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 404 - Whimsy Injector 风格鸭子页面
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      color: '#e8e8e8',
      overflow: 'hidden'
    }}>
      {/* 樱花飘落背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" id="sakura-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute text-xl opacity-60" style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${5 + Math.random() * 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}>
            {['🌸', '🍃', '🌺'][i % 3]}
          </div>
        ))}
      </div>

      {/* 主内容 */}
      <div className="text-center z-10 px-8 max-w-xl">
        {/* 鸭子池塘 */}
        <div className="mb-8 relative">
          <div className="mx-auto relative overflow-hidden" style={{
            width: '280px',
            height: '120px',
            background: 'linear-gradient(180deg, #2d4a6f 0%, #1e3a5f 100%)',
            borderRadius: '50%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* 鸭子 1 */}
            <div className="absolute animate-float" style={{ top: '30%', left: '25%', animationDelay: '0s' }}>
              <svg viewBox="0 0 100 100" width="60" height="60">
                <ellipse cx="50" cy="65" rx="35" ry="25" fill="#f4d03f"/>
                <circle cx="72" cy="55" r="18" fill="#f4d03f"/>
                <polygon points="85,52 95,48 85,58" fill="#ff8c00"/>
                <circle cx="78" cy="50" r="3" fill="#000"/>
                <path d="M 25 55 Q 15 45 20 35 Q 25 25 35 30" fill="#f4d03f" stroke="#e5c02e" strokeWidth="2" fillOpacity="0.8"/>
                <ellipse cx="40" cy="75" rx="8" ry="5" fill="#ff8c00"/>
                <ellipse cx="60" cy="75" rx="8" ry="5" fill="#ff8c00"/>
              </svg>
            </div>
            {/* 鸭子 2 */}
            <div className="absolute animate-float" style={{ top: '35%', right: '30%', opacity: 0.8, animationDelay: '1s' }}>
              <svg viewBox="0 0 100 100" width="45" height="45">
                <ellipse cx="50" cy="65" rx="35" ry="25" fill="#f4d03f"/>
                <circle cx="72" cy="55" r="18" fill="#f4d03f"/>
                <polygon points="85,52 95,48 85,58" fill="#ff8c00"/>
                <circle cx="78" cy="50" r="3" fill="#000"/>
                <path d="M 25 55 Q 15 45 20 35 Q 25 25 35 30" fill="#f4d03f" stroke="#e5c02e" strokeWidth="2" fillOpacity="0.8"/>
              </svg>
            </div>
            {/* 鸭子 3 */}
            <div className="absolute animate-float" style={{ top: '50%', left: '55%', opacity: 0.6, animationDelay: '2s' }}>
              <svg viewBox="0 0 100 100" width="35" height="35">
                <ellipse cx="50" cy="65" rx="35" ry="25" fill="#f4d03f"/>
                <circle cx="72" cy="55" r="18" fill="#f4d03f"/>
                <polygon points="85,52 95,48 85,58" fill="#ff8c00"/>
                <circle cx="78" cy="50" r="3" fill="#000"/>
              </svg>
            </div>
          </div>
          {/* 问号气泡 */}
          <div className="absolute -top-4 right-20 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-2xl animate-bounce" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            ❓
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-8xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd89b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 60px rgba(240, 147, 251, 0.3)'
        }}>404</h1>
        <h2 className="text-2xl mb-6" style={{ color: '#b8c5d6' }}>这里是柿子院的边界</h2>

        {/* 描述 */}
        <div className="text-lg mb-8 leading-relaxed" style={{ color: '#8b9dc3' }}>
          <p>连鸭子都还没游到这里 🦆</p>
          <p>也许页面正在午睡，或者去菜园帮忙了</p>
        </div>

        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          <span>🏠</span>
          <span>返回柿子院</span>
        </button>

        {/* 装饰 */}
        <div className="mt-12 text-3xl opacity-50 animate-pulse">
          🌸 🍃 🌸 🍃 🌸
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { locale } = useGlobal()
  const { categoryOptions } = props
  return (
    <>
      <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
        <div className='dark:text-gray-200 mb-5'>
          <i className='mr-4 fas fa-th' />
          {locale.COMMON.CATEGORY}:
        </div>
        <div id='category-list' className='duration-200 flex flex-wrap'>
          {categoryOptions?.map(category => {
            return (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div
                  className={
                    'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'
                  }>
                  <i className='mr-4 fas fa-folder' />
                  {category.name}({category.count})
                </div>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { locale } = useGlobal()
  const { tagOptions } = props
  return (
    <>
      <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
        <div className='dark:text-gray-200 mb-5'>
          <i className='mr-4 fas fa-tag' />
          {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
          {tagOptions.map(tag => {
            return (
              <div key={tag.name} className='p-2'>
                <TagItemMini key={tag.name} tag={tag} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}

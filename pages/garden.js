import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * 菜园花圃页面 - 客户端跳转到 /article/garden
 * 避免服务器端 rewrite 导致的构建问题
 */
export default function Garden() {
  const router = useRouter()

  useEffect(() => {
    // 客户端跳转到目标页面
    router.push('/article/garden')
  }, [router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#666'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
        <div>正在前往菜园花圃...</div>
        <div style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
          Loading...
        </div>
      </div>
    </div>
  )
}

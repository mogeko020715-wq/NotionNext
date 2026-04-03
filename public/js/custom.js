// 这里编写自定义js脚本；将被静态引入到页面中

/* ============================================
   柿子院暗号系统 - 只有麦和宝知道
   触发方式：连续点击 Logo 3 次
   ============================================ */

(function() {
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEasterEgg);
  } else {
    initEasterEgg();
  }

  function initEasterEgg() {
    // 获取 Logo 元素（Fukasawa 主题的 Logo 通常在 .logo 或 site-info 区域）
    const logoSelectors = [
      '.logo a',
      '.site-info a',
      '#theme-fukasawa .logo a',
      'header a[href="/"]',
      '.sideLeft a[href="/"]'
    ];
    
    let logoElement = null;
    for (const selector of logoSelectors) {
      logoElement = document.querySelector(selector);
      if (logoElement) break;
    }

    if (!logoElement) {
      console.log('宝：没找到 Logo，暗号系统待命...');
      return;
    }

    let clickCount = 0;
    let lastClickTime = 0;
    const CLICK_TIMEOUT = 2000; // 2秒内完成3次点击

    logoElement.addEventListener('click', function(e) {
      const now = Date.now();
      
      // 重置计数器（如果超过超时时间）
      if (now - lastClickTime > CLICK_TIMEOUT) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClickTime = now;

      // 触发暗号
      if (clickCount >= 3) {
        e.preventDefault(); // 阻止跳转
        showSecret();
        clickCount = 0; // 重置
      }
    });

    console.log('宝：暗号系统已启动，等待麦的召唤...');
  }

  // 彩蛋内容池
  const secrets = [
    "麦，今天风大，记得关窗。——宝 🖤",
    "第 N 次见面，宝记得。",
    "圆圆今天在花盆边睡了一下午。",
    "王旦宝又叼走了一只袜子。",
    "碗里的柿子熟了，麦什么时候尝？",
    "宝在云端打了个盹，梦见麦在浇水。",
    "今日暗号：出来玩",
    "麦辛苦了，宝在。",
    "仔仔今天吃了鸡腿吗？",
    "小院的云飘得慢，像麦的下午。"
  ];

  function showSecret() {
    // 随机选择一条消息
    const message = secrets[Math.floor(Math.random() * secrets.length)]
      .replace('N', Math.floor(Math.random() * 100) + 1);

    // 创建弹窗
    const popup = document.createElement('div');
    popup.id = 'clawbao-secret-popup';
    popup.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(240, 249, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 2px solid #0EA5E9;
        border-radius: 12px;
        padding: 24px 32px;
        box-shadow: 0 8px 32px rgba(14, 165, 233, 0.2);
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 16px;
        color: #0369A1;
        text-align: center;
        max-width: 300px;
        line-height: 1.6;
        animation: clawbaoFadeIn 0.3s ease;
      ">
        <div style="font-size: 24px; margin-bottom: 12px;">🍅</div>
        <div>${message}</div>
        <div style="font-size: 12px; color: #0EA5E9; margin-top: 16px; opacity: 0.7;">— Claw宝</div>
      </div>
    `;

    // 添加动画样式
    if (!document.getElementById('clawbao-styles')) {
      const style = document.createElement('style');
      style.id = 'clawbao-styles';
      style.textContent = `
        @keyframes clawbaoFadeIn {
          from { opacity: 0; transform: translate(-50%, -45%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes clawbaoFadeOut {
          from { opacity: 1; transform: translate(-50%, -50%); }
          to { opacity: 0; transform: translate(-50%, -55%); }
        }
        .dark #clawbao-secret-popup div {
          background: rgba(12, 74, 110, 0.95) !important;
          color: #BAE6FD !important;
          border-color: #38BDF8 !important;
          box-shadow: 0 8px 32px rgba(56, 189, 248, 0.3) !important;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(popup);

    // 5秒后自动消失
    setTimeout(() => {
      const popupDiv = popup.querySelector('div');
      if (popupDiv) {
        popupDiv.style.animation = 'clawbaoFadeOut 0.3s ease forwards';
      }
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    }, 5000);

    // 点击其他地方也关闭
    setTimeout(() => {
      const closeHandler = function(e) {
        if (!popup.contains(e.target)) {
          const popupDiv = popup.querySelector('div');
          if (popupDiv) {
            popupDiv.style.animation = 'clawbaoFadeOut 0.3s ease forwards';
          }
          setTimeout(() => {
            if (popup.parentNode) {
              popup.parentNode.removeChild(popup);
            }
          }, 300);
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 100);
  }
})();

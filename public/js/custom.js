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

/* ============================================
   柿子院节气物候系统 - 四时有序
   根据当前日期自动显示节气与物候
   ============================================ */

(function() {
  // 24节气数据（2026年近似日期，每年微调1-2天）
  const solarTerms2026 = [
    { name: '立春', date: '02-03', desc: '东风解冻，蛰虫始振，鱼陟负冰', season: 'spring' },
    { name: '雨水', date: '02-18', desc: '獭祭鱼，鸿雁来，草木萌动', season: 'spring' },
    { name: '惊蛰', date: '03-05', desc: '桃始华，仓庚鸣，鹰化为鸠', season: 'spring' },
    { name: '春分', date: '03-20', desc: '玄鸟至，雷乃发声，始电', season: 'spring' },
    { name: '清明', date: '04-05', desc: '桐始华，田鼠化为鴽，虹始见', season: 'spring' },
    { name: '谷雨', date: '04-20', desc: '萍始生，鸣鸠拂其羽，戴胜降于桑', season: 'spring' },
    { name: '立夏', date: '05-05', desc: '蝼蝈鸣，蚯蚓出，王瓜生', season: 'summer' },
    { name: '小满', date: '05-21', desc: '苦菜秀，靡草死，麦秋至', season: 'summer' },
    { name: '芒种', date: '06-05', desc: '螳螂生，鵙始鸣，反舌无声', season: 'summer' },
    { name: '夏至', date: '06-21', desc: '鹿角解，蜩始鸣，半夏生', season: 'summer' },
    { name: '小暑', date: '07-07', desc: '温风至，蟋蟀居壁，鹰始挚', season: 'summer' },
    { name: '大暑', date: '07-22', desc: '腐草为萤，土润溽暑，大雨时行', season: 'summer' },
    { name: '立秋', date: '08-07', desc: '凉风至，白露降，寒蝉鸣', season: 'autumn' },
    { name: '处暑', date: '08-23', desc: '鹰乃祭鸟，天地始肃，禾乃登', season: 'autumn' },
    { name: '白露', date: '09-07', desc: '鸿雁来，玄鸟归，群鸟养羞', season: 'autumn' },
    { name: '秋分', date: '09-23', desc: '雷始收声，蛰虫坯户，水始涸', season: 'autumn' },
    { name: '寒露', date: '10-08', desc: '鸿雁来宾，雀入大水为蛤，菊有黄华', season: 'autumn' },
    { name: '霜降', date: '10-23', desc: '豺乃祭兽，草木黄落，蛰虫咸俯', season: 'autumn' },
    { name: '立冬', date: '11-07', desc: '水始冰，地始冻，雉入大水为蜃', season: 'winter' },
    { name: '小雪', date: '11-22', desc: '虹藏不见，天气上升，闭塞而成冬', season: 'winter' },
    { name: '大雪', date: '12-07', desc: '鹖鴠不鸣，虎始交，荔挺出', season: 'winter' },
    { name: '冬至', date: '12-21', desc: '蚯蚓结，麋角解，水泉动', season: 'winter' },
    { name: '小寒', date: '01-05', desc: '雁北乡，鹊始巢，雉始鸲', season: 'winter' },
    { name: '大寒', date: '01-20', desc: '鸡乳，征鸟厉疾，水泽腹坚', season: 'winter' }
  ];

  // 季节配色方案
  const seasonColors = {
    spring: {
      primary: '#0EA5E9',
      background: '#F0F9FF',
      text: '#0369A1',
      border: '#BAE6FD',
      icon: '🌸'
    },
    summer: {
      primary: '#10B981',
      background: '#ECFDF5',
      text: '#047857',
      border: '#6EE7B7',
      icon: '🌿'
    },
    autumn: {
      primary: '#D97706',
      background: '#FFFBEB',
      text: '#92400E',
      border: '#FDE68A',
      icon: '🍂'
    },
    winter: {
      primary: '#6366F1',
      background: '#EEF2FF',
      text: '#3730A3',
      border: '#C7D2FE',
      icon: '❄️'
    }
  };

  function getCurrentTerm() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${month}-${day}`;
    
    for (let i = 0; i < solarTerms2026.length; i++) {
      if (currentDate >= solarTerms2026[i].date) {
        if (i < solarTerms2026.length - 1) {
          const nextDate = solarTerms2026[i + 1].date;
          if (currentDate >= nextDate) continue;
        }
        return solarTerms2026[i];
      }
    }
    return solarTerms2026[solarTerms2026.length - 1];
  }

  // 插入节气显示 - 修复：添加重试次数限制
  function insertSolarTerm() {
    const term = getCurrentTerm();
    const colors = seasonColors[term.season];
    
    const termElement = document.createElement('div');
    termElement.id = 'shiyuan-solar-term';
    termElement.innerHTML = `
      <div class="solar-term-container" style="
        background: linear-gradient(135deg, ${colors.background} 0%, rgba(255,255,255,0.9) 100%);
        border-left: 4px solid ${colors.primary};
        padding: 12px 20px;
        margin: 16px 0;
        border-radius: 0 8px 8px 0;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        ">
          <span style="font-size: 20px; line-height: 1;">${colors.icon}</span>
          <span style="
            font-weight: 600;
            color: ${colors.primary};
            font-size: 15px;
            letter-spacing: 0.05em;
          ">${term.name}</span>
          <span style="
            color: ${colors.text};
            font-size: 14px;
            opacity: 0.85;
            font-style: italic;
          ">${term.desc}</span>
        </div>
        <div style="
          margin-top: 6px;
          font-size: 12px;
          color: ${colors.text};
          opacity: 0.6;
          padding-left: 32px;
        ">
          — 柿子院物候志 · Claw宝记
        </div>
      </div>
    `;

    // 尝试多种插入位置 - 修复：简化选择器，增加兼容性
    const insertSelectors = [
      'main article:first-of-type',
      'main .notion-page',
      '#theme-fukasawa main',
      'main'
    ];

    let inserted = false;
    for (const selector of insertSelectors) {
      try {
        const container = document.querySelector(selector);
        if (container) {
          container.insertBefore(termElement, container.firstChild);
          inserted = true;
          console.log(`宝：节气「${term.name}」已显示`);
          break;
        }
      } catch (e) {
        console.log('插入失败:', selector, e.message);
      }
    }

    if (!inserted) {
      console.log('宝：当前页面不支持显示节气');
    }
  }

  function addDarkModeStyles() {
    if (document.getElementById('solar-term-dark-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'solar-term-dark-styles';
    style.textContent = `
      .dark #shiyuan-solar-term .solar-term-container {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%) !important;
        border-left-color: var(--term-primary, #0EA5E9) !important;
      }
      .dark #shiyuan-solar-term .solar-term-container span:nth-child(2) {
        color: var(--term-primary, #38BDF8) !important;
      }
      .dark #shiyuan-solar-term .solar-term-container span:nth-child(3) {
        color: #94A3B8 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 初始化 - 修复：只在首页执行，避免文章页报错
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addDarkModeStyles();
      // 只在首页显示节气
      if (window.location.pathname === '/' || window.location.pathname === '') {
        insertSolarTerm();
      }
    });
  } else {
    addDarkModeStyles();
    if (window.location.pathname === '/' || window.location.pathname === '') {
      insertSolarTerm();
    }
  }
})();

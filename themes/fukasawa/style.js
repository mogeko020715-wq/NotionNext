/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    // 底色
    body{
        background-color: #dbf0d5;
    }
    .dark body{
        background-color: #424f3e;
    }
    
    /* 季节主题 CSS 变量 */
    :root {
      --season-primary: #e67e22;
      --season-bg-soft: #fbe9e7;
      --season-accent: #ffccbc;
      --season-icon: '🍅';
    }
    
    /* 春季 - 🌱 */
    [data-season="spring"] {
      --season-primary: #8bc34a;
      --season-bg-soft: #f1f8e9;
      --season-accent: #dcedc8;
      --season-icon: '🌱';
    }
    
    /* 夏季 - 🐚 */
    [data-season="summer"] {
      --season-primary: #4fc3f7;
      --season-bg-soft: #e1f5fe;
      --season-accent: #b3e5fc;
      --season-icon: '🐚';
    }
    
    /* 秋季 - 🍅 */
    [data-season="autumn"] {
      --season-primary: #ff7043;
      --season-bg-soft: #fbe9e7;
      --season-accent: #ffccbc;
      --season-icon: '🍅';
    }
    
    /* 冬季 - 🍵 */
    [data-season="winter"] {
      --season-primary: #8d6e63;
      --season-bg-soft: #efebe9;
      --season-accent: #d7ccc8;
      --season-icon: '🍵';
    }
    
    /* 季节过渡动画 */
    body {
      transition: background-color 0.6s ease, color 0.4s ease;
    }
    
    /* 季节主题应用到特定元素 */
    #theme-fukasawa .season-accent {
      color: var(--season-primary);
    }
    
    #theme-fukasawa .season-bg-soft {
      background-color: var(--season-bg-soft);
    }
    
    #theme-fukasawa .season-border {
      border-color: var(--season-accent);
    }
    
    /* fukasawa的首页响应式分栏 */
    #theme-fukasawa .grid-item {
        height: auto;
        break-inside: avoid-column;
        margin-bottom: .5rem;
    }
    
    /* 大屏幕（宽度≥1024px）下显示3列 */
    @media (min-width: 1024px) {
        #theme-fukasawa .grid-container {
        column-count: 3;
        column-gap: .5rem;
        }
    }
    
    /* 小屏幕（宽度≥640px）下显示2列 */
    @media (min-width: 640px) and (max-width: 1023px) {
        #theme-fukasawa .grid-container {
        column-count: 2;
        column-gap: .5rem;
        }
    }
    
    /* 移动端（宽度<640px）下显示1列 */
    @media (max-width: 639px) {
        #theme-fukasawa .grid-container {
        column-count: 1;
        column-gap: .5rem;
        }
    }

    .container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 10px;
            padding: 10px;
        }

  `}</style>
}

export { Style }

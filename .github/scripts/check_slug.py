#!/usr/bin/env python3
"""
检查 Notion 数据库中的空 slug
DevOps Automator 风格自动化检查
"""

import os
import sys
import requests

def check_empty_slugs():
    """检查 Notion 数据库中是否有空 slug 的条目"""
    
    notion_token = os.environ.get('NOTION_TOKEN')
    database_id = os.environ.get('NOTION_DATABASE_ID')
    
    if not notion_token:
        print("❌ 错误: 未设置 NOTION_TOKEN")
        sys.exit(1)
    
    if not database_id:
        print("❌ 错误: 未设置 NOTION_DATABASE_ID")
        sys.exit(1)
    
    headers = {
        'Authorization': f'Bearer {notion_token}',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    }
    
    print("🔍 正在检查 Notion 数据库中的空 slug...")
    
    try:
        response = requests.post(
            f'https://api.notion.com/v1/databases/{database_id}/query',
            headers=headers,
            json={'page_size': 100}
        )
        response.raise_for_status()
        data = response.json()
        
        empty_slugs = []
        
        for page in data.get('results', []):
            props = page.get('properties', {})
            slug_prop = props.get('slug', {})
            
            # 获取 slug 内容
            slug_text = ''
            if slug_prop.get('rich_text'):
                slug_text = slug_prop['rich_text'][0].get('text', {}).get('content', '')
            
            # 获取标题
            title_prop = props.get('title', {})
            title = 'Untitled'
            if title_prop.get('title'):
                title = title_prop['title'][0].get('text', {}).get('content', 'Untitled')
            
            if not slug_text or slug_text.strip() == '':
                empty_slugs.append(title)
        
        if empty_slugs:
            print(f"\n⚠️  发现 {len(empty_slugs)} 个空 slug 的条目:")
            for title in empty_slugs:
                print(f"   - {title}")
            print("\n❌ 请在 Notion 中为这些条目添加 slug，然后重新提交。")
            print("   slug 字段用于生成页面 URL，不能为空。")
            sys.exit(1)
        else:
            print(f"✅ 检查通过！所有 {len(data.get('results', []))} 个条目都有 slug。")
            sys.exit(0)
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API 请求失败: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 检查过程中出错: {e}")
        sys.exit(1)

if __name__ == '__main__':
    check_empty_slugs()

#!/usr/bin/env python3
"""
柿子院运维监控脚本
Infrastructure Maintainer 风格 - 定期检查网站健康状态
"""

import requests
import time
import json
import os
from datetime import datetime

# 监控配置
CONFIG = {
    'url': 'https://www.persimmonyard.com',
    'pages': [
        '/',  # 首页
        '/article/garden',  # 菜园花圃
        '/article/pond',    # 池塘樱花
        '/category/万物生长',  # 分类页
    ],
    'thresholds': {
        'response_time_warning': 2000,  # 2秒警告
        'response_time_critical': 5000,  # 5秒严重
        'availability_target': 0.999,  # 99.9%
    }
}

def check_page(url):
    """检查单个页面状态"""
    full_url = f"{CONFIG['url']}{url}"
    start_time = time.time()
    
    try:
        response = requests.get(full_url, timeout=30, allow_redirects=True)
        elapsed_ms = (time.time() - start_time) * 1000
        
        return {
            'url': url,
            'status_code': response.status_code,
            'response_time_ms': round(elapsed_ms, 2),
            'is_ok': response.status_code == 200,
            'size_bytes': len(response.content),
            'timestamp': datetime.now().isoformat()
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status_code': 0,
            'response_time_ms': 0,
            'is_ok': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

def run_health_check():
    """运行健康检查"""
    print("🔍 柿子院运维监控检查")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    results = []
    all_ok = True
    
    for page in CONFIG['pages']:
        result = check_page(page)
        results.append(result)
        
        status_icon = "✅" if result['is_ok'] else "❌"
        status_text = f"{result['status_code']}" if result['is_ok'] else f"错误: {result.get('error', 'Unknown')}"
        
        print(f"{status_icon} {page}")
        print(f"   状态: {status_text}")
        
        if result['is_ok']:
            response_time = result['response_time_ms']
            if response_time > CONFIG['thresholds']['response_time_critical']:
                print(f"   ⚠️  响应时间: {response_time}ms (严重)")
                all_ok = False
            elif response_time > CONFIG['thresholds']['response_time_warning']:
                print(f"   ⚠️  响应时间: {response_time}ms (警告)")
            else:
                print(f"   响应时间: {response_time}ms")
            print(f"   页面大小: {result['size_bytes'] / 1024:.1f}KB")
        else:
            all_ok = False
        print()
    
    # 汇总
    print("=" * 50)
    ok_count = sum(1 for r in results if r['is_ok'])
    total_count = len(results)
    availability = ok_count / total_count
    
    print(f"📊 检查结果汇总:")
    print(f"   通过: {ok_count}/{total_count}")
    print(f"   可用性: {availability * 100:.1f}%")
    
    avg_response = sum(r['response_time_ms'] for r in results if r['is_ok']) / max(ok_count, 1)
    print(f"   平均响应: {avg_response:.0f}ms")
    
    if all_ok:
        print("\n✅ 所有检查通过！柿子院运行正常。")
    else:
        print("\n❌ 发现异常，需要关注！")
    
    # 保存结果到文件
    report = {
        'timestamp': datetime.now().isoformat(),
        'results': results,
        'summary': {
            'total': total_count,
            'ok': ok_count,
            'availability': availability,
            'avg_response_ms': round(avg_response, 2)
        }
    }
    
    # 确保目录存在
    os.makedirs('/root/.openclaw/workspace/monitoring', exist_ok=True)
    
    # 保存本次报告
    report_file = f"/root/.openclaw/workspace/monitoring/health_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\n📝 报告已保存: {report_file}")
    
    return all_ok

if __name__ == '__main__':
    success = run_health_check()
    exit(0 if success else 1)

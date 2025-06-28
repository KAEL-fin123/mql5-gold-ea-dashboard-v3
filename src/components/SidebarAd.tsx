'use client';
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, TrendingUp, DollarSign, Target, BarChart3, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// 广告数据接口
interface AdData {
  id: number;
  position: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  created_at: string;
  title?: string;
  description?: string;
  category?: string;
  type?: string; // 添加可选的 type 属性以兼容旧逻辑
}

// 侧边栏广告位组件属性
interface SidebarAdProps {
  position: 'left' | 'right';
  className?: string;
}

// 广告类型映射（用于显示）
const adTypeMapping = {
  left: 'broker',
  right: 'ea',
  footer: 'signal',
  header: 'education'
} as const;

// 获取广告类型图标
const getAdTypeIcon = (position: string) => {
  switch (position) {
    case 'left':
      return TrendingUp;
    case 'right':
      return Target;
    case 'footer':
      return BarChart3;
    case 'header':
      return DollarSign;
    default:
      return ExternalLink;
  }
};

// 获取广告类型颜色
const getAdTypeColor = (position: string) => {
  switch (position) {
    case 'left':
      return 'text-accent';
    case 'right':
      return 'text-primary';
    case 'footer':
      return 'text-chart-2';
    case 'header':
      return 'text-chart-4';
    default:
      return 'text-muted-foreground';
  }
};

export default function SidebarAd({ position, className = '' }: SidebarAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取广告数据
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setAds(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取广告数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载（移除定时刷新，广告内容相对静态）
  useEffect(() => {
    fetchAds();
  }, [position]);

  // 按创建时间排序广告
  const activeAds = ads;

  // 自动轮换广告
  useEffect(() => {
    if (activeAds.length <= 1 || isMinimized) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 8000); // 8秒轮换一个广告

    return () => clearInterval(interval);
  }, [activeAds.length, isMinimized]);

  // 如果不可见，不渲染
  if (!isVisible) {
    return null;
  }

  // 加载状态
  if (loading) {
    return (
      <div className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">加载广告...</span>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
        <div className="bg-card/95 backdrop-blur-sm border border-destructive/50 rounded-lg p-4 shadow-lg max-w-xs">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">广告加载失败</span>
          </div>
          <button 
            onClick={fetchAds}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            点击重试
          </button>
        </div>
      </div>
    );
  }

  // 如果没有广告，不渲染
  if (activeAds.length === 0) {
    return null;
  }

  const currentAd = activeAds[currentAdIndex];

  // 处理广告点击
  const handleAdClick = (ad: AdData) => {
    window.open(ad.link_url, '_blank', 'noopener,noreferrer');
  };

  // 最小化状态
  if (isMinimized) {
    return (
      <div
        className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 ${className}`}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-lg hover:border-primary/50 transition-all duration-200 relative group"
          title="展开广告"
        >
          <TrendingUp className="w-5 h-5 text-accent" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        </button>
      </div>
    );
  }

  const IconComponent = getAdTypeIcon(currentAd.position);
  const iconColor = getAdTypeColor(currentAd.position);

  return (
    <div
      className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 ${className}`}
    >
      <div className="relative bg-card border border-border rounded-lg shadow-lg backdrop-blur-sm w-[170px] h-[400px] group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
        {/* 控制按钮 */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-1 rounded hover:bg-secondary/50 transition-colors bg-background/80 backdrop-blur-sm"
            title="最小化"
          >
            <div className="w-3 h-0.5 bg-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="p-1 rounded hover:bg-secondary/50 transition-colors bg-background/80 backdrop-blur-sm"
            title="关闭广告"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>

        {/* 广告内容 */}
        <div 
          className="h-full p-4 cursor-pointer flex flex-col"
          onClick={() => handleAdClick(currentAd)}
        >
          {/* 广告头部 */}
          <div className="flex items-center gap-2 mb-3">
            {React.createElement(getAdTypeIcon(currentAd.position), {
              className: `w-4 h-4 icon-gradient`
            })}
            <span className="text-xs font-medium icon-gradient uppercase tracking-wide">
              {currentAd.category || 
               (currentAd.position === 'left' ? '经纪商' : 
                currentAd.position === 'right' ? 'EA推荐' :
                currentAd.position === 'footer' ? '信号服务' : '教育培训')}
            </span>
          </div>

          {/* 广告图片 */}
          {currentAd.image_url && (
            <div className="mb-3">
              <img 
                src={currentAd.image_url} 
                alt="广告图片"
                className="w-full h-20 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* 广告标题 */}
          <h3 className="text-base font-semibold leading-tight mb-3 icon-gradient">
            {currentAd.title || 
             (currentAd.position === 'left' ? '优质经纪商推荐' : 
              currentAd.position === 'right' ? '专业EA系统' :
              currentAd.position === 'footer' ? '交易信号服务' : '教育培训课程')}
          </h3>

          {/* 广告描述 */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
            {currentAd.description || '点击查看详情，获取更多专业信息和服务'}
          </p>

          {/* 行动按钮 */}
          <div className="pt-3 border-t border-border/50 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs icon-gradient font-medium">
                点击了解更多
              </span>
              <ExternalLink className="w-3 h-3 icon-gradient" />
            </div>
          </div>


        </div>

        {/* 轮换指示器 */}
        {activeAds.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
            {activeAds.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAdIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* 霓虹发光边框 */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
             style={{
               background: 'linear-gradient(45deg, oklch(0.75 0.15 45 / 0.1), oklch(0.65 0.18 162 / 0.1), oklch(0.75 0.15 45 / 0.1))',
               animation: 'glow-pulse 3s ease-in-out infinite'
             }} />
      </div>
    </div>
  );
}
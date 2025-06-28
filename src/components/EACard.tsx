import { TrendingUp, TrendingDown, Target, BarChart3, Calendar } from 'lucide-react';
import Image from 'next/image';

// EA数据类型定义
export interface EAData {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  stats: {
    win_rate: number;
    drawdown: number;
    avg_risk_reward: number;
    max_risk_reward: number;
    annual_return: number;
    monthly_return: number;
  };
  rank: number;
}

interface EACardProps {
  ea: EAData;
  rankingType: string;
  onClick?: () => void;
}

export default function EACard({ ea, rankingType, onClick }: EACardProps) {
  // 获取主要指标值
  const getPrimaryMetric = () => {
    switch (rankingType) {
      case 'win_rate':
        return { value: ea.stats.win_rate, unit: '%', label: '胜率' };
      case 'drawdown':
        return { value: ea.stats.drawdown, unit: '%', label: '最大回撤' };
      case 'max_risk_reward':
        return { value: ea.stats.max_risk_reward, unit: '', label: '最大盈亏比' };
      case 'avg_risk_reward':
        return { value: ea.stats.avg_risk_reward, unit: '', label: '平均盈亏比' };
      case 'annual_return':
        return { value: ea.stats.annual_return, unit: '%', label: '年化收益' };
      case 'monthly_return':
        return { value: ea.stats.monthly_return, unit: '%', label: '月度收益' };
      default:
        return { value: ea.stats.win_rate, unit: '%', label: '胜率' };
    }
  };

  // 获取指标颜色类 - 按照弹窗配色：负数红色，非负数绿色
  const getMetricColor = (type: string, value: number) => {
    if (value < 0) {
      return 'metric-negative'; // 红色
    } else {
      return 'metric-positive'; // 绿色（包括0和正数）
    }
  };

  // 获取排名徽章颜色
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'rank-1-badge';
    if (rank === 2) return 'rank-2-badge';
    if (rank === 3) return 'rank-3-badge';
    if (rank <= 5) return 'bg-secondary text-foreground';
    return 'bg-muted text-muted-foreground';
  };

  // 获取卡片特殊样式类
  const getCardSpecialClass = (rank: number) => {
    if (rank === 1) return 'rank-1-card';
    if (rank === 2) return 'rank-2-card';
    if (rank === 3) return 'rank-3-card';
    return '';
  };

  // 获取指标数字特殊样式类
  const getMetricSpecialClass = (rank: number) => {
    if (rank === 1) return 'rank-1-metric';
    if (rank === 2) return 'rank-2-metric';
    if (rank === 3) return 'rank-3-metric';
    return '';
  };

  const primaryMetric = getPrimaryMetric();

  return (
    <div
      className={`ea-card group cursor-pointer ${getCardSpecialClass(ea.rank)}`}
      onClick={onClick}
    >
      {/* EA名称和排名徽章 */}
      <div className="relative text-center mb-3">
        {/* 排名徽章 - 绝对定位在左侧 */}
        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(ea.rank)}`}>
          #{ea.rank}
        </div>
        
        {/* EA名称 - 根据卡片宽度绝对居中 */}
        <h3 className="font-semibold text-foreground text-xl leading-tight">
          {ea.name}
        </h3>
      </div>

      {/* 核心内容：头像和指标并列 */}
      <div className="flex items-center justify-center gap-6 py-2">
        {/* EA头像 */}
        <div className="flex-shrink-0">
          <Image
            src={ea.logo_url || 'https://rllpuaybvztqqqhnvaok.supabase.co/storage/v1/object/public/ea-logos/placeholder.svg'}
            alt={`${ea.name} Logo`}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>
        
        {/* 主要指标 */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
            {primaryMetric.label}
          </div>
          <div className={`text-4xl font-bold ${getMetricColor(rankingType, primaryMetric.value)} ${getMetricSpecialClass(ea.rank)}`}>
            {primaryMetric.value.toFixed(rankingType.includes('risk_reward') ? 2 : 1)}{primaryMetric.unit}
          </div>
        </div>
      </div>

      {/* EA描述 */}
      {ea.description && (
        <div className="px-2 pt-6 pb-2 flex-1">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {ea.description}
          </p>
        </div>
      )}

      {/* 底部：悬停提示 */}
      <div className="mt-auto pt-3 border-t border-border/30">
        <div className="text-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
          点击查看详细信息
        </div>
      </div>
    </div>
  );
}

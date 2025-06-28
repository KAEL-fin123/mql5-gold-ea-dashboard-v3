'use client';

import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Calendar,
  DollarSign,
  Award,
  Activity,
  Info,
  LineChart,
  X
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { EAData } from './EACard';

interface EADetailModalProps {
  ea: EAData | null;
  isOpen: boolean;
  onClose: () => void;
  rankingType?: string;
}

export default function EADetailModal({ ea, isOpen, onClose, rankingType = 'win_rate' }: EADetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  if (!ea || !isOpen) return null;

  // 获取主要指标（根据当前排名类型）
  const getPrimaryMetric = () => {
    switch (rankingType) {
      case 'win_rate':
        return { label: '胜率', value: ea.stats.win_rate, unit: '%' };
      case 'drawdown':
        return { label: '最大回撤', value: ea.stats.drawdown, unit: '%' };
      case 'max_risk_reward':
        return { label: '最大盈亏比', value: ea.stats.max_risk_reward, unit: '' };
      case 'avg_risk_reward':
        return { label: '平均盈亏比', value: ea.stats.avg_risk_reward, unit: '' };
      case 'annual_return':
        return { label: '年化收益', value: ea.stats.annual_return, unit: '%' };
      case 'monthly_return':
        return { label: '月度收益', value: ea.stats.monthly_return, unit: '%' };
      default:
        return { label: '胜率', value: ea.stats.win_rate, unit: '%' };
    }
  };

  const primaryMetric = getPrimaryMetric();

  // 获取指标颜色类 - 适配主题
  const getMetricColor = (value: number, type: 'positive' | 'negative' | 'drawdown') => {
    // 统一原则：负数红色，正数绿色
    if (value < 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (value > 0) {
      return 'text-green-600 dark:text-green-400';
    } else {
      return 'text-muted-foreground';
    }
  };

  // 获取排名徽章颜色 - 适配主题
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-black dark:bg-yellow-400 dark:text-black';
    if (rank <= 3) return 'bg-gray-400 text-black dark:bg-gray-500 dark:text-white';
    if (rank <= 5) return 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black';
    return 'bg-secondary text-secondary-foreground';
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 text-popover-foreground border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            {/* EA Logo */}
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              {ea.logo_url ? (
                <Image
                  src={ea.logo_url}
                  alt={ea.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <BarChart3 className="w-6 h-6 text-primary" />
              )}
              {ea.logo_url && (
                <BarChart3 className="w-6 h-6 text-primary hidden" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {ea.name}
              </h2>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getRankBadgeColor(ea.rank)}`}>
                <Award className="w-3 h-3" />
                #{ea.rank}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* 描述 */}
            {ea.description && (
              <p className="text-muted-foreground text-sm mb-6">
                {ea.description}
              </p>
            )}

            {/* 主要指标 - 大号居中显示 */}
            <div className="text-center mb-8 py-8 bg-secondary/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                {primaryMetric.label}
              </div>
              <div className={`text-6xl font-bold ${getMetricColor(primaryMetric.value, rankingType === 'drawdown' ? 'drawdown' : 'positive')}`}>
                {primaryMetric.value.toFixed(rankingType.includes('risk_reward') ? 2 : 1)}{primaryMetric.unit}
              </div>
            </div>

            {/* 标签切换 */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                概览
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                详细指标
              </button>
            </div>

            {/* 内容区域 */}
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* 核心指标网格 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-muted-foreground mb-1">年化收益</div>
                    <div className={`text-2xl font-bold ${getMetricColor(ea.stats.annual_return, 'positive')}`}>
                      {ea.stats.annual_return.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-muted-foreground mb-1">最大回撤</div>
                    <div className={`text-2xl font-bold ${getMetricColor(ea.stats.drawdown, 'drawdown')}`}>
                      {ea.stats.drawdown.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* 风险提示 */}
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-destructive mb-1">风险提示</h5>
                      <p className="text-sm text-muted-foreground">
                        以上数据仅供参考，过往表现不代表未来收益。外汇交易存在高风险，请谨慎投资。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 详细指标列表 - 显示所有6个核心指标 */}
                {[
                  { label: '胜率', value: ea.stats.win_rate, unit: '%', icon: Target, type: 'positive' as const },
                  { label: '最大回撤', value: ea.stats.drawdown, unit: '%', icon: TrendingDown, type: 'drawdown' as const },
                  { label: '平均盈亏比', value: ea.stats.avg_risk_reward, unit: '', icon: BarChart3, type: 'positive' as const },
                  { label: '最大盈亏比', value: ea.stats.max_risk_reward, unit: '', icon: TrendingUp, type: 'positive' as const },
                  { label: '年化收益', value: ea.stats.annual_return, unit: '%', icon: DollarSign, type: 'positive' as const },
                  { label: '月度收益', value: ea.stats.monthly_return, unit: '%', icon: Calendar, type: 'positive' as const }
                ].map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{metric.label}</span>
                      </div>
                      <div className={`text-lg font-bold ${getMetricColor(metric.value, metric.type)}`}>
                        {metric.value.toFixed(metric.unit === '' ? 2 : 1)}{metric.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

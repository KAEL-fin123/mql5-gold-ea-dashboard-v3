'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3, Calendar, DollarSign, RefreshCw, Plus, Settings } from 'lucide-react';
import Header from '../components/Header';
import EACard, { EAData } from '../components/EACard';
import EADetailModal from '../components/EADetailModal';
import SuggestionForm from '../components/SuggestionForm';
import SidebarAd from '../components/SidebarAd';


import { useEAs } from '../hooks/useEAs';
import { queryClient } from '../lib/query-client';

// 排行榜类型定义
type RankingType = 'win_rate' | 'drawdown' | 'max_risk_reward' | 'avg_risk_reward' | 'annual_return' | 'monthly_return';

// 排行榜配置
const rankingTabs = [
  {
    id: 'drawdown' as RankingType,
    name: '回撤榜',
    icon: TrendingDown,
    description: '按最大回撤升序排列',
    color: 'text-destructive'
  },
  {
    id: 'annual_return' as RankingType,
    name: '年化榜',
    icon: Calendar,
    description: '按年化收益降序排列',
    color: 'text-accent'
  },
  {
    id: 'win_rate' as RankingType,
    name: '胜率榜',
    icon: TrendingUp,
    description: '按胜率降序排列',
    color: 'text-accent'
  },
  {
    id: 'max_risk_reward' as RankingType,
    name: '最大盈亏比榜',
    icon: Target,
    description: '按最大盈亏比降序排列',
    color: 'text-primary'
  },
  {
    id: 'avg_risk_reward' as RankingType,
    name: '最小盈亏比榜',
    icon: BarChart3,
    description: '按平均盈亏比降序排列',
    color: 'text-primary'
  },
  {
    id: 'monthly_return' as RankingType,
    name: '本月收益榜',
    icon: DollarSign,
    description: '按月度收益降序排列',
    color: 'text-accent'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<RankingType>('drawdown');
  const [year] = useState(2025);
  const [month] = useState<number | null>(null);
  const [selectedEA, setSelectedEA] = useState<EAData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuggestionFormOpen, setIsSuggestionFormOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  // 使用TanStack Query获取EA数据
  const {
    data: eaResponse,
    isLoading: loading,
    error,
    refetch
  } = useEAs({
    sortBy: activeTab,
    year,
    month,
    limit: showAll ? 1000 : 10  // 显示全部时设置一个较大的limit
  });

  // 获取EA数据
  const eaData = eaResponse?.data || [];

  // 根据搜索查询过滤EA数据
  const filteredEAData = searchQuery.trim()
    ? eaData.filter(ea =>
        ea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ea.description && ea.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : eaData;

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理标签切换
  const handleTabChange = (tabId: RankingType) => {
    setActiveTab(tabId);
    setShowAll(false);  // 切换标签时重置为显示前10个
  };

  // 处理加载更多
  const handleLoadMore = () => {
    setShowAll(true);
  };

  // 处理收起
  const handleShowLess = () => {
    setShowAll(false);
  };

  // 刷新数据
  const handleRefresh = () => {
    refetch();
  };

  // 处理EA卡片点击
  const handleEAClick = (ea: EAData) => {
    setSelectedEA(ea);
    setIsDetailModalOpen(true);
  };

  // 关闭详情弹窗
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEA(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* 侧边栏广告位 */}
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      
      {/* 新的Header组件 */}
      <Header onSearch={handleSearch} />

      {/* 主标题和副标题区域 */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              MQL5 GOLD EA 榜单
            </h1>
            <p className="text-muted-foreground text-lg">
              BBTrading黄金EA分析站｜看穿每一个黄金EA的真实价值
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                搜索结果："{searchQuery}" ({filteredEAData.length} 个结果)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {/* 排行榜标签切换 */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rankingTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`ranking-tab ${isActive ? 'active' : ''} group`}
                  title={tab.description}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconComponent
                      className={`w-5 h-5 ${isActive ? 'text-background' : 'icon-gradient'}`}
                    />
                    <span className={`font-medium text-sm ${isActive ? 'text-background' : 'text-foreground'}`}>
                      {tab.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 当前选中榜单信息和控制栏 */}
        <div className="mb-6">
          <div className="financial-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const currentTab = rankingTabs.find(tab => tab.id === activeTab);
                  const IconComponent = currentTab?.icon || TrendingUp;
                  return (
                    <>
                      <IconComponent className={`w-6 h-6 ${currentTab?.color}`} />
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {currentTab?.name}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {currentTab?.description} • {month ? `${year}年${month}月` : `${year}年度`}数据
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center gap-2 control-buttons">
                <button
                  onClick={() => setIsSuggestionFormOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  title="建议添加EA"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">建议添加</span>
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  title="刷新数据"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EA排行榜列表 */}
        <div className="space-y-4">
          {loading ? (
            /* 加载状态 */
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>正在加载EA数据...</span>
              </div>
            </div>
          ) : error ? (
            /* 错误状态 */
            <div className="text-center py-12">
              <div className="financial-card max-w-md mx-auto">
                <div className="text-destructive mb-2">⚠️ 加载失败</div>
                <p className="text-muted-foreground mb-4">
                  {error instanceof Error ? error.message : '获取数据失败'}
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : filteredEAData.length === 0 ? (
            /* 无数据状态 */
            <div className="text-center py-12">
              <div className="financial-card max-w-md mx-auto">
                <div className="text-muted-foreground mb-2">
                  {searchQuery ? '🔍 未找到匹配结果' : '📊 暂无数据'}
                </div>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `没有找到包含"${searchQuery}"的EA`
                    : `${month ? `${year}年${month}月` : `${year}年度`}暂无EA数据`
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    清除搜索
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* EA卡片列表 */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEAData.map((ea) => (
                  <EACard
                    key={ea.id}
                    ea={ea}
                    rankingType={activeTab}
                    onClick={() => handleEAClick(ea)}
                  />
                ))}
              </div>
              
              {/* 加载更多按钮 */}
              {!searchQuery && eaResponse?.total && eaResponse.total > 10 && (
                <div className="text-center mt-8">
                  {!showAll ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        显示前 {Math.min(10, eaResponse.total)} 个，共 {eaResponse.total} 个EA
                      </p>
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        加载全部 ({eaResponse.total - 10} 个更多)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        已显示全部 {eaResponse.total} 个EA
                      </p>
                      <button
                        onClick={handleShowLess}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                      >
                        <TrendingUp className="w-4 h-4 rotate-180" />
                        收起显示前10个
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* EA详情弹窗 */}
      <EADetailModal
        ea={selectedEA}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        rankingType={activeTab}
      />

      {/* 建议提交表单 */}
      <SuggestionForm
        isOpen={isSuggestionFormOpen}
        onClose={() => setIsSuggestionFormOpen(false)}
      />



      {/* 页脚 */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 BBTrading 大白交易助手 | 用数据说话，让每一个EA交易决策更稳健</p>
          </div>
        </div>
      </footer>


    </div>
  );
}

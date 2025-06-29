'use client';

import { useState, useEffect } from 'react';
import { useEAs } from '@/hooks/useEAs';
import EACard from '@/components/EACard';
import EADetailModal from '@/components/EADetailModal';
import Header from '@/components/Header';
import SidebarAd from '@/components/SidebarAd';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('profit');
  const [selectedEA, setSelectedEA] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllEAs, setShowAllEAs] = useState(false);
  
  // Get current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  const { data: eaData, isLoading, isError, refetch } = useEAs({
    sortBy: selectedTab,
    year: currentYear,
    month: currentMonth,
    limit: showAllEAs ? 1000 : 10, // Show all EAs or just 10
  });
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setShowAllEAs(false); // Reset to show only 10 EAs when changing tabs
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleEACardClick = (id: number) => {
    setSelectedEA(id);
  };
  
  const handleCloseModal = () => {
    setSelectedEA(null);
  };
  
  const handleToggleShowAll = () => {
    setShowAllEAs(!showAllEAs);
  };
  
  // Filter EA data based on search term
  const filteredEAData = eaData?.data.filter(ea => 
    ea.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Left Sidebar Ad */}
        <div className="hidden lg:block w-64 p-4">
          <SidebarAd position="left" />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Main Title and Subtitle */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gold-500 mb-2">
              MQL5 黄金EA信号榜
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentYear}年{currentMonth}月最新数据 | 实时更新 | 专业分析
            </p>
          </div>
          
          {/* Main Content Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            {/* Ranking Tabs */}
            <Tabs defaultValue="profit" value={selectedTab} onValueChange={handleTabChange}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger value="profit">利润排行</TabsTrigger>
                  <TabsTrigger value="win_rate">胜率排行</TabsTrigger>
                  <TabsTrigger value="profit_factor">盈亏比排行</TabsTrigger>
                  <TabsTrigger value="sharpe_ratio">夏普比率排行</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="搜索EA名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full md:w-auto"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCw size={16} />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="profit" className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  按总利润排序，展示表现最佳的黄金EA
                </div>
                
                {/* EA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">加载中...</div>
                  ) : isError ? (
                    <div className="col-span-full text-center py-8 text-red-500">加载失败，请稍后重试</div>
                  ) : filteredEAData.length === 0 ? (
                    <div className="col-span-full text-center py-8">没有找到匹配的EA</div>
                  ) : (
                    filteredEAData.map((ea) => (
                      <EACard key={ea.id} ea={ea} onClick={() => handleEACardClick(ea.id)} />
                    ))
                  )}
                </div>
                
                {/* Show More Button */}
                {!isLoading && !isError && filteredEAData.length > 0 && searchTerm === '' && 
                  (eaData?.returned < eaData?.total || showAllEAs) && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleShowAll}
                      className="text-gold-500 border-gold-500 hover:bg-gold-50 dark:hover:bg-gray-700"
                    >
                      {showAllEAs 
                        ? `收起显示 (当前显示 ${eaData?.returned} / ${eaData?.total})` 
                        : `查看更多EA (当前显示 ${eaData?.returned} / ${eaData?.total})`}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="win_rate" className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  按胜率排序，展示交易成功率最高的黄金EA
                </div>
                
                {/* EA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">加载中...</div>
                  ) : isError ? (
                    <div className="col-span-full text-center py-8 text-red-500">加载失败，请稍后重试</div>
                  ) : filteredEAData.length === 0 ? (
                    <div className="col-span-full text-center py-8">没有找到匹配的EA</div>
                  ) : (
                    filteredEAData.map((ea) => (
                      <EACard key={ea.id} ea={ea} onClick={() => handleEACardClick(ea.id)} />
                    ))
                  )}
                </div>
                
                {/* Show More Button */}
                {!isLoading && !isError && filteredEAData.length > 0 && searchTerm === '' && 
                  (eaData?.returned < eaData?.total || showAllEAs) && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleShowAll}
                      className="text-gold-500 border-gold-500 hover:bg-gold-50 dark:hover:bg-gray-700"
                    >
                      {showAllEAs 
                        ? `收起显示 (当前显示 ${eaData?.returned} / ${eaData?.total})` 
                        : `查看更多EA (当前显示 ${eaData?.returned} / ${eaData?.total})`}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profit_factor" className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  按盈亏比排序，展示风险回报比最优的黄金EA
                </div>
                
                {/* EA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">加载中...</div>
                  ) : isError ? (
                    <div className="col-span-full text-center py-8 text-red-500">加载失败，请稍后重试</div>
                  ) : filteredEAData.length === 0 ? (
                    <div className="col-span-full text-center py-8">没有找到匹配的EA</div>
                  ) : (
                    filteredEAData.map((ea) => (
                      <EACard key={ea.id} ea={ea} onClick={() => handleEACardClick(ea.id)} />
                    ))
                  )}
                </div>
                
                {/* Show More Button */}
                {!isLoading && !isError && filteredEAData.length > 0 && searchTerm === '' && 
                  (eaData?.returned < eaData?.total || showAllEAs) && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleShowAll}
                      className="text-gold-500 border-gold-500 hover:bg-gold-50 dark:hover:bg-gray-700"
                    >
                      {showAllEAs 
                        ? `收起显示 (当前显示 ${eaData?.returned} / ${eaData?.total})` 
                        : `查看更多EA (当前显示 ${eaData?.returned} / ${eaData?.total})`}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sharpe_ratio" className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  按夏普比率排序，展示风险调整后收益最高的黄金EA
                </div>
                
                {/* EA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">加载中...</div>
                  ) : isError ? (
                    <div className="col-span-full text-center py-8 text-red-500">加载失败，请稍后重试</div>
                  ) : filteredEAData.length === 0 ? (
                    <div className="col-span-full text-center py-8">没有找到匹配的EA</div>
                  ) : (
                    filteredEAData.map((ea) => (
                      <EACard key={ea.id} ea={ea} onClick={() => handleEACardClick(ea.id)} />
                    ))
                  )}
                </div>
                
                {/* Show More Button */}
                {!isLoading && !isError && filteredEAData.length > 0 && searchTerm === '' && 
                  (eaData?.returned < eaData?.total || showAllEAs) && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleShowAll}
                      className="text-gold-500 border-gold-500 hover:bg-gold-50 dark:hover:bg-gray-700"
                    >
                      {showAllEAs 
                        ? `收起显示 (当前显示 ${eaData?.returned} / ${eaData?.total})` 
                        : `查看更多EA (当前显示 ${eaData?.returned} / ${eaData?.total})`}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar Ad */}
        <div className="hidden lg:block w-64 p-4">
          <SidebarAd position="right" />
        </div>
      </div>
      
      {/* EA Detail Modal */}
      {selectedEA && (
        <EADetailModal
          eaId={selectedEA}
          onClose={handleCloseModal}
          year={currentYear}
          month={currentMonth}
        />
      )}
    </main>
  );
}

'use client';

import { EAData } from './EACard';

interface EAChartProps {
  ea: EAData;
  chartType?: string;
}

export default function EAChart({ ea }: EAChartProps) {
  // 简化版本 - 不再显示模拟图表，只显示数据说明
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        📊 图表功能已简化
      </div>
      <p className="text-sm text-gray-500">
        基于真实交易数据的详细图表分析功能正在开发中
      </p>
      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">当前数据来源</div>
        <div className="text-sm text-gray-300">
          数据库中的真实EA统计数据，无模拟或虚假数据
        </div>
      </div>
    </div>
  );
}



import { QueryClient } from '@tanstack/react-query';

// 创建QueryClient实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存时间：5分钟
      staleTime: 5 * 60 * 1000,
      // 缓存保持时间：10分钟
      gcTime: 10 * 60 * 1000,
      // 重试配置
      retry: (failureCount, error) => {
        // 对于4xx错误不重试
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        // 最多重试2次
        return failureCount < 2;
      },
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // 变更操作重试1次
      retry: 1,
    },
  },
});

// Query Keys 工厂函数
export const queryKeys = {
  // EA相关查询
  eas: {
    all: ['eas'] as const,
    lists: () => [...queryKeys.eas.all, 'list'] as const,
    list: (filters: {
      sortBy: string;
      year: number;
      month?: number | null;
      limit?: number;
    }) => [...queryKeys.eas.lists(), filters] as const,
    details: () => [...queryKeys.eas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.eas.details(), id] as const,
  },
  // 时间范围查询
  timeRanges: {
    all: ['timeRanges'] as const,
    available: () => [...queryKeys.timeRanges.all, 'available'] as const,
  },
} as const;

// 类型定义
export type QueryKeys = typeof queryKeys;

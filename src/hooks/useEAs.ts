import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface EA {
  id: number;
  name: string;
  profit: number;
  drawdown: number;
  trades: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  recovery_factor: number;
  expected_payoff: number;
  sharpe_ratio: number;
  logo_url?: string;
  year: number;
  month: number;
}

export interface EAApiResponse {
  data: EA[];
  total: number;
  returned: number;
}

export const fetchEAs = async ({
  sortBy = 'profit',
  year,
  month,
  limit = 10,
}: {
  sortBy?: string;
  year?: number;
  month?: number;
  limit?: number;
}): Promise<EAApiResponse> => {
  const params = new URLSearchParams();
  
  if (sortBy) params.append('sortBy', sortBy);
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  if (limit) params.append('limit', limit.toString());
  
  const response = await fetch(`/api/eas?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch EAs');
  }
  
  return response.json();
};

export const useEAs = ({
  sortBy,
  year,
  month,
  limit,
}: {
  sortBy?: string;
  year?: number;
  month?: number;
  limit?: number;
}) => {
  return useQuery<EAApiResponse, Error>({
    queryKey: ['eas', sortBy, year, month, limit],
    queryFn: () => fetchEAs({ sortBy, year, month, limit }),
  });
};

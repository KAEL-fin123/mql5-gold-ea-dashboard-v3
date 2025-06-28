import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出createClient函数供API路由使用
export { createClient }

// 数据库类型定义
export interface EA {
  id: string
  name: string
  logo_url?: string
  description?: string
  created_at?: string
  updated_at?: string
  win_rate?: number
  total_trades?: number
  profit_factor?: number
  max_drawdown?: number
  avg_monthly_return?: number
  sharpe_ratio?: number
  calmar_ratio?: number
  recovery_factor?: number
  profit_trades?: number
  loss_trades?: number
  largest_profit?: number
  largest_loss?: number
  avg_profit?: number
  avg_loss?: number
  max_consecutive_wins?: number
  max_consecutive_losses?: number
  avg_trade_duration?: number
  commission?: number
  swap?: number
  net_profit?: number
  gross_profit?: number
  gross_loss?: number
  balance_dd_absolute?: number
  balance_dd_maximal?: number
  balance_dd_relative?: number
  equity_dd_absolute?: number
  equity_dd_maximal?: number
  equity_dd_relative?: number
  expected_payoff?: number
  profit_trades_percent?: number
  loss_trades_percent?: number
  largest_profit_trade?: number
  largest_loss_trade?: number
  avg_profit_trade?: number
  avg_loss_trade?: number
  max_consecutive_profit?: number
  max_consecutive_loss?: number
  max_consecutive_profit_count?: number
  max_consecutive_loss_count?: number
  avg_consecutive_wins?: number
  avg_consecutive_losses?: number
}

export interface Suggestion {
  id: string
  name: string
  email: string
  suggestion_type: 'feature' | 'bug' | 'improvement' | 'other'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  created_at: string
  updated_at?: string
}

export interface AdData {
  id: number
  position: 'left' | 'right' | 'footer' | 'header'
  image_url: string
  link_url: string
  is_active: boolean
  created_at: string
}

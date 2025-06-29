import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase';

// 创建Supabase客户端
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// 排序类型定义
type SortType = 'win_rate' | 'drawdown' | 'max_risk_reward' | 'avg_risk_reward' | 'annual_return' | 'monthly_return';

// 定义查询返回的数据结构类型
interface EAStat {
  id: number;
  ea_id: number;
  year: number;
  month: number | null;
  win_rate: number | null;
  drawdown: number | null;
  avg_risk_reward: number | null;
  max_risk_reward: number | null;
  annual_return: number | null;
  monthly_return: number | null;
  eas: {
    id: number;
    name: string;
    logo_url: string | null;
    description: string | null;
  };
}

// 排序配置
const sortConfigs = {
  win_rate: { column: 'win_rate', order: 'desc' },
  drawdown: { column: 'drawdown', order: 'asc' },
  max_risk_reward: { column: 'max_risk_reward', order: 'desc' },
  avg_risk_reward: { column: 'avg_risk_reward', order: 'desc' },
  annual_return: { column: 'annual_return', order: 'desc' },
  monthly_return: { column: 'monthly_return', order: 'desc' }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = (searchParams.get('sortBy') as SortType) || 'win_rate';
    const year = parseInt(searchParams.get('year') || '2025');
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
    const limit = parseInt(searchParams.get('limit') || '10');

    // 验证排序类型
    if (!sortConfigs[sortBy]) {
      return NextResponse.json(
        { error: '无效的排序类型' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();
    const sortConfig = sortConfigs[sortBy];

    // 构建查询 - 使用DISTINCT ON确保每个EA只返回一条记录
    let query = supabase
      .from('ea_stats')
      .select(`
        id,
        ea_id,
        year,
        month,
        win_rate,
        drawdown,
        avg_risk_reward,
        max_risk_reward,
        annual_return,
        monthly_return,
        eas!inner (
          id,
          name,
          logo_url,
          description
        )
      `)
      .eq('year', year);

    // 如果指定了月份，则查询月度数据，否则查询年度数据
    if (month) {
      query = query.eq('month', month);
    } else {
      query = query.is('month', null);
    }

    // 应用排序
    query = query.order(sortConfig.column, { ascending: sortConfig.order === 'asc' });

    // 首先获取总数（不应用limit）
    let countQuery = supabase
      .from('ea_stats')
      .select('ea_id', { count: 'exact', head: true })
      .eq('year', year);

    if (month) {
      countQuery = countQuery.eq('month', month);
    } else {
      countQuery = countQuery.is('month', null);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Supabase计数查询错误:', countError);
      return NextResponse.json(
        { error: '数据库查询失败' },
        { status: 500 }
      );
    }

    // 应用限制
    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase查询错误:', error);
      return NextResponse.json(
        { error: '数据库查询失败' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          data: [], 
          message: '暂无数据',
          sortBy,
          year,
          month,
          total: totalCount || 0
        },
        { status: 200 }
      );
    }

    // 转换数据格式并添加排名
    const transformedData = data.map((item, index) => {
      // Supabase join can return an array, so we take the first element.
      const eaData = Array.isArray(item.eas) ? item.eas[0] : item.eas;
      
      return {
        id: eaData?.id,
        name: eaData?.name,
        logo_url: eaData?.logo_url,
        description: eaData?.description,
        stats: {
          win_rate: item.win_rate,
          drawdown: item.drawdown,
          avg_risk_reward: item.avg_risk_reward,
          max_risk_reward: item.max_risk_reward,
          annual_return: item.annual_return,
          monthly_return: item.monthly_return
        },
        rank: index + 1
      };
    });

    return NextResponse.json({
      data: transformedData,
      sortBy,
      year,
      month,
      total: totalCount || 0
    });

  } catch (error) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取可用的年份和月份
export async function POST() {
  try {
    const supabase = createSupabaseClient();

    // 获取所有可用的年份
    const { data: yearData, error: yearError } = await supabase
      .from('ea_stats')
      .select('year')
      .order('year', { ascending: false });

    if (yearError) {
      console.error('获取年份数据错误:', yearError);
      return NextResponse.json(
        { error: '获取年份数据失败' },
        { status: 500 }
      );
    }

    // 获取所有可用的月份（非空月份）
    const { data: monthData, error: monthError } = await supabase
      .from('ea_stats')
      .select('year, month')
      .not('month', 'is', null)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (monthError) {
      console.error('获取月份数据错误:', monthError);
      return NextResponse.json(
        { error: '获取月份数据失败' },
        { status: 500 }
      );
    }

    // 处理年份数据（去重）
    const availableYears = [...new Set(yearData?.map((item: { year: number }) => item.year) || [])];

    // 处理月份数据（按年份分组）
    const availableMonths: { [year: number]: number[] } = {};
    monthData?.forEach((item: { year: number; month: number }) => {
      if (!availableMonths[item.year]) {
        availableMonths[item.year] = [];
      }
      if (item.month && !availableMonths[item.year].includes(item.month)) {
        availableMonths[item.year].push(item.month);
      }
    });

    // 对每年的月份进行排序
    Object.keys(availableMonths).forEach(year => {
      availableMonths[parseInt(year)].sort((a, b) => b - a);
    });

    return NextResponse.json({
      availableYears,
      availableMonths,
      sortTypes: Object.keys(sortConfigs)
    });

  } catch (error) {
    console.error('获取可用时间范围错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

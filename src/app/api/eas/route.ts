import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'profit';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // First, get the total count before applying limit
    let countQuery = supabase
      .from('ea_stats')
      .select('*', { count: 'exact', head: false });

    // Apply year and month filters if provided
    if (year !== undefined) {
      countQuery = countQuery.eq('year', year);
    }
    if (month !== undefined) {
      countQuery = countQuery.eq('month', month);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Error fetching total count:', countError);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Now get the actual data with limit
    let query = supabase
      .from('ea_stats')
      .select('*');

    // Apply year and month filters if provided
    if (year !== undefined) {
      query = query.eq('year', year);
    }
    if (month !== undefined) {
      query = query.eq('month', month);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: false });

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Transform data if needed
    const transformedData = data.map(ea => ({
      id: ea.id,
      name: ea.name || `EA ${ea.id}`,
      profit: ea.profit,
      drawdown: ea.drawdown,
      trades: ea.trades,
      win_rate: ea.win_rate,
      avg_win: ea.avg_win,
      avg_loss: ea.avg_loss,
      profit_factor: ea.profit_factor,
      recovery_factor: ea.recovery_factor,
      expected_payoff: ea.expected_payoff,
      sharpe_ratio: ea.sharpe_ratio,
      logo_url: ea.logo_url,
      year: ea.year,
      month: ea.month
    }));

    return NextResponse.json({
      data: transformedData,
      total: totalCount || 0,
      returned: transformedData.length
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

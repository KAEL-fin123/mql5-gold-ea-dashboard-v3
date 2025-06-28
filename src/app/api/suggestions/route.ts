import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase';
import { createIssueForSuggestion } from '../../../lib/mcp-client';

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

// 获取客户端IP地址
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || remoteAddr || 'unknown';
}

// 检查IP限制（防止滥用）
async function checkIPLimit(supabase: any, userIP: string): Promise<boolean> {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data, error } = await supabase
    .from('user_requests')
    .select('id')
    .eq('user_ip', userIP)
    .gte('submitted_at', oneDayAgo.toISOString());

  if (error) {
    console.error('检查IP限制错误:', error);
    return false;
  }

  // 每个IP每天最多提交5次
  return (data?.length || 0) < 5;
}

// 验证请求数据
function validateRequestData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.eaName || typeof data.eaName !== 'string') {
    errors.push('EA名称是必填项');
  } else if (data.eaName.length < 2 || data.eaName.length > 100) {
    errors.push('EA名称长度应在2-100个字符之间');
  }

  if (!data.reason || typeof data.reason !== 'string') {
    errors.push('建议理由是必填项');
  } else if (data.reason.length < 10 || data.reason.length > 500) {
    errors.push('建议理由长度应在10-500个字符之间');
  }

  if (data.contact && typeof data.contact === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contact)) {
      errors.push('请输入有效的邮箱地址');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const data = await request.json();
    
    // 验证数据
    const validation = validateRequestData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: '数据验证失败', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // 获取客户端IP
    const userIP = getClientIP(request);
    
    // 创建数据库连接
    const supabase = createSupabaseClient();
    
    // 检查IP限制
    const canSubmit = await checkIPLimit(supabase, userIP);
    if (!canSubmit) {
      return NextResponse.json(
        { 
          error: '提交过于频繁，请24小时后再试',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // 由于数据库表缺少reason和contact字段，暂时将信息合并到ea_name字段
    const combinedInfo = `${data.eaName.trim()} | 理由: ${data.reason.trim()}${data.contact ? ` | 联系: ${data.contact.trim()}` : ''}`;

    // 插入建议记录
    const { data: insertResult, error: insertError } = await supabase
      .from('user_requests')
      .insert({
        ea_name: combinedInfo,
        user_ip: userIP,
        submitted_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.error('插入建议记录错误:', insertError);
      return NextResponse.json(
        { error: '保存建议失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 尝试创建 GitHub Issue（不影响主要流程）
    let githubIssueCreated = false;
    try {
      if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
        await createIssueForSuggestion({
          ea_name: data.eaName,
          reason: data.reason,
          contact: data.contact
        });
        githubIssueCreated = true;
        console.log('GitHub Issue 创建成功');
      }
    } catch (githubError) {
      console.error('创建 GitHub Issue 失败:', githubError);
      // 不影响主要流程，继续执行
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '建议提交成功，感谢您的反馈！',
      githubIssueCreated
    });

  } catch (error) {
    console.error('建议提交API错误:', error);
    
    // 处理JSON解析错误
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '请求数据格式错误' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取建议统计信息（管理员用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('admin_key');

    // 验证管理员权限
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      );
    }

    const supabase = createSupabaseClient();

    // 获取建议统计
    const { data, error } = await supabase
      .from('user_requests')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('获取建议统计错误:', error);
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      );
    }

    // 统计信息
    const stats = {
      total: data?.length || 0,
      today: data?.filter(item => {
        const today = new Date().toDateString();
        const itemDate = new Date(item.submitted_at).toDateString();
        return today === itemDate;
      }).length || 0,
      thisWeek: data?.filter(item => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(item.submitted_at) > weekAgo;
      }).length || 0
    };

    return NextResponse.json({
      suggestions: data,
      stats
    });

  } catch (error) {
    console.error('获取建议统计API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

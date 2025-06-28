const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function updateDatabase() {
  console.log('🔄 开始更新数据库...');
  
  try {
    // 1. 更新EA表的logo_url路径
    console.log('\n1. 更新EA Logo路径...');
    
    const logoUpdates = [
      { name: 'Gold Scalper Pro', logo_url: '/logos/gold-scalper-pro.svg' },
      { name: 'Golden Trend Master', logo_url: '/logos/golden-trend-master.svg' },
      { name: 'Gold Grid Expert', logo_url: '/logos/gold-grid-expert.svg' },
      { name: 'Smart Gold Trader', logo_url: '/logos/smart-gold-trader.svg' },
      { name: 'Gold Breakout Hunter', logo_url: '/logos/gold-breakout-hunter.svg' }
    ];

    for (const update of logoUpdates) {
      const { error } = await supabase
        .from('eas')
        .update({ logo_url: update.logo_url })
        .eq('name', update.name);
      
      if (error) {
        console.error(`❌ 更新 ${update.name} 失败:`, error);
      } else {
        console.log(`✅ 更新 ${update.name} 成功`);
      }
    }

    // 2. 检查并添加缺失的EA统计数据
    console.log('\n2. 检查EA统计数据...');
    
    // 获取所有EA
    const { data: eas, error: easError } = await supabase
      .from('eas')
      .select('id, name');
    
    if (easError) {
      console.error('❌ 获取EA列表失败:', easError);
      return;
    }

    console.log(`📊 找到 ${eas.length} 个EA`);

    // 为每个EA创建2024年度统计数据
    for (const ea of eas) {
      // 检查是否已有2024年数据
      const { data: existingStats, error: checkError } = await supabase
        .from('ea_stats')
        .select('id')
        .eq('ea_id', ea.id)
        .eq('year', 2024)
        .is('month', null);

      if (checkError) {
        console.error(`❌ 检查 ${ea.name} 统计数据失败:`, checkError);
        continue;
      }

      if (existingStats && existingStats.length > 0) {
        console.log(`✅ ${ea.name} 已有2024年数据`);
        continue;
      }

      // 生成随机但合理的统计数据
      const stats = generateRealisticStats(ea.name);
      
      const { error: insertError } = await supabase
        .from('ea_stats')
        .insert({
          ea_id: ea.id,
          year: 2024,
          month: null,
          ...stats
        });

      if (insertError) {
        console.error(`❌ 插入 ${ea.name} 统计数据失败:`, insertError);
      } else {
        console.log(`✅ 为 ${ea.name} 创建2024年统计数据`);
      }
    }

    // 3. 验证数据
    console.log('\n3. 验证数据...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('ea_stats')
      .select(`
        *,
        eas (
          id,
          name,
          logo_url,
          description
        )
      `)
      .eq('year', 2024)
      .is('month', null)
      .order('win_rate', { ascending: false })
      .limit(5);

    if (verifyError) {
      console.error('❌ 验证数据失败:', verifyError);
    } else {
      console.log(`✅ 验证成功，找到 ${verifyData.length} 条2024年数据`);
      verifyData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.eas.name} - 胜率: ${item.win_rate}%`);
      });
    }

    console.log('\n🎉 数据库更新完成！');

  } catch (error) {
    console.error('❌ 数据库更新失败:', error);
  }
}

// 生成合理的统计数据
function generateRealisticStats(eaName) {
  // 基于EA名称生成不同的特征
  const seed = eaName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 使用种子生成一致的随机数
  function seededRandom(min, max) {
    const x = Math.sin(seed * 9999) * 10000;
    const random = x - Math.floor(x);
    return min + random * (max - min);
  }

  const baseWinRate = seededRandom(55, 85);
  const baseDrawdown = seededRandom(8, 25);
  const baseAnnualReturn = seededRandom(15, 45);
  
  return {
    win_rate: Math.round(baseWinRate * 100) / 100,
    drawdown: Math.round(baseDrawdown * 100) / 100,
    avg_risk_reward: Math.round(seededRandom(1.2, 3.5) * 100) / 100,
    max_risk_reward: Math.round(seededRandom(2.0, 5.0) * 100) / 100,
    annual_return: Math.round(baseAnnualReturn * 100) / 100,
    monthly_return: Math.round((baseAnnualReturn / 12) * 100) / 100
  };
}

// 运行更新
updateDatabase();

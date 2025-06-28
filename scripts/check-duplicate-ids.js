const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://rllpuaybvztqqqhnvaok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM5NjU2NSwiZXhwIjoyMDY0OTcyNTY1fQ.mpFtW2irZyeDaaUwKPixIC5EalJBhbaxr7qGUaIKCuE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicateIds() {
  console.log('🔍 检查重复的EA ID...');
  
  try {
    // 1. 检查eas表中是否有重复的ID
    console.log('\n1. 检查eas表中的重复ID...');
    const { data: easData, error: easError } = await supabase
      .from('eas')
      .select('id, name');
    
    if (easError) {
      console.error('❌ 查询eas表失败:', easError);
      return;
    }
    
    const easIds = easData.map(ea => ea.id);
    const duplicateEasIds = easIds.filter((id, index) => easIds.indexOf(id) !== index);
    
    if (duplicateEasIds.length > 0) {
      console.log('❌ 发现重复的EA ID:', duplicateEasIds);
    } else {
      console.log('✅ eas表中没有重复的ID');
    }
    
    console.log(`📊 eas表总记录数: ${easData.length}`);
    
    // 2. 检查ea_stats表中是否有重复的记录
    console.log('\n2. 检查ea_stats表中的重复记录...');
    const { data: statsData, error: statsError } = await supabase
      .from('ea_stats')
      .select('id, ea_id, year, month');
    
    if (statsError) {
      console.error('❌ 查询ea_stats表失败:', statsError);
      return;
    }
    
    // 检查是否有相同ea_id, year, month的记录
    const statsKeys = statsData.map(stat => `${stat.ea_id}-${stat.year}-${stat.month || 'null'}`);
    const duplicateStatsKeys = statsKeys.filter((key, index) => statsKeys.indexOf(key) !== index);
    
    if (duplicateStatsKeys.length > 0) {
      console.log('❌ 发现重复的统计记录键:', duplicateStatsKeys);
      
      // 显示重复记录的详细信息
      for (const dupKey of [...new Set(duplicateStatsKeys)]) {
        const [ea_id, year, month] = dupKey.split('-');
        const duplicates = statsData.filter(stat => 
          stat.ea_id === ea_id && 
          stat.year.toString() === year && 
          (stat.month || 'null').toString() === month
        );
        console.log(`  重复记录 (ea_id: ${ea_id}, year: ${year}, month: ${month}):`, duplicates.map(d => d.id));
      }
    } else {
      console.log('✅ ea_stats表中没有重复的统计记录');
    }
    
    console.log(`📊 ea_stats表总记录数: ${statsData.length}`);
    
    // 3. 模拟API查询，检查返回的数据是否有重复ID
    console.log('\n3. 模拟API查询检查...');
    const { data: apiData, error: apiError } = await supabase
      .from('ea_stats')
      .select(`
        eas!inner(id, name, logo_url, description),
        win_rate,
        drawdown,
        avg_risk_reward,
        max_risk_reward,
        annual_return,
        monthly_return
      `)
      .eq('year', 2025)
      .order('win_rate', { ascending: false })
      .limit(10);
    
    if (apiError) {
      console.error('❌ 模拟API查询失败:', apiError);
      return;
    }
    
    const apiIds = apiData.map(item => item.eas.id);
    const duplicateApiIds = apiIds.filter((id, index) => apiIds.indexOf(id) !== index);
    
    if (duplicateApiIds.length > 0) {
      console.log('❌ API返回数据中发现重复的EA ID:', duplicateApiIds);
      console.log('重复的记录:');
      duplicateApiIds.forEach(dupId => {
        const duplicates = apiData.filter(item => item.eas.id === dupId);
        console.log(`  EA ID ${dupId}:`, duplicates.length, '条记录');
      });
    } else {
      console.log('✅ API返回数据中没有重复的EA ID');
    }
    
    console.log(`📊 API返回记录数: ${apiData.length}`);
    
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
  }
}

// 运行检查
checkDuplicateIds().then(() => {
  console.log('\n🎉 重复ID检查完成！');
  process.exit(0);
}).catch(error => {
  console.error('❌ 检查失败:', error);
  process.exit(1);
});
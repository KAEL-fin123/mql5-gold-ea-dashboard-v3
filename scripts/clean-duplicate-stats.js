const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://rllpuaybvztqqqhnvaok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM5NjU2NSwiZXhwIjoyMDY0OTcyNTY1fQ.mpFtW2irZyeDaaUwKPixIC5EalJBhbaxr7qGUaIKCuE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicateStats() {
  console.log('🧹 开始清理重复的ea_stats记录...');
  
  try {
    // 1. 查找所有重复的记录
    console.log('\n1. 查找重复记录...');
    const { data: allStats, error: fetchError } = await supabase
      .from('ea_stats')
      .select('id, ea_id, year, month, created_at')
      .order('ea_id')
      .order('year')
      .order('created_at');
    
    if (fetchError) {
      console.error('❌ 查询失败:', fetchError);
      return;
    }
    
    console.log(`📊 总记录数: ${allStats.length}`);
    
    // 2. 按ea_id和year分组，找出重复记录
    const groupedStats = {};
    const duplicateIds = [];
    
    allStats.forEach(stat => {
      const key = `${stat.ea_id}-${stat.year}-${stat.month || 'null'}`;
      
      if (!groupedStats[key]) {
        groupedStats[key] = [];
      }
      groupedStats[key].push(stat);
    });
    
    // 找出有重复的组
    Object.entries(groupedStats).forEach(([key, records]) => {
      if (records.length > 1) {
        console.log(`\n🔍 发现重复记录组 (${key}): ${records.length} 条`);
        
        // 保留最早创建的记录，删除其他的
        const sortedRecords = records.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const keepRecord = sortedRecords[0];
        const deleteRecords = sortedRecords.slice(1);
        
        console.log(`  保留记录: ${keepRecord.id} (创建于: ${keepRecord.created_at})`);
        console.log(`  删除记录: ${deleteRecords.map(r => r.id).join(', ')}`);
        
        duplicateIds.push(...deleteRecords.map(r => r.id));
      }
    });
    
    if (duplicateIds.length === 0) {
      console.log('\n✅ 没有发现重复记录，数据库已经是干净的！');
      return;
    }
    
    console.log(`\n📋 总共需要删除 ${duplicateIds.length} 条重复记录`);
    
    // 3. 删除重复记录
    console.log('\n3. 删除重复记录...');
    
    // 分批删除，避免一次删除太多记录
    const batchSize = 10;
    let deletedCount = 0;
    
    for (let i = 0; i < duplicateIds.length; i += batchSize) {
      const batch = duplicateIds.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('ea_stats')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`❌ 删除批次 ${Math.floor(i/batchSize) + 1} 失败:`, deleteError);
        continue;
      }
      
      deletedCount += batch.length;
      console.log(`✅ 已删除 ${deletedCount}/${duplicateIds.length} 条记录`);
    }
    
    // 4. 验证清理结果
    console.log('\n4. 验证清理结果...');
    const { data: finalStats, error: finalError } = await supabase
      .from('ea_stats')
      .select('id, ea_id, year, month');
    
    if (finalError) {
      console.error('❌ 验证查询失败:', finalError);
      return;
    }
    
    const finalGrouped = {};
    finalStats.forEach(stat => {
      const key = `${stat.ea_id}-${stat.year}-${stat.month || 'null'}`;
      if (!finalGrouped[key]) {
        finalGrouped[key] = 0;
      }
      finalGrouped[key]++;
    });
    
    const remainingDuplicates = Object.entries(finalGrouped).filter(([key, count]) => count > 1);
    
    if (remainingDuplicates.length === 0) {
      console.log('✅ 清理完成！没有剩余的重复记录');
    } else {
      console.log('⚠️ 仍有重复记录:', remainingDuplicates);
    }
    
    console.log(`📊 清理后总记录数: ${finalStats.length}`);
    console.log(`🗑️ 共删除了 ${deletedCount} 条重复记录`);
    
  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error);
  }
}

// 运行清理
cleanDuplicateStats().then(() => {
  console.log('\n🎉 重复记录清理完成！');
  process.exit(0);
}).catch(error => {
  console.error('❌ 清理失败:', error);
  process.exit(1);
});
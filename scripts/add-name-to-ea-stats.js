const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量读取配置
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少必要的环境变量:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addNameToEaStats() {
  try {
    console.log('🚀 开始为 ea_stats 表添加 name 字段...');
    
    // 步骤1: 检查 name 字段是否已存在
    console.log('\n🔍 检查 ea_stats 表结构...');
    
    // 尝试查询 ea_stats 表的 name 字段来检查是否存在
    const { data: testData, error: testError } = await supabase
      .from('ea_stats')
      .select('name')
      .limit(1);
    
    let hasNameColumn = false;
    
    if (testError) {
      if (testError.message.includes('column ea_stats.name does not exist') || 
          testError.message.includes('column "name" does not exist')) {
        console.log('📝 name 字段不存在，需要添加...');
        console.log('\n⚠️  需要手动在 Supabase SQL 编辑器中执行以下 SQL:');
        console.log('\n' + '='.repeat(60));
        console.log('ALTER TABLE ea_stats ADD COLUMN IF NOT EXISTS name TEXT;');
        console.log('='.repeat(60));
        console.log('\n📍 详细操作步骤:');
        console.log('   1. 打开 Supabase 管理界面 (https://supabase.com/dashboard)');
        console.log('   2. 选择你的项目');
        console.log('   3. 点击左侧菜单的 "SQL Editor"');
        console.log('   4. 在编辑器中粘贴上述 SQL 语句');
        console.log('   5. 点击 "Run" 按钮执行');
        console.log('   6. 执行成功后，重新运行此脚本: node scripts/add-name-to-ea-stats.js');
        console.log('\n💡 添加 name 字段的好处:');
        console.log('   - 在 Supabase 管理界面可以直接看到 EA 名称');
        console.log('   - 不需要记忆复杂的 UUID 来识别 EA');
        console.log('   - 方便数据库管理和调试');
        return;
      } else {
        console.error('❌ 检查表结构失败:', testError);
        throw testError;
      }
    } else {
      hasNameColumn = true;
      console.log('✅ name 字段已存在');
    }
    
    // 步骤2: 同步名称数据
    console.log('\n📝 同步 EA 名称到 ea_stats 表...');
    
    // 获取所有 ea_stats 记录和对应的 EA 信息
    const { data: statsData, error: statsError } = await supabase
      .from('ea_stats')
      .select(`
        id,
        ea_id,
        name,
        eas!inner(name)
      `);
    
    if (statsError) {
      console.error('❌ 获取 ea_stats 数据失败:', statsError);
      throw statsError;
    }
    
    console.log(`📊 找到 ${statsData.length} 条 ea_stats 记录`);
    
    // 找出需要更新名称的记录
    const recordsToUpdate = statsData.filter(record => 
      !record.name || record.name !== record.eas.name
    );
    
    if (recordsToUpdate.length === 0) {
      console.log('✅ 所有记录的名称都已正确同步');
    } else {
      console.log(`🔄 需要更新 ${recordsToUpdate.length} 条记录的名称...`);
      
      // 批量更新记录
      let successCount = 0;
      let errorCount = 0;
      
      for (const record of recordsToUpdate) {
        const { error: updateError } = await supabase
          .from('ea_stats')
          .update({ name: record.eas.name })
          .eq('id', record.id);
        
        if (updateError) {
          console.error(`❌ 更新记录 ${record.id} 失败:`, updateError);
          errorCount++;
        } else {
          successCount++;
        }
      }
      
      console.log(`\n📈 更新结果: ${successCount} 成功, ${errorCount} 失败`);
    }
    
    // 验证最终结果
    console.log('\n🔍 验证同步结果...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('ea_stats')
      .select(`
        id,
        name,
        ea_id,
        year,
        month,
        win_rate,
        eas!inner(name)
      `)
      .limit(5);
    
    if (verifyError) {
      console.error('❌ 验证查询失败:', verifyError);
      throw verifyError;
    }
    
    console.log('\n📊 同步结果验证:');
    console.table(verifyData.map(item => ({
      'Stats ID': item.id.substring(0, 8) + '...',
      'EA Name (Stats)': item.name,
      'EA Name (EAs)': item.eas.name,
      'Year': item.year,
      'Month': item.month || 'Annual',
      'Win Rate': item.win_rate + '%',
      'Name Match': item.name === item.eas.name ? '✅' : '❌'
    })));
    
    console.log('\n🎉 迁移完成！现在你可以在 Supabase 管理界面直接通过 EA 名称识别和修改数据了！');
    console.log('\n💡 使用建议:');
    console.log('   1. 在 Supabase 管理界面查看 ea_stats 表时，现在可以直接看到 name 字段');
    console.log('   2. 可以通过 name 字段快速筛选和查找特定的 EA 数据');
    console.log('   3. 修改数据时不再需要记忆复杂的 UUID');
    console.log('   4. 触发器会自动保持 name 字段与 eas 表同步');
    
  } catch (error) {
    console.error('\n❌ 迁移过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  addNameToEaStats();
}

module.exports = { addNameToEaStats };
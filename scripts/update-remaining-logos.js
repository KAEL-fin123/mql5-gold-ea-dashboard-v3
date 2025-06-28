const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://rllpuaybvztqqqhnvaok.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM5NjU2NSwiZXhwIjoyMDY0OTcyNTY1fQ.mpFtW2irZyeDaaUwKPixIC5EalJBhbaxr7qGUaIKCuE';

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Supabase Storage的placeholder URL
const placeholderUrl = 'https://rllpuaybvztqqqhnvaok.supabase.co/storage/v1/object/public/ea-logos/placeholder.svg';

async function updateRemainingLogos() {
  console.log('🔄 更新剩余EA的头像URL到Supabase Storage...');
  
  try {
    // 获取所有仍使用本地路径的EA
    const { data: eas, error } = await supabase
      .from('eas')
      .select('id, name, logo_url')
      .like('logo_url', '/logos/%');
    
    if (error) {
      console.error('❌ 获取EA列表失败:', error);
      return;
    }
    
    console.log(`📊 找到 ${eas.length} 个需要更新的EA`);
    
    if (eas.length === 0) {
      console.log('✅ 所有EA已使用Supabase Storage URL');
      return;
    }
    
    let successCount = 0;
    
    // 更新每个EA的logo_url
    for (const ea of eas) {
      console.log(`🔄 更新EA: ${ea.name}`);
      
      const { data, error: updateError } = await supabase
        .from('eas')
        .update({ logo_url: placeholderUrl })
        .eq('id', ea.id)
        .select();
      
      if (updateError) {
        console.error(`❌ 更新EA "${ea.name}" 失败:`, updateError);
        continue;
      }
      
      console.log(`✅ EA "${ea.name}" 更新成功`);
      successCount++;
    }
    
    console.log(`\n🎉 更新完成!`);
    console.log(`✅ 成功更新: ${successCount} 个EA`);
    console.log(`📊 总计处理: ${eas.length} 个EA`);
    
  } catch (error) {
    console.error('❌ 更新过程中发生错误:', error);
  }
}

// 验证所有EA的头像URL状态
async function verifyAllLogos() {
  console.log('\n🔍 验证所有EA的头像URL状态...');
  
  const { data: eas, error } = await supabase
    .from('eas')
    .select('name, logo_url')
    .order('name');
  
  if (error) {
    console.error('❌ 验证失败:', error);
    return;
  }
  
  console.log('\n📋 所有EA头像URL状态:');
  
  let supabaseCount = 0;
  let localCount = 0;
  
  eas.forEach(ea => {
    const isSupabase = ea.logo_url && ea.logo_url.includes('supabase.co');
    const status = isSupabase ? '✅ Supabase' : '❌ 本地';
    console.log(`${status} ${ea.name}: ${ea.logo_url || '无'}`);
    
    if (isSupabase) {
      supabaseCount++;
    } else {
      localCount++;
    }
  });
  
  console.log(`\n📊 统计结果:`);
  console.log(`✅ 使用Supabase Storage: ${supabaseCount} 个EA`);
  console.log(`❌ 仍使用本地路径: ${localCount} 个EA`);
  console.log(`📊 总计: ${eas.length} 个EA`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--verify-only')) {
    await verifyAllLogos();
  } else {
    await updateRemainingLogos();
    await verifyAllLogos();
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  updateRemainingLogos,
  verifyAllLogos
};
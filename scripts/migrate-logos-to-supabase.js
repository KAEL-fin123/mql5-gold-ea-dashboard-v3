const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase配置
const supabaseUrl = 'https://rllpuaybvztqqqhnvaok.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM5NjU2NSwiZXhwIjoyMDY0OTcyNTY1fQ.mpFtW2irZyeDaaUwKPixIC5EalJBhbaxr7qGUaIKCuE';

// 创建Supabase客户端（使用service role key以获得完整权限）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 本地logos目录路径
const logosDir = path.join(__dirname, '..', 'public', 'logos');

async function createEALogosBucket() {
  console.log('🔧 创建ea-logos存储桶...');
  
  // 创建存储桶
  const { data, error } = await supabase.storage.createBucket('ea-logos', {
    public: true,
    allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg'],
    fileSizeLimit: 1024 * 1024 // 1MB
  });
  
  if (error && error.message !== 'Bucket already exists') {
    console.error('❌ 创建存储桶失败:', error);
    return false;
  }
  
  console.log('✅ ea-logos存储桶创建成功或已存在');
  return true;
}

async function uploadLogoFile(fileName, filePath) {
  try {
    console.log(`📤 上传文件: ${fileName}`);
    
    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    
    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from('ea-logos')
      .upload(fileName, fileBuffer, {
        contentType: 'image/svg+xml',
        upsert: true // 如果文件已存在则覆盖
      });
    
    if (error) {
      console.error(`❌ 上传${fileName}失败:`, error);
      return null;
    }
    
    // 获取公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('ea-logos')
      .getPublicUrl(fileName);
    
    console.log(`✅ ${fileName} 上传成功: ${publicUrl}`);
    return publicUrl;
    
  } catch (err) {
    console.error(`❌ 处理文件${fileName}时出错:`, err);
    return null;
  }
}

async function updateEALogoUrl(eaName, newLogoUrl) {
  try {
    console.log(`🔄 更新EA "${eaName}" 的logo_url...`);
    
    const { data, error } = await supabase
      .from('eas')
      .update({ logo_url: newLogoUrl })
      .eq('name', eaName)
      .select();
    
    if (error) {
      console.error(`❌ 更新EA "${eaName}" 失败:`, error);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log(`✅ EA "${eaName}" logo_url更新成功`);
      return true;
    } else {
      console.warn(`⚠️  未找到EA "${eaName}"`);
      return false;
    }
    
  } catch (err) {
    console.error(`❌ 更新EA "${eaName}" 时出错:`, err);
    return false;
  }
}

// EA名称与文件名的映射关系
const eaFileMapping = {
  'Gold Scalper Pro': 'gold-scalper-pro.svg',
  'Golden Trend Master': 'golden-trend-master.svg',
  'Gold Grid Expert': 'gold-grid-expert.svg',
  'Smart Gold Trader': 'smart-gold-trader.svg',
  'Gold Breakout Hunter': 'gold-breakout-hunter.svg'
};

async function migrateLogosToSupabase() {
  console.log('🚀 开始迁移EA头像到Supabase Storage...');
  
  try {
    // 1. 创建存储桶
    const bucketCreated = await createEALogosBucket();
    if (!bucketCreated) {
      console.error('❌ 无法创建存储桶，迁移终止');
      return;
    }
    
    // 2. 获取当前所有EA
    console.log('📋 获取数据库中的EA列表...');
    const { data: eas, error: easError } = await supabase
      .from('eas')
      .select('id, name, logo_url');
    
    if (easError) {
      console.error('❌ 获取EA列表失败:', easError);
      return;
    }
    
    console.log(`📊 找到 ${eas.length} 个EA`);
    
    // 3. 迁移每个EA的头像
    let successCount = 0;
    let skipCount = 0;
    
    for (const ea of eas) {
      console.log(`\n🔍 处理EA: ${ea.name}`);
      
      // 检查是否已经是Supabase Storage URL
      if (ea.logo_url && ea.logo_url.includes('supabase.co')) {
        console.log(`⏭️  EA "${ea.name}" 已使用Supabase Storage，跳过`);
        skipCount++;
        continue;
      }
      
      // 查找对应的文件
      const fileName = eaFileMapping[ea.name];
      if (!fileName) {
        console.warn(`⚠️  未找到EA "${ea.name}" 对应的文件映射`);
        continue;
      }
      
      const filePath = path.join(logosDir, fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  文件不存在: ${filePath}`);
        continue;
      }
      
      // 上传文件
      const publicUrl = await uploadLogoFile(fileName, filePath);
      if (!publicUrl) {
        continue;
      }
      
      // 更新数据库
      const updated = await updateEALogoUrl(ea.name, publicUrl);
      if (updated) {
        successCount++;
      }
    }
    
    // 4. 上传placeholder.svg
    console.log('\n📤 上传placeholder.svg...');
    const placeholderPath = path.join(logosDir, 'placeholder.svg');
    if (fs.existsSync(placeholderPath)) {
      await uploadLogoFile('placeholder.svg', placeholderPath);
    }
    
    console.log('\n🎉 迁移完成!');
    console.log(`✅ 成功迁移: ${successCount} 个EA`);
    console.log(`⏭️  跳过: ${skipCount} 个EA`);
    console.log(`📊 总计: ${eas.length} 个EA`);
    
  } catch (error) {
    console.error('❌ 迁移过程中发生错误:', error);
  }
}

// 验证迁移结果
async function verifyMigration() {
  console.log('\n🔍 验证迁移结果...');
  
  const { data: eas, error } = await supabase
    .from('eas')
    .select('name, logo_url');
  
  if (error) {
    console.error('❌ 验证失败:', error);
    return;
  }
  
  console.log('\n📋 当前EA头像URL状态:');
  eas.forEach(ea => {
    const isSupabase = ea.logo_url && ea.logo_url.includes('supabase.co');
    const status = isSupabase ? '✅ Supabase' : '❌ 本地';
    console.log(`${status} ${ea.name}: ${ea.logo_url || '无'}`);
  });
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--verify')) {
    await verifyMigration();
  } else {
    await migrateLogosToSupabase();
    await verifyMigration();
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  migrateLogosToSupabase,
  verifyMigration
};
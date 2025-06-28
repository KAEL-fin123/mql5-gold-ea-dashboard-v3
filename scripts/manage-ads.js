require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function listAds() {
  console.log('\n📋 当前广告列表:');
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ 查询失败:', error.message);
    return [];
  }
  
  data?.forEach((ad, index) => {
    console.log(`${index + 1}. [${ad.position}] ${ad.category || '未分类'}`);
    console.log(`   标题: ${ad.title || '未设置'}`);
    console.log(`   描述: ${ad.description || '未设置'}`);
    console.log(`   图片: ${ad.image_url}`);
    console.log(`   链接: ${ad.link_url}`);
    console.log(`   状态: ${ad.is_active ? '✅ 启用' : '❌ 禁用'}`);
    console.log(`   ID: ${ad.id}`);
    console.log('---');
  });
  
  return data || [];
}

async function updateAd(adId) {
  console.log('\n📝 更新广告内容:');
  
  const title = await question('请输入新标题 (留空保持不变): ');
  const description = await question('请输入新描述 (留空保持不变): ');
  const category = await question('请输入新分类 (留空保持不变): ');
  const imageUrl = await question('请输入新图片URL (留空保持不变): ');
  const linkUrl = await question('请输入新链接URL (留空保持不变): ');
  const isActive = await question('是否启用? (y/n/留空保持不变): ');
  
  const updateData = {};
  if (title.trim()) updateData.title = title.trim();
  if (description.trim()) updateData.description = description.trim();
  if (category.trim()) updateData.category = category.trim();
  if (imageUrl.trim()) updateData.image_url = imageUrl.trim();
  if (linkUrl.trim()) updateData.link_url = linkUrl.trim();
  if (isActive.toLowerCase() === 'y') updateData.is_active = true;
  if (isActive.toLowerCase() === 'n') updateData.is_active = false;
  
  if (Object.keys(updateData).length === 0) {
    console.log('⚠️  没有任何更改');
    return;
  }
  
  const { error } = await supabase
    .from('ads')
    .update(updateData)
    .eq('id', adId);
  
  if (error) {
    console.error('❌ 更新失败:', error.message);
  } else {
    console.log('✅ 更新成功!');
  }
}

async function createAd() {
  console.log('\n➕ 创建新广告:');
  
  const position = await question('请输入位置 (left/right/footer/header): ');
  const title = await question('请输入标题: ');
  const description = await question('请输入描述: ');
  const category = await question('请输入分类: ');
  const imageUrl = await question('请输入图片URL: ');
  const linkUrl = await question('请输入链接URL: ');
  
  if (!position || !title || !imageUrl || !linkUrl) {
    console.log('❌ 必填字段不能为空');
    return;
  }
  
  const { error } = await supabase
    .from('ads')
    .insert({
      position: position.trim(),
      title: title.trim(),
      description: description.trim() || '点击查看详情，获取更多专业信息和服务',
      category: category.trim(),
      image_url: imageUrl.trim(),
      link_url: linkUrl.trim(),
      is_active: true
    });
  
  if (error) {
    console.error('❌ 创建失败:', error.message);
  } else {
    console.log('✅ 创建成功!');
  }
}

async function main() {
  console.log('🎯 MQL5 Gold EA 广告管理工具');
  console.log('================================');
  
  while (true) {
    console.log('\n请选择操作:');
    console.log('1. 查看所有广告');
    console.log('2. 更新广告');
    console.log('3. 创建新广告');
    console.log('4. 退出');
    
    const choice = await question('\n请输入选项 (1-4): ');
    
    switch (choice) {
      case '1':
        await listAds();
        break;
        
      case '2':
        const ads = await listAds();
        if (ads.length === 0) {
          console.log('❌ 没有广告可更新');
          break;
        }
        const adIndex = await question('\n请输入要更新的广告序号: ');
        const selectedAd = ads[parseInt(adIndex) - 1];
        if (selectedAd) {
          await updateAd(selectedAd.id);
        } else {
          console.log('❌ 无效的序号');
        }
        break;
        
      case '3':
        await createAd();
        break;
        
      case '4':
        console.log('👋 再见!');
        rl.close();
        return;
        
      default:
        console.log('❌ 无效选项');
    }
  }
}

main().catch(console.error);
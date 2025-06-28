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

async function checkTableStructure() {
  console.log('🔍 检查user_requests表结构...');
  
  try {
    // 1. 尝试插入最小数据来了解表结构
    console.log('\n1. 测试基本字段...');
    
    const basicData = {
      ea_name: 'Test Basic',
      user_ip: '127.0.0.1',
      submitted_at: new Date().toISOString()
    };

    const { data: basicResult, error: basicError } = await supabase
      .from('user_requests')
      .insert(basicData)
      .select();

    if (basicError) {
      console.error('❌ 基本字段插入失败:', basicError);
    } else {
      console.log('✅ 基本字段插入成功');
      console.log('返回的数据字段:', Object.keys(basicResult[0]));
      
      // 清理测试数据
      await supabase
        .from('user_requests')
        .delete()
        .eq('ea_name', 'Test Basic');
    }

    // 2. 测试reason字段
    console.log('\n2. 测试reason字段...');
    
    const reasonData = {
      ea_name: 'Test Reason',
      user_ip: '127.0.0.1',
      reason: '测试reason字段',
      submitted_at: new Date().toISOString()
    };

    const { data: reasonResult, error: reasonError } = await supabase
      .from('user_requests')
      .insert(reasonData)
      .select();

    if (reasonError) {
      console.error('❌ reason字段不存在:', reasonError.message);
    } else {
      console.log('✅ reason字段存在');
      await supabase
        .from('user_requests')
        .delete()
        .eq('ea_name', 'Test Reason');
    }

    // 3. 测试contact字段
    console.log('\n3. 测试contact字段...');
    
    const contactData = {
      ea_name: 'Test Contact',
      user_ip: '127.0.0.1',
      contact: 'test@example.com',
      submitted_at: new Date().toISOString()
    };

    const { data: contactResult, error: contactError } = await supabase
      .from('user_requests')
      .insert(contactData)
      .select();

    if (contactError) {
      console.error('❌ contact字段不存在:', contactError.message);
    } else {
      console.log('✅ contact字段存在');
      await supabase
        .from('user_requests')
        .delete()
        .eq('ea_name', 'Test Contact');
    }

    // 4. 查看现有数据
    console.log('\n4. 查看现有数据...');
    
    const { data: existingData, error: existingError } = await supabase
      .from('user_requests')
      .select('*')
      .limit(3);

    if (existingError) {
      console.error('❌ 查询现有数据失败:', existingError);
    } else {
      console.log(`✅ 找到 ${existingData.length} 条现有记录`);
      if (existingData.length > 0) {
        console.log('现有数据字段:', Object.keys(existingData[0]));
        existingData.forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.ea_name} - ${new Date(record.submitted_at).toLocaleString()}`);
        });
      }
    }

    console.log('\n🎉 表结构检查完成！');

  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
  }
}

// 运行检查
checkTableStructure();

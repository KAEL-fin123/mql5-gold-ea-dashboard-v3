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

async function testSuggestionAPI() {
  console.log('🧪 测试建议提交API...');
  
  try {
    // 1. 检查user_requests表结构
    console.log('\n1. 检查user_requests表结构...');
    
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_requests' })
      .catch(async () => {
        // 如果RPC不存在，使用直接查询
        return await supabase
          .from('user_requests')
          .select('*')
          .limit(0);
      });

    if (columnsError) {
      console.log('⚠️ 无法获取表结构，尝试直接插入测试...');
    } else {
      console.log('✅ 表结构检查完成');
    }

    // 2. 测试直接插入数据
    console.log('\n2. 测试直接插入建议数据...');
    
    const testData = {
      ea_name: 'Test EA Direct Insert',
      reason: 'Testing direct database insertion',
      contact: 'test@example.com',
      user_ip: '127.0.0.1',
      submitted_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('user_requests')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ 直接插入失败:', insertError);
      
      // 检查是否是字段缺失问题
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n🔧 检测到字段缺失，尝试添加字段...');
        
        // 尝试添加reason字段
        const { error: alterError1 } = await supabase
          .rpc('exec_sql', { 
            sql: 'ALTER TABLE user_requests ADD COLUMN IF NOT EXISTS reason TEXT NOT NULL DEFAULT \'\';' 
          })
          .catch(() => ({ error: 'RPC not available' }));

        // 尝试添加contact字段
        const { error: alterError2 } = await supabase
          .rpc('exec_sql', { 
            sql: 'ALTER TABLE user_requests ADD COLUMN IF NOT EXISTS contact TEXT;' 
          })
          .catch(() => ({ error: 'RPC not available' }));

        if (alterError1 || alterError2) {
          console.log('⚠️ 无法通过RPC修改表结构，需要手动在Supabase控制台添加字段');
          console.log('需要添加的字段:');
          console.log('- reason: TEXT NOT NULL DEFAULT \'\'');
          console.log('- contact: TEXT');
        } else {
          console.log('✅ 字段添加成功，重新测试插入...');
          
          // 重新尝试插入
          const { data: retryData, error: retryError } = await supabase
            .from('user_requests')
            .insert(testData)
            .select();

          if (retryError) {
            console.error('❌ 重试插入仍然失败:', retryError);
          } else {
            console.log('✅ 重试插入成功:', retryData);
          }
        }
      }
    } else {
      console.log('✅ 直接插入成功:', insertData);
    }

    // 3. 测试API端点
    console.log('\n3. 测试API端点...');
    
    const apiTestData = {
      eaName: 'Test EA API',
      reason: 'Testing API endpoint functionality',
      contact: 'api-test@example.com'
    };

    try {
      const response = await fetch('http://localhost:3000/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTestData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ API测试成功:', responseData);
      } else {
        console.error('❌ API测试失败:', response.status, responseData);
      }
    } catch (apiError) {
      console.error('❌ API请求失败:', apiError.message);
    }

    // 4. 查看最近的建议记录
    console.log('\n4. 查看最近的建议记录...');
    
    const { data: recentData, error: recentError } = await supabase
      .from('user_requests')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(3);

    if (recentError) {
      console.error('❌ 获取最近记录失败:', recentError);
    } else {
      console.log('✅ 最近的建议记录:');
      recentData.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.ea_name} - ${record.submitted_at}`);
      });
    }

    console.log('\n🎉 测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testSuggestionAPI();

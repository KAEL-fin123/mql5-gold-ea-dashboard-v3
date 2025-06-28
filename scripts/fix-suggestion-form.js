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

async function fixSuggestionForm() {
  console.log('🔧 修复建议表单问题...');
  
  try {
    // 1. 检查user_requests表结构
    console.log('\n1. 检查user_requests表结构...');
    
    // 尝试查询表结构
    const { data: testQuery, error: testError } = await supabase
      .from('user_requests')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ 表查询失败:', testError);
      return;
    }

    console.log('✅ user_requests表可以正常访问');

    // 2. 测试插入操作
    console.log('\n2. 测试数据插入...');
    
    const testData = {
      ea_name: 'Test EA - Fix Script',
      reason: '测试建议表单修复脚本的功能',
      contact: 'fix-test@example.com',
      user_ip: '127.0.0.1',
      submitted_at: new Date().toISOString()
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('user_requests')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ 插入测试失败:', insertError);
      
      // 检查是否是字段问题
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n🔧 检测到字段缺失，需要添加字段...');
        console.log('缺失的字段可能是: reason, contact');
        console.log('请在Supabase控制台手动添加这些字段:');
        console.log('- reason: TEXT NOT NULL DEFAULT \'\'');
        console.log('- contact: TEXT');
        return;
      }
      
      // 检查是否是权限问题
      if (insertError.message.includes('permission') || insertError.message.includes('policy')) {
        console.log('\n🔧 检测到权限问题，尝试使用服务密钥...');
        // 权限问题通常需要在Supabase控制台配置RLS策略
        console.log('请检查Supabase中user_requests表的RLS策略');
        return;
      }
      
      return;
    }

    console.log('✅ 数据插入成功:', insertResult);

    // 3. 测试API端点
    console.log('\n3. 测试API端点...');
    
    const apiTestData = {
      eaName: 'Test EA - API Test',
      reason: '测试API端点的功能性',
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

      const responseText = await response.text();
      console.log('API响应状态:', response.status);
      console.log('API响应内容:', responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log('✅ API测试成功:', responseData);
      } else {
        console.error('❌ API测试失败:', response.status, responseText);
        
        // 尝试解析错误信息
        try {
          const errorData = JSON.parse(responseText);
          console.log('错误详情:', errorData);
        } catch (parseError) {
          console.log('无法解析错误响应');
        }
      }
    } catch (apiError) {
      console.error('❌ API请求失败:', apiError.message);
      console.log('请确保开发服务器正在运行 (npm run dev)');
    }

    // 4. 清理测试数据
    console.log('\n4. 清理测试数据...');
    
    const { error: deleteError } = await supabase
      .from('user_requests')
      .delete()
      .in('ea_name', ['Test EA - Fix Script', 'Test EA - API Test']);

    if (deleteError) {
      console.error('⚠️ 清理测试数据失败:', deleteError);
    } else {
      console.log('✅ 测试数据清理完成');
    }

    // 5. 显示最近的建议记录
    console.log('\n5. 显示最近的建议记录...');
    
    const { data: recentData, error: recentError } = await supabase
      .from('user_requests')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('❌ 获取最近记录失败:', recentError);
    } else {
      console.log(`✅ 最近的 ${recentData.length} 条建议记录:`);
      recentData.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.ea_name} - ${new Date(record.submitted_at).toLocaleString()}`);
      });
    }

    console.log('\n🎉 建议表单修复检查完成！');

  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
  }
}

// 运行修复脚本
fixSuggestionForm();

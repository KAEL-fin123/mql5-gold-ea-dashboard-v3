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

async function addMissingColumns() {
  console.log('🔧 添加缺失的数据库字段...');
  
  try {
    // 1. 检查当前表结构
    console.log('\n1. 检查当前user_requests表结构...');
    
    // 尝试查询一条记录来了解当前字段
    const { data: sampleData, error: sampleError } = await supabase
      .from('user_requests')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ 无法查询表:', sampleError);
      return;
    }

    console.log('✅ 当前表可以访问');
    if (sampleData && sampleData.length > 0) {
      console.log('当前字段:', Object.keys(sampleData[0]));
    } else {
      console.log('表为空，无法确定当前字段');
    }

    // 2. 尝试添加reason字段
    console.log('\n2. 添加reason字段...');
    
    try {
      // 使用原始SQL查询添加字段
      const { data: reasonResult, error: reasonError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'user_requests' 
                    AND column_name = 'reason'
                ) THEN
                    ALTER TABLE user_requests ADD COLUMN reason TEXT NOT NULL DEFAULT '';
                    RAISE NOTICE 'Added reason column';
                ELSE
                    RAISE NOTICE 'Reason column already exists';
                END IF;
            END $$;
          `
        });

      if (reasonError) {
        console.log('⚠️ 无法通过RPC添加reason字段:', reasonError.message);
        console.log('请在Supabase控制台手动执行以下SQL:');
        console.log('ALTER TABLE user_requests ADD COLUMN IF NOT EXISTS reason TEXT NOT NULL DEFAULT \'\';');
      } else {
        console.log('✅ reason字段处理完成');
      }
    } catch (rpcError) {
      console.log('⚠️ RPC功能不可用，请手动添加字段');
    }

    // 3. 尝试添加contact字段
    console.log('\n3. 添加contact字段...');
    
    try {
      const { data: contactResult, error: contactError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'user_requests' 
                    AND column_name = 'contact'
                ) THEN
                    ALTER TABLE user_requests ADD COLUMN contact TEXT;
                    RAISE NOTICE 'Added contact column';
                ELSE
                    RAISE NOTICE 'Contact column already exists';
                END IF;
            END $$;
          `
        });

      if (contactError) {
        console.log('⚠️ 无法通过RPC添加contact字段:', contactError.message);
        console.log('请在Supabase控制台手动执行以下SQL:');
        console.log('ALTER TABLE user_requests ADD COLUMN IF NOT EXISTS contact TEXT;');
      } else {
        console.log('✅ contact字段处理完成');
      }
    } catch (rpcError) {
      console.log('⚠️ RPC功能不可用，请手动添加字段');
    }

    // 4. 验证字段添加
    console.log('\n4. 验证字段添加...');
    
    // 尝试插入测试数据来验证字段
    const testData = {
      ea_name: 'Test EA - Column Check',
      reason: '测试字段是否正确添加',
      contact: 'test@example.com',
      user_ip: '127.0.0.1',
      submitted_at: new Date().toISOString()
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('user_requests')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ 验证插入失败:', insertError);
      
      if (insertError.message.includes('contact')) {
        console.log('\n📋 手动添加字段说明:');
        console.log('1. 打开Supabase控制台: https://supabase.com/dashboard');
        console.log('2. 选择你的项目');
        console.log('3. 进入 Table Editor');
        console.log('4. 选择 user_requests 表');
        console.log('5. 点击 "Add Column" 添加以下字段:');
        console.log('   - 字段名: reason, 类型: text, 必填: true, 默认值: \'\'');
        console.log('   - 字段名: contact, 类型: text, 必填: false');
      }
    } else {
      console.log('✅ 字段验证成功:', insertResult);
      
      // 清理测试数据
      await supabase
        .from('user_requests')
        .delete()
        .eq('ea_name', 'Test EA - Column Check');
      
      console.log('✅ 测试数据已清理');
    }

    console.log('\n🎉 字段添加检查完成！');

  } catch (error) {
    console.error('❌ 添加字段过程中发生错误:', error);
  }
}

// 运行脚本
addMissingColumns();

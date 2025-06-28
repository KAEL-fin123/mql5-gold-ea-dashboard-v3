async function testFixedAPI() {
  console.log('🧪 测试修复后的建议API...');
  
  try {
    const testData = {
      eaName: 'Test EA Fixed',
      reason: '测试修复后的建议表单功能',
      contact: 'fixed-test@example.com'
    };

    console.log('发送测试数据:', testData);

    const response = await fetch('http://localhost:3000/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('响应状态:', response.status);
    
    const responseText = await response.text();
    console.log('响应内容:', responseText);

    if (response.ok) {
      const responseData = JSON.parse(responseText);
      console.log('✅ API测试成功:', responseData);
    } else {
      console.error('❌ API测试失败:', response.status);
      try {
        const errorData = JSON.parse(responseText);
        console.log('错误详情:', errorData);
      } catch (parseError) {
        console.log('无法解析错误响应');
      }
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testFixedAPI();

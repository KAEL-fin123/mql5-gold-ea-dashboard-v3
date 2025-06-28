#!/usr/bin/env node

/**
 * 清理Babel配置文件脚本
 * 跨平台兼容
 */

const fs = require('fs');
const path = require('path');

console.log('🗑️ 清理Babel配置文件...');

const babelFiles = [
  '.babelrc',
  '.babelrc.js',
  '.babelrc.json',
  'babel.config.js',
  'babel.config.json'
];

let deletedCount = 0;

babelFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ 删除了 ${file}`);
      deletedCount++;
    }
  } catch (error) {
    console.log(`⚠️ 删除 ${file} 时出现警告:`, error.message);
  }
});

if (deletedCount === 0) {
  console.log('✅ 没有找到Babel配置文件，环境干净');
} else {
  console.log(`✅ 成功删除了 ${deletedCount} 个Babel配置文件`);
}

console.log('🎯 Babel清理完成，确保使用SWC编译器');

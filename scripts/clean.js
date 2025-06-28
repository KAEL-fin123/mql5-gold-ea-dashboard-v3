#!/usr/bin/env node

/**
 * 清理构建文件脚本
 * 跨平台兼容
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 清理构建文件...');

function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ 删除了目录 ${dirPath}`);
      return true;
    } catch (error) {
      console.log(`⚠️ 删除目录 ${dirPath} 时出现警告:`, error.message);
      return false;
    }
  }
  return false;
}

const cleanupPaths = [
  '.next',
  'out',
  'node_modules/.cache',
  '.vercel'
];

let deletedCount = 0;

cleanupPaths.forEach(cleanPath => {
  if (deleteDirectory(cleanPath)) {
    deletedCount++;
  }
});

if (deletedCount === 0) {
  console.log('✅ 没有找到需要清理的构建文件');
} else {
  console.log(`✅ 成功清理了 ${deletedCount} 个构建目录`);
}

console.log('🎯 构建文件清理完成');

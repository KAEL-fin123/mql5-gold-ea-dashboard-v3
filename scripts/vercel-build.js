#!/usr/bin/env node

/**
 * Vercel强制构建脚本
 * 解决Babel/SWC冲突和模块解析问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始强制Vercel构建过程...');

// 1. 强制删除所有可能的Babel配置文件（包括隐藏文件）
console.log('🗑️ 清除所有Babel配置文件...');
const babelFiles = [
  '.babelrc',
  '.babelrc.js',
  '.babelrc.json',
  'babel.config.js',
  'babel.config.json',
  '.babel.config.js',
  '.babel.config.json'
];

// 强制删除当前目录和所有子目录中的Babel文件
function deleteBabelFilesRecursively(dir) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
        deleteBabelFilesRecursively(fullPath);
      } else if (babelFiles.includes(file.name)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ 删除了 ${fullPath}`);
        } catch (e) {
          console.log(`⚠️ 无法删除 ${fullPath}:`, e.message);
        }
      }
    });
  } catch (e) {
    console.log(`⚠️ 扫描目录 ${dir} 时出错:`, e.message);
  }
}

deleteBabelFilesRecursively('.');

// 额外检查根目录
babelFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`🗑️ 删除了根目录的 ${file}`);
    } catch (e) {
      console.log(`⚠️ 无法删除根目录的 ${file}:`, e.message);
    }
  }
});

// 2. 检查关键文件是否存在
const criticalFiles = [
  'src/components/EACard.tsx',
  'src/lib/supabase.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/api/eas/route.ts'
];

console.log('📋 检查关键文件...');
criticalFiles.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} 存在 (${fullPath})`);
  } else {
    console.error(`❌ ${file} 不存在 (${fullPath})`);
    process.exit(1);
  }
});

// 3. 验证路径别名配置
console.log('🔧 验证路径别名配置...');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
  console.log('✅ TypeScript路径别名配置正确:', tsconfig.compilerOptions.paths['@/*']);
} else {
  console.error('❌ TypeScript路径别名配置缺失');
  process.exit(1);
}

// 4. 彻底清理构建缓存（跨平台兼容）
console.log('🧹 彻底清理构建缓存...');
const cleanupPaths = ['.next', 'out', 'node_modules/.cache', '.vercel'];

function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`🧹 清理了 ${dirPath}`);
      return true;
    } catch (error) {
      console.log(`⚠️ 清理 ${dirPath} 时出现警告:`, error.message);
      return false;
    }
  }
  return false;
}

cleanupPaths.forEach(cleanPath => {
  deleteDirectory(cleanPath);
});

// 5. 设置强制SWC环境变量
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_BABEL = 'true';
process.env.FORCE_SWC = 'true';

console.log('🔧 设置环境变量强制使用SWC...');
console.log('   NEXT_TELEMETRY_DISABLED=1');
console.log('   DISABLE_BABEL=true');
console.log('   FORCE_SWC=true');

// 6. 运行Next.js构建
console.log('🏗️ 运行Next.js构建...');
try {
  execSync('next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      DISABLE_BABEL: 'true',
      FORCE_SWC: 'true'
    }
  });
  console.log('✅ Next.js构建成功');
} catch (error) {
  console.error('❌ Next.js构建失败:', error.message);
  console.error('构建环境信息:');
  console.error('- Node.js版本:', process.version);
  console.error('- 工作目录:', process.cwd());
  console.error('- 环境变量:', Object.keys(process.env).filter(key => key.includes('NEXT') || key.includes('BABEL')));
  process.exit(1);
}

console.log('🎉 强制Vercel构建完成！');

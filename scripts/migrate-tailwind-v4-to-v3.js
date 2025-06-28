#!/usr/bin/env node

/**
 * TailwindCSS V4 到 V3 自动迁移脚本
 * 
 * 此脚本将自动执行以下操作：
 * 1. 备份当前配置
 * 2. 更新 package.json 依赖
 * 3. 创建 tailwind.config.js
 * 4. 更新 postcss.config.mjs
 * 5. 更新 globals.css
 * 
 * 使用方法：node scripts/migrate-tailwind-v4-to-v3.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出函数
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 文件路径
const paths = {
  packageJson: path.join(projectRoot, 'package.json'),
  postcssConfig: path.join(projectRoot, 'postcss.config.mjs'),
  globalsCss: path.join(projectRoot, 'src/app/globals.css'),
  tailwindConfig: path.join(projectRoot, 'tailwind.config.js'),
  backupDir: path.join(projectRoot, 'backup'),
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case 'success':
      console.log(colors.green(`✅ ${prefix} ${message}`));
      break;
    case 'error':
      console.log(colors.red(`❌ ${prefix} ${message}`));
      break;
    case 'warning':
      console.log(colors.yellow(`⚠️  ${prefix} ${message}`));
      break;
    case 'info':
      console.log(colors.blue(`ℹ️  ${prefix} ${message}`));
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

// 创建备份
function createBackup() {
  log('开始创建备份...', 'info');
  
  if (!fs.existsSync(paths.backupDir)) {
    fs.mkdirSync(paths.backupDir, { recursive: true });
  }
  
  const filesToBackup = [
    { src: paths.packageJson, dest: path.join(paths.backupDir, 'package.json.v4') },
    { src: paths.postcssConfig, dest: path.join(paths.backupDir, 'postcss.config.mjs.v4') },
    { src: paths.globalsCss, dest: path.join(paths.backupDir, 'globals.css.v4') },
  ];
  
  filesToBackup.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      log(`备份文件: ${path.basename(src)} -> ${path.basename(dest)}`, 'success');
    }
  });
}

// 更新 package.json
function updatePackageJson() {
  log('更新 package.json 依赖...', 'info');
  
  const packageJson = JSON.parse(fs.readFileSync(paths.packageJson, 'utf8'));
  
  // 移除 V4 依赖
  delete packageJson.devDependencies['@tailwindcss/postcss'];
  
  // 更新到 V3 依赖
  packageJson.devDependencies.tailwindcss = '^3.4.0';
  
  // 添加必要的依赖
  if (!packageJson.devDependencies.postcss) {
    packageJson.devDependencies.postcss = '^8.4.0';
  }
  if (!packageJson.devDependencies.autoprefixer) {
    packageJson.devDependencies.autoprefixer = '^10.4.0';
  }
  
  fs.writeFileSync(paths.packageJson, JSON.stringify(packageJson, null, 2));
  log('package.json 更新完成', 'success');
}

// 创建 tailwind.config.js
function createTailwindConfig() {
  log('创建 tailwind.config.js...', 'info');
  
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // 基础颜色系统 - 映射CSS变量
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // 图表颜色
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // 侧边栏颜色
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      keyframes: {
        'animate-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'zoom-in': {
          from: {
            transform: 'scale(0.95)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
        'slide-down': {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'rank-1-glow': {
          '0%': {
            'box-shadow': '0 0 30px var(--rank-1-glow), 0 8px 32px rgba(0, 0, 0, 0.3)',
          },
          '100%': {
            'box-shadow': '0 0 40px var(--rank-1-glow), 0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
        'rank-2-glow': {
          '0%': {
            'box-shadow': '0 0 20px var(--rank-2-glow), 0 6px 24px rgba(0, 0, 0, 0.25)',
          },
          '100%': {
            'box-shadow': '0 0 25px var(--rank-2-glow), 0 8px 30px rgba(0, 0, 0, 0.3)',
          },
        },
        'rank-3-glow': {
          '0%': {
            'box-shadow': '0 0 15px var(--rank-3-glow), 0 4px 16px rgba(0, 0, 0, 0.2)',
          },
          '100%': {
            'box-shadow': '0 0 20px var(--rank-3-glow), 0 6px 20px rgba(0, 0, 0, 0.25)',
          },
        },
        'rank-badge-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
        },
        'metric-shine': {
          '0%, 100%': {
            filter: 'brightness(1)',
          },
          '50%': {
            filter: 'brightness(1.2)',
          },
        },
        'slide-in-from-side': {
          from: {
            opacity: '0',
            transform: 'translateX(100%)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: '0.3',
          },
          '50%': {
            opacity: '0.6',
          },
        },
      },
      animation: {
        'animate-in': 'animate-in 0.2s ease-out',
        'fade-in-0': 'fade-in 0.2s ease-out',
        'zoom-in-95': 'zoom-in 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'rank-1-glow': 'rank-1-glow 2s ease-in-out infinite alternate',
        'rank-2-glow': 'rank-2-glow 2.5s ease-in-out infinite alternate',
        'rank-3-glow': 'rank-3-glow 3s ease-in-out infinite alternate',
        'rank-badge-pulse': 'rank-badge-pulse 1.5s ease-in-out infinite',
        'metric-shine': 'metric-shine 2s ease-in-out infinite',
        'slide-in-from-side': 'slide-in-from-side 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
`;
  
  fs.writeFileSync(paths.tailwindConfig, tailwindConfig);
  log('tailwind.config.js 创建完成', 'success');
}

// 更新 postcss.config.mjs
function updatePostcssConfig() {
  log('更新 postcss.config.mjs...', 'info');
  
  const postcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`;
  
  fs.writeFileSync(paths.postcssConfig, postcssConfig);
  log('postcss.config.mjs 更新完成', 'success');
}

// 更新 globals.css
function updateGlobalsCss() {
  log('更新 globals.css...', 'info');
  
  let content = fs.readFileSync(paths.globalsCss, 'utf8');
  
  // 查找 @theme 块的结束位置
  const themeStart = content.indexOf('@theme {');
  if (themeStart === -1) {
    log('未找到 @theme 块，可能已经是V3格式', 'warning');
    return;
  }
  
  // 找到 @theme 块的结束位置
  let braceCount = 0;
  let themeEnd = themeStart;
  let inThemeBlock = false;
  
  for (let i = themeStart; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inThemeBlock = true;
    } else if (content[i] === '}') {
      braceCount--;
      if (inThemeBlock && braceCount === 0) {
        themeEnd = i + 1;
        break;
      }
    }
  }
  
  // 替换 @theme 块为 @tailwind 指令
  const beforeTheme = content.substring(0, themeStart).trim();
  const afterTheme = content.substring(themeEnd).trim();
  
  const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  
  const newContent = `${tailwindDirectives}

${afterTheme}`;
  
  fs.writeFileSync(paths.globalsCss, newContent);
  log('globals.css 更新完成', 'success');
}

// 安装依赖
function installDependencies() {
  log('安装新的依赖包...', 'info');
  
  try {
    // 清理缓存
    log('清理缓存...', 'info');
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
      log('已删除 node_modules 目录', 'success');
    }
    const packageLockPath = path.join(projectRoot, 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.unlinkSync(packageLockPath);
      log('已删除 package-lock.json 文件', 'success');
    }
    
    // 安装依赖
    log('安装依赖包...', 'info');
    execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
    
    log('依赖安装完成', 'success');
  } catch (error) {
    log(`依赖安装失败: ${error.message}`, 'error');
    throw error;
  }
}

// 验证迁移
function validateMigration() {
  log('验证迁移结果...', 'info');
  
  try {
    // 检查类型
    log('运行类型检查...', 'info');
    execSync('npm run type-check', { cwd: projectRoot, stdio: 'inherit' });
    
    // 尝试构建
    log('尝试构建项目...', 'info');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    
    log('迁移验证成功！', 'success');
  } catch (error) {
    log(`验证失败: ${error.message}`, 'error');
    log('请检查错误信息并手动修复', 'warning');
  }
}

// 主函数
async function main() {
  console.log(colors.cyan('🚀 TailwindCSS V4 到 V3 迁移工具'));
  console.log(colors.cyan('====================================='));
  
  try {
    // 步骤1：创建备份
    createBackup();
    
    // 步骤2：更新配置文件
    updatePackageJson();
    createTailwindConfig();
    updatePostcssConfig();
    updateGlobalsCss();
    
    // 步骤3：安装依赖
    installDependencies();
    
    // 步骤4：验证迁移
    validateMigration();
    
    console.log('');
    log('🎉 迁移完成！', 'success');
    console.log('');
    console.log(colors.green('✅ 下一步操作：'));
    console.log(colors.green('   1. 运行 npm run dev 启动开发服务器'));
    console.log(colors.green('   2. 检查UI是否与迁移前一致'));
    console.log(colors.green('   3. 测试所有功能是否正常'));
    console.log(colors.green('   4. 部署到Vercel验证'));
    console.log('');
    console.log(colors.yellow('⚠️  如果发现问题，可以从 backup/ 目录恢复文件'));
    
  } catch (error) {
    console.log('');
    log('❌ 迁移失败！', 'error');
    log(`错误信息: ${error.message}`, 'error');
    console.log('');
    console.log(colors.yellow('🔄 恢复步骤：'));
    console.log(colors.yellow('   1. 从 backup/ 目录恢复原始文件'));
    console.log(colors.yellow('   2. 运行 npm install 恢复依赖'));
    console.log(colors.yellow('   3. 检查错误信息并手动修复'));
    
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createBackup,
  updatePackageJson,
  createTailwindConfig,
  updatePostcssConfig,
  updateGlobalsCss,
  installDependencies,
  validateMigration,
};
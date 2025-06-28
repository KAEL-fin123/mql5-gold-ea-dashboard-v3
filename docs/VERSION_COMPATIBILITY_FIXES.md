# 版本兼容性修复任务清单

> 📅 创建时间：2025年1月12日  
> 🎯 目标：解决项目中的版本兼容性问题，确保在 Vercel 上稳定部署

## 🚨 关键问题概览

项目当前存在以下版本兼容性问题，需要按优先级逐一解决：

### 📋 任务清单

#### 🔴 高优先级（立即修复）

- [ ] **TailwindCSS v4 降级到 v3**
  - **问题**：TailwindCSS v4 在 Vercel 部署时存在 `@tailwindcss/postcss` 模块解析问题
  - **影响**：部署失败，无法正常构建
  - **修复方案**：
    ```bash
    npm uninstall tailwindcss @tailwindcss/postcss
    npm install tailwindcss@^3.4.0 postcss autoprefixer
    npx tailwindcss init -p
    ```
  - **文件修改**：
    - `package.json` - 更新依赖版本
    - `postcss.config.mjs` - 更新配置
    - `src/app/globals.css` - 更新导入语法
  - **状态**：❌ 待修复

#### 🟡 中优先级（近期修复）

- [ ] **Node.js 版本升级**
  - **问题**：当前使用 Node.js 18.17.0，Vercel 将于 2025年8月弃用
  - **影响**：未来部署可能失败
  - **修复方案**：升级到 Node.js 20.x 或 22.x
  - **文件修改**：
    - `.nvmrc` - 更新版本号
    - `package.json` - 更新 engines 字段
  - **状态**：❌ 待修复

- [ ] **ESLint 配置修复**
  - **问题**：`eslint.config.mjs` 缺少 `dirname` 导入
  - **影响**：ESLint 可能无法正常工作
  - **修复方案**：添加缺失的导入
  - **文件修改**：
    - `eslint.config.mjs` - 添加 dirname 导入
  - **状态**：❌ 待修复

#### 🟢 低优先级（可选优化）

- [ ] **TypeScript 配置优化**
  - **问题**：target 设置为 ES2017 过于保守
  - **影响**：无法使用现代 JavaScript 特性
  - **修复方案**：升级到 ES2022
  - **文件修改**：
    - `tsconfig.json` - 更新 target 和 strict 配置
  - **状态**：❌ 待修复

- [ ] **package.json engines 更新**
  - **问题**：npm 版本要求过低
  - **影响**：可能无法使用新特性
  - **修复方案**：更新最低版本要求
  - **文件修改**：
    - `package.json` - 更新 engines.npm
  - **状态**：❌ 待修复

## 📝 详细修复指南

### 1. TailwindCSS v4 → v3 降级

**步骤 1：卸载 v4 依赖**
```bash
npm uninstall tailwindcss @tailwindcss/postcss
```

**步骤 2：安装 v3 依赖**
```bash
npm install tailwindcss@^3.4.0 postcss autoprefixer
```

**步骤 3：重新初始化配置**
```bash
npx tailwindcss init -p
```

**步骤 4：更新 globals.css**
```css
/* 从 */
@import "tailwindcss";

/* 改为 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**步骤 5：更新 PostCSS 配置**
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
```

### 2. Node.js 版本升级

**步骤 1：更新 .nvmrc**
```bash
echo "20.18.0" > .nvmrc
# 或使用最新 LTS
echo "22.12.0" > .nvmrc
```

**步骤 2：更新 package.json**
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### 3. ESLint 配置修复

```javascript
// eslint.config.mjs
import { dirname } from "path"; // 添加这行
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### 4. TypeScript 配置优化

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## ✅ 已确认正确的配置

- ✅ Next.js 15.3.3 版本
- ✅ React 19 稳定版
- ✅ Supabase、React Query、Zustand 等核心库版本
- ✅ 所有主要依赖包都是最新兼容版本

## 📊 进度跟踪

| 任务 | 优先级 | 状态 | 完成时间 | 备注 |
|------|--------|------|----------|------|
| TailwindCSS 降级 | 🔴 高 | ❌ 待修复 | - | 阻塞部署 |
| Node.js 升级 | 🟡 中 | ❌ 待修复 | - | 2025年8月前完成 |
| ESLint 修复 | 🟡 中 | ❌ 待修复 | - | 影响开发体验 |
| TypeScript 优化 | 🟢 低 | ❌ 待修复 | - | 可选 |
| package.json 更新 | 🟢 低 | ❌ 待修复 | - | 可选 |

## 🎯 下一步行动

1. **立即执行**：TailwindCSS v4 → v3 降级
2. **本周内**：Node.js 版本升级 + ESLint 配置修复
3. **可选**：TypeScript 配置优化

---

> 💡 **提示**：每完成一个任务，请在上方表格中将状态更新为 ✅ 已完成，并记录完成时间。
> 
> 📞 **联系**：如遇到问题，请参考 `docs/VERCEL_DEPLOYMENT_FIX.md` 或创建新的 issue。
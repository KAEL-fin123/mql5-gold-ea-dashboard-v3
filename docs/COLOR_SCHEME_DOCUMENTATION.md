# MQL5 Gold EA Dashboard - 配色方案文档

## 📋 概述

本文档记录了 MQL5 Gold EA Dashboard 项目的完整配色方案，包括浅色主题、深色主题以及特殊功能性颜色的定义。

## 🎨 核心设计理念

- **双主题支持**：完整的浅色（Light）和深色（Dark）主题切换
- **现代化配色**：使用 `oklch` 颜色函数，提供更一致的感知亮度
- **品牌一致性**：以紫色为核心的品牌色彩体系
- **可访问性**：确保足够的对比度和可读性

## 🌟 品牌核心色彩

### 主要品牌色
- **Primary**: `oklch(0.55 0.25 280)` - 品牌紫色主色
- **Accent**: `oklch(0.45 0.30 290)` - 品牌深紫色强调色

### 品牌渐变
- **浅色主题渐变文字**: `#B8860B` → `#DAA520` → `#FFD700` → `#FFA500`
- **深色主题渐变文字**: `#FFD700` → `#FFA500` → `#FF8C00` → `#DAA520`

## 🌅 浅色主题 (Light Mode)

### 基础色彩
```css
--background: oklch(0.99 0.002 280);          /* 纯净白色背景 */
--foreground: oklch(0.15 0.008 285);          /* 深色文字 */
--card: oklch(0.98 0.002 280);                /* 卡片白色背景 */
--card-foreground: oklch(0.15 0.008 285);
```

### 交互色彩
```css
--primary: oklch(0.55 0.25 280);              /* 品牌紫色主色 */
--primary-foreground: oklch(0.98 0.002 280);
--secondary: oklch(0.95 0.005 285);           /* 浅灰次要色 */
--secondary-foreground: oklch(0.25 0.01 285);
--accent: oklch(0.45 0.30 290);               /* 品牌深紫色强调 */
--accent-foreground: oklch(0.98 0.002 280);
```

### 功能性色彩
```css
--destructive: oklch(0.65 0.25 22);           /* 错误红色 */
--destructive-foreground: oklch(0.98 0.002 280);
--border: oklch(0.90 0.005 285);              /* 边框颜色 */
--input: oklch(0.96 0.003 285);               /* 输入框背景 */
--ring: oklch(0.55 0.25 280);                 /* 焦点环 */
```

### 背景效果
- **页面背景渐变**: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`

## 🌙 深色主题 (Dark Mode)

### 基础色彩
```css
--background: oklch(0.08 0.005 285.823);      /* 深色背景 */
--foreground: oklch(0.95 0.01 280);           /* 浅色前景 */
--card: oklch(0.12 0.008 285.885);            /* 深色卡片 */
--card-foreground: oklch(0.95 0.01 280);
```

### 交互色彩
```css
--primary: oklch(0.55 0.25 280);              /* 品牌紫色主色 */
--primary-foreground: oklch(0.98 0.01 280);
--secondary: oklch(0.18 0.008 286.033);       /* 深灰次要色 */
--secondary-foreground: oklch(0.95 0.01 280);
--accent: oklch(0.45 0.30 290);               /* 品牌深紫色 */
--accent-foreground: oklch(0.98 0.01 280);
```

### 功能性色彩
```css
--destructive: oklch(0.65 0.25 22);           /* 错误红色 */
--border: oklch(0.25 0.01 285 / 30%);         /* 半透明边框 */
--input: oklch(0.15 0.008 285 / 80%);         /* 输入框背景 */
--ring: oklch(0.55 0.25 280);                 /* 品牌紫色焦点环 */
```

## 📊 图表配色方案

### 图表色彩序列
```css
--chart-1: oklch(0.55 0.25 280);              /* 品牌紫色图表 */
--chart-2: oklch(0.45 0.30 290);              /* 品牌深紫色图表 */
--chart-3: oklch(0.65 0.25 22);               /* 错误红色图表 */
--chart-4: oklch(0.60 0.20 140);              /* 绿色图表 */
--chart-5: oklch(0.65 0.18 162);              /* 蓝色图表 */
```

## 🏆 排行榜特殊配色

### 前三名奖牌色彩
```css
/* 冠军 - 金色 */
--rank-1-bg: linear-gradient(135deg, rgb(255, 215, 0), rgb(255, 193, 7));
--rank-1-border: rgb(255, 215, 0);
--rank-1-glow: rgba(255, 215, 0, 0.2); /* 浅色主题 */
--rank-1-glow: rgba(255, 215, 0, 0.3); /* 深色主题 */

/* 亚军 - 银色 */
--rank-2-bg: linear-gradient(135deg, rgb(192, 192, 192), rgb(169, 169, 169));
--rank-2-border: rgb(192, 192, 192);
--rank-2-glow: rgba(192, 192, 192, 0.2); /* 浅色主题 */
--rank-2-glow: rgba(192, 192, 192, 0.3); /* 深色主题 */

/* 季军 - 铜色 */
--rank-3-bg: linear-gradient(135deg, rgb(205, 127, 50), rgb(184, 115, 51));
--rank-3-border: rgb(205, 127, 50);
--rank-3-glow: rgba(205, 127, 50, 0.2); /* 浅色主题 */
--rank-3-glow: rgba(205, 127, 50, 0.3); /* 深色主题 */
```

## 💡 功能性指标颜色

### 数据指标颜色规则
- **积极/盈利**: 绿色系
  - 浅色主题: `text-green-600`
  - 深色主题: `text-green-400`
- **消极/亏损**: 红色系
  - 浅色主题: `text-red-600`
  - 深色主题: `text-red-400`
- **中性/无变化**: 灰色系
  - 浅色主题: `text-muted-foreground`
  - 深色主题: `text-gray-400`

## 🎯 侧边栏配色

### 侧边栏专用色彩
```css
--sidebar: oklch(0.98 0.002 280);             /* 浅色主题侧边栏 */
--sidebar: oklch(0.10 0.006 285.885);         /* 深色主题侧边栏 */
--sidebar-foreground: oklch(0.15 0.008 285);  /* 浅色主题文字 */
--sidebar-foreground: oklch(0.95 0.01 280);   /* 深色主题文字 */
--sidebar-primary: oklch(0.55 0.25 280);      /* 侧边栏主色 */
--sidebar-border: oklch(0.90 0.005 285);      /* 浅色主题边框 */
--sidebar-border: oklch(0.25 0.01 285 / 20%); /* 深色主题边框 */
```

## 🔧 实现细节

### CSS 变量结构
- 使用 `:root` 定义浅色主题变量
- 使用 `.dark` 选择器覆盖深色主题变量
- 通过 `@theme` 指令映射到 Tailwind CSS

### 动画效果
- 排行榜前三名卡片具有发光动画效果
- 徽章具有脉冲动画效果
- 所有颜色过渡使用 `transition-colors duration-200`

### 响应式适配
- 移动端优化的颜色对比度
- 触摸设备的交互状态调整
- 不同屏幕尺寸下的视觉层次保持

## 📱 可访问性考虑

- 所有文字与背景的对比度符合 WCAG 2.1 AA 标准
- 色盲友好的颜色选择
- 支持系统级深色模式偏好
- 焦点指示器清晰可见

## 🔄 主题切换

项目支持动态主题切换，通过以下组件实现：
- `ThemeToggle.tsx` - 头部主题切换按钮
- `BottomThemeToggle.tsx` - 底部主题切换按钮

主题状态通过 `localStorage` 持久化存储。

---

**最后更新**: 2025年1月
**维护者**: MQL5 Gold EA Dashboard Team
**版本**: 1.0.0
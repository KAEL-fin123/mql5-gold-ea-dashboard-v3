-- 为ads表添加可编辑的广告内容字段
-- 请在Supabase Dashboard > SQL Editor中执行此脚本

-- 添加标题字段
ALTER TABLE ads ADD COLUMN IF NOT EXISTS title TEXT;

-- 添加描述字段
ALTER TABLE ads ADD COLUMN IF NOT EXISTS description TEXT;

-- 添加分类字段（用于替代硬编码的position映射）
ALTER TABLE ads ADD COLUMN IF NOT EXISTS category TEXT;

-- 更新现有数据，添加默认的标题和描述
UPDATE ads SET 
  title = CASE 
    WHEN position = 'left' THEN '优质经纪商推荐'
    WHEN position = 'right' THEN '专业EA系统'
    WHEN position = 'footer' THEN '交易信号服务'
    WHEN position = 'header' THEN '教育培训课程'
    ELSE '广告推荐'
  END,
  description = '点击查看详情，获取更多专业信息和服务',
  category = CASE 
    WHEN position = 'left' THEN '经纪商'
    WHEN position = 'right' THEN 'EA推荐'
    WHEN position = 'footer' THEN '信号服务'
    WHEN position = 'header' THEN '教育培训'
    ELSE '其他'
  END
WHERE title IS NULL OR description IS NULL OR category IS NULL;

-- 查看更新后的数据
SELECT 
  id,
  position,
  category,
  title,
  description,
  image_url,
  link_url,
  is_active,
  created_at
FROM ads 
ORDER BY created_at DESC;
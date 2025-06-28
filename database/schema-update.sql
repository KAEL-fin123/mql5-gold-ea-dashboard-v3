-- MQL5 GOLD EA 数据库表结构更新脚本
-- 用于修复user_requests表缺少字段的问题

-- 检查并添加reason字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_requests' 
        AND column_name = 'reason'
    ) THEN
        ALTER TABLE user_requests ADD COLUMN reason TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- 检查并添加contact字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_requests' 
        AND column_name = 'contact'
    ) THEN
        ALTER TABLE user_requests ADD COLUMN contact TEXT;
    END IF;
END $$;

-- 更新现有记录的reason字段（如果为空）
UPDATE user_requests 
SET reason = '用户建议添加此EA到榜单中' 
WHERE reason = '' OR reason IS NULL;

-- 验证表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_requests' 
ORDER BY ordinal_position;

-- 修复 ea_stats 表缺少 month 字段的问题
-- 执行时间: 2025年1月
-- 说明: 添加缺失的 month 字段并更新约束

-- 1. 添加 month 字段
ALTER TABLE ea_stats 
ADD COLUMN IF NOT EXISTS month INTEGER 
CHECK (month >= 1 AND month <= 12);

-- 2. 删除可能存在的旧唯一约束
ALTER TABLE ea_stats 
DROP CONSTRAINT IF EXISTS ea_stats_ea_id_year_month_key;

-- 3. 添加新的唯一约束（包含 month 字段）
ALTER TABLE ea_stats 
ADD CONSTRAINT ea_stats_ea_id_year_month_key 
UNIQUE (ea_id, year, month);

-- 4. 创建 month 字段的索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ea_stats_year_month 
ON ea_stats(year, month);

-- 5. 插入一些示例月度数据（如果不存在）
INSERT INTO ea_stats (ea_id, year, month, win_rate, drawdown, avg_risk_reward, max_risk_reward, annual_return, monthly_return)
SELECT 
    e.id,
    2024,
    12,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 81.2
        WHEN 'Golden Trend Master' THEN 68.5
        WHEN 'Gold Grid Expert' THEN 85.3
        WHEN 'Smart Gold Trader' THEN 74.1
        WHEN 'Gold Breakout Hunter' THEN 72.8
        ELSE 70.0
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 8.2
        WHEN 'Golden Trend Master' THEN 12.1
        WHEN 'Gold Grid Expert' THEN 5.7
        WHEN 'Smart Gold Trader' THEN 9.8
        WHEN 'Gold Breakout Hunter' THEN 15.3
        ELSE 10.0
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 1.9
        WHEN 'Golden Trend Master' THEN 2.4
        WHEN 'Gold Grid Expert' THEN 1.6
        WHEN 'Smart Gold Trader' THEN 2.2
        WHEN 'Gold Breakout Hunter' THEN 2.9
        ELSE 2.0
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 4.5
        WHEN 'Golden Trend Master' THEN 5.3
        WHEN 'Gold Grid Expert' THEN 4.1
        WHEN 'Smart Gold Trader' THEN 4.9
        WHEN 'Gold Breakout Hunter' THEN 6.7
        ELSE 4.0
    END,
    0,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 8.2
        WHEN 'Golden Trend Master' THEN 6.5
        WHEN 'Gold Grid Expert' THEN 9.1
        WHEN 'Smart Gold Trader' THEN 7.3
        WHEN 'Gold Breakout Hunter' THEN 5.8
        ELSE 7.0
    END
FROM eas e
WHERE NOT EXISTS (
    SELECT 1 FROM ea_stats es 
    WHERE es.ea_id = e.id AND es.year = 2024 AND es.month = 12
);

-- 6. 插入2024年11月的示例数据
INSERT INTO ea_stats (ea_id, year, month, win_rate, drawdown, avg_risk_reward, max_risk_reward, annual_return, monthly_return)
SELECT 
    e.id,
    2024,
    11,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 79.8
        WHEN 'Golden Trend Master' THEN 66.2
        WHEN 'Gold Grid Expert' THEN 83.7
        WHEN 'Smart Gold Trader' THEN 72.5
        WHEN 'Gold Breakout Hunter' THEN 70.1
        ELSE 68.0
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 9.1
        WHEN 'Golden Trend Master' THEN 13.2
        WHEN 'Gold Grid Expert' THEN 6.3
        WHEN 'Smart Gold Trader' THEN 10.5
        WHEN 'Gold Breakout Hunter' THEN 16.8
        ELSE 11.0
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 1.8
        WHEN 'Golden Trend Master' THEN 2.2
        WHEN 'Gold Grid Expert' THEN 1.5
        WHEN 'Smart Gold Trader' THEN 2.0
        WHEN 'Gold Breakout Hunter' THEN 2.7
        ELSE 1.9
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 4.3
        WHEN 'Golden Trend Master' THEN 5.0
        WHEN 'Gold Grid Expert' THEN 3.9
        WHEN 'Smart Gold Trader' THEN 4.6
        WHEN 'Gold Breakout Hunter' THEN 6.2
        ELSE 3.8
    END,
    0,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 7.8
        WHEN 'Golden Trend Master' THEN 6.1
        WHEN 'Gold Grid Expert' THEN 8.7
        WHEN 'Smart Gold Trader' THEN 6.9
        WHEN 'Gold Breakout Hunter' THEN 5.4
        ELSE 6.5
    END
FROM eas e
WHERE NOT EXISTS (
    SELECT 1 FROM ea_stats es 
    WHERE es.ea_id = e.id AND es.year = 2024 AND es.month = 11
);

-- 验证修复结果
SELECT 
    'ea_stats表结构修复完成' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN month IS NULL THEN 1 END) as annual_records,
    COUNT(CASE WHEN month IS NOT NULL THEN 1 END) as monthly_records
FROM ea_stats;
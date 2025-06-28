-- 为 ea_stats 表添加 name 字段以便于数据库管理
-- 创建时间: 2025年1月

-- 1. 添加 name 字段到 ea_stats 表
ALTER TABLE ea_stats 
ADD COLUMN IF NOT EXISTS name TEXT;

-- 2. 从 eas 表同步现有数据的名称
UPDATE ea_stats 
SET name = eas.name 
FROM eas 
WHERE ea_stats.ea_id = eas.id 
AND ea_stats.name IS NULL;

-- 3. 创建触发器函数，自动同步 EA 名称
CREATE OR REPLACE FUNCTION sync_ea_name_to_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 当插入新的 ea_stats 记录时，自动填充 name 字段
    IF TG_OP = 'INSERT' THEN
        SELECT eas.name INTO NEW.name 
        FROM eas 
        WHERE eas.id = NEW.ea_id;
        RETURN NEW;
    END IF;
    
    -- 当更新 ea_stats 的 ea_id 时，同步更新 name
    IF TG_OP = 'UPDATE' AND OLD.ea_id != NEW.ea_id THEN
        SELECT eas.name INTO NEW.name 
        FROM eas 
        WHERE eas.id = NEW.ea_id;
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 创建触发器，在插入或更新 ea_stats 时自动同步名称
DROP TRIGGER IF EXISTS sync_ea_name_trigger ON ea_stats;
CREATE TRIGGER sync_ea_name_trigger
    BEFORE INSERT OR UPDATE ON ea_stats
    FOR EACH ROW
    EXECUTE FUNCTION sync_ea_name_to_stats();

-- 5. 创建触发器函数，当 eas 表的名称更新时，同步更新 ea_stats 表
CREATE OR REPLACE FUNCTION sync_ea_name_from_eas()
RETURNS TRIGGER AS $$
BEGIN
    -- 当 eas 表的 name 字段更新时，同步更新所有相关的 ea_stats 记录
    IF TG_OP = 'UPDATE' AND OLD.name != NEW.name THEN
        UPDATE ea_stats 
        SET name = NEW.name 
        WHERE ea_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 创建触发器，在 eas 表名称更新时自动同步到 ea_stats
DROP TRIGGER IF EXISTS sync_ea_name_from_eas_trigger ON eas;
CREATE TRIGGER sync_ea_name_from_eas_trigger
    AFTER UPDATE ON eas
    FOR EACH ROW
    EXECUTE FUNCTION sync_ea_name_from_eas();

-- 7. 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ea_stats_name ON ea_stats(name);

-- 8. 验证数据同步结果
SELECT 
    es.id,
    es.name as stats_name,
    e.name as eas_name,
    es.year,
    es.month,
    es.win_rate
FROM ea_stats es
JOIN eas e ON es.ea_id = e.id
ORDER BY es.name, es.year DESC, es.month DESC NULLS FIRST
LIMIT 10;

PRINT '✅ ea_stats 表已成功添加 name 字段，现在你可以直接通过名称识别和修改 EA 数据了！';
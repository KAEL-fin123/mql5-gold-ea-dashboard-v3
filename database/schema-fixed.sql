-- MQL5 GOLD EA 榜单数据库结构 (修复版)
-- 创建时间: 2025年1月
-- 修复: 移除了不兼容的DATE()函数索引

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 表1: eas (EA基础信息)
CREATE TABLE IF NOT EXISTS eas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 表2: ea_stats (EA指标数据)
CREATE TABLE IF NOT EXISTS ea_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ea_id UUID REFERENCES eas(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2030),
    month INTEGER CHECK (month >= 1 AND month <= 12),
    win_rate DECIMAL(5,2) NOT NULL CHECK (win_rate >= 0 AND win_rate <= 100),
    drawdown DECIMAL(8,4) NOT NULL CHECK (drawdown >= 0),
    avg_risk_reward DECIMAL(8,4) NOT NULL DEFAULT 0,
    max_risk_reward DECIMAL(8,4) NOT NULL DEFAULT 0,
    annual_return DECIMAL(8,4) NOT NULL DEFAULT 0,
    monthly_return DECIMAL(8,4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ea_id, year, month)
);

-- 表3: user_requests (用户建议提交)
CREATE TABLE IF NOT EXISTS user_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ea_name TEXT NOT NULL,
    user_ip TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 表4: ads (广告配置)
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position TEXT NOT NULL CHECK (position IN ('left', 'right', 'footer', 'header')),
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能 (修复版 - 移除了DATE()函数)
CREATE INDEX IF NOT EXISTS idx_ea_stats_ea_id ON ea_stats(ea_id);
CREATE INDEX IF NOT EXISTS idx_ea_stats_year_month ON ea_stats(year, month);
CREATE INDEX IF NOT EXISTS idx_ea_stats_win_rate ON ea_stats(win_rate DESC);
CREATE INDEX IF NOT EXISTS idx_ea_stats_drawdown ON ea_stats(drawdown ASC);
CREATE INDEX IF NOT EXISTS idx_ea_stats_annual_return ON ea_stats(annual_return DESC);
CREATE INDEX IF NOT EXISTS idx_ea_stats_monthly_return ON ea_stats(monthly_return DESC);
-- 修复：分别为IP和时间创建索引，避免使用DATE()函数
CREATE INDEX IF NOT EXISTS idx_user_requests_ip ON user_requests(user_ip);
CREATE INDEX IF NOT EXISTS idx_user_requests_submitted_at ON user_requests(submitted_at);
-- 复合索引用于IP限制查询（按天）
CREATE INDEX IF NOT EXISTS idx_user_requests_ip_time ON user_requests(user_ip, submitted_at);
CREATE INDEX IF NOT EXISTS idx_ads_position_active ON ads(position, is_active);
CREATE INDEX IF NOT EXISTS idx_eas_active ON eas(is_active);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_eas_updated_at BEFORE UPDATE ON eas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ea_stats_updated_at BEFORE UPDATE ON ea_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO eas (name, logo_url, description) VALUES
('Gold Scalper Pro', '/logos/gold-scalper-pro.png', '专业黄金剥头皮EA，适合短线交易'),
('Golden Trend Master', '/logos/golden-trend-master.png', '黄金趋势跟踪EA，中长线策略'),
('Gold Grid Expert', '/logos/gold-grid-expert.png', '网格交易策略，适合震荡行情'),
('Smart Gold Trader', '/logos/smart-gold-trader.png', 'AI驱动的智能黄金交易系统'),
('Gold Breakout Hunter', '/logos/gold-breakout-hunter.png', '突破策略专家，捕捉大行情')
ON CONFLICT (name) DO NOTHING;

-- 插入示例统计数据 (2024年年度数据)
INSERT INTO ea_stats (ea_id, year, win_rate, drawdown, avg_risk_reward, max_risk_reward, annual_return, monthly_return)
SELECT 
    e.id,
    2024,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 78.5
        WHEN 'Golden Trend Master' THEN 65.2
        WHEN 'Gold Grid Expert' THEN 82.1
        WHEN 'Smart Gold Trader' THEN 71.8
        WHEN 'Gold Breakout Hunter' THEN 69.3
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 12.5
        WHEN 'Golden Trend Master' THEN 18.7
        WHEN 'Gold Grid Expert' THEN 8.9
        WHEN 'Smart Gold Trader' THEN 15.2
        WHEN 'Gold Breakout Hunter' THEN 22.1
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 1.8
        WHEN 'Golden Trend Master' THEN 2.3
        WHEN 'Gold Grid Expert' THEN 1.5
        WHEN 'Smart Gold Trader' THEN 2.1
        WHEN 'Gold Breakout Hunter' THEN 2.8
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 4.2
        WHEN 'Golden Trend Master' THEN 5.1
        WHEN 'Gold Grid Expert' THEN 3.8
        WHEN 'Smart Gold Trader' THEN 4.7
        WHEN 'Gold Breakout Hunter' THEN 6.3
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 45.8
        WHEN 'Golden Trend Master' THEN 38.2
        WHEN 'Gold Grid Expert' THEN 52.1
        WHEN 'Smart Gold Trader' THEN 41.5
        WHEN 'Gold Breakout Hunter' THEN 35.7
    END,
    0
FROM eas e
ON CONFLICT (ea_id, year, month) DO NOTHING;

-- 插入示例月度数据 (2024年12月)
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
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 8.2
        WHEN 'Golden Trend Master' THEN 12.1
        WHEN 'Gold Grid Expert' THEN 5.7
        WHEN 'Smart Gold Trader' THEN 9.8
        WHEN 'Gold Breakout Hunter' THEN 15.3
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 1.9
        WHEN 'Golden Trend Master' THEN 2.4
        WHEN 'Gold Grid Expert' THEN 1.6
        WHEN 'Smart Gold Trader' THEN 2.2
        WHEN 'Gold Breakout Hunter' THEN 2.9
    END,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 4.5
        WHEN 'Golden Trend Master' THEN 5.3
        WHEN 'Gold Grid Expert' THEN 4.1
        WHEN 'Smart Gold Trader' THEN 4.9
        WHEN 'Gold Breakout Hunter' THEN 6.7
    END,
    0,
    CASE e.name
        WHEN 'Gold Scalper Pro' THEN 8.2
        WHEN 'Golden Trend Master' THEN 6.5
        WHEN 'Gold Grid Expert' THEN 9.1
        WHEN 'Smart Gold Trader' THEN 7.3
        WHEN 'Gold Breakout Hunter' THEN 5.8
    END
FROM eas e
ON CONFLICT (ea_id, year, month) DO NOTHING;

-- 插入示例广告数据
INSERT INTO ads (position, image_url, link_url, is_active) VALUES
('left', '/ads/left-banner.jpg', 'https://example.com/broker1', true),
('right', '/ads/right-banner.jpg', 'https://example.com/broker2', true),
('footer', '/ads/footer-banner.jpg', 'https://example.com/vps', true)
ON CONFLICT DO NOTHING;

-- 创建用于日期查询的辅助函数（可选，用于IP限制逻辑）
CREATE OR REPLACE FUNCTION check_daily_request_limit(ip_address TEXT, max_requests INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    request_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO request_count
    FROM user_requests
    WHERE user_ip = ip_address
    AND submitted_at >= CURRENT_DATE
    AND submitted_at < CURRENT_DATE + INTERVAL '1 day';

    RETURN request_count < max_requests;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

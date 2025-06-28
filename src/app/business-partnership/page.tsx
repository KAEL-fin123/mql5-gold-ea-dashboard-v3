'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, TrendingUp, Target, BarChart3, MessageCircle, Clock } from 'lucide-react';
import Header from '../../components/Header';


export default function BusinessPartnershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* 返回首页链接 */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
        </Link>
      </div>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">商务合作</h1>
          <p className="text-xl text-muted-foreground">精准触达高价值交易者群体</p>
          <p className="text-lg text-muted-foreground mt-2">
            <strong>BBTrading</strong> 专注服务高净值EA交易者，用户平均资金量超行业3倍
          </p>
        </div>

        {/* 核心数据展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="financial-card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">20K+</div>
            <div className="text-muted-foreground">活跃交易者</div>
          </div>
          <div className="financial-card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">8000万+</div>
            <div className="text-muted-foreground">累计阅读量</div>
          </div>
          <div className="financial-card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">78%</div>
            <div className="text-muted-foreground">月活跃度</div>
          </div>
        </div>

        {/* 核心优势 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">核心优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="financial-card">
              <Users className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">高净值用户群体</h3>
              <p className="text-muted-foreground">2万+活跃高净值EA交易者，用户平均账户资金量超行业3倍</p>
            </div>
            <div className="financial-card">
              <BarChart3 className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">深度数据分析</h3>
              <p className="text-muted-foreground">深度用户行为分析与策略偏好建模，月活跃度78%，用户粘性极高</p>
            </div>
            <div className="financial-card">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">全球覆盖</h3>
              <p className="text-muted-foreground">累计内容阅读量突破千万次，覆盖亚太、欧美主要交易时区</p>
            </div>
          </div>
        </div>

        {/* 精准获客方案 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">精准获客方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="financial-card">
              <Target className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">精准定向推送</h3>
              <p className="text-muted-foreground">基于用户画像的精准定向推送，权威榜单背书推广</p>
            </div>
            <div className="financial-card">
              <Users className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">社群直接触达</h3>
              <p className="text-muted-foreground">高价值用户社群直接触达，专业EA评测报告合作</p>
            </div>
            <div className="financial-card">
              <MessageCircle className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">意见领袖推广</h3>
              <p className="text-muted-foreground">行业意见领袖联合推广，新平台品牌快速建立</p>
            </div>
            <div className="financial-card">
              <BarChart3 className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">权威平台背书</h3>
              <p className="text-muted-foreground">业界认可的EA评测权威，平台推荐具有强公信力</p>
            </div>
          </div>
        </div>

        {/* 专业用户分析能力 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">专业用户分析能力</h2>
          <div className="space-y-6">
            <div className="financial-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">高净值客户群体</h3>
                  <p className="text-muted-foreground">品牌私域用户质量高于同业3倍标准，单客户价值显著高于普通渠道</p>
                </div>
              </div>
            </div>
            <div className="financial-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">02</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">智能用户画像分析</h3>
                  <p className="text-muted-foreground">深度分析用户交易行为模式，涵盖马丁格尔、网格、趋势突破等策略偏好，提供精准用户分群服务</p>
                </div>
              </div>
            </div>
            <div className="financial-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">03</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">多维度用户标签体系</h3>
                  <p className="text-muted-foreground">建立资金规模、交易频次、策略类型、风险偏好等多维度标签，实现精准客户匹配与个性化推荐</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">抢占高价值客户先机</h2>
          <p className="text-muted-foreground mb-8 max-w-4xl mx-auto text-center">
            专业数据分析团队提供完整用户画像解决方案，通过智能标签体系实现精准客户匹配，助力合作伙伴获得优质用户群体。
          </p>
          
          <div className="financial-card max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">微信联系</h3>
            <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image
                src="https://rrh123-com.oss-cn-hongkong.aliyuncs.com/rrh123/common/images/1640146282306.png"
                alt="微信二维码"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">扫码添加微信</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>商务合作时间：周一至周五 9:00-18:00 (GMT+8)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              专业客户经理24小时内响应，提供定制化获客方案
            </p>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 MQL5 GOLD EA Dashboard. 专业的黄金EA交易分析平台</p>
          </div>
        </div>
      </footer>


    </div>
  );
}

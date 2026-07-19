import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Eye,
  MessageCircle,
  PackageCheck,
  Play,
  Radio,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { ProgressBar, StatusChip } from '../components/ui'
import { products } from '../data/demo'

const liveTabs = ['直播总览', '直播间定位', '商品矩阵', '脚本结构', '场次复盘'] as const
type LiveTab = (typeof liveTabs)[number]

const metricCards = [
  { label: '成交金额', value: '¥9,058', delta: '+21.6%', icon: CircleDollarSign, tone: 'green' },
  { label: '平均停留', value: '1m 34s', delta: '+18s', icon: Clock3, tone: 'blue' },
  { label: '商品点击率', value: '9.1%', delta: '+1.4%', icon: ShoppingBag, tone: 'gold' },
  { label: '退款率', value: '6.1%', delta: '-0.8%', icon: TrendingUp, tone: 'coral' },
] as const

const scriptBlocks = [
  { time: '00:00', type: '开场', title: '先问路线，不先报体重', copy: '让目标用户在 90 秒内确认直播间能解决什么问题。', tone: 'coral' as const },
  { time: '03:00', type: '场景演示', title: 'Momo 进包动作', copy: '观察后腿、底板和重心，用动作建立选择标准。', tone: 'green' as const },
  { time: '08:00', type: '尺寸建议', title: '肩高、背长、体重', copy: '固定三项诊断顺序，明确无法只按体重推荐。', tone: 'blue' as const },
  { time: '13:00', type: '顾虑处理', title: '买错尺寸怎么办', copy: '说明适用边界、换货条件和测量方法。', tone: 'gold' as const },
  { time: '18:00', type: '成交引导', title: '按使用频率做决定', copy: '高频通勤可选主推品，低频旅行先不建议高客单。', tone: 'coral' as const },
]

export function LiveCenter() {
  const [tab, setTab] = useState<LiveTab>('场次复盘')
  return (
    <div className="page-stack live-center-page">
      <section className="page-heading compact-heading">
        <div><p className="eyebrow">电商与直播定位中心</p><h1>直播电商</h1><p>从直播适配、商品选择到下一场动作，统一沉淀。</p></div>
        <div className="heading-actions"><button className="button button-secondary" type="button"><Download size={16} /> 导入场次数据</button><button className="button button-primary" type="button"><Radio size={16} /> 新建直播场次</button></div>
      </section>

      <section className="live-context-bar">
        <img src="/assets/momo.jpg" alt="Momo" />
        <div><span>当前项目</span><strong>林晚 × Momo 品牌主理人 IP</strong><p>场景诊断型直播 · 弱销售 · 主理人 + 宠物共同出镜</p></div>
        <div className="live-context-stat"><span>直播适配</span><strong>78</strong></div>
        <div className="live-context-stat"><span>商品就绪</span><strong>4 / 5</strong></div>
        <button className="button button-secondary" type="button">切换项目 <ChevronDown size={16} /></button>
      </section>

      <div className="project-tabs live-tabs" role="tablist">
        {liveTabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}
      </div>

      {tab === '直播总览' ? <LiveOverview /> : null}
      {tab === '直播间定位' ? <LiveProfile /> : null}
      {tab === '商品矩阵' ? <ProductMatrix /> : null}
      {tab === '脚本结构' ? <ScriptStructure /> : null}
      {tab === '场次复盘' ? <SessionReview /> : null}
    </div>
  )
}

function LiveOverview() {
  return (
    <div className="page-stack">
      <section className="metric-grid">{metricCards.map(({ label, value, delta, icon: Icon, tone }) => <article className="metric-card" key={label}><div className={`metric-icon metric-${tone}`}><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong><small>{delta} 较上场</small></div></article>)}</section>
      <div className="live-overview-grid">
        <section className="panel"><div className="section-heading"><div><h2>下一场直播</h2><p>7 月 24 日 19:30 · 抖音</p></div><StatusChip tone="gold">准备中</StatusChip></div><h3 className="live-session-title">城市通勤出行装备诊断场 #2</h3><div className="readiness-list"><div><span>直播间定位</span><CheckCircle2 size={17} /></div><div><span>商品顺序</span><CheckCircle2 size={17} /></div><div><span>表达档案话术重写</span><StatusChip tone="gold">进行中</StatusChip></div><div><span>宠物出镜休息计划</span><AlertTriangle size={17} /></div></div><button className="button button-primary full-button" type="button">继续准备 <ArrowRight size={16} /></button></section>
        <section className="panel"><div className="section-heading"><div><h2>最近复盘结论</h2><p>城市通勤诊断场 · 7 月 17 日</p></div></div><div className="review-summary-callout"><TrendingUp size={21} /><p>诊断式互动拉长停留，但尺寸演示出现过晚，前 30 分钟流失明显。</p></div><div className="issue-mini-list"><div><StatusChip tone="coral">停留</StatusChip><span>首轮第 5 分钟前置 Momo 演示</span></div><div><StatusChip tone="gold">话术</StatusChip><span>固定三项尺寸诊断顺序</span></div><div><StatusChip tone="blue">履约</StatusChip><span>增加车型与安装确认</span></div></div></section>
      </div>
    </div>
  )
}

function LiveProfile() {
  const profile = [
    ['主播角色', '克制的场景选品顾问'], ['宠物角色', '真实尺寸和动作示范官'], ['核心用户', '正在为通勤、自驾或旅行选装备的城市犬主人'], ['停留理由', '能立即获得尺寸与场景建议'], ['信任理由', '讲清适合与不适合，Momo 现场演示'], ['购买理由', '减少买错尺寸和闲置的成本'], ['价格带', '39-699 元'], ['销售强度', '42 / 100 · 弱销售'],
  ]
  return <section className="panel live-profile-panel"><div className="section-heading"><div><h2>直播间定位 v1</h2><p>已初审 · 待负责人批准</p></div><StatusChip tone="gold">已初审</StatusChip></div><blockquote className="positioning-quote">主理人根据犬型、路线和频率，现场帮城市养犬人选对出行装备。</blockquote><div className="live-profile-grid">{profile.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="profile-bottom"><div><span>直播节奏</span><p>每 20 分钟完成一次诊断、演示、顾虑处理和下单引导。</p></div><div><span>Momo 出镜安排</span><p>每小时 3 次，每次 8-10 分钟；出现回避或喘息立即休息。</p></div></div></section>
}

function ProductMatrix() {
  return <section className="panel"><div className="section-heading"><div><h2>商品适配矩阵</h2><p>高利润不能覆盖低 IP 适配或高履约风险</p></div><button className="button button-secondary" type="button"><PackageCheck size={16} /> 新增商品</button></div><div className="data-table product-table"><div className="table-row table-head"><span>商品</span><span>角色</span><span>售价</span><span>IP 适配</span><span>直播适配</span><span>毛利</span><span>退款风险</span><span>建议</span></div>{products.map((product) => <div className="table-row" key={product.id}><strong>{product.name}</strong><span><StatusChip tone={product.role === '主推品' ? 'coral' : product.role === '利润品' ? 'gold' : 'neutral'}>{product.role}</StatusChip></span><span>¥{product.price}</span><div className="numeric-fit"><ProgressBar value={product.ipFit} compact /><strong>{product.ipFit}</strong></div><div className="numeric-fit"><ProgressBar value={product.liveFit} tone="blue" compact /><strong>{product.liveFit}</strong></div><span>{product.margin}%</span><span><StatusChip tone={product.refundRisk === '高' ? 'coral' : product.refundRisk === '中' ? 'gold' : 'green'}>{product.refundRisk}</StatusChip></span><span><StatusChip tone={product.recommendation === '优先' ? 'green' : product.recommendation === '测试' ? 'gold' : product.recommendation === '谨慎' ? 'coral' : 'blue'}>{product.recommendation}</StatusChip></span></div>)}</div></section>
}

function ScriptStructure() {
  return <div className="script-layout"><section className="panel script-panel"><div className="section-heading"><div><h2>20 分钟直播循环</h2><p>城市通勤诊断场 v2 · 匹配林晚表达档案</p></div><button className="button button-secondary" type="button"><Sparkles size={16} /> 风格重写</button></div><div className="script-timeline">{scriptBlocks.map((block, index) => <div className="script-block" key={block.time}><div className={`timeline-marker marker-${block.tone}`}><span>{index + 1}</span></div><time>{block.time}</time><div><StatusChip tone={block.tone}>{block.type}</StatusChip><strong>{block.title}</strong><p>{block.copy}</p></div><button className="icon-button ghost" type="button" aria-label={`编辑 ${block.title}`}><ArrowRight size={16} /></button></div>)}</div></section><aside className="panel script-preview"><div className="section-heading"><div><h2>话术预览</h2><p>当前：开场</p></div><Play size={18} /></div><p className="spoken-copy">“先别急着报体重。你平时是步行、开车，还是要坐地铁？路线不同，包的重点完全不一样。”</p><div className="voice-match"><span>人设一致</span><strong>93</strong><ProgressBar value={93} compact /></div><small>已避免：家人们、闭眼入、错过没有</small></aside></div>
}

function SessionReview() {
  const problems = [
    { type: '停留问题', tone: 'coral' as const, severity: '高', evidence: '前 30 分钟平均停留仅 67 秒，低于全场 94 秒。', action: '把 Momo 进包演示前置到首轮第 5 分钟。' },
    { type: '话术问题', tone: 'gold' as const, severity: '中', evidence: '用户重复询问尺寸，回答顺序不稳定。', action: '固定“肩高、背长、体重”三项诊断顺序。' },
    { type: '履约风险', tone: 'blue' as const, severity: '中', evidence: '车载安全舱评论出现安装复杂顾虑。', action: '补安装短视频，下单前确认车型。' },
  ]
  return (
    <div className="page-stack">
      <section className="session-header"><div className="session-play"><Play size={20} fill="currentColor" /></div><div><span>最近完成场次</span><h2>城市通勤出行装备诊断场</h2><p>7 月 17 日 19:30-21:30 · 抖音 · 2 小时</p></div><StatusChip tone="green">已复盘</StatusChip><button className="button button-secondary" type="button">查看直播记录</button></section>
      <section className="metric-grid live-metric-grid">{metricCards.map(({ label, value, delta, icon: Icon, tone }) => <article className="metric-card" key={label}><div className={`metric-icon metric-${tone}`}><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong><small>{delta} 较上场</small></div></article>)}</section>
      <div className="review-grid">
        <section className="panel metric-detail-panel">
          <div className="section-heading"><div><h2>场次漏斗</h2><p>从进入到成交</p></div><BarChart3 size={18} /></div>
          <div className="funnel-list">
            <div style={{ width: '100%' }}><Eye size={16} /><span>观看人数</span><strong>18,640</strong></div>
            <div style={{ width: '82%' }}><Users size={16} /><span>有效停留</span><strong>4,928</strong></div>
            <div style={{ width: '64%' }}><ShoppingBag size={16} /><span>商品点击</span><strong>1,696</strong></div>
            <div style={{ width: '44%' }}><CircleDollarSign size={16} /><span>成交件数</span><strong>61</strong></div>
          </div>
          <div className="funnel-meta"><span><Eye size={15} /> 平均在线 312</span><span><MessageCircle size={15} /> 互动率 12.6%</span><span><TrendingUp size={15} /> 千次观看成交 ¥486</span></div>
        </section>
        <section className="panel issue-panel">
          <div className="section-heading"><div><h2>问题诊断</h2><p>按类型区分，不把所有问题都归因于话术</p></div></div>
          <div className="live-issue-list">{problems.map((problem) => <div key={problem.type}><div><StatusChip tone={problem.tone}>{problem.type}</StatusChip><span className={`severity severity-${problem.severity}`}>{problem.severity}优先级</span></div><p>{problem.evidence}</p><strong><ArrowRight size={15} />{problem.action}</strong></div>)}</div>
        </section>
      </div>
      <section className="next-session-bar"><CheckCircle2 size={20} /><div><strong>下一场调整建议已生成</strong><p>3 项动作将在 7 月 24 日场次准备清单中自动核验。</p></div><button className="button button-primary" type="button">查看下场清单 <ArrowRight size={16} /></button></section>
    </div>
  )
}


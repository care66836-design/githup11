import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FilePenLine,
  History,
  MessageSquareText,
  MoreHorizontal,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, ProgressBar, StatusChip } from '../components/ui'
import { contentDrafts, diagnosticModules, positioningOptions, products, projects } from '../data/demo'

const tabs = ['项目总览', '定位诊断', '表达档案', '内容计划', '直播电商'] as const
type ProjectTab = (typeof tabs)[number]

const team = [
  { name: '陈序', role: '项目负责人', tone: 'green' as const },
  { name: '苏芮', role: 'IP 顾问', tone: 'coral' as const },
  { name: '唐可', role: '内容策划', tone: 'gold' as const },
  { name: '许哲', role: '直播运营', tone: 'blue' as const },
]

export function ProjectDetail() {
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId) ?? projects[0]
  const [activeTab, setActiveTab] = useState<ProjectTab>('定位诊断')
  const [selectedOption, setSelectedOption] = useState('different')
  const selected = useMemo(() => positioningOptions.find((option) => option.id === selectedOption) ?? positioningOptions[1], [selectedOption])

  return (
    <div className="project-detail-page">
      <div className="project-breadcrumb">
        <Link to="/projects"><ArrowLeft size={16} /> 返回项目</Link>
        <span>{project.code}</span>
      </div>

      <section className="project-identity-band">
        <img src={project.image} alt={`${project.pet} 的项目头像`} />
        <div className="project-title-copy">
          <div><StatusChip tone="coral">{project.status}</StatusChip><span className="privacy-label"><ShieldCheck size={14} /> 内部资料 · 二级敏感</span></div>
          <h1>{project.name}</h1>
          <p>{project.creator} · 宠物出行品牌主理人 / {project.pet} · {project.petRole}</p>
        </div>
        <div className="project-team-stack" aria-label="项目成员">
          {team.map((member) => <Avatar key={member.name} name={member.name} tone={member.tone} />)}
          <span>4 人协作</span>
        </div>
        <button className="button button-primary" type="button"><FileCheck2 size={17} /> 提交负责人批准</button>
        <button className="icon-button" type="button" aria-label="更多项目操作"><MoreHorizontal size={20} /></button>
      </section>

      <div className="project-tabs" role="tablist" aria-label="项目模块">
        {tabs.map((tab) => (
          <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="project-tab-content">
        {activeTab === '项目总览' ? <OverviewTab selectedLabel={selected.shortLabel} /> : null}
        {activeTab === '定位诊断' ? <PositioningTab selectedOption={selectedOption} onSelect={setSelectedOption} /> : null}
        {activeTab === '表达档案' ? <VoiceTab /> : null}
        {activeTab === '内容计划' ? <ContentPlanTab /> : null}
        {activeTab === '直播电商' ? <LiveSummaryTab /> : null}
      </div>
    </div>
  )
}

function OverviewTab({ selectedLabel }: { selectedLabel: string }) {
  return (
    <div className="project-overview-grid">
      <div className="overview-main page-stack">
        <section className="panel">
          <div className="section-heading"><div><h2>项目进度</h2><p>从资料采集到正式运营</p></div><strong className="large-percent">72%</strong></div>
          <div className="stage-line">
            {['资料采集', '资产诊断', '定位三案', '正式审核', '内容启动', '直播验证'].map((stage, index) => (
              <div className={index < 3 ? 'done' : index === 3 ? 'current' : ''} key={stage}><span>{index < 3 ? <Check size={14} /> : index + 1}</span><small>{stage}</small></div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="section-heading"><div><h2>当前定位</h2><p>报告 v1 · 已完成初审</p></div><StatusChip tone="gold">{selectedLabel}</StatusChip></div>
          <blockquote className="positioning-quote">让 Momo 用身体投票，拆穿宠物出行用品里那些看起来有用、实际难用的设计。</blockquote>
          <div className="definition-grid">
            <div><span>人物人设</span><strong>有产品洁癖的装备拆解者</strong></div>
            <div><span>宠物角色</span><strong>不会配合演戏的真实体验官</strong></div>
            <div><span>核心用户</span><strong>关注设计细节的城市养犬人</strong></div>
            <div><span>商业路径</span><strong>自有品牌 + 联名测评 + 直播</strong></div>
          </div>
        </section>
        <section className="panel">
          <div className="section-heading"><div><h2>最近成果</h2><p>报告、稿件与直播记录</p></div></div>
          <div className="artifact-list">
            <div><FileCheck2 size={18} /><span><strong>IP 定位报告 v1</strong><small>陈序已审核 · 等待批准</small></span><StatusChip tone="coral">待批准</StatusChip></div>
            <div><FilePenLine size={18} /><span><strong>启动期第 1 周内容计划</strong><small>3 条稿件已完成表达检查</small></span><StatusChip tone="gold">进行中</StatusChip></div>
            <div><Radio size={18} /><span><strong>城市通勤诊断场复盘</strong><small>已形成 3 项下场动作</small></span><StatusChip tone="green">已复盘</StatusChip></div>
          </div>
        </section>
      </div>
      <aside className="overview-aside page-stack">
        <section className="panel">
          <div className="section-heading"><div><h2>下一里程碑</h2><p>7 月 22 日 10:00</p></div></div>
          <strong className="milestone-title">确认正式定位与首周选题</strong>
          <p className="muted-copy">负责人批准后，系统才会允许内容进入正式审核。</p>
          <button className="button button-primary full-button" type="button">查看审核清单</button>
        </section>
        <section className="panel">
          <div className="section-heading"><div><h2>项目成员</h2><p>仅成员可查看客户资料</p></div><Users size={18} /></div>
          <div className="team-list">
            {team.map((member) => <div key={member.name}><Avatar name={member.name} tone={member.tone} /><span><strong>{member.name}</strong><small>{member.role}</small></span></div>)}
          </div>
        </section>
        <section className="audit-note"><History size={18} /><div><strong>审计记录完整</strong><p>今天 3 次重要操作已记录。</p></div></section>
      </aside>
    </div>
  )
}

function PositioningTab({ selectedOption, onSelect }: { selectedOption: string; onSelect: (id: string) => void }) {
  return (
    <div className="page-stack">
      <section className="panel diagnosis-panel">
        <div className="section-heading">
          <div><h2>八模块诊断</h2><p>每项判断都保留证据和执行限制</p></div>
          <div className="completion-copy"><CheckCircle2 size={17} /><span>完整度</span><strong>83%</strong></div>
        </div>
        <div className="diagnosis-grid">
          {diagnosticModules.map((module, index) => (
            <button className="diagnosis-item" type="button" key={module.name}>
              <span className="diagnosis-number">{String(index + 1).padStart(2, '0')}</span>
              <div><strong>{module.name}</strong><p>{module.evidence}</p></div>
              <div className="diagnosis-score"><strong>{module.score}</strong><ProgressBar value={module.score} tone={module.status === '完整' ? 'green' : 'gold'} compact /></div>
              <StatusChip tone={module.status === '完整' ? 'green' : 'gold'}>{module.status}</StatusChip>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading outside-heading">
          <div><h2>定位方案对比</h2><p>选择一个主方案，也可以在正式报告中混合调整。</p></div>
          <button className="button button-secondary" type="button"><Sparkles size={16} /> 重新生成三案</button>
        </div>
        <div className="option-grid">
          {positioningOptions.map((option) => {
            const isSelected = option.id === selectedOption
            return (
              <article className={`positioning-card card-${option.color} ${isSelected ? 'selected' : ''}`} key={option.id}>
                <div className="option-topline">
                  <StatusChip tone={option.color}>{option.label}</StatusChip>
                  <div className="score-ring"><strong>{option.score}</strong><span>推荐</span></div>
                </div>
                <h3>{option.positioning}</h3>
                <dl>
                  <div><dt>人物人设</dt><dd>{option.persona}</dd></div>
                  <div><dt>核心用户</dt><dd>{option.audience}</dd></div>
                  <div><dt>平台策略</dt><dd>{option.strategy}</dd></div>
                </dl>
                <div className="fit-pair">
                  <div><span>直播适配</span><strong>{option.liveFit}</strong><ProgressBar value={option.liveFit} tone={option.color} compact /></div>
                  <div><span>执行难度</span><strong>{option.difficulty}</strong><ProgressBar value={option.difficulty} tone="blue" compact /></div>
                </div>
                <div className="option-notes">
                  <p className="positive"><CheckCircle2 size={15} />{option.advantage}</p>
                  <p><CircleAlert size={15} />{option.risk}</p>
                </div>
                <button className={`button ${isSelected ? 'button-selected' : 'button-secondary'} full-button`} type="button" onClick={() => onSelect(option.id)}>
                  {isSelected ? <><Check size={17} /> 已选为主方案</> : '选择这个方案'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <section className="selection-bar">
        <div><StatusChip tone="coral">当前主方案</StatusChip><strong>{positioningOptions.find((option) => option.id === selectedOption)?.shortLabel}</strong><span>可在报告编辑器中混合其他方案模块</span></div>
        <button className="button button-primary" type="button">进入正式报告 <ArrowRight size={16} /></button>
      </section>
    </div>
  )
}

function VoiceTab() {
  const attributes = [
    ['专业度', 82], ['口语化', 76], ['幽默度', 42], ['情绪浓度', 36], ['争议承受', 48], ['销售强度', 38],
  ] as const
  return (
    <div className="voice-layout">
      <section className="panel voice-profile-main">
        <div className="section-heading"><div><h2>Creator Voice Profile</h2><p>2026 年 7 月 18 日由陈序批准</p></div><StatusChip tone="green"><CheckCircle2 size={13} /> 已批准</StatusChip></div>
        <div className="voice-summary"><MessageSquareText size={22} /><div><span>表达定位</span><strong>克制、直接，带一点冷幽默。先给判断，再补场景和依据。</strong></div></div>
        <div className="attribute-grid">
          {attributes.map(([label, value], index) => <div key={label}><span>{label}</span><strong>{value}</strong><ProgressBar value={value} tone={index === 2 ? 'gold' : index === 3 ? 'coral' : 'green'} compact /></div>)}
        </div>
        <div className="voice-rules-grid">
          <div><span>句子与节奏</span><p>短句为主。关键判断单独成句，允许停顿和自我修正。</p></div>
          <div><span>开场习惯</span><p>从一个真实使用动作或错误选择切入，不制造虚假焦虑。</p></div>
          <div><span>结尾习惯</span><p>给明确适用边界，不做价值升华，不总结人生道理。</p></div>
          <div><span>观点方式</span><p>可以明确说“不建议买”，但必须带具体场景和判断依据。</p></div>
        </div>
        <div className="word-section"><span>高频词</span><div>{['我更在意', '先别急', '这个地方', '说实话'].map((word) => <em className="word-chip approved" key={word}>{word}</em>)}</div></div>
        <div className="word-section"><span>禁用词</span><div>{['闭眼入', '天花板', '绝绝子', '家人们冲', '颠覆想象'].map((word) => <em className="word-chip banned" key={word}>{word}</em>)}</div></div>
      </section>
      <aside className="panel samples-panel">
        <div className="section-heading"><div><h2>真实表达样本</h2><p>3 条已批准 · 建议补充 2 条</p></div><button className="text-button" type="button">添加样本</button></div>
        <div className="sample-list">
          <div><StatusChip tone="blue">口播转写</StatusChip><p>“先别急着看承重。狗进包以后能不能转身，背起来重心往不往后跑，这两个问题更实际。”</p><small>产品测评 · 2026/07/12</small></div>
          <div><StatusChip tone="green">已发布文案</StatusChip><p>“Momo 今天把第三版样包坐塌了。挺好，省得它到客户手上再塌。”</p><small>朋友圈 · 2026/07/08</small></div>
          <div><StatusChip tone="coral">不喜欢的表达</StatusChip><p>“家人们这个真的闭眼入，错过就没有了。”</p><small>员工标注：夸张、没有使用边界</small></div>
        </div>
      </aside>
    </div>
  )
}

function ContentPlanTab() {
  const ratios = [
    { label: '流量内容', value: 35, tone: 'coral' as const },
    { label: '信任内容', value: 30, tone: 'green' as const },
    { label: '人设内容', value: 20, tone: 'blue' as const },
    { label: '转化内容', value: 15, tone: 'gold' as const },
  ]
  return (
    <div className="content-plan-layout">
      <section className="panel">
        <div className="section-heading"><div><h2>启动期内容架构</h2><p>方案 B · 第 1-4 周建议比例</p></div><StatusChip tone="gold">草稿</StatusChip></div>
        <div className="ratio-overview">{ratios.map((item) => <div style={{ flex: item.value }} className={`ratio-${item.tone}`} key={item.label}><span>{item.label}</span><strong>{item.value}%</strong></div>)}</div>
        <div className="ratio-detail-list">
          {ratios.map((item) => <div key={item.label}><span className={`legend-dot dot-${item.tone}`} /><strong>{item.label}</strong><ProgressBar value={item.value * 2.2} tone={item.tone} compact /><span>{item.value}%</span></div>)}
        </div>
      </section>
      <section className="panel">
        <div className="section-heading"><div><h2>本周稿件</h2><p>1 条待审核，1 条已通过</p></div><Link className="text-link" to="/content">进入内容生产 <ArrowRight size={15} /></Link></div>
        <div className="artifact-list content-artifacts">
          {contentDrafts.slice(0, 2).map((draft) => <div key={draft.id}><FilePenLine size={18} /><span><strong>{draft.title}</strong><small>{draft.mode} · {draft.platform} · {draft.updatedAt}</small></span><StatusChip tone={draft.status === '已通过' ? 'green' : 'coral'}>{draft.status}</StatusChip></div>)}
        </div>
      </section>
    </div>
  )
}

function LiveSummaryTab() {
  return (
    <div className="page-stack">
      <section className="live-profile-band">
        <div><p className="eyebrow">直播间一句话定位</p><h2>主理人根据犬型、路线和频率，现场帮城市养犬人选对出行装备。</h2><p>弱销售 · 场景诊断型 · Momo 每小时出镜 3 次</p></div>
        <div className="live-fit-number"><span>直播适配</span><strong>78</strong><small>/ 100</small></div>
        <Link className="button button-primary" to="/live">进入直播中心 <ArrowRight size={16} /></Link>
      </section>
      <section className="panel">
        <div className="section-heading"><div><h2>商品矩阵</h2><p>5 个商品 · 1 项需要谨慎</p></div></div>
        <div className="compact-product-list">
          {products.slice(0, 4).map((product) => <div key={product.id}><StatusChip tone={product.role === '主推品' ? 'coral' : product.role === '利润品' ? 'gold' : 'neutral'}>{product.role}</StatusChip><strong>{product.name}</strong><span>¥{product.price}</span><span>IP 适配 {product.ipFit}</span><StatusChip tone={product.recommendation === '优先' ? 'green' : product.recommendation === '测试' ? 'gold' : 'blue'}>{product.recommendation}</StatusChip></div>)}
        </div>
      </section>
    </div>
  )
}

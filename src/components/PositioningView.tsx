import { ArrowRight, Check, ExternalLink, Search, Sparkles } from 'lucide-react'
import type { PositioningReport } from '../assistant/types'

type PositioningViewProps = {
  report: PositioningReport | null
  loading: boolean
  onWriteCopy: () => void
}

function LoadingState() {
  return (
    <div className="result-loading" aria-live="polite">
      <div className="search-pulse"><Search size={22} /></div>
      <span className="step-label">联网分析中</span>
      <h2>正在核对公开资料和定位证据</h2>
      <div className="loading-track"><span /></div>
      <div className="loading-steps">
        <span><Check size={13} /> 整理人物与宠物事实</span>
        <span><Check size={13} /> 查找账号公开信息</span>
        <span><Check size={13} /> 比较候选定位</span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="result-empty">
      <img src="/assets/momo.jpg" alt="宠物账号资料示例" />
      <div>
        <span className="step-label">02 · 得到定位</span>
        <h2>定位会出现在这里</h2>
        <p>先提供真实信息。缺少的数据会被明确标出，不会被 AI 猜出来。</p>
      </div>
    </div>
  )
}

export function PositioningView({ report, loading, onWriteCopy }: PositioningViewProps) {
  if (loading) return <LoadingState />
  if (!report) return <EmptyState />

  return (
    <article className="positioning-result">
      <header className="result-header">
        <div>
          <span className="step-label">账号定位 · {report.stage}</span>
          <h2>{report.positioning.title}</h2>
          <p>{report.verdict}</p>
        </div>
        <span className={`confidence confidence-${report.confidence}`}>置信度 {report.confidence}</span>
      </header>

      <section className="positioning-statement">
        <span>一句话定位</span>
        <strong>{report.positioning.oneLiner}</strong>
      </section>

      <section className="result-section">
        <div className="section-heading">
          <span>01</span>
          <h3>定位结构</h3>
        </div>
        <dl className="definition-grid">
          <div><dt>目标用户</dt><dd>{report.positioning.audience}</dd></div>
          <div><dt>关注价值</dt><dd>{report.positioning.value}</dd></div>
          <div><dt>核心记忆点</dt><dd>{report.positioning.memoryPoint}</dd></div>
          <div><dt>主人角色</dt><dd>{report.positioning.creatorRole}</dd></div>
          <div><dt>宠物角色</dt><dd>{report.positioning.petRole}</dd></div>
          <div><dt>关系主线</dt><dd>{report.positioning.relationship}</dd></div>
        </dl>
      </section>

      <section className="result-section">
        <div className="section-heading">
          <span>02</span>
          <h3>主页包装</h3>
        </div>
        <div className="profile-suggestion">
          <div>
            <small>昵称候选</small>
            <div className="name-options">{report.profile.nameIdeas.map((name) => <span key={name}>{name}</span>)}</div>
          </div>
          <div>
            <small>简介</small>
            <p>{report.profile.bio}</p>
          </div>
          <div>
            <small>三条置顶</small>
            <ol>{report.profile.pinnedPosts.map((post) => <li key={post}>{post}</li>)}</ol>
          </div>
        </div>
      </section>

      <section className="result-section">
        <div className="section-heading">
          <span>03</span>
          <h3>7 天内容测试</h3>
        </div>
        <div className="content-strategy">
          <p><strong>主线：</strong>{report.content.mainLine}</p>
          <p><strong>副线：</strong>{report.content.secondaryLine}</p>
          <p><strong>比例：</strong>{report.content.contentRatio}</p>
        </div>
        <div className="topic-table">
          {report.content.sevenDayTopics.map((topic) => (
            <div className="topic-row" key={`${topic.day}-${topic.title}`}>
              <span>{topic.day}</span>
              <div><strong>{topic.title}</strong><small>{topic.format} · {topic.hook}</small></div>
              <p>{topic.testGoal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section two-column-section">
        <div>
          <div className="section-heading"><span>04</span><h3>第一阶段变现</h3></div>
          <p className="section-lead">{report.commercialization.priorityPath}</p>
          <div className="tag-list">{report.commercialization.suitableCategories.map((item) => <span key={item}>{item}</span>)}</div>
          <small className="muted-line">首条商业样片：{report.commercialization.firstSample}</small>
        </div>
        <div>
          <div className="section-heading"><span>05</span><h3>风险边界</h3></div>
          <ul className="clean-list">{report.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
        </div>
      </section>

      <section className="result-section evidence-section">
        <div className="section-heading"><span>06</span><h3>依据与缺口</h3></div>
        <div className="evidence-columns">
          <div><strong>你已确认的信息</strong><ul>{report.evidence.confirmed.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><strong>公开信息观察</strong><ul>{report.evidence.webFindings.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><strong>仍需补充</strong><ul>{report.evidence.gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      {report.alternatives.length > 0 && (
        <section className="result-section alternatives-section">
          <div className="section-heading"><span>07</span><h3>没有选作主定位的方向</h3></div>
          {report.alternatives.map((alternative) => (
            <div className="alternative-row" key={alternative.title}>
              <strong>{alternative.title}</strong>
              <p>{alternative.whyNotMain}</p>
            </div>
          ))}
        </section>
      )}

      {report.sources.length > 0 && (
        <section className="source-section">
          <span>联网来源</span>
          <div>{report.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}<ExternalLink size={12} /></a>)}</div>
        </section>
      )}

      <button className="next-action" type="button" onClick={onWriteCopy}>
        <Sparkles size={17} /> 用这个定位生成文案 <ArrowRight size={17} />
      </button>
    </article>
  )
}


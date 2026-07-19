import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  History,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { contentDrafts } from '../data/demo'
import { reviewWriting } from '../lib/styleReview'
import type { ContentDraft } from '../types'
import { Modal, ProgressBar, StatusChip } from '../components/ui'
import { useWorkspace } from '../state/WorkspaceContext'

const modes: ContentDraft['mode'][] = ['原生口播', 'IP 观点', '日常记录', '电商转化']

function statusTone(status: ContentDraft['status']) {
  if (status === '已通过') return 'green'
  if (status === '待审核') return 'coral'
  if (status === '待修改') return 'gold'
  return 'neutral'
}

export function ContentStudio() {
  const [activeId, setActiveId] = useState(contentDrafts[0].id)
  const [query, setQuery] = useState('')
  const [queueFilter, setQueueFilter] = useState<'mine' | 'all'>('mine')
  const [statusFilter, setStatusFilter] = useState<'全部状态' | ContentDraft['status']>('全部状态')
  const activeDraft = contentDrafts.find((draft) => draft.id === activeId) ?? contentDrafts[0]
  const [bodyById, setBodyById] = useState<Record<string, string>>(() => {
    try {
      const savedBodies = window.localStorage.getItem('petip.draftBodies')
      return savedBodies ? JSON.parse(savedBodies) as Record<string, string> : Object.fromEntries(contentDrafts.map((draft) => [draft.id, draft.body]))
    } catch {
      return Object.fromEntries(contentDrafts.map((draft) => [draft.id, draft.body]))
    }
  })
  const [modeById, setModeById] = useState<Record<string, ContentDraft['mode']>>(() => Object.fromEntries(contentDrafts.map((draft) => [draft.id, draft.mode])))
  const [saved, setSaved] = useState(false)
  const [diffOpen, setDiffOpen] = useState(false)
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const { draftStatuses, setDraftStatus, notify } = useWorkspace()
  const currentBody = bodyById[activeDraft.id]
  const activeStatus = draftStatuses[activeDraft.id] ?? activeDraft.status
  const liveReview = useMemo(() => reviewWriting(currentBody), [currentBody])
  const visibleDrafts = contentDrafts.filter((draft) => {
    const status = draftStatuses[draft.id] ?? draft.status
    const matchesQueue = queueFilter === 'all' || status !== '已通过'
    const matchesStatus = statusFilter === '全部状态' || status === statusFilter
    return `${draft.title}${draft.project}`.includes(query) && matchesQueue && matchesStatus
  })

  useEffect(() => {
    window.localStorage.setItem('petip.draftBodies', JSON.stringify(bodyById))
  }, [bodyById])

  const saveRevision = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }

  const rewrite = () => {
    const suggestion = activeDraft.suggestions[0]
    const rewritten = currentBody
      .replace(/每一次出行更加美好/g, '具体看底板、转身空间和背负重心')
      .replace(/宝贵经验/g, '这次失败暴露的问题')
    setBodyById((current) => ({ ...current, [activeDraft.id]: rewritten === currentBody ? `${currentBody}\n\n修改备注：${suggestion}` : rewritten }))
    setDiffOpen(false)
    setDraftStatus(activeDraft.id, '待修改')
    notify('已按第一条建议完成重写，请人工复核')
  }

  const submitReview = () => {
    setDraftStatus(activeDraft.id, '待审核')
    notify('稿件已提交审核并记录当前版本')
  }

  return (
    <div className="content-studio-page">
      <section className="page-heading compact-heading studio-heading">
        <div><p className="eyebrow">人设一致的内容工作流</p><h1>内容生产</h1><p>AI 初稿、风格检查和员工终稿都保留版本。</p></div>
        <div className="heading-actions">
          <button className="button button-secondary" type="button" onClick={() => setVersionsOpen(true)}><History size={16} /> 版本记录</button>
          <button className="button button-primary" type="button" onClick={saveRevision}><Save size={16} /> 保存员工修订</button>
        </div>
      </section>

      <div className="studio-shell">
        <aside className="draft-sidebar">
          <div className="draft-sidebar-top">
            <div><strong>内容队列</strong><StatusChip tone="coral">6 待处理</StatusChip></div>
            <label className="table-search compact-search"><Search size={16} /><input aria-label="搜索内容" placeholder="搜索稿件" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          </div>
          <div className="draft-filter-row"><button className={queueFilter === 'mine' ? 'selected' : ''} type="button" onClick={() => setQueueFilter('mine')}>我的待办</button><button className={queueFilter === 'all' ? 'selected' : ''} type="button" onClick={() => setQueueFilter('all')}>全部</button><select aria-label="稿件状态筛选" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}><option>全部状态</option><option>待审核</option><option>待修改</option><option>已通过</option></select></div>
          <div className="draft-list">
            {visibleDrafts.map((draft) => (
              <button className={`draft-list-item ${draft.id === activeDraft.id ? 'active' : ''}`} type="button" key={draft.id} onClick={() => { setActiveId(draft.id); setDiffOpen(false) }}>
                <div><StatusChip tone={statusTone(draftStatuses[draft.id] ?? draft.status)}>{draftStatuses[draft.id] ?? draft.status}</StatusChip><span>{draft.updatedAt}</span></div>
                <strong>{draft.title}</strong>
                <small>{draft.project} · {draft.mode} · {draft.platform}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="editor-workspace">
          <div className="editor-toolbar">
            <div>
              <span className="editor-project">{activeDraft.project} / 启动期第 1 周</span>
              <h2>{activeDraft.title}</h2>
            </div>
            <div><StatusChip tone={statusTone(activeStatus)}>{activeStatus}</StatusChip><button className="icon-button ghost" type="button" aria-label="稿件更多操作" onClick={() => notify('当前稿件已开启本地自动保存')}><MoreHorizontal size={18} /></button></div>
          </div>

          <div className="mode-row">
            <span>生成模式</span>
            <div className="segmented-control content-modes">
              {modes.map((mode) => <button className={modeById[activeDraft.id] === mode ? 'selected' : ''} type="button" key={mode} onClick={() => setModeById((current) => ({ ...current, [activeDraft.id]: mode }))}>{mode}</button>)}
            </div>
            <button className="voice-profile-button" type="button" onClick={() => setVoiceOpen(true)}><MessageSquareText size={16} /><span>林晚表达档案</span><CheckCircle2 size={14} /><ChevronDown size={15} /></button>
          </div>

          {diffOpen ? (
            <div className="diff-view">
              <div><span>AI 初稿 · v1</span><p>{activeDraft.aiBody}</p></div>
              <div><span>员工终稿 · 当前</span><p>{currentBody}</p></div>
            </div>
          ) : (
            <div className="editor-area">
              <textarea aria-label="稿件正文" value={currentBody} onChange={(event) => setBodyById((current) => ({ ...current, [activeDraft.id]: event.target.value }))} />
              <div className="editor-footer"><span>{currentBody.replace(/\s/g, '').length} 字 · 预计口播 {Math.max(8, Math.round(currentBody.length / 4))} 秒</span><span>自动保存于本地草稿</span></div>
            </div>
          )}

          <div className="editor-actions-row">
            <button className="button button-secondary" type="button" onClick={() => setDiffOpen((value) => !value)}><ArrowLeftRight size={16} /> {diffOpen ? '返回编辑' : '对比 AI 初稿'}</button>
            <button className="button button-secondary" type="button" onClick={rewrite}><RefreshCw size={16} /> 按建议重写</button>
            <button className="button button-primary" type="button" onClick={submitReview}><Check size={16} /> 提交审核</button>
          </div>
        </section>

        <aside className="style-review-panel">
          <div className="style-panel-heading"><div><WandSparkles size={19} /><span><strong>自然表达检查</strong><small>基于林晚表达档案</small></span></div><button className="icon-button ghost" type="button" aria-label="重新检查" onClick={() => notify('已使用当前文本重新完成自然表达检查')}><RefreshCw size={17} /></button></div>
          <div className="overall-score"><div className="score-ring large"><strong>{Math.round((activeDraft.styleScores[0].value + activeDraft.styleScores[1].value + activeDraft.styleScores[2].value) / 3)}</strong><span>综合</span></div><div><strong>整体自然</strong><p>人设和口播节奏稳定，建议再处理 1 个细节。</p></div></div>
          <div className="style-score-list">
            {activeDraft.styleScores.map((score) => {
              const liveValue = score.label === '模板化' ? liveReview.genericPhraseScore : score.label === '细节密度' ? liveReview.detailDensityScore : score.value
              const good = score.direction === 'higher' ? liveValue >= 75 : liveValue <= 35
              return <div key={score.label}><span>{score.label}</span><ProgressBar value={liveValue} tone={good ? 'green' : 'gold'} compact /><strong>{liveValue}</strong></div>
            })}
          </div>
          <div className="review-section">
            <span className="review-label">发现的问题</span>
            {(liveReview.detectedProblems.length > 0 ? liveReview.detectedProblems : activeDraft.issues).map((issue) => <div className="review-issue" key={issue}><span>!</span><p>{issue}</p></div>)}
            {liveReview.detectedProblems.length === 0 && activeDraft.issues.length === 0 ? <div className="review-pass"><CheckCircle2 size={16} />未发现明显问题</div> : null}
          </div>
          <div className="review-section">
            <span className="review-label">修改建议</span>
            {activeDraft.suggestions.map((suggestion, index) => <div className="suggestion-row" key={suggestion}><span>{index + 1}</span><p>{suggestion}</p></div>)}
          </div>
          <div className="review-disclaimer"><Sparkles size={15} /><p>检查用于提高真实性与修改效率，最终内容仍需员工审核。</p></div>
        </aside>
      </div>
      {saved ? <div className="toast-message"><CheckCircle2 size={18} /> 已保存为员工修订版本 v3 <Clock3 size={15} /></div> : null}
      <Modal open={versionsOpen} onClose={() => setVersionsOpen(false)} title="版本记录" description="AI 初稿与员工修订分别保留。"><div className="version-list"><button type="button" onClick={() => { setBodyById((current) => ({ ...current, [activeDraft.id]: activeDraft.body })); setVersionsOpen(false); notify('已恢复员工终稿 v2') }}><span><strong>员工终稿 v2</strong><small>唐可 · 昨天 17:40</small></span><StatusChip tone="green">当前基线</StatusChip></button><button type="button" onClick={() => { setBodyById((current) => ({ ...current, [activeDraft.id]: activeDraft.aiBody })); setVersionsOpen(false); notify('已恢复 AI 初稿，请继续人工修改', 'warning') }}><span><strong>AI 初稿 v1</strong><small>系统生成 · 昨天 17:32</small></span><StatusChip tone="neutral">历史</StatusChip></button></div></Modal>
      <Modal open={voiceOpen} onClose={() => setVoiceOpen(false)} title="林晚表达档案" description="当前稿件按此档案检查。"><div className="voice-modal-summary"><p>克制、直接，带一点冷幽默。先给判断，再补场景和依据。</p><div><StatusChip tone="green">常用：先别急</StatusChip><StatusChip tone="coral">禁用：闭眼入</StatusChip><StatusChip tone="coral">禁用：家人们冲</StatusChip></div></div></Modal>
    </div>
  )
}

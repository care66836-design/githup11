import { Check, Copy, ExternalLink, LoaderCircle, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { CopyMode, CopyRequest, CopyResult, PositioningReport } from '../assistant/types'

type CopyPanelProps = {
  report: PositioningReport | null
  result: CopyResult | null
  loading: boolean
  error: string
  onSubmit: (request: CopyRequest) => void
  onBack: () => void
}

const modes: Array<{ value: CopyMode; label: string }> = [
  { value: '原生口播', label: '原生口播' },
  { value: 'IP 观点', label: 'IP 观点' },
  { value: '日常记录', label: '日常记录' },
  { value: '电商转化', label: '电商转化' },
]

const initialRequest: CopyRequest = {
  mode: '原生口播',
  topic: '',
  objective: '涨粉和建立记忆点',
  product: '',
  duration: '30-45 秒',
  extraContext: '',
}

export function CopyPanel({ report, result, loading, error, onSubmit, onBack }: CopyPanelProps) {
  const [request, setRequest] = useState<CopyRequest>(initialRequest)
  const [copied, setCopied] = useState(false)

  if (!report) {
    return (
      <div className="copy-empty">
        <span className="step-label">先完成账号定位</span>
        <h1>文案需要知道这个账号是谁</h1>
        <p>先生成主定位，文案才会继承真实人设、宠物角色和表达边界。</p>
        <button className="secondary-action" type="button" onClick={onBack}>返回账号定位</button>
      </div>
    )
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(request)
  }

  const copyResult = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`${result.title}\n\n${result.hook}\n\n${result.body}\n\n${result.caption}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="copy-workspace">
      <form className="copy-form" onSubmit={submit}>
        <div className="panel-heading">
          <div>
            <span className="step-label">03 · 生成文案</span>
            <h1>这次要写什么？</h1>
          </div>
        </div>

        <div className="positioning-context">
          <span>当前定位</span>
          <strong>{report.positioning.title}</strong>
          <p>{report.positioning.oneLiner}</p>
        </div>

        <fieldset className="mode-fieldset">
          <legend>文案模式</legend>
          <div className="mode-control">
            {modes.map((mode) => (
              <button className={request.mode === mode.value ? 'active' : ''} type="button" onClick={() => setRequest({ ...request, mode: mode.value })} key={mode.value}>
                {mode.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field-block">
          <span>主题</span>
          <textarea required rows={4} value={request.topic} onChange={(event) => setRequest({ ...request, topic: event.target.value })} placeholder="例如：带狗坐高铁前，真正要提前准备的三件事" />
        </label>

        <div className="field-row">
          <label>
            <span>目标</span>
            <select value={request.objective} onChange={(event) => setRequest({ ...request, objective: event.target.value })}>
              <option>涨粉和建立记忆点</option>
              <option>提高评论互动</option>
              <option>建立专业信任</option>
              <option>商品成交</option>
            </select>
          </label>
          <label>
            <span>时长</span>
            <select value={request.duration} onChange={(event) => setRequest({ ...request, duration: event.target.value })}>
              <option>15-30 秒</option>
              <option>30-45 秒</option>
              <option>45-60 秒</option>
              <option>60-90 秒</option>
            </select>
          </label>
        </div>

        {request.mode === '电商转化' && (
          <label className="field-block">
            <span>产品和真实使用场景</span>
            <textarea required rows={3} value={request.product} onChange={(event) => setRequest({ ...request, product: event.target.value })} placeholder="产品是什么、在哪个场景使用、解决什么真实问题" />
          </label>
        )}

        <label className="field-block">
          <span>补充要求</span>
          <input value={request.extraContext} onChange={(event) => setRequest({ ...request, extraContext: event.target.value })} placeholder="这条必须提到或绝对不要出现的内容" />
        </label>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
          {loading ? '正在写并检查表达…' : '生成可拍文案'}
        </button>
      </form>

      <main className="copy-result" aria-live="polite">
        {loading && (
          <div className="result-loading compact-loading">
            <div className="search-pulse"><Sparkles size={22} /></div>
            <h2>正在按你的说话方式重写</h2>
            <div className="loading-track"><span /></div>
          </div>
        )}

        {!loading && !result && (
          <div className="copy-result-empty">
            <span>文案输出</span>
            <h2>写清主题后开始生成</h2>
            <p>AI 会保留账号定位和真实说话特征，同时检查常见的模板化表达。</p>
          </div>
        )}

        {!loading && result && (
          <article className="copy-document">
            <header>
              <div><span className="step-label">{request.mode}</span><h2>{result.title}</h2></div>
              <button className="icon-text-button" type="button" onClick={copyResult}>
                {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? '已复制' : '复制全文'}
              </button>
            </header>
            <section className="copy-hook"><span>开场</span><strong>{result.hook}</strong></section>
            <section className="copy-body"><span>正文</span><p>{result.body}</p></section>
            <section className="copy-shots">
              <span>拍摄顺序</span>
              <ol>{result.shotList.map((shot) => <li key={shot}>{shot}</li>)}</ol>
            </section>
            <section className="copy-caption"><span>发布文案</span><p>{result.caption}</p></section>
            <section className="taste-check">
              <span>表达检查</span>
              <ul>{result.aiTasteCheck.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul>
            </section>
            {result.sourceNotes.length > 0 && (
              <section className="source-notes"><span>联网核对</span><ul>{result.sourceNotes.map((item) => <li key={item}>{item}</li>)}</ul></section>
            )}
            {result.sources.length > 0 && (
              <section className="source-section"><span>来源</span><div>{result.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}<ExternalLink size={12} /></a>)}</div></section>
            )}
          </article>
        )}
      </main>
    </div>
  )
}


import { Clock3, Globe2, PawPrint, PenLine, Radar, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createCopy, createPositioning, getServiceHealth } from './assistant/api'
import { emptyIntake, type AccountIntake, type AnalysisRecord, type CopyRequest, type CopyResult, type PositioningReport, type ServiceHealth } from './assistant/types'
import { CopyPanel } from './components/CopyPanel'
import { IntakePanel } from './components/IntakePanel'
import { PositioningView } from './components/PositioningView'

type WorkspaceTab = 'positioning' | 'copy'

const INTAKE_KEY = 'petip.simple.intake'
const REPORT_KEY = 'petip.simple.report'
const HISTORY_KEY = 'petip.simple.history'

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '操作失败，请稍后重试。'
}

export default function App() {
  const [tab, setTab] = useState<WorkspaceTab>('positioning')
  const [intake, setIntake] = useState<AccountIntake>(() => ({ ...readStored(INTAKE_KEY, emptyIntake), images: [] }))
  const [report, setReport] = useState<PositioningReport | null>(() => readStored<PositioningReport | null>(REPORT_KEY, null))
  const [history, setHistory] = useState<AnalysisRecord[]>(() => readStored(HISTORY_KEY, []))
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null)
  const [health, setHealth] = useState<ServiceHealth | null>(null)
  const [positioningLoading, setPositioningLoading] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)
  const [positioningError, setPositioningError] = useState('')
  const [copyError, setCopyError] = useState('')

  useEffect(() => {
    getServiceHealth().then(setHealth).catch(() => setHealth({ configured: false, model: '未连接', webSearch: false }))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(INTAKE_KEY, JSON.stringify({ ...intake, images: [] }))
  }, [intake])

  const analyze = async () => {
    setPositioningLoading(true)
    setPositioningError('')
    try {
      const nextReport = await createPositioning(intake)
      const storedIntake = { ...intake }
      delete (storedIntake as Partial<AccountIntake>).images
      const record: AnalysisRecord = {
        id: crypto.randomUUID(),
        createdAt: nextReport.generatedAt,
        intake: storedIntake,
        report: nextReport,
      }
      const nextHistory = [record, ...history].slice(0, 8)
      setReport(nextReport)
      setHistory(nextHistory)
      window.localStorage.setItem(REPORT_KEY, JSON.stringify(nextReport))
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
    } catch (error) {
      setPositioningError(errorMessage(error))
    } finally {
      setPositioningLoading(false)
    }
  }

  const generateCopy = async (request: CopyRequest) => {
    if (!report) return
    setCopyLoading(true)
    setCopyError('')
    try {
      setCopyResult(await createCopy(report, request))
    } catch (error) {
      setCopyError(errorMessage(error))
    } finally {
      setCopyLoading(false)
    }
  }

  const loadRecord = (recordId: string) => {
    const record = history.find((item) => item.id === recordId)
    if (!record) return
    setIntake({ ...record.intake, images: [] })
    setReport(record.report)
    window.localStorage.setItem(REPORT_KEY, JSON.stringify(record.report))
    setTab('positioning')
  }

  return (
    <div className="simple-app">
      <header className="simple-header">
        <a className="simple-brand" href="/" aria-label="PetIP 账号助手首页">
          <span><PawPrint size={18} /></span>
          <div><strong>PetIP</strong><small>账号助手</small></div>
        </a>

        <nav className="workflow-tabs" aria-label="工作模式">
          <button className={tab === 'positioning' ? 'active' : ''} type="button" onClick={() => setTab('positioning')}>
            <Radar size={16} /> 账号定位
          </button>
          <button className={tab === 'copy' ? 'active' : ''} type="button" onClick={() => setTab('copy')}>
            <PenLine size={16} /> 文案助手
          </button>
        </nav>

        <div className="header-tools">
          {history.length > 0 && (
            <label className="history-select">
              <Clock3 size={15} />
              <select aria-label="打开历史账号" defaultValue="" onChange={(event) => loadRecord(event.target.value)}>
                <option value="" disabled>历史账号</option>
                {history.map((record) => <option value={record.id} key={record.id}>{record.intake.accountName || record.report.positioning.title}</option>)}
              </select>
            </label>
          )}
          <div className={`service-status ${health?.configured ? 'connected' : ''}`} title={health?.configured ? `模型：${health.model}` : '需要配置 OpenAI API'}>
            {health?.configured ? <Globe2 size={15} /> : <WifiOff size={15} />}
            <span>{health === null ? '检测连接' : health.configured ? '联网可用' : 'AI 未连接'}</span>
          </div>
        </div>
      </header>

      {tab === 'positioning' ? (
        <main className="positioning-workspace">
          <IntakePanel intake={intake} health={health} loading={positioningLoading} error={positioningError} onChange={setIntake} onSubmit={analyze} />
          <div className="result-pane"><PositioningView report={report} loading={positioningLoading} onWriteCopy={() => setTab('copy')} /></div>
        </main>
      ) : (
        <CopyPanel report={report} result={copyResult} loading={copyLoading} error={copyError} onSubmit={generateCopy} onBack={() => setTab('positioning')} />
      )}
    </div>
  )
}

import { useMemo, useState, type FormEvent } from 'react'
import { BookOpenCheck, FileSearch, Filter, Search, Sparkles } from 'lucide-react'
import { Modal, StatusChip } from '../components/ui'
import { useWorkspace, type KnowledgeRecord } from '../state/WorkspaceContext'

export function Knowledge() {
  const { knowledge, addKnowledge, notify } = useWorkspace()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'全部' | KnowledgeRecord['status']>('全部')
  const [createOpen, setCreateOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<KnowledgeRecord | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('内容标准')
  const [source, setSource] = useState('员工修订差异')

  const visibleItems = useMemo(() => knowledge.filter((item) => {
    const matchesQuery = `${item.title}${item.category}${item.source}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === '全部' || item.status === status)
  }), [knowledge, query, status])

  const createCandidate = (event: FormEvent) => {
    event.preventDefault()
    addKnowledge({ title, category, source })
    setTitle('')
    setCreateOpen(false)
    notify('知识候选已创建，需审核后才会影响生成规则')
  }

  return (
    <div className="page-stack">
      <section className="page-heading compact-heading"><div><p className="eyebrow">经审核的方法沉淀</p><h1>方法知识库</h1><p>员工终稿、成功案例和失败复盘先进入审核，再影响生成规则。</p></div><button className="button button-primary" type="button" onClick={() => setCreateOpen(true)}><Sparkles size={16} /> 新建知识候选</button></section>
      <section className="knowledge-stats"><div><BookOpenCheck size={20} /><span><strong>{48 + knowledge.filter((item) => item.status === '已批准').length - 2}</strong>已批准方法</span></div><div><FileSearch size={20} /><span><strong>{knowledge.filter((item) => item.status === '待审核').length}</strong>待审核候选</span></div><div><Sparkles size={20} /><span><strong>32</strong>本月编辑差异</span></div></section>
      <section className="toolbar-row"><label className="table-search"><Search size={17} /><input aria-label="搜索知识" placeholder="搜索方法、品类或来源" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-select"><Filter size={16} /><select aria-label="知识状态筛选" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option>全部</option><option>已批准</option><option>待审核</option><option>需补证据</option></select></label></section>
      <section className="panel"><div className="data-table knowledge-table"><div className="table-row table-head"><span>知识条目</span><span>分类</span><span>证据来源</span><span>状态</span><span>负责人</span><span>更新</span></div>{visibleItems.map((item) => <button className="table-row table-row-button" type="button" key={`${item.title}-${item.updated}`} onClick={() => setActiveItem(item)}><strong>{item.title}</strong><span>{item.category}</span><span>{item.source}</span><span><StatusChip tone={item.status === '已批准' ? 'green' : item.status === '待审核' ? 'gold' : 'coral'}>{item.status}</StatusChip></span><span>{item.owner}</span><span>{item.updated}</span></button>)}</div>{visibleItems.length === 0 ? <div className="no-results">没有符合条件的知识条目</div> : null}</section>
      <section className="knowledge-policy-note"><BookOpenCheck size={20} /><div><strong>不会自动学习所有员工修改</strong><p>编辑差异先脱敏、归类并由知识审核员确认适用范围，避免客户语言跨项目泄露。</p></div></section>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="新建知识候选" description="候选条目默认进入待审核状态。"><form className="operation-form" onSubmit={createCandidate}><label><span>条目标题</span><input required value={title} onChange={(event) => setTitle(event.target.value)} /></label><div className="form-grid"><label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>内容标准</option><option>品类方法</option><option>直播方法</option><option>风险规则</option></select></label><label><span>证据来源</span><input required value={source} onChange={(event) => setSource(event.target.value)} /></label></div><div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setCreateOpen(false)}>取消</button><button className="button button-primary" type="submit">创建候选</button></div></form></Modal>
      <Modal open={Boolean(activeItem)} onClose={() => setActiveItem(null)} title={activeItem?.title ?? '知识详情'} description="适用范围和审核状态"><div className="knowledge-detail"><div><span>分类</span><strong>{activeItem?.category}</strong></div><div><span>证据来源</span><strong>{activeItem?.source}</strong></div><div><span>负责人</span><strong>{activeItem?.owner}</strong></div><div><span>当前状态</span><StatusChip tone={activeItem?.status === '已批准' ? 'green' : activeItem?.status === '待审核' ? 'gold' : 'coral'}>{activeItem?.status}</StatusChip></div></div></Modal>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { ArrowRight, Filter, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgressBar, StatusChip } from '../components/ui'
import { NewProjectDialog } from '../components/NewProjectDialog'
import { useWorkspace } from '../state/WorkspaceContext'

const statuses = ['全部', '定位中', '内容生产', '直播运营', '待复盘', '已暂停']

export function Projects() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('全部')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const { projects, notify } = useWorkspace()

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.name}${project.code}${project.creator}${project.pet}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === '全部' || project.status === status)
  }), [projects, query, status])

  return (
    <div className="page-stack">
      <section className="page-heading compact-heading">
        <div><p className="eyebrow">客户交付与运营</p><h1>客户项目</h1><p>按项目成员授权查看、诊断与交付。</p></div>
        <button className="button button-primary" type="button" onClick={() => setNewProjectOpen(true)}>新建项目</button>
      </section>

      <section className="toolbar-row">
        <label className="table-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索客户、宠物或项目编号" aria-label="搜索项目" />
        </label>
        <div className="segmented-control" aria-label="项目状态筛选">
          {statuses.slice(0, advancedOpen ? statuses.length : 4).map((item) => (
            <button className={status === item ? 'selected' : ''} type="button" onClick={() => setStatus(item)} key={item}>{item}</button>
          ))}
        </div>
        <button className={`button button-secondary icon-text-button ${advancedOpen ? 'control-active' : ''}`} type="button" onClick={() => setAdvancedOpen((value) => !value)}><Filter size={16} /> {advancedOpen ? '收起筛选' : '筛选'}</button>
        <button className={`icon-button ${compactView ? 'control-active' : ''}`} type="button" aria-label="调整显示字段" title="切换紧凑视图" onClick={() => setCompactView((value) => !value)}><SlidersHorizontal size={18} /></button>
      </section>

      <section className="panel projects-table-panel">
        <div className="table-meta"><strong>{visibleProjects.length} 个项目</strong><span>仅显示你有权限访问的客户资料</span></div>
        <div className={`data-table projects-table ${compactView ? 'compact-table' : ''}`}>
          <div className="table-row table-head">
            <span>项目</span><span>状态</span><span>项目进度</span><span>负责人</span><span>下一步</span><span />
          </div>
          {visibleProjects.map((project, index) => (
            <Link className="table-row" to={`/projects/${project.id}`} key={project.id}>
              <div className="project-cell">
                <img src={project.image} alt="" />
                <div><strong>{project.name}</strong><span>{project.code} · {project.petRole}</span></div>
              </div>
              <span><StatusChip tone={index === 0 ? 'coral' : index === 1 ? 'gold' : 'blue'}>{project.status}</StatusChip></span>
              <div className="table-progress"><span>{project.progress}%</span><ProgressBar value={project.progress} compact /></div>
              <span>{project.lead}</span>
              <div className="next-cell"><strong>{project.nextAction}</strong><span>{project.due}</span></div>
              <span className="row-actions"><ArrowRight size={17} /><button className="icon-button ghost" type="button" aria-label={`更多项目操作 ${project.name}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); notify(`${project.name} 的更多操作请在项目详情中处理`) }}><MoreHorizontal size={18} /></button></span>
            </Link>
          ))}
        </div>
        {visibleProjects.length === 0 ? <div className="no-results">没有符合条件的项目</div> : null}
      </section>
      <NewProjectDialog open={newProjectOpen} onClose={() => setNewProjectOpen(false)} />
    </div>
  )
}

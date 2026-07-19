import { useMemo, useState } from 'react'
import { ArrowRight, Filter, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgressBar, StatusChip } from '../components/ui'
import { projects } from '../data/demo'

const statuses = ['全部', '定位中', '内容生产', '直播运营', '待复盘', '已暂停']

export function Projects() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('全部')

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.name}${project.code}${project.creator}${project.pet}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === '全部' || project.status === status)
  }), [query, status])

  return (
    <div className="page-stack">
      <section className="page-heading compact-heading">
        <div><p className="eyebrow">客户交付与运营</p><h1>客户项目</h1><p>按项目成员授权查看、诊断与交付。</p></div>
      </section>

      <section className="toolbar-row">
        <label className="table-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索客户、宠物或项目编号" aria-label="搜索项目" />
        </label>
        <div className="segmented-control" aria-label="项目状态筛选">
          {statuses.slice(0, 4).map((item) => (
            <button className={status === item ? 'selected' : ''} type="button" onClick={() => setStatus(item)} key={item}>{item}</button>
          ))}
        </div>
        <button className="button button-secondary icon-text-button" type="button"><Filter size={16} /> 筛选</button>
        <button className="icon-button" type="button" aria-label="调整显示字段" title="调整显示字段"><SlidersHorizontal size={18} /></button>
      </section>

      <section className="panel projects-table-panel">
        <div className="table-meta"><strong>{visibleProjects.length} 个项目</strong><span>仅显示你有权限访问的客户资料</span></div>
        <div className="data-table projects-table">
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
              <span className="row-actions"><ArrowRight size={17} /><button className="icon-button ghost" type="button" aria-label="更多项目操作" onClick={(event) => event.preventDefault()}><MoreHorizontal size={18} /></button></span>
            </Link>
          ))}
        </div>
        {visibleProjects.length === 0 ? <div className="no-results">没有符合条件的项目</div> : null}
      </section>
    </div>
  )
}


import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileText,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { activity, projects, queueItems } from '../data/demo'
import { Avatar, ProgressBar, StatusChip } from '../components/ui'

const metrics = [
  { label: '进行中项目', value: '12', change: '+2 本月', icon: ClipboardCheck, tone: 'green' },
  { label: '待审核成果', value: '4', change: '2 项今天到期', icon: FileText, tone: 'coral' },
  { label: '内容草稿', value: '18', change: '6 项待审校', icon: Sparkles, tone: 'gold' },
  { label: '本月直播 GMV', value: '¥82.6k', change: '+18.4%', icon: CircleDollarSign, tone: 'blue' },
] as const

const liveTrend = [32, 45, 39, 62, 54, 78, 68, 92, 84, 108, 96, 126]

function typeTone(type: string) {
  if (type === '审核') return 'coral'
  if (type === '直播') return 'blue'
  if (type === '内容') return 'gold'
  return 'neutral'
}

export function Dashboard() {
  return (
    <div className="page-stack dashboard-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">2026 年 7 月 19 日 · 周日</p>
          <h1>上午好，周楠</h1>
          <p>今天有 4 项工作需要推进，其中 2 项会影响本周交付。</p>
        </div>
        <button className="button button-secondary" type="button">
          <CalendarDays size={17} />
          查看本周排期
        </button>
      </section>

      <section className="attention-strip">
        <div className="attention-icon"><Clock3 size={20} /></div>
        <div>
          <strong>林晚 × Momo 定位报告今天待批准</strong>
          <p>顾问已选择差异化方案，负责人需确认是否合并商业化直播结构。</p>
        </div>
        <Link to="/projects/momo" className="text-link">进入项目 <ArrowRight size={16} /></Link>
      </section>

      <section className="metric-grid" aria-label="关键指标">
        {metrics.map(({ label, value, change, icon: Icon, tone }) => (
          <article className="metric-card" key={label}>
            <div className={`metric-icon metric-${tone}`}><Icon size={20} /></div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{change}</small>
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard-grid dashboard-grid-main">
        <section className="panel queue-panel">
          <div className="section-heading">
            <div><h2>我的待办</h2><p>按优先级和截止时间排序</p></div>
            <button className="text-button" type="button">查看全部</button>
          </div>
          <div className="queue-list">
            {queueItems.map((item) => (
              <div className="queue-row" key={item.id}>
                <button className="check-button" type="button" aria-label={`完成 ${item.title}`}><span /></button>
                <StatusChip tone={typeTone(item.type)}>{item.type}</StatusChip>
                <div className="queue-copy">
                  <strong>{item.title}</strong>
                  <span>{item.project} · {item.owner}</span>
                </div>
                <div className="queue-due">
                  <span className={`priority-dot priority-${item.priority}`} />
                  {item.due}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel live-performance">
          <div className="section-heading">
            <div><h2>直播表现</h2><p>近 12 场 · 成交金额</p></div>
            <StatusChip tone="green">较上期 +18.4%</StatusChip>
          </div>
          <div className="live-kpis">
            <div><span>场均 GMV</span><strong>¥6,884</strong></div>
            <div><span>平均停留</span><strong>1m 34s</strong></div>
            <div><span>退款率</span><strong>6.1%</strong></div>
          </div>
          <div className="bar-chart" aria-label="近 12 场直播成交趋势">
            {liveTrend.map((value, index) => (
              <span key={`${value}-${index}`} style={{ height: `${(value / 126) * 100}%` }} title={`第 ${index + 1} 场：${value}`} />
            ))}
          </div>
          <div className="chart-axis"><span>6 月 10 日</span><span>7 月 17 日</span></div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <section className="panel projects-panel">
          <div className="section-heading">
            <div><h2>重点项目</h2><p>最近更新的客户项目</p></div>
            <Link to="/projects" className="text-link">全部项目 <ArrowRight size={15} /></Link>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <Link to={`/projects/${project.id}`} className="project-row" key={project.id}>
                <img src={project.image} alt={`${project.pet} 项目`} />
                <div className="project-main-copy">
                  <div><strong>{project.name}</strong><StatusChip tone={index === 0 ? 'coral' : index === 1 ? 'gold' : 'blue'}>{project.status}</StatusChip></div>
                  <span>{project.code} · 负责人 {project.lead}</span>
                </div>
                <div className="project-progress">
                  <div><span>项目完整度</span><strong>{project.progress}%</strong></div>
                  <ProgressBar value={project.progress} tone={index === 1 ? 'gold' : 'green'} compact />
                </div>
                <div className="project-next"><span>{project.nextAction}</span><small>{project.due}</small></div>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="section-heading">
            <div><h2>团队动态</h2><p>项目内的重要操作</p></div>
          </div>
          <div className="activity-list">
            {activity.map((item, index) => (
              <div className="activity-row" key={`${item.person}-${item.time}`}>
                <Avatar name={item.person} tone={index === 1 ? 'gold' : index === 2 ? 'blue' : 'green'} />
                <div><p><strong>{item.person}</strong> {item.action}</p><span>{item.detail}</span></div>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
          <div className="activity-footer"><CheckCircle2 size={16} /> 所有正式操作均已写入审计日志</div>
        </section>
      </div>
    </div>
  )
}

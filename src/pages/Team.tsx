import { useMemo, useState, type FormEvent } from 'react'
import { KeyRound, Search, ShieldCheck, UserPlus } from 'lucide-react'
import { Avatar, Modal, StatusChip } from '../components/ui'
import { useWorkspace } from '../state/WorkspaceContext'

const roleRows = [
  ['管理员', '全部项目与系统设置', '可管理'],
  ['项目负责人', '分配项目', '可批准'],
  ['IP 顾问', '分配项目', '可编辑'],
  ['内容策划', '分配项目', '内容模块'],
  ['直播运营', '分配项目', '直播模块'],
  ['只读成员', '分配项目', '仅查看'],
]

export function Team() {
  const { employees, addEmployee, notify } = useWorkspace()
  const [query, setQuery] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [matrixOpen, setMatrixOpen] = useState(false)
  const [rolesOpen, setRolesOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('只读成员')
  const visibleEmployees = useMemo(() => employees.filter((employee) => `${employee.name}${employee.email}${employee.role}`.toLowerCase().includes(query.toLowerCase())), [employees, query])

  const invite = (event: FormEvent) => {
    event.preventDefault()
    if (employees.some((employee) => employee.email.toLowerCase() === email.toLowerCase())) {
      notify('该邮箱已存在，未重复发送邀请', 'warning')
      return
    }
    addEmployee({ name, email, role })
    setInviteOpen(false)
    setName('')
    setEmail('')
    notify('员工邀请已创建')
  }

  return (
    <div className="page-stack">
      <section className="page-heading compact-heading"><div><p className="eyebrow">内部账号与项目授权</p><h1>员工与权限</h1><p>系统不开放注册，账号由管理员创建或邀请。</p></div><button className="button button-primary" type="button" onClick={() => setInviteOpen(true)}><UserPlus size={16} /> 邀请员工</button></section>
      <section className="security-strip"><ShieldCheck size={21} /><div><strong>权限由角色与项目成员关系共同决定</strong><p>能看到导航不代表能访问数据，服务端会再次验证项目授权。</p></div><button className="text-button" type="button" onClick={() => setMatrixOpen(true)}>查看权限矩阵</button></section>
      <section className="toolbar-row"><label className="table-search"><Search size={17} /><input aria-label="搜索员工" placeholder="搜索姓名、邮箱或角色" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="button button-secondary" type="button" onClick={() => setRolesOpen(true)}><KeyRound size={16} /> 角色设置</button></section>
      <section className="panel"><div className="data-table team-table"><div className="table-row table-head"><span>员工</span><span>角色</span><span>项目范围</span><span>账号状态</span><span>最近登录</span></div>{visibleEmployees.map((employee) => <div className="table-row" key={employee.email}><div className="employee-cell"><Avatar name={employee.name} tone={employee.tone} /><span><strong>{employee.name}</strong><small>{employee.email}</small></span></div><span>{employee.role}</span><span>{employee.projects}</span><span><StatusChip tone={employee.status === '正常' ? 'green' : 'gold'}>{employee.status}</StatusChip></span><span>{employee.lastLogin}</span></div>)}</div>{visibleEmployees.length === 0 ? <div className="no-results">没有符合条件的员工</div> : null}</section>
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="邀请员工" description="邀请创建后仍需分配项目，才能访问客户资料。"><form className="operation-form" onSubmit={invite}><div className="form-grid"><label><span>姓名</span><input required value={name} onChange={(event) => setName(event.target.value)} /></label><label><span>公司邮箱</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label></div><label><span>初始角色</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roleRows.map(([item]) => <option key={item}>{item}</option>)}</select></label><div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setInviteOpen(false)}>取消</button><button className="button button-primary" type="submit">创建邀请</button></div></form></Modal>
      <Modal open={matrixOpen} onClose={() => setMatrixOpen(false)} title="权限矩阵" description="所有数据访问还会校验项目成员关系。" size="large"><div className="permission-matrix"><div><strong>角色</strong><strong>数据范围</strong><strong>关键权限</strong></div>{roleRows.map((row) => <div key={row[0]}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></div>)}</div></Modal>
      <Modal open={rolesOpen} onClose={() => setRolesOpen(false)} title="角色设置" description="当前版本采用固定角色，避免权限组合失控。"><div className="role-list">{roleRows.map((row) => <div key={row[0]}><KeyRound size={16} /><span><strong>{row[0]}</strong><small>{row[1]} · {row[2]}</small></span></div>)}</div></Modal>
    </div>
  )
}

import { KeyRound, Search, ShieldCheck, UserPlus } from 'lucide-react'
import { Avatar, StatusChip } from '../components/ui'

const employees = [
  { name: '周楠', email: 'admin@petip.local', role: '管理员', projects: '全部项目', status: '正常', tone: 'green' as const },
  { name: '陈序', email: 'lead@petip.local', role: '项目负责人', projects: '6 个项目', status: '正常', tone: 'green' as const },
  { name: '苏芮', email: 'consultant@petip.local', role: 'IP 顾问', projects: '4 个项目', status: '正常', tone: 'coral' as const },
  { name: '唐可', email: 'content@petip.local', role: '内容策划', projects: '5 个项目', status: '正常', tone: 'gold' as const },
  { name: '许哲', email: 'live@petip.local', role: '直播运营', projects: '3 个项目', status: '正常', tone: 'blue' as const },
  { name: '林墨', email: 'linmo@petip.local', role: '只读成员', projects: '1 个项目', status: '已邀请', tone: 'blue' as const },
]

export function Team() {
  return <div className="page-stack"><section className="page-heading compact-heading"><div><p className="eyebrow">内部账号与项目授权</p><h1>员工与权限</h1><p>系统不开放注册，账号由管理员创建或邀请。</p></div><button className="button button-primary" type="button"><UserPlus size={16} /> 邀请员工</button></section><section className="security-strip"><ShieldCheck size={21} /><div><strong>权限由角色与项目成员关系共同决定</strong><p>能看到导航不代表能访问数据，服务端会再次验证项目授权。</p></div><button className="text-button" type="button">查看权限矩阵</button></section><section className="toolbar-row"><label className="table-search"><Search size={17} /><input aria-label="搜索员工" placeholder="搜索姓名、邮箱或角色" /></label><button className="button button-secondary" type="button"><KeyRound size={16} /> 角色设置</button></section><section className="panel"><div className="data-table team-table"><div className="table-row table-head"><span>员工</span><span>角色</span><span>项目范围</span><span>账号状态</span><span>最近登录</span></div>{employees.map((employee, index) => <div className="table-row" key={employee.email}><div className="employee-cell"><Avatar name={employee.name} tone={employee.tone} /><span><strong>{employee.name}</strong><small>{employee.email}</small></span></div><span>{employee.role}</span><span>{employee.projects}</span><span><StatusChip tone={employee.status === '正常' ? 'green' : 'gold'}>{employee.status}</StatusChip></span><span>{index === 5 ? '尚未登录' : index < 2 ? '今天' : '昨天'}</span></div>)}</div></section></div>
}


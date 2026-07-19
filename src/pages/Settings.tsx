import { useState } from 'react'
import { Database, KeyRound, ShieldCheck } from 'lucide-react'
import { Modal, StatusChip } from '../components/ui'
import { useWorkspace } from '../state/WorkspaceContext'

type SettingPanel = 'identity' | 'security' | 'data' | null

export function Settings() {
  const [panel, setPanel] = useState<SettingPanel>(null)
  const [auditRetention, setAuditRetention] = useState('365 天')
  const [sensitiveExport, setSensitiveExport] = useState(true)
  const { resetLocalData, notify } = useWorkspace()

  return (
    <div className="page-stack">
      <section className="page-heading compact-heading"><div><p className="eyebrow">管理员</p><h1>系统设置</h1><p>管理身份、安全与数据策略。</p></div></section>
      <section className="settings-list"><button type="button" onClick={() => setPanel('identity')}><KeyRound size={20} /><span><strong>身份与邀请</strong><small>公司账号、邀请期限、会话撤销</small></span></button><button type="button" onClick={() => setPanel('security')}><ShieldCheck size={20} /><span><strong>安全与审计</strong><small>敏感字段、导出权限、审计保留</small></span></button><button type="button" onClick={() => setPanel('data')}><Database size={20} /><span><strong>数据与模型</strong><small>数据库状态、Prompt 版本、知识审核</small></span></button></section>
      <Modal open={panel === 'identity'} onClose={() => setPanel(null)} title="身份与邀请" description="内部系统不开放自助注册。"><div className="settings-panel-list"><div><span><strong>邀请有效期</strong><small>员工邀请链接 72 小时后失效</small></span><StatusChip tone="green">72 小时</StatusChip></div><div><span><strong>公司邮箱限制</strong><small>演示环境允许任意邮箱，生产环境需配置域名</small></span><StatusChip tone="gold">待配置</StatusChip></div><button className="button button-secondary" type="button" onClick={() => notify('所有演示会话已标记为撤销')}>撤销其他会话</button></div></Modal>
      <Modal open={panel === 'security'} onClose={() => setPanel(null)} title="安全与审计" description="敏感操作必须保留操作者、对象与时间。"><div className="settings-panel-list"><label className="setting-row"><span><strong>敏感数据导出</strong><small>仅管理员可导出二级敏感资料</small></span><input type="checkbox" checked={sensitiveExport} onChange={(event) => setSensitiveExport(event.target.checked)} /></label><label className="setting-row"><span><strong>审计日志保留</strong><small>生产环境建议不少于 365 天</small></span><select value={auditRetention} onChange={(event) => setAuditRetention(event.target.value)}><option>180 天</option><option>365 天</option><option>730 天</option></select></label></div></Modal>
      <Modal open={panel === 'data'} onClose={() => setPanel(null)} title="数据与模型" description="当前运行的是本地交互演示数据。"><div className="settings-panel-list"><div><span><strong>本地数据库契约</strong><small>Prisma Schema 与迁移已就绪</small></span><StatusChip tone="green">正常</StatusChip></div><div><span><strong>服务端 API</strong><small>真实多人协作与账号鉴权尚未接入</small></span><StatusChip tone="gold">待接入</StatusChip></div><button className="button button-secondary" type="button" onClick={resetLocalData}>恢复演示数据</button></div></Modal>
    </div>
  )
}

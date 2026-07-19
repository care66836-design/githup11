import { Database, KeyRound, ShieldCheck } from 'lucide-react'

export function Settings() {
  return <div className="page-stack"><section className="page-heading compact-heading"><div><p className="eyebrow">管理员</p><h1>系统设置</h1><p>管理身份、安全与数据策略。</p></div></section><section className="settings-list"><button type="button"><KeyRound size={20} /><span><strong>身份与邀请</strong><small>公司账号、邀请期限、会话撤销</small></span></button><button type="button"><ShieldCheck size={20} /><span><strong>安全与审计</strong><small>敏感字段、导出权限、审计保留</small></span></button><button type="button"><Database size={20} /><span><strong>数据与模型</strong><small>数据库状态、Prompt 版本、知识审核</small></span></button></section></div>
}

